import { HttpService } from '@nestjs/axios';
import { Constants } from 'src/common/constants';
import { Logger } from '@nestjs/common';
import { AuthService } from 'src/common/auth.service';

export abstract class NetworkApiBase {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  protected async makeApiRequest(
    msisdn: string,
    body: any,
    scope: string,
    apiEndpoint: string,
  ): Promise<any> {
    this.logger.log(`Network API request for MSISDN: ${msisdn}`);

    const authToken = await this.authService.generateNetworkApiAuthToken(
      msisdn,
      scope,
    );

    try {
      const response = await this.httpService.axiosRef.post(apiEndpoint, body, {
        headers: {
          ...Constants.VONAGE_API_DEFAULT_CONFIG.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });
      this.logger.debug(
        `Network API Response: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error('Network API request failed', error);
      throw error;
    }
  }
}
