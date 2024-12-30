import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {
    // Do Nothing
  }

  private async generateAuthCode(
    msisdn: string,
    scope: string,
  ): Promise<string> {
    const response: any = await this.httpService.axiosRef.post(
      `${process.env.VONAGE_AUTH_API_ENDPOINT}/bc-authorize`,
      {
        login_hint: msisdn,
        scope: scope, // TODO Check if multiple scopes can be sent
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VONAGE_APPLICATION_JWT}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.auth_req_id;
  }

  async generateNetworkApiAuthToken(
    msisdn: string,
    scope: string,
  ): Promise<string> {
    const authCode = await this.generateAuthCode(msisdn, scope);

    const response: any = await this.httpService.axiosRef.post(
      `${process.env.VONAGE_AUTH_API_ENDPOINT}/token`,
      {
        auth_req_id: authCode,
        grant_type: 'urn:openid:params:grant-type:ciba',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VONAGE_APPLICATION_JWT}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }
}
