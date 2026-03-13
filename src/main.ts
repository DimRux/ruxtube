import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import IORedis from 'ioredis';
import ms from 'ms';

import { AppModule } from './app.module';
import { parseBoolean } from './libs/common/utils/parseBoolean';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'));

  app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    session({
      secret: config.getOrThrow('SESSION_SECRET'),
      name: config.getOrThrow('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credential: true,
    exposesHeaders: ['set-cookie'],
  });
  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
