import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import { add, format } from 'date-fns';
import { sortObject } from 'src/helpers/utils';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,

    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    private config: ConfigService
  ) { }
  verifyVnpaySignature(query: any): boolean {
    const vnp_HashSecret = this.config.get<string>('VNP_HASH_SECRET');
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;
    delete query.mobile;

    const sortedQuery = sortObject(query);;

    const signData = qs.stringify(sortedQuery, { encode: false });
    const hash = crypto
      .createHmac('sha512', vnp_HashSecret)
      .update(Buffer.from(signData, 'utf8'))
      .digest('hex');

    return hash === vnp_SecureHash;
  }


  createPaymentUrl(orderId: string, amount: number, req, id: string, mobile?: string): string {
    const vnp_TmnCode = this.config.get<string>('VNP_TMN_CODE');
    const vnp_HashSecret = this.config.get<string>('VNP_HASH_SECRET');
    const vnp_Url = this.config.get<string>('VNP_URL');
    const vnp_ReturnUrl = this.config.get<string>('VNP_RETURN_URL') + `${mobile === "true" ? "?mobile=true" : ""}`;

    const createDate = format(new Date(), 'yyyyMMddHHmmss')
    const expiredDate = format(add(new Date(), { minutes: 15 }), 'yyyyMMddHHmmss')

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      "127.0.0.1";

    const params = {
      vnp_Version: '2.1.1',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: id,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expiredDate,
    };

    const sortedParams = sortObject(params);;
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex')
    sortedParams['vnp_SecureHash'] = signed
    const finalUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: false })}`;
    console.log(finalUrl);


    return finalUrl;
  }

  async create(createPaymentDto: CreatePaymentDto, req, mobile?: string) {
    const { orderId } = createPaymentDto
    const bill = await this.billsRepository.findOne({
      where: {
        id: orderId,
        isPaid: false
      }
    })
    if (!bill) throw new BadRequestException("Không tìm thấy hóa đơn chưa thanh toán này!")
    const amount = bill.amount
    const payment = await this.paymentsRepository.save({
      orderId,
      amount,
    });
    const url = this.createPaymentUrl(orderId, amount, req, payment.id, mobile);
    return { url, message: "Đang chuyển hướng trang thanh toán" }
  }

  async updateOrderStatus(txnRef: string, status: 'success' | 'failed', res, mobile?: string) {
    const CLIENT_URL = this.config.get<string>('CLIENT_URL')
    const payment = await this.paymentsRepository.findOneBy({ id: txnRef })
    if (payment) {
      if (status === 'success') {
        const bill = await this.billsRepository.update(payment.orderId, { isPaid: true })
        if (bill.affected === 0) console.log(`Không thể cập nhật trạng thái thanh toán hóa đơn ${txnRef}!`)
        else console.log(`Cập nhật trạng thái thanh toán hóa đơn ${txnRef} thành công`)
      }
      const update = await this.paymentsRepository.update(txnRef, { status })
      if (update.affected === 0) console.log(`Không thể cập nhật trạng thái thanh toán ${txnRef} thành ${status}!`)
      else console.log(`Cập nhật trạng thái thanh toán ${txnRef} thành ${status} thành công`);
      if (mobile === "true") return res.redirect(`${CLIENT_URL}/mobile/bills/?status=${status}&billId=${payment.id}`);
      return res.redirect(`${CLIENT_URL}/customer/bills/?status=${status}&billId=${payment.id}`);
    }
    else console.log("Không tìm thấy mã thanh toán tương ứng!")
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
