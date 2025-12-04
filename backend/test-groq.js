import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

async function testGroq() {
  try {
    console.log('Testing Groq API Key:', process.env.GROQ_API_KEY?.substring(0, 15) + '...\n');
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    console.log('Sending test message to Groq...\n');
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in one sentence' }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 50,
    });
    
    console.log('✅ SUCCESS! Groq responded:');
    console.log(completion.choices[0]?.message?.content);
    console.log('\n🎉 Your Groq API key is working perfectly!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\n💡 Possible issues:');
    console.error('   1. API key is invalid - create a new one at https://console.groq.com/keys');
    console.error('   2. API key is not activated yet - wait a few minutes');
    console.error('   3. Rate limit exceeded - wait and try again');
  }
}

testGroq();
