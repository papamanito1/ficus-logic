import Link from 'next/link'
import Image from 'next/image'
import { footerNavigation } from '@/data/navigation'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="container-premium section-padding-sm">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="Ficus Logic"
                width={180}
                height={60}
                className="h-10 w-auto brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              Premium leadership &amp; niche executive search, connecting
              organisations with transformative talent across industries.
            </p>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-5">
              Registered Office
            </h3>
            <address className="not-italic text-sm leading-relaxed text-neutral-500">
              Ficus e-Logic Pvt. Ltd.
              <br />
              India
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            &copy; 2024 Ficus e-Logic Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerNavigation.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
