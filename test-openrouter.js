import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.AI_API_KEY;
const MODEL = process.env.AI_MODEL || 'anthropic/claude-3.5-sonnet';

console.log('🔍 Testing OpenRouter API Key...\n');

if (!API_KEY) {
    console.error('❌ No AI_API_KEY found in .env file');
    process.exit(1);
}

console.log(`📋 API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log(`📋 Model: ${MODEL}\n`);

async function testOpenRouterAPI() {
    try {
        console.log('🚀 Sending test request to OpenRouter...\n');

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: 'Say "API key is working!" in one sentence.'
                    }
                ],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://reviveiq.app',
                    'X-Title': 'ReviveIQ'
                },
                timeout: 30000
            }
        );

        console.log('✅ API Key is VALID!\n');
        console.log('📝 Test Response:', response.data.choices[0].message.content);
        console.log('\n💰 Usage Info:');
        console.log('   Model:', response.data.model);
        if (response.data.usage) {
            console.log('   Tokens used:', response.data.usage.total_tokens);
        }
        console.log('\n✨ Your OpenRouter API key is working correctly!');

    } catch (error) {
        console.error('❌ API Key Test FAILED\n');

        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Status Text:', error.response.statusText);
            console.error('Error Details:', JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 401) {
                console.error('\n💡 Issue: Invalid API Key');
                console.error('   → Check that your AI_API_KEY in .env is correct');
                console.error('   → Get your key from: https://openrouter.ai/keys');
            } else if (error.response.status === 402) {
                console.error('\n💡 Issue: Payment Required / Out of Credits');
                console.error('   → Your OpenRouter account has run out of credits');
                console.error('   → Add credits at: https://openrouter.ai/credits');
                console.error('   → Or create a new account for free $5 credit');
            } else if (error.response.status === 429) {
                console.error('\n💡 Issue: Rate Limit Exceeded');
                console.error('   → Too many requests. Wait a moment and try again');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('💡 Issue: Request Timeout');
            console.error('   → OpenRouter API took too long to respond');
        } else {
            console.error('💡 Error:', error.message);
        }

        process.exit(1);
    }
}

testOpenRouterAPI();
