import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;

  constructor(private config: ConfigService) {
    this.client = new ImageAnnotatorClient({
      keyFilename: this.config.get('KEY_LOCATION'),
    });
  }

  async detectObjects(config: VisionConfig) {
    const requests: protos.google.cloud.vision.v1.IAnnotateImageRequest[] =
      config.imageUrls.map((url) => {
        return {
          image: {
            source: {
              imageUri: url,
            },
          },
          features: [{ type: 'OBJECT_LOCALIZATION' }],
        };
      });

    const [response] = await this.client.batchAnnotateImages({ requests });

    return response.responses.map((res) => res.localizedObjectAnnotations);
  }
}

interface VisionConfig {
  imageUrls: string[];
}
