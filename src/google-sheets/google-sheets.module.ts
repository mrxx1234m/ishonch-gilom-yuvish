import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { GoogleSheetsController } from './google-sheets.controller';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports:[GoogleModule],
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService],
  exports:[GoogleSheetsService]
  
})
export class GoogleSheetsModule {}
