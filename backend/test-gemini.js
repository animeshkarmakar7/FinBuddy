import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

console.log('=== Gemini API Key Test ===');
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('API Key preview:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT FOUND');

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('\nTesting Gemini API...');
    const result = await model.generateContent('Say hello in one sentence');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Gemini responded:', text);
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.message.includes('API key')) {
      console.error('\n💡 The API key appears to be invalid.');
      console.error('   Please verify at: https://aistudio.google.com/app/apikey');
    }
    process.exit(1);
  }
}

testGemini();
