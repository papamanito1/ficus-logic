import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageContainer from '@/components/ui/ImageContainer'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Niche Hiring | Ficus Logic',
  description:
    'Specialist search for niche mandates. Deep market mapping for roles with limited talent pools.',
}

const challenges = [
  {
    title: 'Invisible Talent',
    description: 'The best niche candidates are rarely visible.',
  },
  {
    title: 'Deep Context',
    description: "Skills alone don\u2019t define the right fit.",
  },
  {
    title: 'Market Scarcity',
    description: 'Small pools demand exhaustive mapping.',
  },
]

const functions = [
  {
    title: 'Technology',
    description: 'Engineering, product, and platform leadership.',
  },
  {
    title: 'Finance & Risk',
    description: 'Risk, compliance, and financial leadership.',
  },
  {
    title: 'Operations & Supply Chain',
    description: 'Supply chain and operational excellence.',
  },
  {
    title: 'Data & Analytics',
    description: 'Data engineering, science, and analytics leadership.',
  },
  {
    title: 'Sales & GTM',
    description: 'Commercial, revenue, and market leadership.',
  },
  {
    title: 'Regulatory & Compliance',
    description: 'Regulatory affairs and governance leadership.',
  },
]

export default function NicheHiringPage() {
  return (
    <>
      <PageHero
        heading={"Niche roles can\u2019t be filled with generic search."}
        subtitle="Specialist mandates need specialist conviction."
      />

      {/* Why Niche is Different */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="The Reality"
            heading="Some talent pools have fewer than 200 people."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 lg:mt-20">
            {challenges.map((c, i) => (
              <AnimatedSection key={c.title} delay={i * 0.1}>
                <Card variant="surface" className="p-8 lg:p-10">
                  <h3 className="text-xl font-medium text-neutral-900 mb-3">
                    {c.title}
                  </h3>
                  <p className="text-body">{c.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Market Mapping */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Market Intelligence"
            heading="We map before we search."
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-16 lg:mt-20 items-center">
            <AnimatedSection>
              <div className="space-y-4">
                <p className="text-body-lg">
                  Talent pools are finite. We map them completely.
                </p>
                <p className="text-body">
                  Every specialist community has structure. We learn it.
                </p>
                <p className="text-body">
                  Market intelligence precedes candidate outreach. Always.
                </p>
                <p className="text-body">
                  Depth of mapping determines quality of shortlist.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ImageContainer
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=1000&fit=crop"
                alt="Specialist team in focused discussion"
                aspectRatio="4/5"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Functional Depth */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Functional Expertise"
            heading="Depth across functions that matter."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 lg:mt-20">
            {functions.map((fn, i) => (
              <AnimatedSection key={fn.title} delay={i * 0.08}>
                <Card variant="surface" className="p-8">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {fn.title}
                  </h3>
                  <p className="text-body-sm">{fn.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate Credibility */}
      <section className="section-padding bg-neutral-50">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Candidate Quality"
            heading="Every shortlist is earned, not assembled."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <p className="text-body-lg">
                Each candidate represents validated market intelligence.
              </p>
              <p className="text-body">
                No padding. No reach candidates. No compromises.
              </p>
              <p className="text-body">
                Conviction in every name on the shortlist.
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
              Have a niche mandate? Let&apos;s discuss.
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
