import { IAppModule } from "../common/interfaces/interfaces";
// import { AssetPricesController } from "./controllers/assetPrices.controller";
import { AssetPriceAdminController } from "./controllers/assetPriceAdmin.controller";

export const AssetPricesModule: IAppModule = {
  controllers: [
    // AssetPricesController,
    AssetPriceAdminController,
  ],
};
