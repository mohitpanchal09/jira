
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  export const uploadToS3 = async (buffer: Buffer, key: string, contentType: string) => {
    const bucket = process.env.AWS_BUCKET_NAME!;
    
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
  
    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  };