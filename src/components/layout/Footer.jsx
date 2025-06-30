// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg'; // Path to your logo.svg
import { Facebook, Twitter, Linkedin } from 'lucide-react'; // Install: npm install lucide-react

const Footer = () => {
  return (
    <footer className="bg-blue-900 dark:bg-gray-900 text-white py-12 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-blue-400 dark:border-gray-700 pb-8 mb-8">
        {/* Logo and Mission */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/">
            <img src={logo} alt="LinkUp Logo" className="h-10 w-auto mb-4" />
          </Link>
          <p className="text-grey-600 -600 dark:text-gray-300 text-sm">
            Connecting students & companies for a brighter future.
          </p>
        </div>

        {/* Navigation Columns */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Company & Resources</h4>
          <ul className="space-y-2 text-grey-600 -600 dark:text-gray-300 text-sm">
            <li><Link to="/about" className="hover:text-blue-900  transition-colors">About Us</Link></li>
            <li><Link to="/opportunities" className="hover:text-blue-900  transition-colors">Browse Opportunities</Link></li>
            <li><Link to="/contact" className="hover:text-blue-900  transition-colors">Contact Us</Link></li>
            <li><Link to="/blog" className="hover:text-blue-900  transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Legal</h4>
          <ul className="space-y-2 text-grey-600 -600 dark:text-gray-300 text-sm">
            <li><Link to="/privacy" className="hover:text-blue-900  transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-900  transition-colors">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-blue-900  transition-colors">Cookies Policy</Link></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-grey-600 -600  hover:text-blue-900  transition-colors">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-grey-600 -600  hover:text-blue-900  transition-colors">
              <Twitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-grey-600 -600  hover:text-blue-900  transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-grey-600 -600 dark:text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} LinkUp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;