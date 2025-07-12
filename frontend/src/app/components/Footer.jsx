import { FiMessageSquare, FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <FiMessageSquare className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                SmartSupport
              </span>
            </div>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Revolutionizing customer support with AI-powered chatbots that deliver instant, accurate responses 24/7.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/chat" className="text-gray-400 hover:text-white transition-colors">Start Chat</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMail className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="ml-3 text-gray-400">support@smartsupport.ai</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="ml-3 text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <FiMapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="ml-3 text-gray-400">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiGithub className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Digisnare. All rights reserved.
            </p>
{/*             <p className="text-gray-400 text-sm"> */}
{/*               Developed by Syed Sohail with ❤️ */}
{/*             </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
