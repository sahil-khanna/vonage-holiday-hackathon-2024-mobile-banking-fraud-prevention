import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth.service';
import { NetworkApiBase } from './network-api-base';

@Injectable()
export class NumberVerificationService extends NetworkApiBase {
  private readonly phoneNumberVerifyScope =
    'openid dpv:FraudPreventionAndDetection#number-verification-verify-read';

  constructor(httpService: HttpService, authService: AuthService) {
    super(httpService, authService);
  }

  async verifyMsisdn(msisdn: string): Promise<boolean> {
    this.logger.log('Validating Mobile Number');

    const response = await this.makeApiRequest(
      msisdn,
      { phoneNumber: msisdn },
      this.phoneNumberVerifyScope,
      `${process.env.VONAGE_NETWORK_API_ENDPOINT}/number-verification/v031/verify`,
    );

    return response.devicePhoneNumberVerified;
  }
}
