import { sheets_v4 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
export declare class GoogleService {
    private config;
    private sheets;
    private sheetId;
    constructor(config: ConfigService);
    appendRow(values: any[]): Promise<import("googleapis-common").GaxiosResponseWithHTTP2<sheets_v4.Schema$AppendValuesResponse>>;
}
