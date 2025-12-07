"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    google: {
        projectId: process.env.GOOGLE_PROJECT_ID,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        sheetId: process.env.GOOGLE_SHEET_ID,
    },
});
//# sourceMappingURL=google.config.js.map