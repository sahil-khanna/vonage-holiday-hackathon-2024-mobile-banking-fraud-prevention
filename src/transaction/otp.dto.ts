import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class OtpDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @Min(100000)
  @Max(999999)
  @ApiProperty({ example: '100304', minimum: 100000, maximum: 999999 })
  otp: number;
}
