// import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
// import { Type } from 'class-transformer';
// import { AssetPriceType } from "../../common/constants/constants";

// export class AssetPriceUserDTO {
//   @IsDefined()
//   @IsString()
//   id: string;

//   @IsDefined()
//   @IsString()
//   name: string;
// }

// export class CreateAssetPriceDTO {
//   @IsNotEmpty()
//   @IsDefined()
//   @IsString()
//   public type: string;

//   @IsNotEmpty()
//   @IsDefined()
//   @IsObject()
//   @ValidateNested()
//   @Type(() => AssetPriceUserDTO)
//   public user: AssetPriceUserDTO;

//   @IsNotEmpty()
//   @IsDefined()
//   @IsString()
//   public symbol: string;

//   @IsNotEmpty()
//   @IsDefined()
//   @IsInt()
//   public shares: number;

//   @IsNotEmpty()
//   @IsDefined()
//   @IsNumber()
//   public price: number;

//   @IsNotEmpty()
//   @IsDefined()
//   @IsString()
//   public timestamp: string;
// }

// export const AssetPriceSchema: any = {
//   type: 'object',
//   properties: {
//     type: {
//       type: 'string',
//       enum: Object.values(AssetPriceType),
//     },
//     user: {
//       type: 'object',
//       properties: {
//         id: {
//           type: 'string',
//           pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
//         },
//         name: { type: 'string' },
//       },
//       additionalProperties: false,
//     },
//     symbol: { type: 'string' },
//     shares: {
//       type: 'integer',
//       minimum: 10,
//       maximum: 30,
//     },
//     price: {
//       type: 'number',
//       minimum: 130.42,
//       maximum: 195.65,
//     },
//     timestamp: {
//       type: 'string',
//     },
//   },
//   additionalProperties: false
// };

// export const CreateAssetPriceSchema = {
//   type: 'object',
//   properties:  AssetPriceSchema.properties,
//   required: ['type', 'user', 'symbol', 'shares', 'price', 'timestamp']
// };