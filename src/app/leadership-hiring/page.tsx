import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Button from '@/components/ui/Button'
import ImageContainer from '@/components/ui/ImageContainer'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Leadership Hiring | Ficus Logic',
  description:
    'Disciplined executive search for leadership mandates. Precision hiring for senior roles that shape outcomes.',
}

const approachPoints = [
  {
    title: 'Clarity',
    text: 'Every search starts with structured scoping. Role, context, and stakes\u2014defined upfront.',
  },
  {
    title: 'Market Mapping',
    text: 'We map the full leadership landscape. Not just active candidates.',
  },
  {
    title: 'Assessment',
    text: 'Evaluation goes beyond credentials and interviews. Context, judgment, and fit determine shortlists.',
  },
  {
    title: 'Engagement and Onboarding',
    text: 'Alignment is managed, not assumed. Timelines stay disciplined throughout.',
  },
]

const evaluationBlocks = [
  {
    title: 'Competency Mapping',
    text: 'Technical and leadership depth mapped against mandate.',
  },
  {
    title: 'Cultural Alignment',
    text: 'Leadership style assessed for organizational fit.',
  },
  {
    title: 'Stakeholder Readiness',
    text: 'Candidates prepared for complex decision structures.',
  },
  {
    title: 'Reference Architecture',
    text: 'Structured references that reveal real performance.',
  },
]

export default function LeadershipHiringPage() {
  return (
    <>
      <PageHero
        headingTwoLineLock
        heading={
          <>
            <span className="block whitespace-nowrap">
              Leadership mandate demands a unique Search Strategy,
            </span>
            <span className="block whitespace-nowrap">
              Disciplined Search and Laser Sharp Execution
            </span>
          </>
        }
        subtitle="Senior hiring is high-stakes. We treat it that way."
      />

      {/* Search Approach */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <SectionHeading
            eyebrow="The Philosophy"
            heading="Research | Understand | Connect | Deliver"
            align="left"
            className="max-w-none overflow-x-auto [-webkit-overflow-scrolling:touch]"
            headingClassName="whitespace-nowrap"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-16 lg:mt-20 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                {approachPoints.map((point) => (
                  <div key={point.title}>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-body">{point.text}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ImageContainer
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=1000&fit=crop"
                alt="Executive leadership discussion"
                aspectRatio="4/5"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Evaluation Quality */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Assessment"
            heading="Evaluation built on context, not templates."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 lg:mt-20">
            {evaluationBlocks.map((block, i) => (
              <AnimatedSection key={block.title} delay={i * 0.1}>
                <div className="border-l-2 border-brand-500 pl-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {block.title}
                  </h3>
                  <p className="text-body">{block.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Closure & Alignment */}
      <section className="section-padding bg-neutral-50">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Closure"
            heading="Alignment is where mandates succeed or fail."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <p className="text-body-lg">
                Stakeholder alignment determines mandate success.
              </p>
              <p className="text-body">
                We manage alignment from first conversation onward.
              </p>
              <p className="text-body">
                Expectations stay calibrated. Timelines stay honest.
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
              Ready to discuss a leadership mandate?
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
