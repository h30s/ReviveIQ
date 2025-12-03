// Sample data for testing ReviveIQ without real API calls

export const sampleDeals = [
  {
    id: '1001',
    dealName: 'Acme Corp - Enterprise Plan',
    companyName: 'Acme Corp',
    companyDomain: 'acmecorp.com',
    amount: 50000,
    closeDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 8 months ago
    lostReason: 'Budget constraints',
    ownerId: '12345'
  },
  {
    id: '1002',
    dealName: 'TechStart Inc - Growth Package',
    companyName: 'TechStart Inc',
    companyDomain: 'techstart.io',
    amount: 25000,
    closeDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    lostReason: 'Chose competitor',
    ownerId: '12345'
  },
  {
    id: '1003',
    dealName: 'GlobalScale - Professional',
    companyName: 'GlobalScale',
    companyDomain: 'globalscale.com',
    amount: 100000,
    closeDate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000), // 11 months ago
    lostReason: 'No decision made',
    ownerId: '12345'
  },
  {
    id: '1004',
    dealName: 'FastGrow Ltd - Starter',
    companyName: 'FastGrow Ltd',
    companyDomain: 'fastgrow.co',
    amount: 35000,
    closeDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
    lostReason: 'Champion left company',
    ownerId: '12345'
  },
  {
    id: '1005',
    dealName: 'Enterprise Co - Custom Solution',
    companyName: 'Enterprise Co',
    companyDomain: 'enterpriseco.com',
    amount: 75000,
    closeDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000), // 9 months ago
    lostReason: 'Wrong timing',
    ownerId: '12345'
  }
];

export const sampleSignals = {
  'acmecorp.com': [
    {
      type: 'FUNDING',
      strength: 9,
      details: {
        fundingType: 'Series B',
        amount: 20000000,
        currency: 'USD',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 3 weeks ago
      },
      description: 'Raised Series B funding 21 days ago'
    },
    {
      type: 'HIRING_SURGE',
      strength: 6,
      details: {
        jobCount: 12,
        departments: ['Sales', 'Engineering']
      },
      description: '12 open positions - company is growing'
    }
  ],
  'techstart.io': [
    {
      type: 'LEADERSHIP_CHANGE',
      strength: 8,
      details: {
        name: 'Sarah Johnson',
        title: 'Chief Technology Officer',
        startDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000) // 6 weeks ago
      },
      description: 'New Chief Technology Officer hired recently'
    }
  ],
  'globalscale.com': [
    {
      type: 'ANNUAL_TIMING',
      strength: 5,
      details: {
        monthsSinceClosed: 11,
        closeDate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000)
      },
      description: '~12 months since deal closed - annual review cycle'
    }
  ],
  'fastgrow.co': [
    {
      type: 'HIRING_SURGE',
      strength: 6,
      details: {
        jobCount: 8,
        departments: ['Marketing', 'Sales']
      },
      description: '8 open positions - company is growing'
    }
  ],
  'enterpriseco.com': [
    {
      type: 'LEADERSHIP_CHANGE',
      strength: 8,
      details: {
        name: 'Michael Chen',
        title: 'VP of Sales',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
      },
      description: 'New VP of Sales hired recently'
    },
    {
      type: 'HIRING_SURGE',
      strength: 6,
      details: {
        jobCount: 15,
        departments: ['Sales', 'Customer Success']
      },
      description: '15 open positions - company is growing'
    }
  ]
};

export const sampleAnalysis = {
  'acmecorp.com': {
    confidence_score: 9,
    summary: "Strong revival candidate. Budget constraint eliminated by recent $20M Series B funding. Aggressive hiring (12 open roles) confirms growth trajectory and renewed budget availability. Original concern about budget is now resolved.",
    email_draft: `Subject: Congrats on the Series B, Acme team!

Hi there,

I saw the news about Acme's Series B — congratulations on the $20M raise! That's a huge milestone.

When we last spoke 8 months ago, timing wasn't right due to budget priorities. Given your growth trajectory and the 12 open positions I see you're hiring for, I'd love to revisit how we might help Acme scale efficiently.

Would you have 15 minutes this week for a quick catch-up?

Best regards`,
    talking_points: [
      "Congratulate on Series B funding and acknowledge previous budget constraints",
      "Reference their aggressive hiring as evidence of growth and renewed priorities",
      "Propose specific value: helping them scale efficiently during this growth phase"
    ]
  },
  'techstart.io': {
    confidence_score: 8,
    summary: "New CTO Sarah Johnson joined 6 weeks ago. New leadership often brings vendor reviews and fresh perspectives. They previously chose a competitor, but new decision-maker may reconsider.",
    email_draft: `Subject: Welcome to TechStart, Sarah!

Hi Sarah,

I noticed you recently joined TechStart as CTO — congratulations! I previously worked with your team on evaluating our solution for their tech stack.

As you're getting up to speed, I'd be happy to share what we learned about TechStart's needs and how our approach differs from what they ultimately chose. No pitch — just context that might be useful.

Worth a brief call?

Best regards`,
    talking_points: [
      "Welcome new CTO and acknowledge their fresh perspective",
      "Reference previous evaluation without criticizing their predecessor's choice",
      "Offer to share insights about their needs, positioning as helpful rather than salesy"
    ]
  },
  'globalscale.com': {
    confidence_score: 7,
    summary: "11 months since deal closed — approaching annual review cycle. Many companies revisit vendor decisions and budgets annually. Good timing to reconnect.",
    email_draft: `Subject: Following up on GlobalScale

Hi there,

It's been about a year since we last spoke about our solution for GlobalScale. I wanted to reach out as many companies revisit their vendor decisions during annual planning.

Has anything changed in your priorities or budget that might make this worth another conversation?

Happy to do a quick 15-minute call if the timing is better now.

Best regards`,
    talking_points: [
      "Reference the annual cycle timing naturally",
      "Ask open-ended questions about changed priorities",
      "Keep it low-pressure and acknowledge previous timing issues"
    ]
  }
};
