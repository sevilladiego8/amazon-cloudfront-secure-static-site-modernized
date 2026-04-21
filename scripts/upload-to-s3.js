// IMPORTANT: RUN ON LINUX!
/**
 This Node.js script does the following:

- Recursively scans `dist/` folder
- Uploads files to your S3 bucket
- If you're generating compressed gzip files it detects `.gz` files and:
    - Renames them to their original name (`main.js.gz` → `main.js`)
    - Sets `Content-Encoding: gzip`
    - Infers `Content-Type` from extension
- Sets `Cache-Control` headers for long-term caching

### 🔧 Prerequisites:

- Node.js installed
- AWS CLI or credentials set in your environment
- Install AWS SDK:
> npm i @aws-sdk/client-s3 mime-types
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
// const { argv } = require('process')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// CONFIG — adjust these as needed
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'example.com';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DIST_DIR = path.resolve(__dirname, '../dist');
console.log('Reading/Uploading files in ', DIST_DIR);

const s3 = new S3Client({ region: AWS_REGION }); // e.g. us-east-1

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function uploadFile(filePath) {
  const relPath = path.relative(DIST_DIR, filePath);
  const isGzipped = filePath.endsWith('.gz');

  const s3Key = isGzipped ? relPath.replace(/\.gz$/, '') : relPath;

  const contentType = mime.lookup(s3Key) || 'application/octet-stream';
  const contentEncoding = isGzipped ? 'gzip' : undefined;

  const body = fs.readFileSync(filePath);

  const params = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'max-age=31536000, public',
    ...(contentEncoding && { ContentEncoding: contentEncoding }),
  };

  return s3
    .send(new PutObjectCommand(params))
    .then(() => {
      console.log(`✅ Uploaded: ${s3Key} (${isGzipped ? 'gzipped' : 'raw'})`);
    })
    .catch((err) => {
      console.error(`❌ Failed to upload ${s3Key}:`, err.message);
    });
}

async function main() {
  const uploadPromises = [];

  walkDir(DIST_DIR, (filePath) => {
    uploadPromises.push(uploadFile(filePath));
  });

  await Promise.all(uploadPromises);
  console.log('✅ All files uploaded.');
}

main().catch((err) => {
  console.error('❌ Upload process failed:', err);
});
