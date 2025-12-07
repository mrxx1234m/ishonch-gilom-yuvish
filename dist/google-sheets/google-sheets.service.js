"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const common_1 = require("@nestjs/common");
const google_service_1 = require("../google/google.service");
let GoogleSheetsService = class GoogleSheetsService {
    googleService;
    constructor(googleService) {
        this.googleService = googleService;
    }
    async writeOrders(data) {
        try {
            const response = await this.googleService.appendRow(data);
            return response.data;
        }
        catch (error) {
            console.error('Error adding row:', error);
            throw error;
        }
    }
};
exports.GoogleSheetsService = GoogleSheetsService;
exports.GoogleSheetsService = GoogleSheetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_service_1.GoogleService])
], GoogleSheetsService);
//# sourceMappingURL=google-sheets.service.js.map