import { FastifyRequest } from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
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
    // return this.service.deleteAllAssetPrices();
    // return {
    //   data: 'price coming soon',
    //   query
    // };
    return this.service.fetchAndUpdateAssetPrices(query.fsyms as any, query.tsyms)
  }
  
  @POST('/')
  async syncAssetPrices(
    { body }: FastifyRequest<{
      'Body': { from: string[], to: string[] }
    }>
  ) {
    // return this.service.deleteAllAssetPrices();
    // return {
    //   data: 'price coming soon',
    //   query
    // };
    // console.log('%%%%%%%%%%%', { body })
    return this.service.syncAndUpdateAssetPrices(body.from, body.to)
  }
}

export default AssetPriceAdminController;