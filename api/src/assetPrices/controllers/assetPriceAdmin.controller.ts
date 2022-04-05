import { FastifyRequest } from 'fastify';
import {
  Controller, GET,
} from 'fastify-decorators';
import { AssetPricesService } from '../providers/assetPrices.service';

@Controller({ route: '/price' })
export class AssetPriceAdminController {
  constructor(public service: AssetPricesService) {}

  @GET('/')
  async getAssetPrices(
    { query }: FastifyRequest<{
      'Querystring': {
        fsyms: string,
        tsyms: string,
      }
    }>
  ) {
    return this.service.fetchAndUpdateAssetPrices(query.fsyms as any, query.tsyms)
  }
}

export default AssetPriceAdminController;