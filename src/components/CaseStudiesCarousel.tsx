"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

type Testimonial = {
  id: string
  name: string
  role: string
  initials: string
  rating: number
  quote: string
  specialty: string
  image?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Patient",
    initials: "SJ",
    rating: 5,
    quote: "VirtualCare made it so easy to see a doctor without leaving home. I was feeling unwell and within 30 minutes, I had a consultation and prescription sent to my pharmacy. Absolutely incredible service!",
    specialty: "General Practice",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Practitioner",
    initials: "MC",
    rating: 5,
    quote: "As a cardiologist, this platform has allowed me to reach patients who otherwise wouldn't have access to specialist care. The video quality is excellent and the scheduling system is seamless.",
    specialty: "Cardiology",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Patient",
    initials: "ER",
    rating: 5,
    quote: "I was skeptical about telemedicine at first, but VirtualCare changed my mind completely. The doctors are attentive, the platform is user-friendly, and I saved so much time not having to commute.",
    specialty: "Mental Health",
  },
  {
    id: "4",
    name: "Dr. Amanda Foster",
    role: "Practitioner",
    initials: "AF",
    rating: 5,
    quote: "The platform's image sharing capabilities are perfect for dermatology consultations. Patients can easily share photos, and the secure messaging keeps our communication organized.",
    specialty: "Dermatology",
  },
  {
    id: "5",
    name: "James Wilson",
    role: "Patient",
    initials: "JW",
    rating: 5,
    quote: "Managing my chronic condition has never been easier. Regular check-ins with my doctor through VirtualCare have helped me stay on top of my health without the stress of frequent hospital visits.",
    specialty: "Chronic Care",
  },
]

export function CaseStudiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="w-full py-24 bg-gradient-to-b from-white to-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#0d9488] text-sm font-semibold tracking-wide uppercase mb-4 px-4 py-2 bg-[#0d9488]/10 rounded-full">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0f766e]">
              Community Says
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from patients and practitioners who have transformed their healthcare experience with VirtualCare.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-gray-100/50 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#0d9488]/20">
                    {currentTestimonial.initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Quote className="w-5 h-5 text-[#0d9488]" />
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
                  "{currentTestimonial.quote}"
                </p>

                <div>
                  <div className="font-bold text-gray-900 text-xl mb-1">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-[#0d9488] font-medium">
                    {currentTestimonial.role} • {currentTestimonial.specialty}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-6 mt-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center text-gray-600 hover:text-[#0d9488] hover:shadow-xl transition-all duration-200 border border-gray-100"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(index)
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-gradient-to-r from-[#0d9488] to-[#0f766e] w-10" 
                      : "bg-gray-200 hover:bg-gray-300 w-3"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center text-gray-600 hover:text-[#0d9488] hover:shadow-xl transition-all duration-200 border border-gray-100"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
