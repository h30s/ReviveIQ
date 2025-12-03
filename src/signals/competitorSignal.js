import axios from 'axios';
import { config } from '../config.js';

export async function detectCompetitorNews(deal) {
  if (!config.apis.googleNews.apiKey || !deal.lostReason) {
    return null;
  }
  
  // Extract competitor name from lost reason if mentioned
  const competitorMatch = deal.lostReason.match(/chose\s+(\w+)/i);
  if (!competitorMatch) return null;
  
  const competitor = competitorMatch[1];
  
  try {
    const response = await axios.get(config.apis.googleNews.baseUrl, {
      params: {
        key: config.apis.googleNews.apiKey,
        cx: config.apis.googleNews.searchEngineId,
        q: `${competitor} issues OR problems OR outage OR lawsuit`,
        dateRestrict: 'm3',
        num: 5
      }
    });
    
    const negativeKeywords = ['issue', 'problem', 'outage', 'down', 'lawsuit', 'breach', 'hack'];
    const negativeResults = response.data.items?.filter(item => {
      const text = (item.title + ' ' + item.snippet).toLowerCase();
      return negativeKeywords.some(keyword => text.includes(keyword));
    });
    
    if (negativeResults && negativeResults.length > 0) {
      return {
        type: 'COMPETITOR_NEWS',
        strength: 7,
        details: {
          competitor,
          headline: negativeResults[0].title,
          url: negativeResults[0].link
        },
        description: `Negative news about ${competitor}: ${negativeResults[0].title}`
      };
    }
    
    return null;
    
  } catch (error) {
    console.warn(`  ⚠️  Google News API error: ${error.message}`);
    return null;
  }
}
