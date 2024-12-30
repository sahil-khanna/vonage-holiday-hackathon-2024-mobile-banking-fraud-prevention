import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth.service';
import { NetworkApiBase } from './network-api-base';

@Injectable()
export class SimSwapService extends NetworkApiBase {
  private readonly checkSimSwapScope =
    'openid dpv:FraudPreventionAndDetection#check-sim-swap';

  constructor(httpService: HttpService, authService: AuthService) {
    super(httpService, authService);
  }

  async isSimSwapped(msisdn: string): Promise<boolean> {
    this.logger.log('Validating SIM Swap Number');

    const response = await this.makeApiRequest(
      msisdn,
      {
        phoneNumber: msisdn,
        maxAge: parseInt(process.env.SIM_SWAP_MAX_AGE_HOURS),
      },
      this.checkSimSwapScope,
      `${process.env.VONAGE_NETWORK_API_ENDPOINT}/sim-swap/v040/check`,
    );

    return response.swapped;
  }
}
