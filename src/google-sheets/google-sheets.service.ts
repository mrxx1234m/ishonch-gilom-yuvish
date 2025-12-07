// src/google-sheets/google-sheets.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleService } from 'src/google/google.service';

@Injectable()
export class GoogleSheetsService {
  constructor(private readonly googleService: GoogleService) {}

  /**
   * Google Sheet-ga yangi order yozish
   * @param data - yoziladigan ma'lumotlar array sifatida
   */
  async writeOrders(data: any[]) {
    try {
      const response = await this.googleService.appendRow(data);   
      return response.data;
    } catch (error) {
      console.error('Error adding row:', error);
      throw error;
    }
  }
}
