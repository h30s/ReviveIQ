import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.AI_API_KEY;
const PROVIDER = process.env.AI_PROVIDER || 'gemini';
const MODEL = process.env.AI_MODEL || 'gemini-1.5-flash';

console.log('🔍 Testing Google Gemini API...\n');

if (!API_KEY) {
    console.error('❌ No AI_API_KEY found in .env file');
    console.log('\n💡 To get your FREE Gemini API key:');
    console.log('   1. Visit: https://aistudio.google.com/apikey');
    console.log('   2. Sign in with your Google account');
    console.log('   3. Click "Create API Key"');
    console.log('   4. Copy the key and add to .env file:\n');
    console.log('      AI_PROVIDER=gemini');
    console.log('      AI_API_KEY=your_key_here');
    console.log('      AI_MODEL=gemini-1.5-flash\n');
    process.exit(1);
}

console.log(`📋 Provider: ${PROVIDER}`);
console.log(`📋 Model: ${MODEL}`);
console.log(`📋 API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

async function testGeminiAPI() {
    try {
        console.log('🚀 Sending test request to Google Gemini...\n');

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        const response = await axios.post(
            url,
            {
                contents: [{
                    parts: [{
                        text: 'Say "Gemini API is working perfectly!" in one enthusiastic sentence.'
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('✅ Gemini API is WORKING!\n');
        console.log('📝 Test Response:', response.data.candidates[0].content.parts[0].text);
        console.log('\n💰 Usage Info:');
        console.log('   Model:', response.data.modelVersion || MODEL);
        if (response.data.usageMetadata) {
            console.log('   Prompt tokens:', response.data.usageMetadata.promptTokenCount);
            console.log('   Response tokens:', response.data.usageMetadata.candidatesTokenCount);
            console.log('   Total tokens:', response.data.usageMetadata.totalTokenCount);
        }
        console.log('\n✨ Your Gemini API key is working correctly!');
        console.log('🎉 You can now run your ReviveIQ agent with: npm start\n');

    } catch (error) {
        console.error('❌ Gemini API Test FAILED\n');

        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Error Details:', JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 400) {
                const errorMsg = error.response.data?.error?.message || '';
                if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
                    console.error('\n💡 Issue: Invalid API Key');
                    console.error('   → Your AI_API_KEY is not valid');
                    console.error('   → Get a new key at: https://aistudio.google.com/apikey');
                    console.error('   → Make sure to copy the entire key');
                } else if (errorMsg.includes('models/')) {
                    console.error('\n💡 Issue: Invalid Model Name');
                    console.error(`   → Model "${MODEL}" may not exist or be available`);
                    console.error('   → Try: gemini-1.5-flash or gemini-1.5-pro');
                } else {
                    console.error('\n💡 Issue: Bad Request');
                    console.error('   → Error:', errorMsg);
                }
            } else if (error.response.status === 429) {
                console.error('\n💡 Issue: Rate Limit Exceeded');
                console.error('   → Free tier: 15 requests per minute');
                console.error('   → Wait a moment and try again');
            } else if (error.response.status === 403) {
                console.error('\n💡 Issue: Permission Denied');
                console.error('   → Check that your API key has the right permissions');
                console.error('   → Make sure Generative Language API is enabled');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('💡 Issue: Request Timeout');
            console.error('   → Gemini API took too long to respond');
            console.error('   → Check your internet connection');
        } else {
            console.error('💡 Error:', error.message);
        }

        process.exit(1);
    }
}

testGeminiAPI();
