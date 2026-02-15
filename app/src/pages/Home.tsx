import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/article/ArticleCard';
import { useBlog } from '@/context/BlogContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Writers } from './Writers';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const { articles, categories, podcasts } = useBlog();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  const featuredArticles = articles.filter(a => a.featured).slice(0, 3);
  const trendingArticles = articles.filter(a => a.trending).slice(0, 6);
  const latestArticles = articles.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2,
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
      });

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.6,
      });

      gsap.from('.hero-image', {
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Featured section
      gsap.from('.featured-card', {
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Trending section
      gsap.from('.trending-card', {
        scrollTrigger: {
          trigger: trendingRef.current,
          start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen bg-black overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(229, 166, 63, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="text-white z-10">
              <div className="hero-title">
                <span className="inline-block px-4 py-1.5 bg-[#e5a63f]/20 text-[#e5a63f] rounded-full text-sm font-medium mb-6">
                  Welcome to Chasma IR Magazine
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  Stories That{' '}
                  <span className="text-[#e5a63f]">Resonate</span>
                </h1>
              </div>
              
              <p className="hero-subtitle text-xl text-gray-400 mb-8 max-w-lg">
                Sharp analysis on diplomacy, security, and global affairs.  
                Explore informed perspectives and stories shaping our interconnected world.
              </p>
              
              <div className="hero-cta flex flex-wrap gap-4">
                <Link to="/categories">
                  <Button size="lg" className="bg-[#e5a63f] hover:bg-[#d4952f] text-white px-8">
                    Explore Stories
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/writers">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Meet Our Writers
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-cta flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-[#e5a63f]">{articles.length}</p>
                  <p className="text-sm text-gray-500">Articles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#e5a63f]">{Writers.length}</p>
                  <p className="text-sm text-gray-500">Writers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#e5a63f]">{new Intl.NumberFormat().format(15932 + Math.floor(Date.now() / 86400000) - 19740)}</p>
                  <p className="text-sm text-gray-500">Readers</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block">
              <div className="hero-image relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=1000&fit=crop"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-2xl max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#e5a63f]/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#e5a63f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Trending Now</p>
                    <p className="text-xs text-gray-500">Most read this week</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {trendingArticles[0]?.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#e5a63f] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section ref={featuredRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#e5a63f] font-medium text-sm uppercase tracking-wider">
                Editor's Pick
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Featured Stories
              </h2>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-2 text-[#e5a63f] hover:underline">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`featured-card ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <ArticleCard article={article} variant={index === 0 ? 'featured' : 'default'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#e5a63f] font-medium text-sm uppercase tracking-wider">
              Browse by Topic
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Explore Categories
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      {category.articleCount} articles
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section ref={trendingRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#e5a63f] font-medium text-sm uppercase tracking-wider">
                What's Hot
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Trending Now
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article) => (
              <div key={article.id} className="trending-card">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[#e5a63f] font-medium text-sm uppercase tracking-wider">
                    Fresh Content
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    Latest Stories
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {latestArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button variant="outline" size="lg" className="border-gray-300">
                  Load More Stories
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* About Widget */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">About Lumina</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We're a community of writers, thinkers, and creators sharing 
                  stories that matter. Join us on a journey of discovery.
                </p>
                <Link to="/about">
                  <Button variant="link" className="text-[#e5a63f] p-0">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="font-bold text-lg mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Design', 'Technology', 'AI', 'Lifestyle', 'Culture', 'Minimalism', 'Wellness', 'Future'].map((tag) => (
                    <Link
                      key={tag}
                      to={`/tag/${tag.toLowerCase()}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#e5a63f] hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Podcasts */}
              <div>
                <h3 className="font-bold text-lg mb-4">Latest Podcasts</h3>
                <div className="space-y-4">
                  {podcasts.slice(0, 3).map((podcast) => (
                    <Link
                      key={podcast.id}
                      to={`/podcast/${podcast.id}`}
                      className="flex gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={podcast.coverImage}
                          alt={podcast.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[#e5a63f] transition-colors">
                          {podcast.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{podcast.duration}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #e5a63f 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our community of writers and reach thousands of readers 
            who are eager to hear your perspective.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-[#e5a63f] hover:bg-[#d4952f] text-white px-8">
                Become a Writer
              </Button>
            </Link>
            <Link to="/writers">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Meet Our Writers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
