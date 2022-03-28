import { IAppModule } from "../common/interfaces/interfaces";
import { AssetsController } from "./controllers/assets.controller";

export const AssetsModule: IAppModule = {
  controllers: [
    AssetsController,
  ],
};
