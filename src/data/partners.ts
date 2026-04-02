export interface PartnerCompany {
  name: string
  country: string
  region: string
  type: string
  coverage: string
  description: string
}

export interface GlobalRegion {
  name: string
  countries: string[]
  description: string
}

// CMS Integration Point:
// Replace with CMS or API data for dynamic partner/presence management
export const partnerCompanies: PartnerCompany[] = [
  {
    name: 'Ficus e-Logic Pvt. Ltd.',
    country: 'India',
    region: 'South Asia',
    type: 'Headquarters',
    coverage: 'Pan-India leadership and niche hiring',
    description: 'Primary operations hub. Full-service search across technology, BFSI, industrial, and GCC sectors.',
  },
  {
    name: 'Ficus Logic DMCC',
    country: 'United Arab Emirates',
    region: 'Middle East',
    type: 'Subsidiary',
    coverage: 'GCC region executive search',
    description: 'Regional presence covering UAE, Saudi Arabia, and broader Gulf markets for leadership mandates.',
  },
  {
    name: 'Ficus Logic Singapore Pte. Ltd.',
    country: 'Singapore',
    region: 'Southeast Asia',
    type: 'Partner Entity',
    coverage: 'Southeast Asia search coverage',
    description: 'APAC hub for cross-border mandates. Coverage across Singapore, Malaysia, Indonesia, and Vietnam.',
  },
  {
    name: 'Talbridge Associates',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'Search Partner',
    coverage: 'UK and European mandates',
    description: 'Strategic partnership for European leadership search. Joint delivery model for cross-border mandates.',
  },
  {
    name: 'NorthPeak Search Partners',
    country: 'United States',
    region: 'North America',
    type: 'Search Partner',
    coverage: 'US and Canada executive search',
    description: 'Collaborative partnership for North American leadership and niche hiring mandates.',
  },
  {
    name: 'TalentBridge Japan KK',
    country: 'Japan',
    region: 'East Asia',
    type: 'Search Partner',
    coverage: 'Japan and East Asia coverage',
    description: 'Partner network for Japan-origin mandates and East Asian cross-border search.',
  },
]

export const globalRegions: GlobalRegion[] = [
  {
    name: 'South Asia',
    countries: ['India'],
    description:
      'Headquarters and primary delivery hub. Deep market presence across major cities and sectors.',
  },
  {
    name: 'Far East',
    countries: ['Korea', 'Japan', 'HK'],
    description:
      'Leadership and niche search coverage across major North Asia commercial hubs.',
  },
  {
    name: 'Middle East',
    countries: ['Oman', 'Dubai', 'Qatar', 'UAE'],
    description:
      'Mandates across the Gulf corridor, from Oman and the UAE to Qatar.',
  },
  {
    name: 'Africa',
    countries: [
      'Egypt',
      'Nigeria',
      'Gabon',
      'Ivory Coast',
      'Ghana',
      'Kenya',
      'South Africa',
      'Uganda',
      'Tanzania',
    ],
    description:
      'Reach across North, West, East, and Southern Africa for regional and cross-border roles.',
  },
  {
    name: 'APAC & ANZ',
    countries: [
      'Singapore',
      'Vietnam',
      'Thailand',
      'Malaysia',
      'Philippines',
      'China',
      'Taiwan',
    ],
    description:
      'Southeast Asia, Greater China, and connected APAC markets for regional leadership mandates.',
  },
]

export const industries = [
  {
    slug: 'technology',
    title: 'Technology',
    subtitle: 'Product, platform, and infrastructure leadership.',
    description: 'Engineering leaders. Product minds. Platform architects.',
  },
  {
    slug: 'engineering',
    title: 'Engineering & EPC',
    subtitle: 'Complex project and technical leadership.',
    description: 'Project directors. Technical authorities. EPC leadership.',
  },
  {
    slug: 'bfsi-fintech',
    title: 'BFSI & Fintech',
    subtitle: 'Regulated markets need calibrated search.',
    description: 'Risk leaders. Compliance heads. Fintech builders.',
  },
  {
    slug: 'gcc',
    title: 'Global Capability Centre',
    subtitle: 'Building leadership for India GCCs.',
    description: 'Center heads. Function leads. Capability builders.',
  },
  {
    slug: 'product-engineering',
    title: 'Product Engineering',
    subtitle: 'Where product vision meets engineering depth.',
    description: 'Product leaders. Engineering VPs. Technical co-founders.',
  },
  {
    slug: 'industrial-manufacturing',
    title: 'Industrial & Manufacturing',
    subtitle: 'Operational leadership for complex operations.',
    description: 'Plant heads. Supply chain leaders. Operations directors.',
  },
]
