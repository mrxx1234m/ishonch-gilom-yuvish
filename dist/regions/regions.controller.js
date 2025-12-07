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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const regions_service_1 = require("./regions.service");
const create_dto_1 = require("./dto/create.dto");
const update_tariff_dto_1 = require("./dto/update-tariff.dto");
let RegionsController = class RegionsController {
    regionsService;
    constructor(regionsService) {
        this.regionsService = regionsService;
    }
    create(createRegionsDto) {
        return this.regionsService.create(createRegionsDto);
    }
    findAll() {
        return this.regionsService.findAll();
    }
    findOne(id) {
        return this.regionsService.findOne(id);
    }
    update(id, updateRegionsDto) {
        return this.regionsService.update(id, updateRegionsDto);
    }
    remove(id) {
        return this.regionsService.remove(id);
    }
};
exports.RegionsController = RegionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi hudud qo‘shish' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hudud yaratildi.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.default]),
    __metadata("design:returntype", void 0)
], RegionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha hududlarni olish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hududlar ro‘yxati.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RegionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'ID bo‘yicha hududni olish' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hudud topildi.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RegionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Hududni yangilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tariff_dto_1.default]),
    __metadata("design:returntype", void 0)
], RegionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Hududni o‘chirish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RegionsController.prototype, "remove", null);
exports.RegionsController = RegionsController = __decorate([
    (0, swagger_1.ApiTags)('Regions'),
    (0, common_1.Controller)('regions'),
    __metadata("design:paramtypes", [regions_service_1.RegionsService])
], RegionsController);
//# sourceMappingURL=regions.controller.js.map