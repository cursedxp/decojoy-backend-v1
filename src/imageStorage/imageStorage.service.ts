import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ImageStorageService {
  private storage: Storage;

  constructor(
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.storage = new Storage({
      keyFilename: config.get('GOOGLE_APPLICATION_CREDENTIALS'),
      projectId: config.get('GOOGLE_CLOUD_PROJECT_ID'),
    });
  }

  async createImageMetadata(fileName: string, url: string) {
    return this.prismaService.image.create({
      data: {
        fileName,
        url,
      },
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<string> {
    const uniqueID = uuidv4(); // Generate a UUID
    const extension = file.originalname.split('.').pop(); // Extract file extension from the original name
    const sanitizedFilename = `${uniqueID}.${extension}`; // Construct a new unique file name

    const blob = this.storage.bucket(bucketName).file(sanitizedFilename);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(
          new Error(`Unable to upload "${file.originalname}": ${err.message}`),
        );
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async uploadAndCreateMetadata(
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<string> {
    // First, upload the image
    const publicUrl = await this.uploadImage(file, bucketName);

    // Now, create metadata for this image using the sanitized filename
    await this.createImageMetadata(file.originalname, publicUrl);

    return publicUrl;
  }

  async deleteImage(filename: string, bucketName: string): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(filename);

    const [exists] = await file.exists();
    if (!exists) {
      throw new NotFoundException(
        `Image "${filename}" not found in bucket "${bucketName}".`,
      );
    }

    try {
      await file.delete();
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to delete image "${filename}": ${err.message}`,
      );
    }
  }
}
