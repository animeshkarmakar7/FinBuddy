import dotenv from 'dotenv';
import GroqCoachService from './services/groqCoachService.js';

dotenv.config();

async function testGroqService() {
  try {
    console.log('Testing Groq Coach Service...\n');
    
    const service = new GroqCoachService();
    
    console.log('Service initialized successfully!');
    console.log('Sending test chat message...\n');
    
    // Test with a fake userId (just for testing the Groq API)
    const response = await service.chat('test-user-id', 'Say hello in one sentence', []);
    
    console.log('✅ SUCCESS! Groq responded:');
    console.log(response.message);
    console.log('\n🎉 Groq AI Coach is working perfectly!');
    console.log('\nNow test it in the browser - it should work!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  }
}

testGroqService();
