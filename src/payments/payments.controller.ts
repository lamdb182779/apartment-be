import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request, Response } from 'express';
import { Public } from 'src/helpers/decorators';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    return this.paymentsService.create(createPaymentDto, req);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get('return')
  async handleIpn(@Query() query, @Res() res: Response) {
    try {
      const verified = this.paymentsService.verifyVnpaySignature(query);

      if (!verified) {
        this.logger.warn('Chữ ký sai từ VNPAY');
        return res.redirect(`http://localhost:3000/customer/bills?status=error&msg=invalid_signature`)
      }

      const { vnp_ResponseCode, vnp_TxnRef } = query;

      if (vnp_ResponseCode === '00') {
        return this.paymentsService.updateOrderStatus(vnp_TxnRef, 'success', res);
      } else {
        return this.paymentsService.updateOrderStatus(vnp_TxnRef, 'failed', res);
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
