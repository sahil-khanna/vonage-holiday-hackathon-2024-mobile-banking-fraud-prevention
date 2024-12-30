import { NumberVerificationService } from 'src/vonage-api/network-api/number-verification.service';
import { TransactionDto } from './transaction.dto';
import { Constants } from 'src/common/constants';
import { SimSwapService } from 'src/vonage-api/network-api/sim-swap.service';
import { DeviceStatusService } from 'src/vonage-api/network-api/device-status.service';
import {
  DeviceLocationService,
  LocationCoordinates,
} from 'src/vonage-api/network-api/device-location.service';
import { Injectable, Logger } from '@nestjs/common';
import { OneTimePasswordService } from 'src/common/one-time-password.service';

export interface ApiResponse {
  code: number;
  message?: string;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly dempApiDelaySeconds =
    parseInt(process.env.DEMO_API_DELAY_SECONDS || '0') * 1000;

  constructor(
    private readonly numberVerificationService: NumberVerificationService,
    private readonly simSwapService: SimSwapService,
    private readonly deviceStatusService: DeviceStatusService,
    private readonly deviceLocationService: DeviceLocationService,
    private readonly oneTimePasswordService: OneTimePasswordService,
  ) {}

  async startTransaction(
    userId: string,
    transactionDto: TransactionDto,
  ): Promise<ApiResponse> {
    this.logger.log('Starting transaction');

    const userProfile = Constants.userProfiles.find((profile) => {
      return profile.uid === userId;
    });
    this.logger.log("Fetched user's profile");

    if (userProfile == null) {
      this.logger.error('User not registered');
      return {
        code: 1,
        message: 'User not registered',
      };
    }

    this.logger.log('-----------------------------------------------------');
    if (await this.verifyMsisdn(userProfile.msisdn)) {
      this.logger.log('Number verification successful. Transaction is legit.');
      return {
        code: 0,
        message: 'Legit activity',
      };
    }

    this.logger.error('Number verification failed.');

    this.logger.log('-----------------------------------------------------');
    if (await this.verifySimSwap(userProfile.msisdn)) {
      this.logger.warn(
        'SIM Swap recently. Transaction needs to be validated using OTP.',
      );
      await this.oneTimePasswordService.sendOtp();
      return {
        code: 1,
        message: 'OTP sent for verification',
      };
    }

    this.logger.log('SIM Swap verification successful');

    this.logger.log('-----------------------------------------------------');
    if (await this.verifyRoaming(userProfile.msisdn)) {
      this.logger.warn(
        'Device is on International Roaming. Transaction needs to be validated using OTP.',
      );
      await this.oneTimePasswordService.sendOtp();
      return {
        code: 1,
        message: 'OTP sent for verification',
      };
    }

    this.logger.log('Device not on International Roaming');

    this.logger.log('-----------------------------------------------------');
    if (
      await this.verifyHomeLocation(
        userProfile.msisdn,
        userProfile.locationCoordinates,
      )
    ) {
      this.logger.log('Device in Home Location.');
      return {
        code: 0,
        message: 'Legit activity',
      };
    }

    this.logger.warn(
      'Device not in home location. Transaction needs to be validated using OTP.',
    );

    this.logger.log('-----------------------------------------------------');
    
    await this.oneTimePasswordService.sendOtp();
    return {
      code: 1,
      message: 'OTP sent for verification',
    };
  }

  async validateOtp(userId: string, otp: string): Promise<ApiResponse> {
    const userProfile = Constants.userProfiles.find((profile) => {
      return profile.uid === userId;
    });

    this.logger.log('-----------------------------------------------------');
    const isOtpValid = await this.oneTimePasswordService.validateOtp(otp);

    if (!isOtpValid) {
      this.logger.error(
        'OTP validation failed. Transaction looks suspicious. Abroting',
      );
      return {
        code: -1,
        message: 'Invalid OTP',
      };
    }

    this.logger.log('OTP validation successful. Transaction is legit.');
    return {
      code: 0,
      message: 'OTP Validated. Transaction is successful',
    };
  }

  private async verifyMsisdn(msisdn: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await this.numberVerificationService.verifyMsisdn(msisdn));
      }, this.dempApiDelaySeconds);
    });
  }

  private async verifySimSwap(msisdn: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await this.simSwapService.isSimSwapped(msisdn));
      }, this.dempApiDelaySeconds);
    });
  }

  private async verifyRoaming(msisdn: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await this.deviceStatusService.isDeviceInRoaming(msisdn));
      }, this.dempApiDelaySeconds);
    });
  }

  private async verifyHomeLocation(
    msisdn: string,
    locationCoordinates: LocationCoordinates,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(
          await this.deviceLocationService.isDeviceWithinLocation(
            msisdn,
            locationCoordinates,
          ),
        );
      }, this.dempApiDelaySeconds);
    });
  }
}