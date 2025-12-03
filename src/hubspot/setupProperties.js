import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

const REQUIRED_PROPERTIES = [
    {
        name: 'reviveiq_signal_detected',
        label: 'ReviveIQ Signal Detected',
        type: 'bool',
        fieldType: 'booleancheckbox',
        groupName: 'dealinformation',
        description: 'Indicates that ReviveIQ detected a revival signal for this deal'
    },
    {
        name: 'reviveiq_signal_type',
        label: 'ReviveIQ Signal Type',
        type: 'string',
        fieldType: 'text',
        groupName: 'dealinformation',
        description: 'Types of signals detected (e.g., FUNDING, HIRING, TIMING)'
    },
    {
        name: 'reviveiq_last_scan',
        label: 'ReviveIQ Last Scan',
        type: 'date',
        fieldType: 'date',
        groupName: 'dealinformation',
        description: 'Date when this deal was last scanned by ReviveIQ'
    },
    {
        name: 'reviveiq_confidence',
        label: 'ReviveIQ Confidence Score',
        type: 'number',
        fieldType: 'number',
        groupName: 'dealinformation',
        description: 'AI confidence score (1-10) for revival opportunity'
    }
];

export async function setupHubSpotProperties() {
    console.log('🔧 Setting up HubSpot custom properties...\n');

    if (!HUBSPOT_TOKEN) {
        console.error('❌ HUBSPOT_ACCESS_TOKEN not found in .env file');
        console.log('💡 Please add your HubSpot token to .env and try again\n');
        process.exit(1);
    }

    let created = 0;
    let exists = 0;
    let failed = 0;

    for (const prop of REQUIRED_PROPERTIES) {
        try {
            await axios.post(
                `${HUBSPOT_BASE_URL}/crm/v3/properties/deals`,
                prop,
                {
                    headers: {
                        'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`  ✅ Created: ${prop.label}`);
            created++;
        } catch (error) {
            if (error.response?.status === 409) {
                console.log(`  ✓  Exists: ${prop.label}`);
                exists++;
            } else if (error.response?.status === 401) {
                console.error(`  ❌ Authentication failed - check your access token`);
                failed++;
                break;
            } else {
                console.warn(`  ⚠️  Failed: ${prop.label} - ${error.message}`);
                failed++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✨ Setup Complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Already existed: ${exists}`);
    console.log(`   Failed: ${failed}`);
    console.log('='.repeat(50) + '\n');

    if (failed === 0) {
        console.log('🎉 All ReviveIQ properties are ready!');
        console.log('💡 You can now run: npm start\n');
    }
}

// Run if called directly
const isMainModule = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
    setupHubSpotProperties().catch(error => {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    });
}
