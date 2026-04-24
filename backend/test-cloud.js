const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

console.log('Testing Cloudinary upload...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

async function test() {
  try {
    const result = await cloudinary.uploader.upload('https://picsum.photos/200/200', {
      folder: 'test',
      timeout: 60000
    });
    console.log('✅ SUCCESS!');
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
  }
}

test();
