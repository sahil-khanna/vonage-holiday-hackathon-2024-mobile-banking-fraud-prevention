import {
  Body,
  Controller,
  Post,
  Res,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dto';
import { Response } from 'express';
import { OtpDto } from './otp.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {
    // Do nothing
  }

  @Post('/')
  async transaction(
    @Body(new ValidationPipe()) transactionDto: TransactionDto,
    @Headers('userId') userId: string,
    @Res() response: Response,
  ) {
    const result = await this.transactionService.startTransaction(
      userId,
      transactionDto,
    );
    response.send(result);
  }

  @Post('/otp')
  async validateOtp(
    @Body(new ValidationPipe()) otpDto: OtpDto,
    @Headers('userId') userId: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.transactionService.validateOtp(
      userId,
      otpDto.otp.toString(),
    );
    response.send(result);
  }
}
