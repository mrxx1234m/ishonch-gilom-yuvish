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
exports.TariffController = void 0;
const common_1 = require("@nestjs/common");
const tariff_service_1 = require("./tariff.service");
const update_tariff_dto_1 = require("./dto/update-tariff.dto");
const create_tariff_dto_1 = require("./dto/create-tariff.dto");
let TariffController = class TariffController {
    tariffService;
    constructor(tariffService) {
        this.tariffService = tariffService;
    }
    create(createTariffDto) {
        return this.tariffService.create(createTariffDto);
    }
    findAll() {
        return this.tariffService.findAll();
    }
    findActive() {
        return this.tariffService.findActive();
    }
    findOne(id) {
        return this.tariffService.findOne(+id);
    }
    update(id, dto) {
        return this.tariffService.update(+id, dto);
    }
    remove(id) {
        return this.tariffService.remove(+id);
    }
    deactivate(id) {
        return this.tariffService.deactivate(+id);
    }
    activate(id) {
        return this.tariffService.activate(+id);
    }
};
exports.TariffController = TariffController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tariff_dto_1.CreateTariffDto]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tariff_dto_1.UpdateTariffDto]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TariffController.prototype, "activate", null);
exports.TariffController = TariffController = __decorate([
    (0, common_1.Controller)('tariffs'),
    __metadata("design:paramtypes", [tariff_service_1.TariffService])
], TariffController);
//# sourceMappingURL=tariff.controller.js.map