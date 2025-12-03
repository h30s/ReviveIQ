import { detectFunding } from './fundingSignal.js';
import { detectLeadershipChange } from './leadershipSignal.js';
import { detectCompetitorNews } from './competitorSignal.js';
import { detectHiring } from './hiringSignal.js';
import { detectAnnualTiming } from './timingSignal.js';

export async function detectSignals(deal) {
  const signals = [];
  
  // Run all signal detectors in parallel
  const detectors = [
    detectFunding(deal),
    detectLeadershipChange(deal),
    detectCompetitorNews(deal),
    detectHiring(deal),
    detectAnnualTiming(deal)
  ];
  
  const results = await Promise.allSettled(detectors);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      signals.push(result.value);
    } else if (result.status === 'rejected') {
      console.warn(`  ⚠️  Signal detector ${index} failed: ${result.reason.message}`);
    }
  });
  
  return signals;
}
