import { Inject, Injectable } from '@nestjs/common';

import { ProviderOptionsSymbol, type TOptions } from './constants';
import { BaseOAuthService } from './services/base-oauth.service';

@Injectable()
export class ProviderService {
  public constructor(@Inject(ProviderOptionsSymbol) private readonly options: TOptions) {}

  public onModuleInit() {
    for (const provider of this.options.services) {
      provider.baseUrl = this.options.baseUrl;
    }
  }

  public findByService(serviceName: string): BaseOAuthService | null {
    return this.options.services.find((service) => service.name === serviceName) ?? null;
  }
}
