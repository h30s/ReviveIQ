import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function validateToken() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  
  if (!token) {
    console.error('❌ No HUBSPOT_ACCESS_TOKEN found in .env file');
    process.exit(1);
  }

  console.log('🔍 Testing HubSpot token...');
  console.log(`Token: ${token.substring(0, 15)}...${token.substring(token.length - 4)}\n`);

  try {
    // Test basic API access
    const response = await axios.get(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=1',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Token is valid!');
    console.log(`✅ Successfully connected to HubSpot`);
    console.log(`✅ Found ${response.data.results?.length || 0} deal(s) in test query\n`);
    
    // Test required scopes
    console.log('📋 Testing required permissions...');
    const tests = [
      { name: 'Read Deals', url: '/crm/v3/objects/deals?limit=1' },
      { name: 'Read Companies', url: '/crm/v3/objects/companies?limit=1' },
      { name: 'Read Contacts', url: '/crm/v3/objects/contacts?limit=1' }
    ];

    for (const test of tests) {
      try {
        await axios.get(`https://api.hubapi.com${test.url}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`  ✅ ${test.name}`);
      } catch (err) {
        console.log(`  ❌ ${test.name} - ${err.response?.status || 'Failed'}`);
      }
    }

    console.log('\n🎉 Your HubSpot token is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Token validation failed!\n');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.error('\n💡 Your token is invalid or expired.');
      console.error('   Please generate a new token from:');
      console.error('   HubSpot → Settings → Integrations → Private Apps\n');
    }
    
    process.exit(1);
  }
}

validateToken();
