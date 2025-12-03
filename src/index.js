import dotenv from 'dotenv';
import { fetchClosedLostDeals } from './hubspot/dealFetcher.js';
import { detectSignals } from './signals/signalDetector.js';
import { analyzeWithAI } from './ai/analyzer.js';
import { createHubSpotActions } from './hubspot/actionCreator.js';

dotenv.config();

async function runReviveIQ() {
  console.clear();
  console.log('\n' + '═'.repeat(60));
  console.log('🔥  ReviveIQ - Dead Deal Resurrection Agent');
  console.log('═'.repeat(60) + '\n');

  const startTime = Date.now();

  try {
    // Step 1: Fetch closed-lost deals
    console.log('📊 Step 1: Fetching closed-lost deals from HubSpot...');
    const deals = await fetchClosedLostDeals();
    console.log(`✓ Found ${deals.length} closed-lost deals\n`);

    if (deals.length === 0) {
      console.log('💡 No closed-lost deals found.');
      console.log('   Run `npm run seed` to add sample deals for testing.\n');
      return;
    }

    let opportunitiesFound = 0;
    const opportunities = [];

    // Step 2-5: Process each deal
    for (const deal of deals) {
      console.log(`\n🔍 Analyzing: ${deal.companyName} ($${deal.amount.toLocaleString()})`);

      // Step 2: Detect signals
      const signals = await detectSignals(deal);

      if (signals.length === 0) {
        console.log('  ⚪ No signals detected');
        continue;
      }

      console.log(`  ✓ Found ${signals.length} signal(s): ${signals.map(s => s.type).join(', ')}`);

      // Step 3: AI Analysis
      const analysis = await analyzeWithAI(deal, signals);

      if (analysis.confidence_score < parseInt(process.env.CONFIDENCE_THRESHOLD || '7')) {
        console.log(`  ⚠️  Low confidence (${analysis.confidence_score}/10) - skipping`);
        continue;
      }

      console.log(`  🎯 Confidence: ${analysis.confidence_score}/10`);

      // Step 4: Create HubSpot actions
      await createHubSpotActions(deal, signals, analysis);
      console.log('  ✅ Task created in HubSpot');

      opportunitiesFound++;
      opportunities.push({
        company: deal.companyName,
        value: deal.amount,
        signals: signals.length,
        confidence: analysis.confidence_score
      });
    }

    // Enhanced Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const avgDealValue = deals.reduce((sum, d) => sum + d.amount, 0) / deals.length;
    const potentialPipeline = opportunities.reduce((sum, o) => sum + o.value, 0);

    console.log('\n' + '═'.repeat(60));
    console.log('✨  RESULTS');
    console.log('═'.repeat(60));
    console.log(`⏱️   Execution Time: ${elapsed}s`);
    console.log(`📊  Deals Scanned: ${deals.length}`);
    console.log(`🔥  Revival Opportunities: ${opportunitiesFound}`);
    console.log(`💰  Potential Pipeline: $${Math.round(potentialPipeline).toLocaleString()}`);
    console.log(`📈  Discovery Rate: ${((opportunitiesFound / deals.length) * 100).toFixed(1)}%`);
    console.log(`⭐  Avg Confidence: ${opportunities.length > 0 ? (opportunities.reduce((sum, o) => sum + o.confidence, 0) / opportunities.length).toFixed(1) : 0}/10`);
    console.log('═'.repeat(60) + '\n');

    if (opportunitiesFound > 0) {
      console.log('✅  Success! Check your HubSpot Tasks tab for action items!');
      console.log('\n📋 Top Opportunities:');
      opportunities
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .forEach((o, i) => {
          console.log(`   ${i + 1}. ${o.company} - $${o.value.toLocaleString()} (${o.confidence}/10)`);
        });
      console.log('');
    } else {
      console.log('💡 Tips to find more opportunities:');
      console.log('   • Lower CONFIDENCE_THRESHOLD in .env (currently: ' + (process.env.CONFIDENCE_THRESHOLD || '7') + ')');
      console.log('   • Add API keys for signal detection (Crunchbase, etc.)');
      console.log('   • Wait for timing-based signals (6 or 12 month marks)');
      console.log('   • Add more closed-lost deals: npm run seed\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('authentication') || error.message.includes('401')) {
      console.error('💡 Tip: Check your HUBSPOT_ACCESS_TOKEN in .env file');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Check your internet connection and API endpoints');
    }
    console.error('');
    process.exit(1);
  }
}

runReviveIQ();
