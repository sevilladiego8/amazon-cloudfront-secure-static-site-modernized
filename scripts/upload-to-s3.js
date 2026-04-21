// IMPORTANT: RUN ON LINUX!
/**
 This Node.js script does the following:

- Recursively scans `dist/` folder
- Uploads files to your S3 bucket
- if your frontend app has gzip compression enabled, it detects `.gz` files and:
    - Renames them to their original name (`main.js.gz` → `main.js`)
    - Sets `Content-Encoding: gzip`
    - Infers `Content-Type` from extension
- Sets `Cache-Control` headers for long-term caching

### 🔧 Prerequisites:

- Node.js installed
- AWS CLI or credentials set in your environment
- Install AWS SDK:
> npm install aws-sdk mime-types
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const AWS = require('@aws-sdk/client-s3');

const BUCKET_NAME = 'diegosevilla.dev';
const DIST_DIR = path.resolve(__dirname, 'dist');

const s3 = new AWS.S3();

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
    ...(contentEncoding ? { ContentEncoding: contentEncoding } : {}),
  };

  return s3
    .upload(params)
    .promise()
    .then(() =>
      console.log(`Uploaded: ${s3Key} (${isGzipped ? 'gzip' : 'raw'})`),
    );
}

async function main() {
  const uploadPromises = [];
  walkDir(DIST_DIR, (filePath) => {
    uploadPromises.push(uploadFile(filePath));
  });

  await Promise.all(uploadPromises);
  console.log('✅ Upload complete!');
}

main().catch((err) => {
  console.error('❌ Upload failed:', err);
});
