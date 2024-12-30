import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Constants } from 'src/common/constants';

export class MessagePayload {
  from: string;
  to: string;
  text: string;

  constructor(from: string, to: string, text: string) {
    this.from = from;
    this.to = to;
    this.text = text;
  }
}

export abstract class CommunicationApiBase {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(private readonly httpService: HttpService) {}

  protected async send(channel: string, body: MessagePayload, endpoint: string): Promise<any> {
    this.logger.log(`Communication API request for ${channel}`);

    try {
      const response = await this.httpService.axiosRef.post(endpoint, body, {
        headers: Constants.VONAGE_API_DEFAULT_CONFIG.headers,
        auth: {
          username: process.env.VONAGE_MESSAGING_API_KEY,
          password: process.env.VONAGE_MESSAGING_API_SECRET,
        },
      });

      this.logger.debug(
        `Communication API Response: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error('Communication API request failed', error);
      throw error;
    }
  }
}
