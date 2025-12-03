export async function detectAnnualTiming(deal) {
  const monthsSince = Math.round((Date.now() - deal.closeDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

  // Optimal timing is 11-13 months (annual cycles)
  if (monthsSince >= 11 && monthsSince <= 13) {
    return {
      type: 'ANNUAL_TIMING',
      strength: 8,
      details: {
        monthsSince: monthsSince,
        reason: 'Annual budget cycle'
      },
      description: `Perfect timing: ${monthsSince} months since close (annual renewal period)`
    };
  }

  // Also flag 6-month mark (semi-annual reviews)
  if (monthsSince >= 5 && monthsSince <= 7) {
    return {
      type: 'ANNUAL_TIMING',
      strength: 6,
      details: {
        monthsSince: monthsSince,
        reason: 'Mid-year review cycle'
      },
      description: `Good timing: ${monthsSince} months since close (mid-year review period)`
    };
  }

  return null;
}
