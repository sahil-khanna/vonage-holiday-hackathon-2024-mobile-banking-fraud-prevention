import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { generateOTP } from 'otp-agent';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SmsService } from '../vonage-api/communication-api/sms.service';

@Injectable()
export class OneTimePasswordService {
  private readonly logger = new Logger(OneTimePasswordService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly smsService: SmsService,
  ) {
    // Do nothing;
  }

  async sendOtp(
    msisdn: string = process.env.OTP_WHITELISTED_MSISDN,
  ): Promise<void> {
    const otp = generateOTP();
    await this.cacheManager.set(
      `otp-${msisdn}`,
      otp,
      parseInt(process.env.OTP_TTL_MILLISECONDS),
    );

    await this.smsService.sendMessage(
      `Your OTP is ${otp} and it is valid for 5 minutes`,
    );
  }

  async validateOtp(
    otp: string,
    msisdn: string = process.env.OTP_WHITELISTED_MSISDN,
  ): Promise<boolean> {
    const storedOtp = await this.cacheManager.get(`otp-${msisdn}`);

    if (storedOtp == null || storedOtp != otp) {
      return false;
    }

    await this.cacheManager.del(`otp-${msisdn}`);
    return true;
  }
}
