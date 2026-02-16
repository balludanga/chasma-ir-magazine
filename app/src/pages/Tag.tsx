import { useParams } from 'react-router-dom'
import { useBlog } from '@/context/BlogContext'
import { ArticleCard } from '@/components/article/ArticleCard'

export function Tag() {
  const { tag } = useParams<{ tag: string }>()
  const { articles } = useBlog()

  const tagName = (tag || '').toLowerCase()
  const taggedArticles = articles.filter((a) =>
    a.tags?.some((t) => t.toLowerCase() === tagName)
  )

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Tag: {tag}
          </h1>
          <p className="text-gray-600 mt-2">
            {taggedArticles.length} articles
          </p>
        </div>

        {taggedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {taggedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">No articles for this tag yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
