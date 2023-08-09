import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudStorageService {
  private storage: Storage;

  constructor(private config: ConfigService) {
    this.storage = new Storage({
      keyFilename: config.get('GOOGLE_APPLICATION_CREDENTIALS'),
      projectId: config.get('GOOGLE_CLOUD_PROJECT_ID'),
    });
  }

  async upload(file: Express.Multer.File, bucketName: string) {
    const { originalname, buffer } = file;

    const blob = this.storage
      .bucket(bucketName)
      .file(originalname.replace(/ /g, '_'));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', reject);
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(buffer);
    });
  }
}
