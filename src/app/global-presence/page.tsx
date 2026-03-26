import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PageHero from '@/components/PageHero'
import { partnerCompanies, globalRegions } from '@/data/partners'

export const metadata: Metadata = {
  title: 'Global Presence | Ficus Logic',
  description:
    'Executive search capability across 6+ countries and 3 continents. Local depth with cross-border coordination.',
}

const typeBadgeColors: Record<string, string> = {
  Headquarters: 'bg-brand-500/10 text-brand-700',
  Subsidiary: 'bg-accent-500/10 text-accent-700',
  'Partner Entity': 'bg-neutral-200 text-neutral-700',
  'Search Partner': 'bg-neutral-200 text-neutral-700',
}

const stats = [
  { label: 'Countries', value: '6+' },
  { label: 'Continents', value: '3' },
  { label: 'Partner Network', value: '25+' },
]

export default function GlobalPresencePage() {
  return (
    <>
      <PageHero
        heading="Search capability that crosses borders."
        subtitle="Global reach. Local precision."
      />

      {/* Global Presence Intro */}
      <section className="section-padding bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-body-lg max-w-2xl mx-auto">
              We operate across geographies to deliver mandates
              where talent and opportunity converge.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-16 lg:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-display-md text-neutral-900">{stat.value}</p>
                  <p className="text-body-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Region Cards */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <SectionHeading heading="Presence across key markets." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 lg:mt-20">
            {globalRegions.map((region, i) => (
              <AnimatedSection key={region.name} delay={i * 0.08}>
                <Card variant="premium" className="p-8 lg:p-10 h-full">
                  <h3 className="text-xl font-medium text-neutral-900">
                    {region.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {region.countries.map((country) => (
                      <span
                        key={country}
                        className="text-xs font-medium px-3 py-1 bg-brand-500/10 text-brand-700 rounded-full"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                  <p className="text-body mt-5">{region.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Companies */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            heading="Our operating entities and partners."
            subtitle="Direct presence and strategic partnerships worldwide."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 lg:mt-20">
            {partnerCompanies.map((company, i) => (
              <AnimatedSection key={company.name} delay={i * 0.08}>
                <Card variant="premium" className="p-8 lg:p-10 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900">
                        {company.name}
                      </h3>
                      <p className="text-body-sm mt-1">{company.country}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                        typeBadgeColors[company.type] || 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {company.type}
                    </span>
                  </div>
                  <div className="w-12 h-px bg-brand-500 mt-6 mb-6" />
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    {company.coverage}
                  </p>
                  <p className="text-body-sm">{company.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Coordination Support */}
      <section className="section-padding-sm bg-neutral-50">
        <div className="container-narrow text-center">
          <SectionHeading
            eyebrow="Coordination"
            heading="Cross-border delivery. Unified standards."
          />

          <AnimatedSection className="mt-10 lg:mt-14">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-body-lg">
                Multi-geography mandates need compliance awareness.
              </p>
              <p className="text-body">
                We coordinate across entities for seamless delivery.
              </p>
              <p className="text-body">
                Local knowledge. Consistent process. Single point of contact.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-accent-800 to-accent-700">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-md text-white">
              Exploring cross-border hiring?
            </h2>
            <div className="mt-10">
              <Button
                href="/contact"
                variant="primary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-200"
              >
                Reach Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
