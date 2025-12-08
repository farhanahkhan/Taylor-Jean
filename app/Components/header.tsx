"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#", label: "Features" },
    { href: "#", label: "Pricing" },
    { href: "#", label: "About" },
    { href: "#", label: "Contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/elegant-tj-monogram-logo.jpg"
              alt="Taylor Jean logo"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-lg font-bold text-foreground text-primary">
              TAYLOR JEAN
            </span>
          </Link>

          <NavigationMenu.Root className="hidden md:flex">
            <NavigationMenu.List className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavigationMenu.Item key={link.label}>
                  <NavigationMenu.Link
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all block"
                  >
                    {link.label}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>

          <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed top-0 right-0 h-full w-[300px] bg-card border-l border-border z-50 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <VisuallyHidden>
                    <Dialog.Title className="text-lg font-semibold text-foreground">
                      Menu
                    </Dialog.Title>
                  </VisuallyHidden>
                  <Dialog.Close asChild>
                    <button
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2 border-t border-border mt-4">
                    <Link
                      href="/login"
                      className="block w-full py-3 px-4 text-sm font-medium text-center border border-border text-foreground hover:bg-accent/50 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="#"
                      className="block w-full py-3 px-4 text-sm font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
