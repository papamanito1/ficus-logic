export type JobStatus = 'active' | 'archived' | 'expired' | 'closed' | 'inactive'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Consulting'

export interface Job {
  slug: string
  title: string
  location: string
  department: string
  employmentType: EmploymentType
  experience: string
  postedDate: string
  status: JobStatus
  overview: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
}

// CMS/ATS Integration Point:
// Replace this static data with your ATS API, CMS, or database.
// Ensure all returned jobs include a `status` field.
// Only jobs with status === 'active' will be displayed publicly.
export const jobs: Job[] = [
  {
    slug: 'vice-president-engineering',
    title: 'Vice President — Engineering',
    location: 'Bengaluru, India',
    department: 'Technology',
    employmentType: 'Full-time',
    experience: '18+ years',
    postedDate: '2026-03-20',
    status: 'active',
    overview: 'Lead the engineering function for a fast-scaling product company. Drive architecture decisions, team building, and delivery excellence across multiple product lines.',
    responsibilities: [
      'Own engineering strategy and technical roadmap',
      'Build and mentor high-performing engineering teams',
      'Drive architecture decisions for scale and reliability',
      'Partner with product leadership on delivery outcomes',
      'Establish engineering culture and hiring standards',
    ],
    requirements: [
      '18+ years in software engineering, 8+ in leadership roles',
      'Track record of scaling engineering teams from 50 to 200+',
      'Deep expertise in distributed systems and cloud architecture',
      'Experience with product-led growth companies',
      'Strong stakeholder management at CXO level',
    ],
    skills: ['Engineering Leadership', 'Cloud Architecture', 'Team Building', 'Product Engineering'],
  },
  {
    slug: 'chief-financial-officer',
    title: 'Chief Financial Officer',
    location: 'Mumbai, India',
    department: 'Finance',
    employmentType: 'Full-time',
    experience: '20+ years',
    postedDate: '2026-03-18',
    status: 'active',
    overview: 'Lead the finance function for a PE-backed industrial group. Own financial planning, treasury, compliance, and investor relations across three business verticals.',
    responsibilities: [
      'Drive financial strategy and capital allocation',
      'Own investor relations and board reporting',
      'Lead treasury, audit, and compliance functions',
      'Support M&A due diligence and integration',
      'Build finance team across multiple entities',
    ],
    requirements: [
      'CA with 20+ years in finance leadership',
      'PE/VC-backed company experience essential',
      'Multi-entity, multi-geography financial management',
      'Strong board and investor presentation skills',
      'Experience with IPO readiness processes',
    ],
    skills: ['Financial Strategy', 'Investor Relations', 'M&A', 'Compliance'],
  },
  {
    slug: 'head-of-data-science',
    title: 'Head of Data Science',
    location: 'Hyderabad, India',
    department: 'Technology',
    employmentType: 'Full-time',
    experience: '14+ years',
    postedDate: '2026-03-15',
    status: 'active',
    overview: 'Build and lead the data science function for a GCC of a Fortune 500 financial services firm. Define ML strategy, model governance, and analytics capabilities.',
    responsibilities: [
      'Define data science strategy and roadmap',
      'Build ML models for risk, fraud, and customer analytics',
      'Establish model governance and validation frameworks',
      'Lead a team of 25+ data scientists and ML engineers',
      'Partner with global stakeholders on analytics priorities',
    ],
    requirements: [
      '14+ years in data science, 6+ in leadership',
      'Deep expertise in ML/AI for financial services',
      'Experience building GCC data science teams',
      'Strong model governance and regulatory understanding',
      'PhD or Masters in quantitative discipline preferred',
    ],
    skills: ['Machine Learning', 'Data Science', 'Financial Analytics', 'Model Governance'],
  },
  {
    slug: 'senior-director-supply-chain',
    title: 'Senior Director — Supply Chain',
    location: 'Pune, India',
    department: 'Operations',
    employmentType: 'Full-time',
    experience: '16+ years',
    postedDate: '2026-03-12',
    status: 'active',
    overview: 'Lead end-to-end supply chain transformation for a diversified manufacturing group. Drive procurement excellence, logistics optimization, and vendor consolidation.',
    responsibilities: [
      'Own supply chain strategy across three manufacturing plants',
      'Drive procurement excellence and vendor consolidation',
      'Implement S&OP processes and demand planning',
      'Lead logistics and warehouse optimization',
      'Build supply chain analytics capabilities',
    ],
    requirements: [
      '16+ years in supply chain, 8+ in leadership',
      'Manufacturing supply chain expertise essential',
      'Experience with ERP transformation projects',
      'Strong vendor negotiation and management skills',
      'Track record of cost optimization at scale',
    ],
    skills: ['Supply Chain', 'Procurement', 'S&OP', 'Manufacturing'],
  },
  {
    slug: 'general-manager-sales',
    title: 'General Manager — Enterprise Sales',
    location: 'Delhi NCR, India',
    department: 'Sales',
    employmentType: 'Full-time',
    experience: '15+ years',
    postedDate: '2026-03-10',
    status: 'active',
    overview: 'Lead enterprise sales for a SaaS platform serving BFSI clients. Build the sales engine, drive ARR growth, and own strategic client relationships.',
    responsibilities: [
      'Build and lead enterprise sales team of 20+',
      'Drive ARR growth from $5M to $20M in 24 months',
      'Own strategic relationships with top 20 BFSI accounts',
      'Define sales methodology and pipeline management',
      'Partner with product team on market feedback loops',
    ],
    requirements: [
      '15+ years in B2B/enterprise SaaS sales',
      'Deep BFSI domain expertise and network',
      'Track record of building sales teams from scratch',
      'Experience selling to CXO-level stakeholders',
      'Strong understanding of SaaS metrics and unit economics',
    ],
    skills: ['Enterprise Sales', 'BFSI', 'SaaS', 'Team Building'],
  },
  {
    slug: 'director-product-management',
    title: 'Director — Product Management',
    location: 'Bengaluru, India',
    department: 'Product',
    employmentType: 'Full-time',
    experience: '12+ years',
    postedDate: '2026-03-08',
    status: 'active',
    overview: 'Lead product strategy for a B2B fintech platform. Own the product roadmap, drive product-market fit, and build the product management function.',
    responsibilities: [
      'Define product vision and multi-year roadmap',
      'Drive product-market fit and GTM alignment',
      'Build and mentor product management team',
      'Own product analytics and success metrics',
      'Lead customer discovery and feedback integration',
    ],
    requirements: [
      '12+ years in product management, 5+ in fintech',
      'B2B platform product experience essential',
      'Strong analytical and data-driven decision making',
      'Experience with 0-to-1 and scaling products',
      'Excellent stakeholder communication skills',
    ],
    skills: ['Product Strategy', 'Fintech', 'B2B Platforms', 'Product Analytics'],
  },
  {
    slug: 'archived-role-example',
    title: 'Head of Marketing',
    location: 'Mumbai, India',
    department: 'Marketing',
    employmentType: 'Full-time',
    experience: '14+ years',
    postedDate: '2026-01-15',
    status: 'archived',
    overview: 'This role has been filled.',
    responsibilities: [],
    requirements: [],
    skills: [],
  },
]

export function getActiveJobs(): Job[] {
  return jobs
    .filter((job) => job.status === 'active')
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
}

export function getJobBySlug(slug: string): Job | undefined {
  const job = jobs.find((j) => j.slug === slug)
  if (job && job.status !== 'active') return undefined
  return job
}

export function searchJobs(query: string, filters?: { location?: string; department?: string; employmentType?: string }): Job[] {
  let results = getActiveJobs()
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q)) ||
        job.overview.toLowerCase().includes(q)
    )
  }
  if (filters?.location) {
    results = results.filter((j) => j.location.includes(filters.location!))
  }
  if (filters?.department) {
    results = results.filter((j) => j.department === filters.department)
  }
  if (filters?.employmentType) {
    results = results.filter((j) => j.employmentType === filters.employmentType)
  }
  return results
}

export function getUniqueLocations(): string[] {
  return [...new Set(getActiveJobs().map((j) => j.location))]
}

export function getUniqueDepartments(): string[] {
  return [...new Set(getActiveJobs().map((j) => j.department))]
}
