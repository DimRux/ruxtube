import { DynamicModule, Module } from '@nestjs/common';

import { ProviderOptionsSymbol, TAsyncOptions, TOptions } from './constants';
import { ProviderService } from './provider.service';

@Module({})
export class ProviderModule {
  public static register(options: TOptions): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          useValue: options.services,
          provide: ProviderOptionsSymbol,
        },
        ProviderService,
      ],
      exports: [ProviderService],
    };
  }

  public static registerAsync(options: TAsyncOptions): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      providers: [
        {
          useFactory: options.useFactory,
          provide: ProviderOptionsSymbol,
          inject: options.inject,
        },
        ProviderService,
      ],
      exports: [ProviderService],
    };
  }
}
