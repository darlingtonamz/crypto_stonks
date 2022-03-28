"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = exports.createApp = void 0;
const app_1 = require("../src/app");
const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    return app_1.default();
});
exports.createApp = createApp;
const clearDatabase = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const entities = connection.entityMetadatas;
    try {
        yield connection.query("SET session_replication_role = 'replica';");
    }
    catch (e) {
        console.log(e);
    }
    for (const entity of entities) {
        const repository = yield connection.getRepository(entity.name);
        try {
            const [{ exists }] = yield repository.query(`SELECT EXISTS (
               SELECT 1
               FROM   information_schema.tables
               WHERE  table_schema = 'public'
               AND    table_name = '${entity.tableName}'
           )`);
            if (exists) {
                yield repository.query(`DELETE FROM "public"."${entity.tableName}";`);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
});
exports.clearDatabase = clearDatabase;
//# sourceMappingURL=util.js.map