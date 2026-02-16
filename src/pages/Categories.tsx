import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useBlog } from '@/context/BlogContext';
import { ArticleCard } from '@/components/article/ArticleCard';

export function Categories() {
  const { slug } = useParams<{ slug?: string }>();
  const { categories, getArticlesByCategory, articles } = useBlog();

  if (slug) {
    const categoryArticles = getArticlesByCategory(slug);
    const category = categories.find(c => c.slug === slug);

    return (
      <div className="min-h-screen pt-24 pb-12">
        {/* Category Header */}
        <div className="relative h-80 mb-12">
          <img
            src={category?.image}
            alt={category?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Link 
              to="/categories"
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              ← All Categories
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">
              {category?.name}
            </h1>
            <p className="text-white/80 text-lg mt-2 max-w-2xl">
              {category?.description}
            </p>
            <p className="text-white/60 text-sm mt-4">
              {categoryArticles.length} articles
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600">Articles in this category will appear here</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories organized by topics that matter to you
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative h-96 rounded-2xl overflow-hidden"
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

        {/* All Articles */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 9).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
