import {
  FastifyReply, FastifyRequest,
  // FastifyRequest
} from 'fastify';
import { Controller, GET, POST } from 'fastify-decorators';
import { CreateAssetDTO, CreateAssetSchema } from '../dtos/asset.dto';
import { AssetsService } from '../providers/assets.service';

@Controller({ route: '/assets' })
export class AssetsController {
  constructor(public service: AssetsService) {}

  @POST('/', {
    schema: {
      body: CreateAssetSchema,
    },
  })
  async createOne(
    { body }: FastifyRequest<{ 'Body': CreateAssetDTO }>,
    reply: FastifyReply
  ) {
    reply.status(201)
    return this.service.createOneAsset(body);
  }

  @GET('/')
  async getManyAssets() {
    return this.service.getManyAssets();
  }

  @GET('/:symbol')
  async getManyAssetUsingSymbol(
    { params }: FastifyRequest<{ 'Params': { symbol: string } }>
  ) {
    return { params };
  }
}

export default AssetsController;