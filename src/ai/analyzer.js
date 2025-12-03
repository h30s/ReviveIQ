import axios from 'axios';
import { config } from '../config.js';
import { buildAnalysisPrompt } from './prompts.js';

export async function analyzeWithAI(deal, signals) {
  const prompt = buildAnalysisPrompt(deal, signals);

  try {
    const response = await callAIModel(prompt);
    return parseAIResponse(response);

  } catch (error) {
    console.warn(`  ⚠️  AI analysis error: ${error.message}`);
    return fallbackAnalysis(deal, signals);
  }
}

async function callAIModel(prompt) {
  if (!config.ai.apiKey) {
    throw new Error('AI API key not configured');
  }

  if (config.ai.provider === 'gemini') {
    return await callGeminiAPI(prompt);
  } else if (config.ai.provider === 'openrouter') {
    return await callOpenRouterAPI(prompt);
  } else {
    throw new Error(`Unknown AI provider: ${config.ai.provider}`);
  }
}

async function callGeminiAPI(prompt) {
  try {
    const model = config.ai.model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.ai.apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks.' }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });

    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const candidate = response.data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      if (candidate.finishReason) {
        throw new Error(`Gemini finished with reason: ${candidate.finishReason}`);
      }
      throw new Error('Gemini returned empty content');
    }

    const content = candidate.content.parts[0].text;

    // Extract and clean JSON
    let jsonContent = content.trim();

    // Remove markdown code blocks if present
    if (jsonContent.includes('```')) {
      const match = jsonContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonContent = match[1].trim();
      } else {
        jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
    }

    // Fix common JSON issues from Gemini
    // Replace unescaped newlines within strings
    jsonContent = jsonContent.replace(/": "([^"]*)\n/g, (match, p1) => {
      return `": "${p1.replace(/\n/g, '\\n')}\n`;
    });

    return JSON.parse(jsonContent);

  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Invalid Gemini API key or request');
    } else if (error.response?.status === 429) {
      throw new Error('Gemini rate limit exceeded');
    }
    throw new Error(`Gemini error: ${error.message}`);
  }
}

async function callOpenRouterAPI(prompt) {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: config.ai.openrouterModel || 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: prompt + '\n\nIMPORTANT: Return ONLY valid JSON.' }],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${config.ai.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reviveiq.app',
        'X-Title': 'ReviveIQ'
      },
      timeout: 30000
    });

    const content = response.data.choices[0].message.content;
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return JSON.parse(jsonContent);

  } catch (error) {
    if (error.response?.status === 402) {
      throw new Error('OpenRouter out of credits');
    }
    throw new Error(`OpenRouter error: ${error.message}`);
  }
}

function parseAIResponse(response) {
  return {
    confidence_score: parseInt(response.confidence_score) || 7,
    summary: response.summary || 'Revival opportunity detected.',
    email_draft: response.email_draft || '',
    talking_points: Array.isArray(response.talking_points) ? response.talking_points : []
  };
}

function fallbackAnalysis(deal, signals) {
  const avgStrength = signals.reduce((sum, s) => sum + s.strength, 0) / signals.length;
  const confidence = Math.min(10, Math.round(avgStrength + 1));
  const monthsSince = getMonthsSince(deal.closeDate);
  const signalTypes = signals.map(s => s.type);

  let summary = '';
  if (signalTypes.includes('FUNDING')) {
    summary = `Strong revival candidate. ${deal.companyName} has secured funding${signals.length > 1 ? '. Additional signals strengthen the case.' : '.'}`;
  } else if (signalTypes.includes('ANNUAL_TIMING')) {
    summary = `Timing-based opportunity. It's been ${monthsSince} months since the deal closed. Annual budget cycles make this a natural time to reconnect.`;
  } else {
    summary = `${deal.companyName} shows ${signals.length} revival signal(s).`;
  }

  return {
    confidence_score: confidence,
    summary: summary,
    email_draft: generateEmail(deal, signals),
    talking_points: generateTalkingPoints(deal, signals)
  };
}

function generateEmail(deal, signals) {
  const primarySignal = signals[0];
  const monthsSince = getMonthsSince(deal.closeDate);
  const firstName = deal.contactName?.split(' ')[0] || 'there';

  return `Subject: Following up on ${deal.companyName}

Hi ${firstName},

I wanted to reach out following some recent developments at ${deal.companyName}.

${primarySignal.description}

When we last spoke ${monthsSince} months ago, ${deal.lostReason.toLowerCase()}. Given these changes, I thought it might be worth reconnecting to explore if the timing is better now.

Would you have 15 minutes this week for a quick call?

Best regards`;
}

function generateTalkingPoints(deal, signals) {
  const points = [];
  points.push(`Reference the ${signals[0].type.toLowerCase().replace('_', ' ')} signal naturally`);
  points.push(`Address original concern: "${deal.lostReason}" - has situation changed?`);
  points.push(`Propose low-commitment next step: quick 15-minute sync call`);
  return points;
}

function getMonthsSince(date) {
  return Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
}
