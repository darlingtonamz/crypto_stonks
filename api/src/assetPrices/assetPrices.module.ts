import { IAppModule } from "../common/interfaces/interfaces";
import { AssetPricesController } from "./controllers/assetPrices.controller";

export const AssetPricesModule: IAppModule = {
  controllers: [
    AssetPricesController,
  ],
};
