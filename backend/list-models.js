import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('Fetching available models...\n');
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('✅ Available models for your API key:');
    console.log('=====================================\n');
    
    for await (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    console.error('\n💡 Your API key might not have the Generative Language API enabled.');
    console.error('   Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.error('   And click "Enable"');
  }
}

listModels();
