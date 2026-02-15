import { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBlog } from '@/context/BlogContext';
import { ArticleCard } from '@/components/article/ArticleCard';

export function Search() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { articles, categories } = useBlog();

  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filter by search query
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      result = result.filter(
        article =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.author.name.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(article => article.category === selectedCategory);
    }

    return result;
  }, [query, selectedCategory, articles]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Articles
          </h1>
          <p className="text-gray-600">
            Find stories, topics, and writers that interest you
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles, topics, writers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-lg rounded-xl border-gray-200 focus:ring-[#e5a63f] focus:border-[#e5a63f]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-[#e5a63f] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-[#e5a63f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {query || selectedCategory ? (
                <>
                  {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
                  {query && <span> for &quot;{query}&quot;</span>}
                  {selectedCategory && <span> in {selectedCategory}</span>}
                </>
              ) : (
                'All Articles'
              )}
            </h2>
            {(query || selectedCategory) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you&apos;re looking for
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
