import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request, Response } from 'express';
import { Public } from 'src/helpers/decorators';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(
    private readonly paymentsService: PaymentsService,

    private config: ConfigService
  ) { }

  @Public()
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Query() query, @Req() req: Request) {
    return this.paymentsService.create(createPaymentDto, req, query?.mobile);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get('return')
  async handleIpn(@Query() query, @Res() res: Response) {
    const CLIENT_URL = this.config.get<string>('CLIENT_URL')
    try {
      const { vnp_ResponseCode, vnp_TxnRef, mobile, vnp_OrderInfo } = query;
      const id = vnp_OrderInfo.split("don hang ")[1]

      const verified = this.paymentsService.verifyVnpaySignature(query);

      if (!verified) {
        this.logger.warn('Chữ ký sai từ VNPAY');
        if (mobile === "true") return res.redirect(`${CLIENT_URL}/mobile/bills/${id}?status=error`)
        return res.redirect(`${CLIENT_URL}/customer/bills?status=error`)
      }

      if (vnp_ResponseCode === '00') {
        return this.paymentsService.updateOrderStatus(vnp_TxnRef, 'success', res, id, mobile);
      } else {
        return this.paymentsService.updateOrderStatus(vnp_TxnRef, 'failed', res, id, mobile);
      }
    } catch (err) {
      this.logger.error('Lỗi điều khiển VNP IPN', err);
      return res.status(500).send('Internal Server Error');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
