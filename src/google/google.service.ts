import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private sheets: sheets_v4.Sheets;
  private sheetId: string;

  constructor(private config: ConfigService) {
    const clientEmail = this.config.getOrThrow<string>('google.clientEmail');
    const privateKey = this.config
      .getOrThrow<string>('google.privateKey')
      .replace(/\\n/g, '\n');

    this.sheetId = this.config.getOrThrow<string>('google.sheetId');

    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({
      version: 'v4',
      auth,
    });
  }

  async appendRow(values: any[]) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: 'Sheet1!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });
  }
}
