'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Fink
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="#"
              className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              Products
            </Link>
            <Link
              href="#"
              className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="#"
              className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
            <Button
              variant="default"
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
