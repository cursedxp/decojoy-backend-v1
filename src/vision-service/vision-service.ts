import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;
  constructor(private config: ConfigService) {
    this.client = new ImageAnnotatorClient({
      keyFilename: this.config.get('KEY_LOCATION'),
    });
  }
  async detectObjects(imagePath: string) {
    const [result] = await this.client.objectLocalization(imagePath);
    const objects = result.localizedObjectAnnotations;
    console.log(objects);
    return objects;
  }
}
