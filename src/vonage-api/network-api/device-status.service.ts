import { Injectable } from '@nestjs/common';
import { NetworkApiBase } from './network-api-base';
import { HttpService } from '@nestjs/axios';
import { AuthService } from 'src/common/auth.service';

@Injectable()
export class DeviceStatusService extends NetworkApiBase {
  private readonly deviceRoamingStatusScope =
    'openid dpv:NotApplicable#device-status:roaming:read';

  constructor(httpService: HttpService, authService: AuthService) {
    super(httpService, authService);
  }

  async isDeviceInRoaming(msisdn: string): Promise<boolean> {
    this.logger.log('Validating International Roaming status');

    const response = await this.makeApiRequest(
      msisdn,
      { device: { phoneNumber: msisdn } },
      this.deviceRoamingStatusScope,
      `${process.env.VONAGE_NETWORK_API_ENDPOINT}/device-status/v050/roaming`,
    );

    return response.roaming;
  }
}
