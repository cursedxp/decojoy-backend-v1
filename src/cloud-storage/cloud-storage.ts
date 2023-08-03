import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudStorage {
  private storage: Storage;

  constructor(private config: ConfigService) {
    this.storage = new Storage({
      keyFilename: config.get('GOOGLE_APPLICATION_CREDENTIALS'),
      projectId: config.get('GOOGLE_CLOUD_PROJECT_ID'),
    });
  }

  // More methods to interact with Google Cloud Storage will be here.
}
