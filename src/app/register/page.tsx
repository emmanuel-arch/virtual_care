import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Stethoscope, UserRound } from "lucide-react";

export default function RegisterLanding() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/virtual.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full opacity-50 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        ></div>
        <div
          className="absolute right-1/4 top-3/4 h-24 w-24 rounded-full opacity-40 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute right-1/3 top-1/2 h-16 w-16 rounded-full opacity-45 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            animationDelay: "0.5s",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link 
            href="/" 
            className="text-xl font-bold text-white drop-shadow-lg"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            VirtualCare
          </Link>
          <Link 
            href="/login" 
            className="text-sm text-white/90 hover:text-white transition-colors"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            Already have an account? Login
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
          >
            Get started with VirtualCare
          </h1>
          <p 
            className="text-lg text-white/90"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Choose the path that fits you best to begin your healthcare journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            className="relative border-transparent shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(40px) saturate(250%)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow:
                "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <CardHeader>
              <div 
                className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                  boxShadow: "0 8px 24px rgba(13, 148, 136, 0.4)",
                }}
              >
                <UserRound className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Continue as Patient</CardTitle>
              <CardDescription className="text-gray-700">
                Find trusted practitioners, book appointments, and start care in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register/patient">
                <Button 
                  className="w-full py-6 text-base font-semibold transition-all duration-300"
                  style={{ 
                    backgroundColor: "#0d9488", 
                    color: "white",
                    boxShadow: "0 4px 16px rgba(13, 148, 136, 0.4)",
                  }}
                >
                  Create patient account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="relative border-transparent shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(40px) saturate(250%)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow:
                "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
            }}
          >
            <CardHeader>
              <div 
                className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
                }}
              >
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Continue as Practitioner</CardTitle>
              <CardDescription className="text-gray-700">
                Build your profile, manage availability, and connect with new patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register/practitioner">
                <Button 
                  variant="outline"
                  className="w-full py-6 text-base font-semibold transition-all duration-300 border-2"
                  style={{ 
                    borderColor: "rgba(139, 92, 246, 0.5)",
                    color: "#7c3aed",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Register as practitioner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
