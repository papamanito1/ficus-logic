import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageContainer from '@/components/ui/ImageContainer'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'About | Ficus Logic',
  description:
    'Executive search with depth and discipline. Built for mandates that need conviction.',
}

const principles = [
  {
    title: 'Mandate Clarity',
    description: 'Every search begins with structured scoping. Ambiguity is resolved before outreach begins.',
  },
  {
    title: 'Market Intelligence',
    description: 'We map talent landscapes with precision. Our assessments are grounded in data.',
  },
  {
    title: 'Candidate Rigor',
    description: 'Shortlists reflect depth, not volume. Every candidate is evaluated in context.',
  },
  {
    title: 'Closure Focus',
    description: 'We manage alignment through the process. Last-mile risk is anticipated early.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        heading="Built for mandates that need conviction."
        subtitle="Executive search with depth and discipline."
      />

      {/* Philosophy */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Our Philosophy"
            heading="Precision over volume. Depth over speed."
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-16 lg:mt-20 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Every mandate is a commitment.
                  </h3>
                  <p className="text-body">
                    We take on searches we can close well.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Quality is non-negotiable.
                  </h3>
                  <p className="text-body">
                    Shortlists are built on conviction, not volume.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Context determines fit.
                  </h3>
                  <p className="text-body">
                    We evaluate for the role and the organization.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Relationships outlast mandates.
                  </h3>
                  <p className="text-body">
                    Clients return because of trust earned over time.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ImageContainer
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1000&fit=crop"
                alt="Modern office environment"
                aspectRatio="4/5"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Search Discipline */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Search Discipline"
            heading="Every mandate is treated as unique."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 lg:mt-20">
            {principles.map((principle, i) => (
              <AnimatedSection key={principle.title} delay={i * 0.1}>
                <Card variant="premium" className="p-8 lg:p-10 h-full">
                  <h3 className="text-xl font-medium text-neutral-900 mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-body">{principle.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Fit */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Leadership Fit"
            heading="We assess for context, not just credentials."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-body-lg">
                Credentials open the conversation. Context closes it.
              </p>
              <p className="text-body">
                Leadership effectiveness depends on organizational fit.
                We evaluate how candidates operate under pressure,
                navigate ambiguity, and build within constraints.
              </p>
              <p className="text-body">
                The right leader is right for your context.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Global Mindset */}
      <section className="section-padding bg-neutral-50">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Global Execution"
            heading="Local depth. Cross-border capability."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-body-lg">
                Mandates increasingly span geographies and cultures.
              </p>
              <p className="text-body">
                We operate across India, the Middle East,
                Southeast Asia, and partner-led markets in Europe,
                North America, and East Asia.
              </p>
              <p className="text-body">
                Global coordination. Local market understanding.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team / Culture */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Our Team"
            heading="Search professionals. Not recruiters."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-body-lg">
                Our team brings industry depth and search discipline.
              </p>
              <p className="text-body">
                Professionals who understand markets, evaluate leadership,
                and manage mandates with rigor and discretion.
              </p>
              <p className="text-body">
                We invest in quality over scale. Always.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-accent-800 to-accent-700">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-md text-white max-w-3xl mx-auto">
              Ready to work with a search partner who understands?
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
