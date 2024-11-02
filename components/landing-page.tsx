'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Battery, Zap, Gauge, Award, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm z-10 relative">
        <Link className="flex items-center justify-center" href="#">
          <Battery className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-blue-600">Maximum Lithium</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <Image
            src="/images/homebackground.webp?height=1080&width=1920"
            alt="Electric bike rider on a mountain trail"
            width={1920}
            height={1080}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-blue-600 bg-opacity-60"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Electrify Your Rideouts
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Maximum Lithium: Powering your adventures with cutting-edge battery technology for personal electric vehicles.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">Get Started</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Explore Range
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600">Why Choose Maximum Lithium?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600">Unparalleled Power</h3>
                <p className="text-gray-600">Experience longer rides and faster acceleration with our high-capacity batteries.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Gauge className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600">Rapid Charging</h3>
                <p className="text-gray-600">Get back on the trail quickly with our industry-leading charging speeds.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Award className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600">Eco-Friendly</h3>
                <p className="text-gray-600">Reduce your carbon footprint with our sustainable and recyclable battery technology.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600">What Our Riders Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <p className="text-gray-600 mb-4">"Maximum Lithium batteries have transformed my e-bike rideouts. I can now tackle longer trails and explore further without worrying about running out of power!"</p>
                <p className="font-bold text-blue-600">- Sarah J., E-Bike Enthusiast</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <p className="text-gray-600 mb-4">"As an electric skateboard builder, I swear by Maximum Lithium. Their batteries offer the perfect balance of power and weight for epic urban adventures."</p>
                <p className="font-bold text-blue-600">- Mike T., DIY E-Board Builder</p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4 text-blue-600">Our Rideout Ethos</h2>
                <p className="text-gray-600 mb-4">
                  At Maximum Lithium, we're more than just a battery company. We're a community of electric vehicle enthusiasts
                  pushing the boundaries of what's possible on the road and trail. Our passion for sustainable transportation
                  and outdoor adventures drives us to create the most advanced, reliable, and eco-friendly batteries on the market.
                </p>
                <p className="text-gray-600">
                  We believe in empowering individuals to embrace electric mobility and explore the great outdoors, whether it's
                  through e-bikes, e-scooters, or DIY projects. Our team of engineers and EV enthusiasts work tirelessly to ensure
                  that every Maximum Lithium battery delivers the performance and reliability you need for your electric adventures.
                </p>
              </div>
              <div className="relative h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-700 opacity-75"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Battery className="h-32 w-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Maximize Your Rideouts?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join the Maximum Lithium community and take your electric adventures to the next level.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white text-gray-900"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    Subscribe
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-200">
                  By subscribing, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-gray-500">© 2024 Maximum Lithium. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-blue-600" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-blue-600" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}