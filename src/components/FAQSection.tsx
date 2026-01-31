"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MessageCircle } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I book a virtual consultation?",
    answer: "Booking is simple! Create a free account, browse our practitioners by specialty or availability, select a convenient time slot, and confirm your booking. You'll receive a confirmation email with a link to join your video consultation at the scheduled time.",
  },
  {
    question: "Are the practitioners on VirtualCare certified?",
    answer: "Absolutely. All practitioners on our platform are fully licensed and certified professionals. We verify credentials, medical licenses, and certifications before any practitioner can offer consultations through VirtualCare.",
  },
  {
    question: "Is my medical information secure?",
    answer: "Yes, security is our top priority. VirtualCare is fully HIPAA compliant. All video consultations are encrypted end-to-end, and your medical records are stored securely with strict access controls. We never share your data with third parties.",
  },
  {
    question: "Can I get prescriptions through virtual consultations?",
    answer: "Yes, practitioners can prescribe medications when medically appropriate. Prescriptions are sent electronically to your preferred pharmacy. Note that some controlled substances may require an in-person visit depending on local regulations.",
  },
  {
    question: "What if I need to cancel or reschedule my appointment?",
    answer: "You can cancel or reschedule appointments up to 2 hours before the scheduled time without any penalty. Simply log into your account, go to your appointments, and select the reschedule or cancel option.",
  },
  {
    question: "What technology do I need for a video consultation?",
    answer: "You'll need a device with a camera and microphone (smartphone, tablet, or computer), a stable internet connection, and a modern web browser. No special software installation is required – consultations happen right in your browser.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="w-full py-24 bg-gradient-to-b from-[#f8fafc] to-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <span className="inline-block text-[#0d9488] text-sm font-semibold tracking-wide uppercase mb-4 px-4 py-2 bg-[#0d9488]/10 rounded-full">
                FAQ
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
                  Questions
                </span>
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              <a
                href="mailto:support@virtualcare.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#0d9488]/25 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </motion.div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-8 group-hover:text-[#0d9488] transition-colors duration-200">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        openIndex === index 
                          ? "bg-[#0d9488] text-white" 
                          : "bg-[#0d9488]/10 text-[#0d9488]"
                      }`}
                    >
                      <Plus className="w-5 h-5" strokeWidth={2} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px bg-gray-100 mb-4"></div>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
