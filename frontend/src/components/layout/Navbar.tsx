'use client'
import { ThemeToggle } from "@/components/ui-custom/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import icon from '../../../public/icon.svg';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={icon} alt="Spendify Logo" width={32} height={32} />
          <span className="text-xl font-bold text-primary dark:text-primary">
            Spendify
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" className="rounded-lg cursor-pointer">
              Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-lg cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost" className="rounded-lg cursor-pointer">
              Transactions
            </Button>
          </Link>

          <div className="ml-4 flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-lg bg-accent hover:bg-accent/90 cursor-pointer">
                Log in
              </Button>
            </Link>
          </div>
        </nav>

        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex flex-col pt-16 pb-6 px-6 md:hidden animate-fade-in">
          <nav className="flex flex-col space-y-4 mt-10">
            <Link
              href="/"
              className="text-lg font-medium py-3 border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-lg font-medium py-3 border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="text-lg font-medium py-3 border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions
            </Link>
          </nav>
          <div className="mt-auto">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-lg bg-accent hover:bg-accent/90 text-white">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
