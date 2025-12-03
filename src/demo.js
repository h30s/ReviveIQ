import { sampleDeals, sampleSignals, sampleAnalysis } from './sampleData.js';

// Demo mode - runs ReviveIQ with sample data (no API calls needed)

async function runReviveIQDemo() {
  console.log('🔥 ReviveIQ Demo Mode Starting...\n');
  console.log('📝 Using sample data (no API calls)\n');
  
  // Step 1: Show sample deals
  console.log('📊 Fetching closed-lost deals from HubSpot...');
  await sleep(1000);
  console.log(`✓ Found ${sampleDeals.length} closed-lost deals\n`);
  
  let opportunitiesFound = 0;
  
  // Step 2-5: Process each deal
  for (const deal of sampleDeals) {
    console.log(`\n🔍 Analyzing: ${deal.companyName} ($${deal.amount.toLocaleString()})`);
    await sleep(500);
    
    // Check for signals
    const signals = sampleSignals[deal.companyDomain] || [];
    
    if (signals.length === 0) {
      console.log('  ⚪ No signals detected');
      continue;
    }
    
    console.log(`  ✓ Found ${signals.length} signal(s): ${signals.map(s => s.type).join(', ')}`);
    await sleep(500);
    
    // Get analysis
    const analysis = sampleAnalysis[deal.companyDomain];
    
    if (!analysis) {
      console.log('  ⚠️  Analysis not available');
      continue;
    }
    
    console.log(`  🎯 Confidence: ${analysis.confidence_score}/10`);
    await sleep(300);
    
    console.log('  ✅ Task would be created in HubSpot');
    
    // Show sample output
    if (opportunitiesFound === 0) {
      console.log('\n  📋 Sample Task Preview:');
      console.log('  ─────────────────────────────────────────');
      console.log(`  Subject: 🔥 ReviveIQ: ${deal.companyName} showing revival signals`);
      console.log(`  \n  Signals:`);
      signals.forEach(s => console.log(`    • ${s.description}`));
      console.log(`  \n  AI Summary:`);
      console.log(`    ${analysis.summary.substring(0, 100)}...`);
      console.log(`  \n  Email Draft:`);
      console.log(`    ${analysis.email_draft.split('\n')[0]}`);
      console.log('  ─────────────────────────────────────────');
    }
    
    opportunitiesFound++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`🎉 ReviveIQ Demo Complete!`);
  console.log(`📊 Deals Scanned: ${sampleDeals.length}`);
  console.log(`🔥 Opportunities Found: ${opportunitiesFound}`);
  console.log(`💰 Potential Pipeline: $${calculatePipeline(opportunitiesFound)}K`);
  console.log('='.repeat(60));
  
  console.log('\n💡 This was a demo with sample data.');
  console.log('📝 To run with real data:');
  console.log('   1. Add your HubSpot token to .env');
  console.log('   2. Run: npm start\n');
}

function calculatePipeline(opportunities) {
  // Average deal value from sample data
  const avgDealValue = sampleDeals.reduce((sum, d) => sum + d.amount, 0) / sampleDeals.length;
  return Math.round((opportunities * avgDealValue) / 1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run demo
runReviveIQDemo().catch(error => {
  console.error('❌ Demo error:', error.message);
  process.exit(1);
});
