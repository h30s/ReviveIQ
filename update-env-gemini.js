import fs from 'fs';

const envPath = '.env';
const apiKey = 'AIzaSyDQdeCwhvcWgSriuwtqUTDoapvwOiFOwBY';

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Update or add AI configuration
if (envContent.includes('AI_PROVIDER=')) {
    envContent = envContent.replace(/AI_PROVIDER=.*/g, 'AI_PROVIDER=gemini');
} else {
    envContent += '\nAI_PROVIDER=gemini';
}

if (envContent.includes('AI_API_KEY=')) {
    envContent = envContent.replace(/AI_API_KEY=.*/g, `AI_API_KEY=${apiKey}`);
} else {
    envContent += `\nAI_API_KEY=${apiKey}`;
}

if (envContent.includes('AI_MODEL=')) {
    envContent = envContent.replace(/AI_MODEL=.*/g, 'AI_MODEL=gemini-1.5-flash');
} else {
    envContent += '\nAI_MODEL=gemini-1.5-flash';
}

// Write updated .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Updated .env file with Gemini configuration!');
console.log('   AI_PROVIDER=gemini');
console.log('   AI_API_KEY=AIza***OwBY (hidden for security)');
console.log('   AI_MODEL=gemini-1.5-flash');
