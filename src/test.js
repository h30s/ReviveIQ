import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 ReviveIQ Configuration Test\n');

// Test environment variables
const checks = [
  { name: 'HubSpot Access Token', value: process.env.HUBSPOT_ACCESS_TOKEN },
  { name: 'Crunchbase API Key', value: process.env.CRUNCHBASE_API_KEY },
  { name: 'Apollo API Key', value: process.env.APOLLO_API_KEY },
  { name: 'Google News API Key', value: process.env.GOOGLE_NEWS_API_KEY },
  { name: 'AI API Key', value: process.env.AI_API_KEY }
];

let allConfigured = true;

checks.forEach(check => {
  const status = check.value ? '✅' : '❌';
  const display = check.value ? '***configured***' : 'NOT SET';
  console.log(`${status} ${check.name}: ${display}`);
  
  if (!check.value) allConfigured = false;
});

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('✅ All configuration complete! Ready to run.');
  console.log('\nRun: npm start');
} else {
  console.log('⚠️  Some API keys are missing.');
  console.log('\nCopy .env.example to .env and add your keys.');
}

console.log('='.repeat(50));
