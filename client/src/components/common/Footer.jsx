import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              <span className="text-primary">Qalanjo</span> Fast Food
            </h3>
            <p className="text-sm text-gray-400">Fast food, served fresh to your door. Experience the best dining with Qalanjo Fast Food.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiMapPin className="w-4 h-4 text-primary" /> 123 Main Street, Kampala</li>
              <li className="flex items-center gap-2"><FiPhone className="w-4 h-4 text-primary" /> +256 700 123 456</li>
              <li className="flex items-center gap-2"><FiMail className="w-4 h-4 text-primary" /> info@qalanjo.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><FiFacebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><FiTwitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Qalanjo Fast Food. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
