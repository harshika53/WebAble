import { Mail, Linkedin } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-blue-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WebAble</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Web accessibility scanning tool to help you create more inclusive websites that meet WCAG standards.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.wcag.com/resource/what-is-wcag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  WCAG Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://websitesetup.org/web-accessibility-checklist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  Accessibility Tips
                </a>
              </li>
              <li>
                <a
                  href="https://dequeuniversity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  Learn Accessibility Skills
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contact</h4>
            <div className="flex space-x-4 items-center">
              <a href="mailto:your-email@gmail.com" className="text-gray-500 hover:text-gray-900" aria-label="Gmail">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-gray-500 text-sm text-center">
             Developed by Harshika  © {new Date().getFullYear()} WebAble. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;