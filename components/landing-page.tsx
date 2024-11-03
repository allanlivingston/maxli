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
          <Battery className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
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
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
          <Image
            src="/images/homebackground.webp?height=1080&width=1920"
            alt="Electric bike rider on a mountain trail"
            width={1920}
            height={1080}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-blue-600 bg-opacity-60"></div>
          <div className="container px-4 md:px-8 relative z-10 mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Maximize Your Rideouts
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Maximum Lithium: Powering your adventures with cutting-edge battery technology for personal electric vehicles.
                </p>
              </div>
              <div className="space-x-4">
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsGetStartedOpen(true)}
                >
                  Get Started
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Explore Range
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600 dark:text-blue-400">Why Choose Maximum Lithium?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Unparalleled Power</h3>
                <p className="text-gray-600 dark:text-gray-300">Experience longer rides and faster acceleration with our high-capacity batteries.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Gauge className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Rapid Charging</h3>
                <p className="text-gray-600 dark:text-gray-300">Get back on the trail quickly with our industry-leading charging speeds.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Eco-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300">Reduce your carbon footprint with our sustainable and recyclable battery technology.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-600 dark:text-blue-400">What Our Riders Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;Maximum Lithium batteries have transformed my e-bike rideouts. I can now tackle longer trails and explore further without worrying about running out of power!&rdquo;</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">- Sarah J., E-Bike Enthusiast</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-blue-100 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;As an electric skateboard builder, I swear by Maximum Lithium. Their batteries offer the perfect balance of power and weight for epic urban adventures.&rdquo;</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">- Mike T., DIY E-Board Builder</p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4 text-blue-600 dark:text-blue-400">Our Rideout Ethos</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  At Maximum Lithium, we&apos;re more than just a battery company. We&apos;re a community of electric vehicle enthusiasts
                  pushing the boundaries of what&apos;s possible on the road and trail. Our passion for sustainable transportation
                  and outdoor adventures drives us to create the most advanced, reliable, and eco-friendly batteries on the market.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in empowering individuals to embrace electric mobility and explore the great outdoors, whether it&apos;s
                  through e-bikes, e-scooters, or DIY projects. Our team of engineers and EV enthusiasts work tirelessly to ensure
                  that every Maximum Lithium battery delivers the performance and reliability you need for your electric adventures.
                </p>
              </div>
              <div className="relative h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-700 opacity-75"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Battery className="h-32 w-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
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
                <p className="text-xs text-gray-200">
                  By subscribing, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </section>
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