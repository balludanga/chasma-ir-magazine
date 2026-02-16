import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Chasma IR Magazine</h1>
        <p className="text-gray-600 max-w-2xl">
          Chasma IR Magazine publishes expert analysis on International Relations, Foreign Policy,
          and Global Affairs. This is a placeholder page. Content will be added soon.
        </p>
      </div>
    </div>
  )
}

export function Careers() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers</h1>
        <p className="text-gray-600 max-w-2xl">
          We’re building a community of writers and analysts. This is a placeholder page. Openings
          and application details will be added soon.
        </p>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
        <p className="text-gray-600 max-w-2xl">
          Reach us for partnerships, contributions, and feedback. This is a placeholder page.
        </p>
      </div>
    </div>
  )
}

export function Press() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Press</h1>
        <p className="text-gray-600 max-w-2xl">
          Media inquiries and press resources. This is a placeholder page.
        </p>
      </div>
    </div>
  )
}

export function Help() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-gray-600 max-w-2xl">
          FAQs and support resources. This is a placeholder page.
        </p>
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 max-w-2xl">
          Your privacy matters. This placeholder page will be replaced with the detailed policy.
        </p>
      </div>
    </div>
  )
}

export function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 max-w-2xl">
          Usage terms and conditions. This is a placeholder page.
        </p>
      </div>
    </div>
  )
}

export function Cookies() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-gray-600 max-w-2xl">
          How we use cookies. This is a placeholder page.
        </p>
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
