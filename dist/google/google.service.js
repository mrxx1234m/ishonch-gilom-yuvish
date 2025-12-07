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
exports.GoogleService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
const google_auth_library_1 = require("google-auth-library");
let GoogleService = class GoogleService {
    config;
    sheets;
    sheetId;
    constructor(config) {
        this.config = config;
        const clientEmail = this.config.getOrThrow('google.clientEmail');
        const privateKey = this.config
            .getOrThrow('google.privateKey')
            .replace(/\\n/g, '\n');
        this.sheetId = this.config.getOrThrow('google.sheetId');
        const auth = new google_auth_library_1.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = googleapis_1.google.sheets({
            version: 'v4',
            auth,
        });
    }
    async appendRow(values) {
        return this.sheets.spreadsheets.values.append({
            spreadsheetId: this.sheetId,
            range: 'Sheet1!A:Z',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });
    }
};
exports.GoogleService = GoogleService;
exports.GoogleService = GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleService);
//# sourceMappingURL=google.service.js.map