import { HttpService } from '@nestjs/axios';
import { CommunicationApiBase, MessagePayload } from './communication-api-base';
import { Injectable } from '@nestjs/common';

export class WhatsAppPayload extends MessagePayload {
  message_type: 'text';
  channel: 'whatsapp';

  constructor(from: string, to: string, text: string) {
    super(from, to, text);
    this.message_type = 'text';
    this.channel = 'whatsapp';
  }
}

@Injectable()
export class WhatsAppService extends CommunicationApiBase {
  constructor(httpService: HttpService) {
    super(httpService);
  }

  async sendMessage(
    text: string,
    msisdn: string = process.env.OTP_WHITELISTED_MSISDN,
  ): Promise<void> {
    const whatsappPayload: WhatsAppPayload = new WhatsAppPayload(
      process.env.VONAGE_WHATSAPP_SENDER_ID,
      msisdn,
      text,
    );
    await super.send(
      'WhatsApp',
      whatsappPayload,
      process.env.VONAGE_WHATSAPP_API_ENDPOINT,
    );
  }
}
