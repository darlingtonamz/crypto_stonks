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
const util_1 = require("./util");
describe('GET /health', () => {
    it('should return status 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield util_1.createApp();
        const response = yield app.inject({
            method: 'GET',
            url: '/health',
            headers: { origin: 'http://localhost' }
        });
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=health.e2e-spec.js.map