import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/common/auth.service';
import { NetworkApiBase } from '../network-api/network-api-base';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

@Injectable()
export class DeviceLocationService extends NetworkApiBase {
  private readonly deviceLocationScope =
    'openid dpv:NotApplicable#location-verification:verify';

  constructor(httpService: HttpService, authService: AuthService) {
    super(httpService, authService);
  }

  async isDeviceWithinLocation(
    msisdn: string,
    homeLocation: LocationCoordinates,
  ): Promise<boolean> {
    this.logger.log('Validating Home Location');
    
    const response = await this.makeApiRequest(
      msisdn,
      {
        device: {
          phoneNumber: msisdn,
        },
        area: {
          areaType: 'CIRCLE',
          center: homeLocation,
          radius: parseInt(process.env.DEVICE_LOCATION_RADIUS_METERS),
        },
        maxAge: parseInt(process.env.DEVICE_LOCATION_UPDATE_MAX_AGE_SECONDS),
      },
      this.deviceLocationScope,
      `${process.env.VONAGE_NETWORK_API_ENDPOINT}/location/v020/verify`,
    );

    return ['TRUE', 'PARTIAL'].includes(response.verificationResult);
  }
}
