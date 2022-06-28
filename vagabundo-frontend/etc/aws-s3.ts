import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

AWS.config.loadFromPath('aws-build.json');

const bucketName = 'BUCKET_ID';

const fileNames = [
  path.parse('/dist/vagabundo-frontend/favicon.ico'),
  path.parse('/dist/vagabundo-frontend/index.html'),

  path.parse('/dist/vagabundo-frontend/main.js'),
  path.parse('/dist/vagabundo-frontend/main.js.map'),

  path.parse('/dist/vagabundo-frontend/polyfills.js'),
  path.parse('/dist/vagabundo-frontend/polyfills.js.map'),

  path.parse('/dist/vagabundo-frontend/runtime.js'),
  path.parse('/dist/vagabundo-frontend/runtime.js.map'),

  path.parse('/dist/vagabundo-frontend/styles.js'),
  path.parse('/dist/vagabundo-frontend/styles.js.map'),

  path.parse('/dist/vagabundo-frontend/vendor.js'),
  path.parse('/dist/vagabundo-frontend/vendor.js.map')
];

fileNames.forEach(fileName => {
  const local = path.relative('/', fileName.dir) + path.sep + fileName.base;
  const remote = path.relative('/dist/', fileName.dir) + path.sep + fileName.base;

  uploadFile(local, remote);
});

function uploadFile(localPath, remotePath) {
  fs.readFile(localPath, (err, data) => {
    if (err) {
      throw err;
    }
    const params = {
      Bucket: bucketName,
      Key: remotePath,
      Body: JSON.stringify(data, null, 2)
    };
    s3.upload(params, function(s3Err, s3Data) {
      if (s3Err) {
        throw s3Err;
      }
      console.log(`File uploaded successfully at ${s3Data.Location}`);
    });
  });
}
