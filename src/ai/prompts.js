export function buildAnalysisPrompt(deal, signals) {
  const signalsFormatted = signals.map(s => 
    `- ${s.type}: ${s.description} (Strength: ${s.strength}/10)`
  ).join('\n');
  
  return `You are ReviveIQ, an AI assistant that helps sales teams identify when lost deals should be revisited.

## Context
A sales deal was previously lost with the following details:
- Company: ${deal.companyName}
- Deal Value: $${deal.amount}
- Lost Date: ${deal.closeDate.toLocaleDateString()}
- Lost Reason: ${deal.lostReason}
- Months Since Closed: ${getMonthsSince(deal.closeDate)}

## Detected Signals
The following changes have been detected at this company:
${signalsFormatted}

## Your Task
Based on this information, provide:

1. **Confidence Score (1-10)**: How likely is this deal to be revived? Consider:
   - Relevance of signals to the lost reason
   - Recency and strength of signals
   - Typical buying behavior

2. **Context Summary (2-3 sentences)**: Explain WHY this is a good time to reach out. Connect the signals to the original lost reason.

3. **Email Draft**: Write a brief, personalized re-engagement email that:
   - References the previous conversation naturally
   - Mentions the relevant signal without being creepy
   - Proposes a specific next step
   - Tone: Professional, helpful, not salesy

4. **Talking Points**: 3 bullet points for a phone call

## Output Format
Return as JSON:
{
  "confidence_score": 8,
  "summary": "...",
  "email_draft": "...",
  "talking_points": ["...", "...", "..."]
}`;
}

function getMonthsSince(date) {
  return Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
}
