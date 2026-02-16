import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Chasma IR Magazine</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-xl font-medium text-gray-800 leading-relaxed">
            Welcome to Chasma IR Magazine — Stories That Resonate.
          </p>
          
          <p>
            Chasma IR Magazine is a platform dedicated to sharp analysis on diplomacy, security, and global affairs. 
            We explore informed perspectives and stories shaping our interconnected world.
          </p>

          <div className="my-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="italic text-gray-700">
              To provide expert analysis on International Relations, Foreign Policy, and Global Affairs. 
              We serve as your trusted source for understanding the complex world of geopolitics.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who We Are</h2>
          <p>
            We are a community of writers, thinkers, and creators sharing stories that matter. 
            Chasma IR Magazine brings together voices from around the globe to dissect critical issues 
            and offer fresh insights into the events that define our times.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Join Our Community</h2>
          <p>
            Whether you are a seasoned analyst, a student of international relations, or simply a curious reader, 
            we invite you to join us on a journey of discovery.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Readers:</strong> Explore categories, trending topics, and fresh content daily.</li>
            <li><strong>Writers:</strong> Ready to share your story? Join our community of writers and reach thousands of readers eager to hear your perspective.</li>
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2026 Chasma IR Magazine. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Careers() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers at Chasma IR Magazine</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-xl text-gray-800 leading-relaxed">
            Join a team dedicated to understanding the world. We are always looking for passionate writers, editors, and analysts.
          </p>

          <div className="my-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Why Work With Us?</h3>
            <ul className="list-disc pl-5 space-y-2 text-blue-800">
              <li>Collaborate with experts in International Relations.</li>
              <li>Reach a global audience of informed readers.</li>
              <li>Shape the narrative on critical geopolitical issues.</li>
              <li>Flexible, remote-first environment.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Open Positions</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Contributing Writer (International Security)</h3>
              <p className="text-gray-500 text-sm mb-4">Remote • Part-time</p>
              <p className="mb-4">
                We are looking for writers with expertise in international security, conflict resolution, and defense policy.
                You will produce in-depth analysis and opinion pieces on current events.
              </p>
              <a href="mailto:careers@chasma-ir.com" className="text-blue-600 font-medium hover:underline">Apply Now →</a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Regional Analyst (Asia-Pacific)</h3>
              <p className="text-gray-500 text-sm mb-4">Remote • Contract</p>
              <p className="mb-4">
                Seeking a specialist in Asia-Pacific geopolitics to cover regional developments, trade relations, and diplomatic shifts.
              </p>
              <a href="mailto:careers@chasma-ir.com" className="text-blue-600 font-medium hover:underline">Apply Now →</a>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Editorial Intern</h3>
              <p className="text-gray-500 text-sm mb-4">Remote • Internship</p>
              <p className="mb-4">
                A great opportunity for students or recent graduates to learn the ropes of digital publishing, editing, and content strategy.
              </p>
              <a href="mailto:careers@chasma-ir.com" className="text-blue-600 font-medium hover:underline">Apply Now →</a>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Don't see a role for you?</h3>
            <p className="mb-6">
              We are always open to hearing from talented individuals. Send your resume and a cover letter telling us how you can contribute.
            </p>
            <a href="mailto:careers@chasma-ir.com" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Contact Recruiting
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to hear from you. Whether you have a question about our content, want to contribute, or just want to say hello, feel free to reach out.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">General Inquiries</h3>
                <a href="mailto:info@chasma-ir.com" className="text-blue-600 hover:underline">info@chasma-ir.com</a>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900">Editorial Team</h3>
                <a href="mailto:editor@chasma-ir.com" className="text-blue-600 hover:underline">editor@chasma-ir.com</a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">Partnerships & Advertising</h3>
                <a href="mailto:partners@chasma-ir.com" className="text-blue-600 hover:underline">partners@chasma-ir.com</a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">Mailing Address</h3>
                <p className="text-gray-600">
                  Chasma IR Magazine<br/>
                  123 Global Avenue, Suite 400<br/>
                  New York, NY 10001<br/>
                  USA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Your name" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>General Inquiry</option>
                  <option>Editorial Feedback</option>
                  <option>Contribution Proposal</option>
                  <option>Technical Support</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="How can we help?"></textarea>
              </div>
              
              <button type="button" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Press() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Press & Media</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-xl text-gray-800 leading-relaxed">
            Resources for journalists, media professionals, and content creators.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Media Kit</h3>
              <p className="mb-4 text-sm">
                Download our official logos, brand guidelines, and executive bios.
              </p>
              <button className="text-blue-600 font-medium hover:underline">Download Kit (ZIP) ↓</button>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Press Releases</h3>
              <p className="mb-4 text-sm">
                Latest announcements, partnership news, and editorial updates.
              </p>
              <button className="text-blue-600 font-medium hover:underline">View Archive →</button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">In The News</h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <span className="text-gray-400 font-mono text-sm min-w-[100px]">Oct 12, 2025</span>
              <div>
                <h3 className="font-bold text-gray-900">Chasma IR Magazine Launches New Podcast Series</h3>
                <p className="text-sm text-gray-500">Global Media Wire</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <span className="text-gray-400 font-mono text-sm min-w-[100px]">Sep 05, 2025</span>
              <div>
                <h3 className="font-bold text-gray-900">Top 10 Digital Platforms for Foreign Policy Analysis</h3>
                <p className="text-sm text-gray-500">Tech & Politics Review</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Media Contact</h3>
            <p className="mb-4">
              For interview requests, press passes, or official statements, please contact our media relations team.
            </p>
            <a href="mailto:press@chasma-ir.com" className="text-blue-600 font-medium hover:underline">press@chasma-ir.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Help() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Account Management</h3>
            <ul className="space-y-2 text-blue-600">
              <li><a href="#" className="hover:underline">Reset your password</a></li>
              <li><a href="#" className="hover:underline">Update profile settings</a></li>
              <li><a href="#" className="hover:underline">Manage subscriptions</a></li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Technical Issues</h3>
            <ul className="space-y-2 text-blue-600">
              <li><a href="#" className="hover:underline">Troubleshoot login problems</a></li>
              <li><a href="#" className="hover:underline">Report a bug</a></li>
              <li><a href="#" className="hover:underline">Browser compatibility</a></li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">How can I submit an article?</h3>
            <p className="text-gray-600">
              We welcome contributions from writers and experts. Please create an account, complete your profile, and navigate to the "Write" section to submit your draft for review.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Is Chasma IR Magazine free to read?</h3>
            <p className="text-gray-600">
              Yes, currently all articles and podcasts are free to access. We are committed to open access for educational and informational purposes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">How do I delete my account?</h3>
            <p className="text-gray-600">
              If you wish to delete your account, please contact our support team at <a href="mailto:support@chasma-ir.com" className="text-blue-600 hover:underline">support@chasma-ir.com</a> with your request.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 1, 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p>
            Chasma IR Magazine ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or choose to participate in various activities related to the Site.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
            <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Disclosure of Your Information</h2>
          <p>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@chasma-ir.com" className="text-blue-600 hover:underline">privacy@chasma-ir.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 1, 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Chasma IR Magazine ("we," "us," or "our"), concerning your access to and use of our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Prohibited Activities</h2>
          <p>
            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of [Jurisdiction], and you irrevocably consent that the courts of [Jurisdiction] shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:legal@chasma-ir.com" className="text-blue-600 hover:underline">legal@chasma-ir.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Cookies() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 1, 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Use of Cookies</h2>
          <p>
            Chasma IR Magazine ("we," "us," or "our") uses cookies, web beacons, tracking pixels, and other tracking technologies when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site") to help customize the Site and improve your experience.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. What Are Cookies?</h2>
          <p>
            A "cookie" is a string of information which assigns you a unique identifier that we store on your computer. Your browser then provides that unique identifier to use each time you submit a query to the Site. We use cookies on the Site to, among other things, keep track of services you have used, record registration information, record your user preferences, keep you logged into the Site, facilitate purchase procedures, and track the pages you visit.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900">Advertising Cookies</h3>
              <p>
                Advertising cookies are placed on your computer by advertisers and ad servers in order to display advertisements that are most likely to be of interest to you. These cookies allow advertisers and ad servers to gather information about your visits to the Site and other websites, alternate the ads sent to a specific computer, and track how often an ad has been viewed and by whom.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
              <p>
                Analytics cookies monitor how users reached the Site, and how they interact with and move around once on the Site. These cookies let us know what features on the Site are working the best and what features on the Site can be improved.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900">Essential Cookies</h3>
              <p>
                Essential cookies are necessary for the Site to function properly. They enable you to move around the Site and use its features. Without these cookies, certain services, like accessing secure areas of the Site, cannot be provided.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Control of Cookies</h2>
          <p>
            Most browsers are set to accept cookies by default. You can remove or reject cookies in your browser’s settings. Please be aware that such action could affect the availability and functionality of the Site.
          </p>
          <p>
            For more information on how to control cookies, check your browser or device’s settings for how you can control or reject cookies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Cookie Policy, please contact us at: <a href="mailto:privacy@chasma-ir.com" className="text-blue-600 hover:underline">privacy@chasma-ir.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Sitemap() {
  const links = [
    { name: 'Home', to: '/' },
    { name: 'Categories', to: '/categories' },
    { name: 'Writers', to: '/writers' },
    { name: 'Podcasts', to: '/podcasts' },
    { name: 'Search', to: '/search' },
    { name: 'About', to: '/about' },
    { name: 'Careers', to: '/careers' },
    { name: 'Contact', to: '/contact' },
    { name: 'Press', to: '/press' },
    { name: 'Help', to: '/help' },
    { name: 'Privacy', to: '/privacy' },
    { name: 'Terms', to: '/terms' },
    { name: 'Cookies', to: '/cookies' },
  ]
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Sitemap</h1>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-[#1e3a5f] hover:underline">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Signup() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Signup</h1>
        <p className="text-gray-600 max-w-2xl">
          To create an account, use the Sign In button in the navbar. This page is a placeholder
          and can be replaced with a dedicated signup flow later.
        </p>
      </div>
    </div>
  )
}
