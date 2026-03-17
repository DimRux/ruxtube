import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { BaseOAuthService } from './services/base-oauth.service';

export const ProviderOptionsSymbol = Symbol();

export type TOptions = {
  baseUrl: string;
  services: BaseOAuthService[];
};

export type TAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<TOptions>, 'useFactory' | 'inject'>;
