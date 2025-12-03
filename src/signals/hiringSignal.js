import axios from 'axios';

export async function detectHiring(deal) {
  if (!deal.companyDomain && !deal.companyName) {
    return null;
  }

  try {
    // Try careers page detection
    const careersUrls = [
      `https://${deal.companyDomain}/careers`,
      `https://${deal.companyDomain}/jobs`,
      `https://${deal.companyDomain}/join`,
      `https://careers.${deal.companyDomain}`
    ];

    for (const careersUrl of careersUrls) {
      if (!deal.companyDomain) continue;

      try {
        const response = await axios.get(careersUrl, {
          timeout: 5000,
          maxRedirects: 3,
          validateStatus: (status) => status < 500,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.status === 200) {
          const html = response.data.toLowerCase();

          // Look for job posting indicators
          const jobIndicators = [
            'open positions',
            'we\'re hiring',
            'join our team',
            'job openings',
            'apply now',
            'current openings',
            'view all jobs',
            'see all jobs'
          ];

          const foundIndicators = jobIndicators.filter(term => html.includes(term));

          // Check for job count indicators
          const jobCountMatch = html.match(/(\d+)\s*(open positions|jobs|openings|roles)/i);
          const estimatedJobs = jobCountMatch ? parseInt(jobCountMatch[1]) : foundIndicators.length * 3;

          if (foundIndicators.length >= 2 || jobCountMatch) {
            return {
              type: 'HIRING',
              strength: Math.min(8, 5 + foundIndicators.length),
              details: {
                source: careersUrl,
                indicators: foundIndicators,
                estimatedOpenings: estimatedJobs
              },
              description: `Active hiring detected: ${estimatedJobs}+ open positions on careers page`
            };
          }
        }
      } catch (err) {
        // Try next URL
        continue;
      }
    }

    return null;

  } catch (error) {
    // Silently fail - this signal is optional
    return null;
  }
}
