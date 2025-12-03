import axios from 'axios';
import { config } from '../config.js';

export async function fetchClosedLostDeals() {
  const monthsBack = config.agent.scanMonthsBack;
  const minValue = config.agent.minimumDealValue;
  const timestampCutoff = Date.now() - (monthsBack * 30 * 24 * 60 * 60 * 1000);

  const searchPayload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'dealstage',
            operator: 'EQ',
            value: 'closedlost'
          },
          {
            propertyName: 'closedate',
            operator: 'GTE',
            value: timestampCutoff.toString()
          }
        ]
      }
    ],
    properties: [
      'dealname',
      'amount',
      'closedate',
      'closed_lost_reason',
      'hubspot_owner_id'
    ],
    limit: 100
  };

  if (minValue > 0) {
    searchPayload.filterGroups[0].filters.push({
      propertyName: 'amount',
      operator: 'GTE',
      value: minValue.toString()
    });
  }

  try {
    const response = await axios.post(
      `${config.hubspot.baseUrl}/crm/v3/objects/deals/search`,
      searchPayload,
      {
        headers: {
          'Authorization': `Bearer ${config.hubspot.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const deals = response.data.results.map(deal => ({
      id: deal.id,
      dealName: deal.properties.dealname,
      amount: parseFloat(deal.properties.amount || 0),
      closeDate: new Date(deal.properties.closedate),
      lostReason: deal.properties.closed_lost_reason || 'Unknown',
      ownerId: deal.properties.hubspot_owner_id,
      companyName: deal.properties.dealname.split('-')[0].trim(),
      companyDomain: null // Will be enriched from associations
    }));

    // Enrich with company data
    for (const deal of deals) {
      await enrichDealWithCompany(deal);
    }

    return deals;

  } catch (error) {
    console.error('\n🔍 DEBUG - Full error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);

    if (error.response?.status === 401) {
      throw new Error('HubSpot authentication failed. Check your access token.');
    }
    if (error.response?.status === 403) {
      throw new Error('HubSpot permission denied. Check your Private App scopes include: crm.objects.deals.read, crm.objects.deals.write, crm.objects.contacts.read, crm.objects.companies.read');
    }
    throw new Error(`Failed to fetch deals: ${error.message}`);
  }
}

async function enrichDealWithCompany(deal) {
  try {
    const response = await axios.get(
      `${config.hubspot.baseUrl}/crm/v3/objects/deals/${deal.id}?associations=companies`,
      {
        headers: {
          'Authorization': `Bearer ${config.hubspot.accessToken}`
        }
      }
    );

    const companyId = response.data.associations?.companies?.results?.[0]?.id;

    if (companyId) {
      const companyResponse = await axios.get(
        `${config.hubspot.baseUrl}/crm/v3/objects/companies/${companyId}?properties=name,domain`,
        {
          headers: {
            'Authorization': `Bearer ${config.hubspot.accessToken}`
          }
        }
      );

      deal.companyName = companyResponse.data.properties.name || deal.companyName;
      deal.companyDomain = companyResponse.data.properties.domain;
    }
  } catch (error) {
    console.warn(`  ⚠️  Could not enrich company data: ${error.message}`);
  }
}
