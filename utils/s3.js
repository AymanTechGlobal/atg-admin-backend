const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const getSignedUrl = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 3600, // URL expires in 1 hour
    };

    return await s3.getSignedUrlPromise("getObject", params);
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

const getFileStream = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    return s3.getObject(params).createReadStream();
  } catch (error) {
    console.error("Error getting file stream:", error);
    throw error;
  }
};

module.exports = {
  getSignedUrl,
  getFileStream,
};
