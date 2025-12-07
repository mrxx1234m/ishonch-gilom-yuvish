import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './google.config';

@Module({
  imports: [ConfigModule.forFeature(googleConfig)],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
