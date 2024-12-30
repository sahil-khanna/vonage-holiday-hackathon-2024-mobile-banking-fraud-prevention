import { HttpService } from '@nestjs/axios';
import { CommunicationApiBase, MessagePayload } from './communication-api-base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService extends CommunicationApiBase {
  constructor(httpService: HttpService) {
    super(httpService);
  }

  async sendMessage(
    text: string,
    msisdn: string = process.env.OTP_WHITELISTED_MSISDN,
  ): Promise<void> {
    const smsPayload: MessagePayload = new MessagePayload(
      process.env.VONAGE_SMS_SENDER_ID,
      msisdn,
      text,
    );
    await super.send('SMS', smsPayload, process.env.VONAGE_SMS_API_ENDPOINT);
  }
}
