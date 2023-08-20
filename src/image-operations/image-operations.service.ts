import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class ImageOperationsService {
  private storage: Storage;
  async cropImage(imageBuffer: Buffer, vertices: Vertex[]): Promise<Buffer> {
    // Basic check to see if imageBuffer is present and has data
    if (!imageBuffer || !imageBuffer.length) {
      throw new BadRequestException('Image buffer is empty or not provided');
    }

    if (vertices.length !== 4) {
      throw new BadRequestException('Expected four vertices for cropping.');
    }

    // Validate that each vertex has the required properties
    vertices.forEach((vertex, index) => {
      if (vertex.x === undefined || vertex.y === undefined) {
        throw new BadRequestException(
          `Vertex at index ${index} is missing x or y property.`,
        );
      }
    });

    // Get the metadata of the image to determine its dimensions
    const metadata = await sharp(imageBuffer).metadata();

    const topLeft = vertices[0];
    const topRight = vertices[1];
    const bottomRight = vertices[2];
    const bottomLeft = vertices[3];

    // Additional Check: Ensure vertices are in expected positions
    if (
      topLeft.x > topRight.x ||
      bottomLeft.x > bottomRight.x ||
      topLeft.y > bottomLeft.y ||
      topRight.y > bottomRight.y
    ) {
      throw new BadRequestException('Vertices are not correctly ordered.');
    }

    const width = topRight.x - topLeft.x;
    const height = bottomLeft.y - topLeft.y;

    let left = topLeft.x;
    let top = topLeft.y;

    let calculatedWidth = width;
    let calculatedHeight = height;

    // Validate and adjust if needed
    if (left < 0) left = 0;
    if (top < 0) top = 0;

    // Validate that the region to be cropped does not exceed the image dimensions
    if (left + calculatedWidth > metadata.width!)
      calculatedWidth = metadata.width! - left;
    if (top + calculatedHeight > metadata.height!)
      calculatedHeight = metadata.height! - top;

    if (calculatedWidth <= 0 || calculatedHeight <= 0) {
      throw new BadRequestException(
        `Invalid derived dimensions. Width: ${calculatedWidth}, Height: ${calculatedHeight}. Ensure vertices are correctly positioned within the image bounds.`,
      );
    }

    const croppedImageBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(calculatedWidth),
        height: Math.round(calculatedHeight),
      })
      .toBuffer();

    return croppedImageBuffer;
  }

  async cropMultipleAreas(
    imageBuffer: Buffer,
    verticesArray: Vertex[][],
  ): Promise<Buffer[]> {
    const croppedImages: Buffer[] = [];
    for (const vertices of verticesArray) {
      try {
        const croppedImageBuffer = await this.cropImage(imageBuffer, vertices);
        croppedImages.push(croppedImageBuffer);
      } catch (err) {
        console.error(
          `Error cropping image for vertices: ${JSON.stringify(vertices)} - ${
            err.message
          }`,
        );
      }
    }
    return croppedImages;
  }

  async getImageDimensions(
    imageBuffer: Buffer,
  ): Promise<{ width: number; height: number }> {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width!,
      height: metadata.height!,
    };
  }

  async getImageBuffer(filename: string, bucketName: string): Promise<Buffer> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(filename);

    const [exists] = await file.exists();
    if (!exists) {
      throw new NotFoundException(
        `Image "${filename}" not found in bucket "${bucketName}".`,
      );
    }

    try {
      const [buffer] = await file.download();
      return buffer;
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to fetch image "${filename}": ${err.message}`,
      );
    }
  }

  async uploadCroppedImage(
    buffer: Buffer,
    extension = 'png',
    bucketName: string,
  ): Promise<string> {
    const uniqueID = uuidv4(); // Generate a UUID
    const sanitizedFilename = `${uniqueID}.${extension}`; // Construct a new unique file name

    // Add the 'cropped/' prefix to the sanitized filename to save inside the cropped folder
    const filePath = `cropped/${sanitizedFilename}`;

    const blob = this.storage.bucket(bucketName).file(filePath);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(new Error(`Unable to upload cropped image: ${err.message}`));
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(buffer);
    });
  }
}

export interface Vertex {
  x?: number;
  y?: number;
}
