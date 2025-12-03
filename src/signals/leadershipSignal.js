import axios from 'axios';
import { config } from '../config.js';

export async function detectLeadershipChange(deal) {
  if (!config.apis.apollo.apiKey || !deal.companyDomain) {
    return null;
  }
  
  try {
    // First, get organization ID
    const orgResponse = await axios.get(
      `${config.apis.apollo.baseUrl}/organizations/enrich`,
      {
        params: {
          domain: deal.companyDomain,
          api_key: config.apis.apollo.apiKey
        }
      }
    );
    
    const orgId = orgResponse.data.organization?.id;
    if (!orgId) return null;
    
    // Search for recent leadership hires
    const peopleResponse = await axios.post(
      `${config.apis.apollo.baseUrl}/people/search`,
      {
        organization_ids: [orgId],
        person_seniorities: ['c_suite', 'vp', 'director']
      },
      {
        params: {
          api_key: config.apis.apollo.apiKey
        }
      }
    );
    
    const recentHires = peopleResponse.data.people?.filter(person => {
      if (!person.employment_history?.[0]?.start_date) return false;
      
      const startDate = new Date(person.employment_history[0].start_date);
      const daysSinceStart = (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      return daysSinceStart <= 60;
    });
    
    if (recentHires && recentHires.length > 0) {
      const hire = recentHires[0];
      return {
        type: 'LEADERSHIP_CHANGE',
        strength: 8,
        details: {
          name: hire.name,
          title: hire.title,
          startDate: hire.employment_history[0].start_date
        },
        description: `New ${hire.title} hired recently`
      };
    }
    
    return null;
    
  } catch (error) {
    console.warn(`  ⚠️  Apollo API error: ${error.message}`);
    return null;
  }
}
