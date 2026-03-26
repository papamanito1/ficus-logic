export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
  openInNewTab?: boolean
}

export const navigation: NavItem[] = [
  { label: 'Leadership Hiring', href: '/leadership-hiring' },
  { label: 'Niche Practices', href: '/niche-hiring' },
  { label: 'Industries', href: '/industries' },
  { label: 'Global Presence', href: '/global-presence' },
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Somika AI', href: '/somika-ai' },
]

export const footerNavigation = {
  services: [
    { label: 'Leadership Hiring', href: '/leadership-hiring' },
    { label: 'Niche Practices', href: '/niche-hiring' },
    { label: 'Industries', href: '/industries' },
    { label: 'Somika AI', href: '/somika-ai' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Global Presence', href: '/global-presence' },
    { label: 'Careers', href: '/careers' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}
