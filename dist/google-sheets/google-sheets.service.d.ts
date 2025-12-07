import { GoogleService } from 'src/google/google.service';
export declare class GoogleSheetsService {
    private readonly googleService;
    constructor(googleService: GoogleService);
    writeOrders(data: any[]): Promise<import("googleapis").sheets_v4.Schema$AppendValuesResponse>;
}
