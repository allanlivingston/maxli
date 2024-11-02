import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Welcome to the Ride! 🚴‍♂️</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thanks for choosing Maximum Lithium! These terms of service are here to keep our electric adventures smooth 
              and safe for everyone. By using our products and services, you're agreeing to these terms - it's like 
              checking your battery before a ride, just good practice!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Basics 🔋</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>You must be at least 18 years old to purchase our products</li>
              <li>All purchases are for personal or authorized business use only</li>
              <li>Reselling requires written permission from Maximum Lithium</li>
              <li>Account information must be accurate and up-to-date</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product Usage 🛠️</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our batteries are awesome, but they need proper handling:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Follow all safety guidelines and installation instructions</li>
              <li>Use only with compatible devices and charging equipment</li>
              <li>Don't modify or tamper with the batteries</li>
              <li>Store and operate within recommended temperature ranges</li>
              <li>Regular maintenance is your responsibility (but we're here to help!)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Orders & Shipping 📦</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Orders are subject to availability and confirmation</li>
              <li>Shipping times are estimates, not guarantees</li>
              <li>You're responsible for providing accurate shipping information</li>
              <li>Special handling may be required for certain locations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Returns & Refunds 🔄</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Shipping costs for returns may apply</li>
              <li>Damaged items must be reported within 48 hours of receipt</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Legal Stuff 📜</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>We're not responsible for improper use or modifications</li>
              <li>Prices and specifications subject to change</li>
              <li>We reserve the right to refuse service</li>
              <li>Disputes will be resolved through arbitration</li>
              <li>Local laws and regulations apply</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Content & Intellectual Property 💡</h2>
            <p className="text-gray-600 dark:text-gray-300">
              All content, designs, and trademarks are our property. Feel free to share your Maximum Lithium 
              experiences on social media, but please don't use our content for commercial purposes without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Questions? Let's Chat! 💬</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If anything in these terms isn't clear, or you just want to talk batteries, reach out to us at 
              terms@maximumlithium.com - we're always happy to help!
            </p>
          </section>

          <section className="text-sm text-gray-500 dark:text-gray-400 border-t pt-8">
            <p>
              These terms are effective as of {new Date().toLocaleDateString()} and may be updated periodically. 
              Continued use of our products and services after changes constitutes acceptance of new terms. 
              We'll notify you of any significant changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 