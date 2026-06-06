import { Mail, Linkedin } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="border-t border-transparent bg-gradient-to-r from-blue-100/50 via-white to-blue-100/50">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">WebAble</h3>
            <p className="max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              Web accessibility scanning tool to help you create more inclusive websites that meet WCAG standards.
            </p>
          </div>

          <nav aria-label="Footer resources" className="space-y-4 lg:border-l lg:border-gray-300 lg:pl-8">
            <h4 className="text-base font-semibold text-gray-900 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.wcag.com/resource/what-is-wcag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md py-1 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  WCAG Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://websitesetup.org/web-accessibility-checklist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md py-1 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Accessibility Tips
                </a>
              </li>
              <li>
                <a
                  href="https://dequeuniversity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md py-1 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 hover:translate-x-1 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Learn Accessibility Skills
                </a>
              </li>
            </ul>
          </nav>

          <section className="space-y-4 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-gray-300 lg:pl-8">
            <h4 className="text-base font-semibold text-gray-900 uppercase tracking-wide">Contact</h4>
            <div className="flex items-center gap-3">
              <a
                href="mailto:your-email@gmail.com"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-gray-800  text-gray-500 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-blue-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-gray-800  text-gray-500 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-blue-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-gray-300 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm leading-relaxed text-gray-500 lg:justify-start lg:text-left">
              <span>Developed by Harshika</span>
              <span>© {new Date().getFullYear()} WebAble</span>
              <span>All rights reserved</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm lg:justify-end">
              <a href="/privacy" className="rounded-md px-1 py-1 text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">Privacy</a>
              <a href="/terms" className="rounded-md px-1 py-1 text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;