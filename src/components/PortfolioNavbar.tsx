"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navigationLinks = [
  { name: "Services", href: "#services" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
]

export function PortfolioNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLinkClick = (href: string) => {
    closeMobileMenu()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Virtual<span className="text-[#0d9488]">Care</span>
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-gray-700 hover:text-[#0d9488] px-3 py-2 text-base font-medium transition-colors duration-200 relative group"
                >
                  <span>{link.name}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0d9488] transition-all duration-300 group-hover:w-full"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="text-gray-700 hover:text-[#0d9488] px-4 py-2 text-base font-medium transition-colors duration-200"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white px-6 py-3 rounded-full text-base font-semibold hover:shadow-lg hover:shadow-[#0d9488]/25 transition-all duration-300"
            >
              Get Started
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#0d9488] p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-6 py-6 space-y-4">
              {navigationLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left text-gray-700 hover:text-[#0d9488] px-3 py-2 text-lg font-medium transition-colors duration-200"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <a
                  href="/login"
                  className="block w-full text-center text-gray-700 hover:text-[#0d9488] px-4 py-2 text-base font-medium transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="block w-full text-center bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white px-6 py-3 rounded-full text-base font-semibold"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
