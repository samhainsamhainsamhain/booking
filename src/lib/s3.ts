import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_VERCEL,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VERCEL,
  region: process.env.AWS_REGION_VERCEL,
  signatureVersion: "v4",
});
