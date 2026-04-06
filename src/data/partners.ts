export interface GlobalRegion {
  name: string
  countries: string[]
  description: string
}

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
    slug: 'ai-robotics',
    title: 'AI & Robotics',
    subtitle: 'Intelligent systems, automation, and applied research leadership.',
    description:
      'ML and AI leaders. Robotics and autonomy teams. Research-to-production operators.',
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
