import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TransactionDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @ApiProperty({ example: '104.85', minimum: 1.0, maximum: 9999999.99 })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ example: '006601543625' })
  targetAccountNumber: string;

  @IsString()
  @Length(11)
  @ApiProperty({ example: '00666204948' })
  ifsc: string;
}
