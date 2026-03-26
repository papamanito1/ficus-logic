import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageContainer from '@/components/ui/ImageContainer'
import PageHero from '@/components/PageHero'
import { industries } from '@/data/partners'

export const metadata: Metadata = {
  title: 'Industries | Ficus Logic',
  description:
    'Executive search depth across technology, engineering, BFSI, GCC, product engineering, and industrial sectors.',
}

const industryImages: Record<string, string> = {
  technology:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
  engineering:
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop',
  'bfsi-fintech':
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
  gcc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
  'product-engineering':
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
  'industrial-manufacturing':
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=500&fit=crop',
}

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        heading="Search depth across sectors that matter."
        subtitle="Industry context shapes every mandate."
      />

      {/* Industries Grid */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.slug} delay={i * 0.1}>
                <Card variant="premium" className="overflow-hidden">
                  <ImageContainer
                    src={industryImages[ind.slug] || ''}
                    alt={ind.title}
                    aspectRatio="16/10"
                    className="!rounded-none"
                  />
                  <div className="p-10 lg:p-12">
                    <h3 className="text-display-sm text-neutral-900">
                      {ind.title}
                    </h3>
                    <p className="text-body-lg mt-3">{ind.subtitle}</p>
                    <div className="w-12 h-px bg-brand-500 mt-6 mb-6" />
                    <p className="text-body-sm">{ind.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Industry Expertise */}
      <section className="section-padding bg-neutral-50">
        <div className="container-narrow text-center">
          <SectionHeading
            eyebrow="Cross-Sector"
            heading="Leadership challenges transcend sector boundaries."
          />

          <AnimatedSection className="mt-12 lg:mt-16">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-body-lg">
                Cross-sector experience reveals patterns others miss.
              </p>
              <p className="text-body">
                Mandates benefit from breadth and depth together.
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
              Have an industry-specific mandate?
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
