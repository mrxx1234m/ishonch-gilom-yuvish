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
exports.CreateTariffDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class TariffRegionDto {
    regionId;
    pricePerM2;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hudud ID si' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TariffRegionDto.prototype, "regionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Kvadrat metr uchun narx', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TariffRegionDto.prototype, "pricePerM2", void 0);
class CreateTariffDto {
    serviceName;
    description;
    isActive;
    regions;
    category;
}
exports.CreateTariffDto = CreateTariffDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tarif nomi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tarif tavsifi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tarif faolligi', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTariffDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hududlar va ularning kvadrat metr narxlari',
        type: [TariffRegionDto],
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TariffRegionDto),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Kamida bitta hudud kiritilishi kerak' }),
    __metadata("design:type", Array)
], CreateTariffDto.prototype, "regions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type qoshisi', default: 'GILAM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTariffDto.prototype, "category", void 0);
//# sourceMappingURL=create-tariff.dto.js.map