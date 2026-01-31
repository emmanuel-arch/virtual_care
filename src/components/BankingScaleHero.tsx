"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Stethoscope, Star, Clock } from "lucide-react"

type StatItem = {
  value: number
  suffix: string
  label: string
  description: string
  icon: React.ElementType
}

const stats: StatItem[] = [
  {
    value: 50000,
    suffix: "+",
    label: "Consultations",
    description: "Completed successfully",
    icon: Stethoscope,
  },
  {
    value: 500,
    suffix: "+",
    label: "Practitioners",
    description: "Certified specialists",
    icon: Users,
  },
  {
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "Patient rating",
    icon: Star,
  },
  {
    value: 24,
    suffix: "/7",
    label: "Availability",
    description: "Round the clock care",
    icon: Clock,
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function BankingScaleHero() {
  return (
    <section id="services" className="w-full py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#0d9488]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#0d9488] text-sm font-semibold tracking-wide uppercase mb-4 px-4 py-2 bg-[#0d9488]/10 rounded-full">
            Trusted Healthcare Platform
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Healthcare That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
              Scales With You
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine check-ups to specialist consultations, VirtualCare connects you with 
            the right healthcare professionals whenever you need them.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 hover:border-[#0d9488]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#0d9488]/5 h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0d9488]/10 to-[#0d9488]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-[#0d9488]" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e] mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] to-[#0f766e]"></div>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="cta-grid" width="4" height="4" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#cta-grid)" />
            </svg>
          </div>
          
          <div className="relative p-12 lg:p-16 text-center text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Ready to transform your healthcare experience?</h3>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of patients who have already discovered the convenience of virtual healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register/patient"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center bg-white text-[#0d9488] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Register as Patient
              </motion.a>
              <motion.a
                href="/register/practitioner"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Join as Practitioner
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
