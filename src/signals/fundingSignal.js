import axios from 'axios';
import { config } from '../config.js';
import { apiCallWithRetry } from '../utils/apiHelper.js';

export async function detectFunding(deal) {
  if (!config.apis.crunchbase.apiKey || !deal.companyName) {
    return null;
  }

  try {
    const response = await apiCallWithRetry(
      `${config.apis.crunchbase.baseUrl}/entities/organizations`,
      {
        params: {
          name: deal.companyName
        },
        headers: {
          'X-Cb-User-Key': config.apis.crunchbase.apiKey
        },
        timeout: 10000
      }
    );

    const org = response.data.entities?.[0];
    if (!org) return null;

    const lastFundingDate = org.properties?.last_funding_at;
    if (!lastFundingDate) return null;

    const fundingDate = new Date(lastFundingDate);
    const daysSinceFunding = (Date.now() - fundingDate.getTime()) / (1000 * 60 * 60 * 24);

    // Signal is relevant if funding was within last 90 days
    if (daysSinceFunding <= 90) {
      const fundingType = org.properties.last_funding_type || 'funding';
      const amount = org.properties.money_raised?.value;
      const currency = org.properties.money_raised?.currency || 'USD';

      let amountText = '';
      if (amount) {
        const amountM = (amount / 1000000).toFixed(1);
        amountText = ` ($${amountM}M ${currency})`;
      }

      return {
        type: 'FUNDING',
        strength: 9,
        details: {
          fundingType: fundingType,
          amount: amount,
          currency: currency,
          date: lastFundingDate
        },
        description: `Raised ${fundingType} funding${amountText} ${Math.floor(daysSinceFunding)} days ago`
      };
    }

    return null;

  } catch (error) {
    console.warn(`  ⚠️  Crunchbase API error: ${error.message}`);
    return null;
  }
}
