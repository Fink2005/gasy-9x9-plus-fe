import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Fink
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted partner for premium Web3 experiences and exceptional wallet integration services.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-blue-600" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors duration-200"
              >
                <Github className="w-5 h-5 text-muted-foreground hover:text-purple-600" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-indigo-600" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Products</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Wallet Connect
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  DeFi Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  NFT Platform
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; 2024 Fink. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
