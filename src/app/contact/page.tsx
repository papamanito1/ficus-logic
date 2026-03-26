import type { Metadata } from 'next'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import PageHero from '@/components/PageHero'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Ficus Logic',
  description:
    'Get in touch for leadership hiring and niche executive search mandates. We respond within one business day.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        heading="Let's discuss your mandate."
        subtitle="We respond within one business day."
      />

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <ContactForm />
              </AnimatedSection>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.15}>
                <Card variant="premium" className="p-8 lg:p-10">
                  <h3 className="text-xl font-medium text-neutral-900 mb-8">
                    Get in touch.
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">
                        Email
                      </p>
                      <a
                        href="mailto:contact@ficuslogic.com"
                        className="text-body font-medium text-neutral-900 hover:text-brand-600 transition-colors"
                      >
                        contact@ficuslogic.com
                      </a>
                    </div>

                    <div className="w-full h-px bg-neutral-200/60" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
                        Offices
                      </p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            Delhi NCR
                          </p>
                          <p className="text-body-sm">Registered Office</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            Noida
                          </p>
                          <p className="text-body-sm">Corporate Office</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-neutral-200/60" />

                    <div>
                      <p className="text-body">
                        Reach out for leadership or niche
                        hiring mandates.
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
