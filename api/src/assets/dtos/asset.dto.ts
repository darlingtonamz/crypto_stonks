import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateAssetDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public symbol: string;
}

export const AssetSchema: any = {
  type: 'object',
  properties: {
    symbol: {
      type: 'string',
      pattern: '^[A-Z]*$',
    },
  },
  additionalProperties: false
};

export const CreateAssetSchema = {
  type: 'object',
  properties:  AssetSchema.properties,
  required: ['symbol']
};