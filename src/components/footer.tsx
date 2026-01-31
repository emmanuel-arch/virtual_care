"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Find Practitioners", href: "#services" },
      { label: "Book Appointment", href: "/register" },
      { label: "Video Consultations", href: "#how-it-works" },
      { label: "Health Records", href: "#" },
    ],
  },
  {
    title: "For Practitioners",
    links: [
      { label: "Join as Practitioner", href: "/register/practitioner" },
      { label: "Practitioner Portal", href: "/dashboard/practitioner" },
      { label: "Resources", href: "#" },
      { label: "Success Stories", href: "#testimonials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "HIPAA Compliance", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0d9488]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0f766e]/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-16 relative">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-3xl p-8 lg:p-12 mb-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="footer-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#footer-pattern)" />
            </svg>
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">Stay Updated</h3>
              <p className="text-white/80">Get health tips and platform updates delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-5 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-[#0d9488] rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold">
                Virtual<span className="text-[#0d9488]">Care</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Connecting patients with healthcare professionals through secure, convenient video consultations.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-[#0d9488] transition-colors duration-200">
                <Mail className="w-5 h-5" />
                <span>support@virtualcare.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-[#0d9488] transition-colors duration-200">
                <Phone className="w-5 h-5" />
                <span>1-800-VIRTUAL</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-[#0d9488]" />
                <span>Available Worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (sectionIndex + 1) }}
            >
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#0d9488] transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} VirtualCare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
