import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

// Sample deals with realistic data
const DEMO_DEALS = [
    {
        dealname: 'Stripe - Enterprise Platform Integration',
        amount: '50000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).getTime(), // 8 months ago
        closed_lost_reason: 'Budget constraints - will revisit next quarter'
    },
    {
        dealname: 'Notion - Team Collaboration Suite',
        amount: '25000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).getTime(), // 6 months ago
        closed_lost_reason: 'Chose competitor - went with Confluence'
    },
    {
        dealname: 'Figma - Design System Implementation',
        amount: '35000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000).getTime(), // 11 months ago
        closed_lost_reason: 'No decision made - internal delays'
    },
    {
        dealname: 'Shopify - E-commerce Integration',
        amount: '45000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).getTime(), // ~7 months ago
        closed_lost_reason: 'Champion left company'
    },
    {
        dealname: 'Canva - Enterprise License',
        amount: '30000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000).getTime(), // 12 months ago
        closed_lost_reason: 'Not the right time - seasonal budget freeze'
    },
    {
        dealname: 'Airtable - Workflow Automation',
        amount: '20000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).getTime(), // 5 months ago
        closed_lost_reason: 'Budget allocated to other priorities'
    },
    {
        dealname: 'Slack - Enterprise Grid Setup',
        amount: '40000',
        dealstage: 'closedlost',
        closedate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).getTime(), // 9 months ago
        closed_lost_reason: 'Technical requirements not met'
    }
];

async function seedDemoData() {
    console.log('🌱 Seeding demo data to HubSpot...\n');

    if (!HUBSPOT_TOKEN) {
        console.error('❌ HUBSPOT_ACCESS_TOKEN not found in .env file');
        console.log('💡 Please add your HubSpot token to .env and try again\n');
        process.exit(1);
    }

    let created = 0;
    let failed = 0;

    for (const deal of DEMO_DEALS) {
        try {
            const response = await axios.post(
                `${HUBSPOT_BASE_URL}/crm/v3/objects/deals`,
                { properties: deal },
                {
                    headers: {
                        'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`  ✅ Created: ${deal.dealname} ($${parseInt(deal.amount).toLocaleString()})`);
            created++;
        } catch (error) {
            if (error.response?.status === 401) {
                console.error(`  ❌ Authentication failed - check your access token`);
                failed++;
                break;
            } else {
                console.warn(`  ⚠️  Failed: ${deal.dealname} - ${error.response?.data?.message || error.message}`);
                failed++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✨ Seeding Complete!`);
    console.log(`   Created: ${created} deals`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total value: $${DEMO_DEALS.slice(0, created).reduce((sum, d) => sum + parseInt(d.amount), 0).toLocaleString()}`);
    console.log('='.repeat(50) + '\n');

    if (created > 0) {
        console.log('🎉 Demo deals created successfully!');
        console.log('💡 Run ReviveIQ to test: npm start');
        console.log('\n📝 Note: These deals use real company names (Stripe, Notion, etc.)');
        console.log('   for signal detection to work. ReviveIQ will look for actual');
        console.log('   signals about these companies.\n');
    }
}

// Run if called directly
// Simplified check that works on all platforms
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMainModule || process.argv[1]?.includes('seedDemoData')) {
    seedDemoData().catch(error => {
        console.error('\n❌ Seeding failed:', error.message);
        process.exit(1);
    });
}

export { seedDemoData };
