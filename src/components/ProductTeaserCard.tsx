"use client"

import { motion } from "framer-motion"
import { Video, Calendar, Shield, Clock, ArrowRight, Play } from "lucide-react"

export function ProductTeaserCard() {
  return (
    <section className="w-full px-8 pt-32 pb-20 bg-gradient-to-b from-[#f0fdfa] via-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
            className="flex flex-col"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#0d9488]/10 text-[#0d9488] px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit"
            >
              <span className="w-2 h-2 bg-[#0d9488] rounded-full animate-pulse"></span>
              Trusted by 10,000+ patients worldwide
            </motion.div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight text-gray-900 mb-6 font-bold">
              Your Health,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
                Reimagined
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Connect with certified healthcare practitioners from anywhere. 
              Book appointments, have video consultations, and take control of your health journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-[#0d9488]/25 transition-all duration-300"
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-[#0d9488] hover:text-[#0d9488] transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Video, label: "HD Video Calls", desc: "Crystal clear consultations" },
                { icon: Calendar, label: "Easy Booking", desc: "Schedule in seconds" },
                { icon: Shield, label: "HIPAA Compliant", desc: "Your data is secure" },
                { icon: Clock, label: "24/7 Available", desc: "Care when you need it" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#0d9488]/5 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488]/10 to-[#0d9488]/5 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#0d9488]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{feature.label}</div>
                    <div className="text-sm text-gray-500">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1], delay: 0.3 }}
            className="relative lg:pl-8"
          >
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-[#0d9488]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-[#0f766e]/10 rounded-full blur-3xl"></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-[2.5rem] p-8 lg:p-10 aspect-square flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#0d9488]/20">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  <div className="text-white/60 text-sm mb-2">Now Consulting</div>
                  <div className="text-white text-2xl font-semibold">Dr. Sarah Mitchell</div>
                  <div className="text-white/80">Cardiologist</div>
                </div>

                <div className="relative z-10">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/10">
                    <Video className="w-14 h-14 text-white" />
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-center gap-4">
                  <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                  </button>
                  <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Dr. Online</div>
                    <div className="text-xs text-gray-500">Ready to consult</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0d9488]/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#0d9488]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">100% Secure</div>
                    <div className="text-xs text-gray-500">End-to-end encrypted</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
