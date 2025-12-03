import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Testing Environment Variables...\n');
console.log('HUBSPOT_ACCESS_TOKEN:', process.env.HUBSPOT_ACCESS_TOKEN);
console.log('\nToken starts with:', process.env.HUBSPOT_ACCESS_TOKEN?.substring(0, 20));
console.log('Token length:', process.env.HUBSPOT_ACCESS_TOKEN?.length);
console.log('\n');

// Test HubSpot API
import axios from 'axios';

async function testAuth() {
    try {
        console.log('🧪 Testing HubSpot API authentication...\n');

        const response = await axios.get(
            'https://api.hubapi.com/crm/v3/objects/deals?limit=1',
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ SUCCESS! Token is valid!');
        console.log(`   Found ${response.data.results?.length || 0} deals in response\n`);

    } catch (error) {
        console.error('❌ FAILED!');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);

        if (error.response?.status === 401) {
            console.error('\n💡 This means your token is invalid or missing scopes!');
            console.error('   Go to HubSpot → Settings → Integrations → Private Apps');
            console.error('   Make sure your app has these scopes:');
            console.error('   ✓ crm.objects.deals.read');
            console.error('   ✓ crm.objects.deals.write');
            console.error('   ✓ crm.objects.contacts.read');
            console.error('   ✓ crm.objects.companies.read\n');
        }
    }
}

testAuth();
