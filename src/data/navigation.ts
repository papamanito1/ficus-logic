export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
  openInNewTab?: boolean
}

export const navigation: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Leadership Hiring', href: '/leadership-hiring' },
  { label: 'Niche Mandates', href: '/niche-hiring' },
  { label: 'Industry', href: '/industries' },
  { label: 'Global Presence', href: '/global-presence' },
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Experience FELIX', href: '/somika-ai' },
]

export const footerNavigation = {
  services: [
    { label: 'Leadership Hiring', href: '/leadership-hiring' },
    { label: 'Niche Mandates', href: '/niche-hiring' },
    { label: 'Industry', href: '/industries' },
    { label: 'Experience FELIX', href: '/somika-ai' },
    { label: 'Member portal', href: '/members/login' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Global Presence', href: '/global-presence' },
    { label: 'Careers', href: '/careers' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}
