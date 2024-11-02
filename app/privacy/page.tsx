import Link from 'next/link'

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hey there, fellow rider! 🚲</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're stoked that you're checking out our privacy policy. At Maximum Lithium, we believe in keeping things 
              transparent and simple - just like our battery tech. Here's how we handle your data while you're exploring 
              our electric adventures.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What We Collect 📱</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you cruise through our site, we automatically collect some basic info:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>IP address (to keep our site running smoothly)</li>
              <li>Browser type (so everything looks awesome on your screen)</li>
              <li>Device info (to make sure our site works great on whatever you're using)</li>
              <li>Cookies (the good kind that help remember your preferences)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              If you sign up for our newsletter or make a purchase, we'll also need:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Your email (for order updates and cool battery tips)</li>
              <li>Name and shipping address (can't send batteries to nowhere!)</li>
              <li>Payment info (processed securely through our payment partners)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How We Use It 🔋</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use your info to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Process your orders and keep you updated</li>
              <li>Send you important product info and safety updates</li>
              <li>Share cool battery tech news (only if you opt in)</li>
              <li>Improve our website and products</li>
              <li>Keep our site secure (nobody likes hackers)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Sharing Your Info 🤝</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We only share your data with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Shipping partners (to deliver your awesome batteries)</li>
              <li>Payment processors (to handle transactions securely)</li>
              <li>Service providers who help us run our site</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              We never sell your personal info - that's just not our style.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights 💪</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've got the power! You can:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Access your personal data</li>
              <li>Update or correct your info</li>
              <li>Delete your account</li>
              <li>Opt out of marketing emails</li>
              <li>Request your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Security 🔒</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We protect your data like we protect our batteries - with multiple layers of security. We use encryption, 
              secure servers, and regular security updates to keep your information safe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Questions? Let's Chat! 💬</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about how we handle your data, or just want to chat about battery tech, 
              drop us a line at privacy@maximumlithium.com
            </p>
          </section>

          <section className="text-sm text-gray-500 dark:text-gray-400 border-t pt-8">
            <p>
              This privacy policy is effective as of {new Date().toLocaleDateString()} and will remain in effect except 
              with respect to any changes in its provisions in the future, which will be in effect immediately after 
              being posted on this page. We reserve the right to update or change our Privacy Policy at any time, 
              and you should check this Privacy Policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 