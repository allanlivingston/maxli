/* eslint-disable react/no-unescaped-entities */
'use client'

import { useEffect, useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Battery, Zap, Gauge, Award, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BatteryThemeToggle } from "@/components/ui/battery-theme-toggle"
import { ContactForm } from "@/components/ui/contact-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function LandingPageComponent() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGetStartedSuccess, setShowGetStartedSuccess] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrollingDown = currentScrollPos > prevScrollPos
      setVisible(!isScrollingDown || currentScrollPos < 100)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const maxScroll = 500
      const newOpacity = Math.max(0, 1 - (scrollPosition / maxScroll))
      setOverlayOpacity(newOpacity)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubscribing(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/mnnqpodo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        form.reset()
        setShowSuccessDialog(true)
        setIsSubscribed(true)
        
        setTimeout(() => {
          setShowSuccessDialog(false)
        }, 3000)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      alert('Sorry, there was an error submitting the form. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  const handleGetStarted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/xjkvypwj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        form.reset()
        setIsGetStartedOpen(false)
        setShowGetStartedSuccess(true)
        
        setTimeout(() => {
          setShowGetStartedSuccess(false)
        }, 3000)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      alert('Sorry, there was an error submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header 
        className={`fixed w-full px-4 lg:px-6 h-14 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-50 transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Link className="flex items-center" href="#">
          <span className="ml-3 text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
            Maximum Lithium
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Features
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            About
          </Link>
          <Button onClick={() => setIsGetStartedOpen(true)}>Get Started</Button>
          <BatteryThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <BatteryThemeToggle />
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#about" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsGetStartedOpen(true)
                  }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
      <ContactForm />
      <main className="flex-1 pt-14 mx-auto w-full">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="fixed inset-0 w-full h-screen">
            <Image
              src="/images/homebackground.webp?height=1080&width=1920"
              alt="Electric bike rider on a mountain trail"
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              priority
            />
            <div 
              className="absolute inset-0 bg-white dark:bg-gray-800 transition-opacity duration-300 ease-out"
              style={{ opacity: overlayOpacity }}
            ></div>
          </div>
          <div className="container px-4 md:px-8 relative z-10 mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="animate-slide-up text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-600 dark:text-blue-400">
                  Maximize Your Rideouts
                </h1>
                <p className="animate-slide-up delay-100 mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  Maximum Lithium: Powering your adventures with cutting-edge battery technology for personal electric vehicles.
                </p>
              </div>
              
              <div className="animate-slide-up delay-200 pt-4 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsGetStartedOpen(true)
                  }}
                >
                  Get Started
                </Button>
              </div>
            
            </div>
          </div>
        </section>
        <div className="relative z-20 bg-white dark:bg-gray-800">
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <h2 className="animate-slide-up text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600 dark:text-blue-400">
                Why Choose Maximum Lithium?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="animate-slide-up delay-100 flex flex-col items-center text-center">
                  <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Unparalleled Power</h3>
                  <p className="text-gray-600 dark:text-gray-300">Experience the perfect balance of capacity and output with our high-performance battery systems designed for your specific needs.</p>
                </div>
                <div className="animate-slide-up delay-200 flex flex-col items-center text-center">
                  <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">High Quality Components</h3>
                  <p className="text-gray-600 dark:text-gray-300">Built with premium cells and advanced BMS technology for unmatched reliability and longevity in your electric adventures.</p>
                </div>
                <div className="animate-slide-up delay-300 flex flex-col items-center text-center">
                  <Gauge className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Full Customization</h3>
                  <p className="text-gray-600 dark:text-gray-300">Every pack is tailored to your specifications – from maximum output, voltage, and capacity to form factor and features.</p>
                </div>
              </div>
            </div>
          </section>
          <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <h2 className="animate-slide-up text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600 dark:text-blue-400">
                What Our Riders Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="animate-slide-up delay-100 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;Maximum Lithium batteries have transformed my e-bike rideouts. I can now tackle longer trails and explore further without worrying about running out of power!&rdquo;</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">- Sarah J., E-Bike Enthusiast</p>
                </div>
                <div className="animate-slide-up delay-200 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;As an electric skateboard builder, I swear by Maximum Lithium. Their batteries offer the perfect balance of power and weight for epic urban adventures.&rdquo;</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">- Mike T., DIY E-Bike Builder</p>
                </div>
              </div>
            </div>
          </section>
          <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="animate-slide-up text-3xl font-bold tracking-tighter sm:text-4xl mb-4 text-blue-600 dark:text-blue-400">
                    Our Rideout Ethos
                  </h2>
                  <p className="animate-slide-up delay-100 text-gray-600 dark:text-gray-300 mb-4">
                    At Maximum Lithium, we're more than just a battery company. We're a community of riders, builders, and innovators who believe in pushing the boundaries of what's possible with electric vehicles.
                  </p>
                  <p className="animate-slide-up delay-200 text-gray-600 dark:text-gray-300">
                    We believe in empowering individuals to explore further, ride longer, and build better. Every battery we create is designed with the perfect balance of power, reliability, and safety – because we know what matters most when you're out there chasing that next adventure.
                  </p>
                </div>
                <div className="animate-slide-up delay-300 relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/sfrideout.webp"
                    alt="Electric bike rider on a scenic trail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
          <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600 dark:text-blue-400">
                    Ready to Maximize Your Rideouts?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl">
                    Join the Maximum Lithium community and take your electric adventures to the next level.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  {isSubscribed ? (
                    <div className="text-center text-gray-200">
                      Thanks for subscribing! We'll be in touch soon.
                    </div>
                  ) : (
                    <form 
                      onSubmit={handleSubscribe} 
                      className="flex space-x-2"
                      action="https://formspree.io/f/mnnqpodo"
                      method="POST"
                    >
                      <Input
                        className="max-w-lg flex-1 bg-white text-gray-900"
                        placeholder="Enter your email"
                        type="email"
                        name="email"
                        required
                        disabled={subscribing}
                      />
                      <Button 
                        type="submit" 
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={subscribing}
                      >
                        {subscribing ? 'Subscribing...' : 'Subscribe'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    By subscribing, you agree to our terms and privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Maximum Lithium. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link 
            className="text-xs hover:underline underline-offset-4 text-blue-600 dark:text-blue-400" 
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link 
            className="text-xs hover:underline underline-offset-4 text-blue-600 dark:text-blue-400" 
            href="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-900 dark:text-white">Welcome to Maximum Lithium!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Battery className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <p className="text-center text-gray-600 dark:text-gray-200">
              Thank you for subscribing! We'll keep you updated with the latest news and developments.
            </p>
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-[3000ms] ease-linear"
                style={{ 
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isGetStartedOpen} onOpenChange={setIsGetStartedOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-900 dark:text-white">Start Your Electric Journey</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGetStarted} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                Tell us about your project
              </label>
              <textarea
                name="message"
                placeholder="What are you building? What kind of battery solutions are you looking for?"
                required
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showGetStartedSuccess} onOpenChange={setShowGetStartedSuccess}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-900 dark:text-white">Message Received!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Battery className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <p className="text-center text-gray-600 dark:text-gray-200">
              Thank you for reaching out! We'll review your project details and get back to you soon.
            </p>
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-400"
                style={{ 
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}