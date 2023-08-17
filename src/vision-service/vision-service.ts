import { ImageAnnotatorClient, protos } from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisionService {
  private client: ImageAnnotatorClient;

  constructor(
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {
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

  async saveResults(config: ResultsConfig) {
    try {
      for (let i = 0; i < config.imageUrls.length; i++) {
        const imageUrl = config.imageUrls[i];

        // Start a transaction
        await this.prismaService.$transaction(async (prisma) => {
          const imageEntry = await prisma.image.findFirst({
            where: { url: imageUrl },
          });

          if (imageEntry) {
            const analysisId = await this.createImageAnalysisEntry(
              imageEntry.id,
            );
            await this.createDetectedObjectEntries(
              analysisId,
              config.visionResults[i],
            );
          } else {
            console.error(
              `Image with URL: ${imageUrl} not found in the database.`,
            );
          }
        });
      }
    } catch (error) {
      console.error('Error while saving vision results:', error.message);
      throw new Error('Failed to save vision analysis results');
    }
  }

  async createImageAnalysisEntry(imageId: string): Promise<string> {
    const analysis = await this.prismaService.imageAnalysis.create({
      data: {
        imageId: imageId,
      },
    });
    return analysis.id;
  }

  async createDetectedObjectEntries(
    analysisId: string,
    objects: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation[],
  ): Promise<void> {
    for (const obj of objects) {
      const detectedObject = await this.prismaService.detectedObject.create({
        data: {
          label: obj.name,
          confidence: obj.score,
          imageAnalysisId: analysisId,
        },
      });

      const verticesPromises = obj.boundingPoly.normalizedVertices.map(
        (vertex) => {
          return this.prismaService.vertex.create({
            data: {
              x: vertex.x,
              y: vertex.y,
              detectedObjectId: detectedObject.id,
            },
          });
        },
      );

      await Promise.all(verticesPromises);
    }
  }
}

interface VisionConfig {
  imageUrls: string[];
}

interface ResultsConfig {
  imageUrls: string[];
  visionResults: any[];
}
