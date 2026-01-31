"use client"

import { motion } from "framer-motion"
import { 
  Stethoscope, Brain, Heart, Eye, Bone, Baby, 
  Pill, Activity, UserPlus, Calendar, Video, MessageSquare 
} from "lucide-react"

type Specialty = {
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const specialties: Specialty[] = [
  { name: "General Practice", icon: Stethoscope, color: "#0d9488", bgColor: "#0d948815" },
  { name: "Mental Health", icon: Brain, color: "#8b5cf6", bgColor: "#8b5cf615" },
  { name: "Cardiology", icon: Heart, color: "#ef4444", bgColor: "#ef444415" },
  { name: "Ophthalmology", icon: Eye, color: "#3b82f6", bgColor: "#3b82f615" },
  { name: "Orthopedics", icon: Bone, color: "#f59e0b", bgColor: "#f59e0b15" },
  { name: "Pediatrics", icon: Baby, color: "#ec4899", bgColor: "#ec489915" },
  { name: "Pharmacy", icon: Pill, color: "#10b981", bgColor: "#10b98115" },
  { name: "Diagnostics", icon: Activity, color: "#6366f1", bgColor: "#6366f115" },
]

const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up in minutes with your basic information. It's free and completely secure.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Find a Practitioner",
    description: "Browse our network of certified specialists by specialty, availability, or rating.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Book Appointment",
    description: "Choose a convenient time slot and book your video consultation instantly.",
    icon: Video,
  },
  {
    step: "04",
    title: "Start Consultation",
    description: "Join your secure video call, discuss your concerns, and receive expert care.",
    icon: MessageSquare,
  },
]

export function IntegrationCarousel() {
  return (
    <section id="how-it-works" className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        {/* Specialties Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#0d9488] text-sm font-semibold tracking-wide uppercase mb-4 px-4 py-2 bg-[#0d9488]/10 rounded-full">
            Medical Specialties
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
              Care Coverage
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access a wide range of medical specialties through our platform. Whatever your health needs, 
            we have qualified practitioners ready to help.
          </p>
        </motion.div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-24">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: specialty.bgColor }}
              >
                <specialty.icon className="w-7 h-7" style={{ color: specialty.color }} />
              </div>
              <div className="font-semibold text-gray-900 group-hover:text-[#0d9488] transition-colors duration-300">
                {specialty.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#0d9488] text-sm font-semibold tracking-wide uppercase mb-4 px-4 py-2 bg-[#0d9488]/10 rounded-full">
            Simple Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
              Works
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#0d9488]/20 via-[#0d9488]/40 to-[#0d9488]/20"></div>
          
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-100 h-full hover:shadow-xl hover:shadow-[#0d9488]/5 transition-all duration-500 group">
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center shadow-lg shadow-[#0d9488]/20 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold text-[#0d9488] mb-2 text-center">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
