import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info: any) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('mobile-banking-fraud-prevention')
    .setDescription(
      'A robust fraud detection system that uses real-time APIs to verify the user’s registered SIM, detect SIM swaps, check device roaming and location, and authenticate high-risk transactions with OTP verification, ensuring secure and seamless mobile banking operations.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
