import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const requiredEnvVars = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} environment variable is not set`);
  }
}

/**
 * S3-compatible client for Cloudflare R2
 */
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer} buffer - File buffer to upload
 * @param {string} filename - Filename (will be used as the object key)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadToR2(buffer, filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    // Cache for 1 year (immutable content)
    CacheControl: "public, max-age=31536000, immutable",
  });

  try {
    await r2Client.send(command);
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;
    console.log(`Uploaded to R2: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload file to storage");
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} filename - Filename/key to delete
 * @returns {Promise<void>}
 */
export async function deleteFromR2(filename) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
  });

  try {
    await r2Client.send(command);
    console.log(`Deleted from R2: ${filename}`);
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw new Error("Failed to delete file from storage");
  }
}

/**
 * Get the public URL for a file
 * @param {string} filename - Filename/key
 * @returns {string} - Public URL
 */
export function getR2PublicUrl(filename) {
  return `${process.env.R2_PUBLIC_URL}/${filename}`;
}

/**
 * List all files in R2 bucket
 * @param {string} prefix - Optional prefix to filter files
 * @returns {Promise<Array>} - Array of file objects with key and url
 */
export async function listR2Files(prefix = "") {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: 100,
  });

  try {
    const response = await r2Client.send(command);
    const files = (response.Contents || [])
      .filter((item) => {
        const ext = item.Key?.toLowerCase().split(".").pop();
        return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
      })
      .map((item) => ({
        key: item.Key,
        url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
        size: item.Size,
        lastModified: item.LastModified,
      }));
    return files;
  } catch (error) {
    console.error("Error listing R2 files:", error);
    throw new Error("Failed to list files from storage");
  }
}

export { r2Client };
