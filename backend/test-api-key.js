import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API Key:', API_KEY.substring(0, 15) + '...\n');

// Test 1: Try to list models
const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(listModelsUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    
    if (res.statusCode === 200) {
      const models = JSON.parse(data);
      console.log('\n✅ Available Models:');
      console.log('===================\n');
      
      if (models.models) {
        models.models.forEach(model => {
          console.log(`- ${model.name}`);
          console.log(`  Display Name: ${model.displayName}`);
          console.log(`  Methods: ${model.supportedGenerationMethods?.join(', ')}\n`);
        });
      } else {
        console.log('No models found');
      }
    } else {
      console.log('\n❌ Error Response:');
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('❌ Request Error:', err.message);
});
