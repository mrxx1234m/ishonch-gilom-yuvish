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
exports.UpdateOrderDto = exports.UpdateOrderItemDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UpdateOrderItemDto {
    tariffId;
    regionId;
    area;
    price;
}
exports.UpdateOrderItemDto = UpdateOrderItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Tariff ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "tariffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, description: 'Region ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "regionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25, description: 'Area (m²)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 50000,
        description: 'Calculated price for this item',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOrderItemDto.prototype, "price", void 0);
class UpdateOrderDto {
    address;
    fullName;
    phone;
    comment;
    status;
    items;
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Chilonzor 25', description: 'User address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Azizbek',
        description: 'Full name of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+998901234567',
        description: 'Phone number of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Tezroq bering',
        description: 'Additional comment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.OrderStatus,
        example: client_1.OrderStatus.PENDING,
        description: 'Order status',
    }),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateOrderItemDto],
        description: 'List of order items to update',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateOrderItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateOrderDto.prototype, "items", void 0);
//# sourceMappingURL=update-order.dto.js.map