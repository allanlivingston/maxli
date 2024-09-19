'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, ShoppingCart, Menu, Trees, Waves, Sun, Wind, Trash2, Plus, Minus, Package } from "lucide-react"
import * as Tooltip from '@radix-ui/react-tooltip'
import { ShoppingCart as Cart } from "./ShoppingCart"
import { useCart } from "@/hooks/useCart"
import Image from 'next/image'
import { ebikeBatteries, surfboardBatteries, BatteryProduct } from '@/lib/productData'
import { MiniCart } from '@/components/MiniCart';
import { ErrorBoundary } from 'react-error-boundary';
import Orders from '@/components/Orders'  // Import the Orders component
import { useSearchParams } from 'next/navigation';

export function EnhancedNorcalBatteryStore() {
  const [activeTab, setActiveTab] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeBatteryType, setActiveBatteryType] = useState("ebike")
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [isCartHovered, setIsCartHovered] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const searchParams = useSearchParams();

  const handleCartEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCartHovered(true);
  };

  const handleCartLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCartHovered(false);
    }, 300); // 300ms delay before hiding the MiniCart
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate total number of items in the cart
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  console.log('Rendering EnhancedNorcalBatteryStore');
  console.log('Cart Items:', cartItems);
  console.log('Cart Items Count:', cartItemsCount);
  console.log('Is Cart Hovered:', isCartHovered);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveTab("home");
    setMenuOpen(false);
    setActiveBatteryType("ebike");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCart = () => {
    setActiveTab("cart");
    setIsCartHovered(false); // Close the MiniCart
  };

  const BatteryCard = ({ battery, color }: { battery: BatteryProduct, color: string }) => {
    const imagePath = `/images/batteries/${battery.type}/${battery.imageName}`;

    return (
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="relative">  {/* Add this wrapper div */}
              <Card key={battery.id} className="bg-stone-800 border-stone-700 overflow-hidden cursor-pointer">
                <CardHeader className={`bg-gradient-to-br from-${color}-900 to-stone-800`}>
                  <CardTitle className={`${battery.type === 'surfboard' ? 'text-blue-300' : `text-${color}-300`} flex items-center`}>
                    <battery.icon className="mr-2 h-5 w-4" />
                    {battery.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="aspect-square bg-stone-700 flex items-center justify-center rounded-md mb-4 overflow-hidden">
                    <Image 
                      src={imagePath}
                      alt={battery.name} 
                      width={200}
                      height={200}
                      className="object-cover w-full h-full" 
                    />
                  </div>
                  <p className="text-stone-300">Capacity: {battery.capacity}</p>
                  <p className={`font-bold mt-2 ${battery.type === 'surfboard' ? 'text-blue-300' : `text-${color}-300`} text-lg`}>
                    ${battery.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${battery.type === 'surfboard' ? 'bg-blue-600 hover:bg-blue-700' : `bg-${color}-600 hover:bg-${color}-700`}`}
                    onClick={() => addToCart({
                      ...battery,
                      imagePath
                    })}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content 
              className="bg-stone-700 text-stone-100 p-4 rounded-md shadow-lg max-w-xs z-50"
              sideOffset={-150}  // Adjust this value to position the tooltip vertically
              side="top"
              align="center"
            >
              <h3 className="font-bold mb-2">{battery.name}</h3>
              <p>Capacity: {battery.capacity}</p>
              <p>Price: ${battery.price.toFixed(2)}</p>
              <p>Perfect for {battery.id % 2 === 0 ? "long rides" : "quick trips"}</p>
              <p>Weather resistant: {battery.id % 3 === 0 ? "Yes" : "No"}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  useEffect(() => {
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    if (searchParams.get('orderSuccess') === 'true') {
      console.log('Order success detected');
      setSuccessMessage('Your order has been successfully placed!');
      setActiveTab("orders");
      //alert('Order placed successfully!');
    } else if (searchParams.get('orderError') === 'true') {
      console.log('Order error detected');
      setSuccessMessage('There was an error processing your order. Please try again.');
      alert('Error processing order.');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-900 text-stone-100 font-sans">
      <header className="sticky top-0 z-10 bg-stone-800 border-b border-stone-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center space-x-2"
          >
            <Battery className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>opbattery.com</span>
          </a>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-emerald-400" : "text-stone-400 hover:text-emerald-400"}>Home</Button>
            <Button variant="ghost" onClick={() => setActiveTab("gallery")} className={activeTab === "gallery" ? "text-emerald-400" : "text-stone-400 hover:text-emerald-400"}>Gallery</Button>
            <Button variant="ghost" onClick={() => setActiveTab("about")} className={activeTab === "about" ? "text-emerald-400" : "text-stone-400 hover:text-emerald-400"}>About</Button>
            <Button variant="ghost" onClick={() => setActiveTab("contact")} className={activeTab === "contact" ? "text-emerald-400" : "text-stone-400 hover:text-emerald-400"}>Contact</Button>
            <Button variant="ghost" onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "text-emerald-400" : "text-stone-400 hover:text-emerald-400"}>Orders</Button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative" ref={cartRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActiveTab("cart")} 
                className="relative"
                onMouseEnter={handleCartEnter}
                onMouseLeave={handleCartLeave}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
              {cartItemsCount > 0 && isCartHovered && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-stone-100 border border-stone-300 rounded-md shadow-lg z-50"
                  onMouseEnter={handleCartEnter}
                  onMouseLeave={handleCartLeave}
                >
                  <MiniCart 
                    items={cartItems} 
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    onGoToCart={handleGoToCart}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {menuOpen && (
          <nav className="md:hidden bg-stone-800 py-2">
            <Button variant="ghost" onClick={() => { setActiveTab("home"); setMenuOpen(false) }} className="w-full text-left px-4 py-2">Home</Button>
            <Button variant="ghost" onClick={() => { setActiveTab("gallery"); setMenuOpen(false) }} className="w-full text-left px-4 py-2">Gallery</Button>
            <Button variant="ghost" onClick={() => { setActiveTab("about"); setMenuOpen(false) }} className="w-full text-left px-4 py-2">About</Button>
            <Button variant="ghost" onClick={() => { setActiveTab("contact"); setMenuOpen(false) }} className="w-full text-left px-4 py-2">Contact</Button>
            <Button variant="ghost" onClick={() => { setActiveTab("orders"); setMenuOpen(false) }} className="w-full text-left px-4 py-2">Orders</Button>
          </nav>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {activeTab === "home" && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-300" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>OnPoint Batteries</h1>
            <Tabs value={activeBatteryType} onValueChange={setActiveBatteryType} className="mb-8">
              <TabsList className="mb-4 bg-stone-800">
                <TabsTrigger value="ebike" className="flex items-center data-[state=active]:bg-emerald-700"><Trees className="mr-2 h-4 w-4" /> eBike Batteries</TabsTrigger>
                <TabsTrigger value="surfboard" className="flex items-center data-[state=active]:bg-emerald-700"><Waves className="mr-2 h-4 w-4" /> Surfboard Batteries</TabsTrigger>
              </TabsList>
              <TabsContent value="ebike">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ebikeBatteries.map((battery) => (
                    <BatteryCard key={battery.id} battery={battery} color="emerald" />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="surfboard">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {surfboardBatteries.map((battery) => (
                    <BatteryCard key={battery.id} battery={battery} color="blue" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-300" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Build Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Redwood Trail", "Coastal Ride", "Sierra Summit", "Surf's Up",
                "Golden Gate", "Napa Vineyard", "Tahoe Vista", "Yosemite Falls"
              ].map((place, i) => (
                <div key={i} className="aspect-square bg-stone-800 rounded-lg overflow-hidden">
                  <img src={`/placeholder.svg?height=300&width=300&text=${place}`} alt={place} className="object-cover w-full h-full hover:opacity-75 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-300" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Powered by the Rideout Spirit—Make What You Have Better.</h2>
            <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
              <p className="text-stone-300 mb-4">
              Op Point is more than just batteries; it's about embracing the rideout spirit and making the most of what you've got. From early morning surf checks to late-night scooter sessions and e-bike commutes, our roots are in garage workshops and the untamed streets of NorCal. We build power solutions that keep you rolling, wherever your journey takes you.</p>
              <p className="text-stone-300 mb-4">
              We're here for those who don't just buy new—those who upgrade, enhance, and ride what they've built. Our batteries are designed for e-bikes, scooters, and more, with unmatched power, endurance, and solid reliability. Whether you're pushing the limits of your e-bike, cruising on your scooter, or heading to the waves, our products are made to boost what you already have and take it to the next level. And if you're just getting started, we're here to help you build it exactly how you want it.
              </p>
              <p className="text-stone-300">
              Ride with us. Keep the rideout spirit alive by making what you have even better, from the bike to the board. Because with OPbattery, you're not just riding—you're creating, upgrading, and living the ride your way.              </p>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-300" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Connect with Us</h2>
            <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
              <p className="text-stone-300 mb-4">
                Have questions about our eco-friendly power solutions? Want to share your OP Batteries adventure story? We'd love to hear from you!
              </p>
              <div className="space-y-2 text-stone-300">
                <p><strong>Email:</strong> hello@opbattery.com</p>
              </div>
              <p className="text-stone-300 mt-4">
                Drop by our solar-powered showroom to test our batteries, chat with our team of local outdoor enthusiasts, and maybe share a cup of locally roasted, organic coffee while we help you find the perfect power solution for your next adventure.
              </p>
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <Cart 
            items={cartItems} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity}
            clearCart={clearCart}
          />
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-300" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>Your Orders</h2>
            <Orders />
          </div>
        )}
      </main>

      <footer className="bg-stone-800 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-2 text-emerald-400">Our Commitment</h3>
              <p className="text-stone-400">More Power, No BS! Powering adventures, preserving nature. OP Batteries is committed to sustainable energy solutions that power the spirt of the rideout and respect and protect our beautiful landscapes.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-emerald-400">Explore</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-stone-400 hover:text-emerald-400">Eco-Initiatives</a></li>
                <li><a href="#" className="text-stone-400 hover:text-emerald-400">NorCal Trail Guide</a></li>
                <li><a href="#" className="text-stone-400 hover:text-emerald-400">Community Clean-ups</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-emerald-400">Join Our Community</h3>
              <p className="text-stone-300 mb-2">Sign up for sustainable tips and exclusive OPbattery offers</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-stone-700 border-stone-600 text-stone-100 flex-grow" />
                <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">Stay Connected</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-stone-400">
            © 2024 OnPoint Batteries | Powered by the sun, inspired by the redwoods
          </div>
        </div>
      </footer>
    </div>
  )
}