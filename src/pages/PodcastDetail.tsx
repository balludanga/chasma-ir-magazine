import { useParams, Link } from 'react-router-dom'
import { useBlog } from '@/context/BlogContext'
import { Calendar, Clock } from 'lucide-react'

export function PodcastDetail() {
  const { id } = useParams<{ id: string }>()
  const { podcasts } = useBlog()

  const podcast = podcasts.find((p) => p.id === id)

  if (!podcast) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Podcast not found</p>
          <Link to="/podcasts" className="text-[#1e3a5f] hover:underline">
            Back to Podcasts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{podcast.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(podcast.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {podcast.duration}
            </span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mb-6">
          <img
            src={podcast.coverImage}
            alt={podcast.title}
            className="w-full h-72 object-cover"
          />
        </div>

        <p className="text-gray-700 mb-6">{podcast.description}</p>

        {podcast.audioUrl ? (
          <audio controls className="w-full">
            <source src={podcast.audioUrl} />
          </audio>
        ) : (
          <p className="text-gray-600">Audio file not available for this episode.</p>
        )}

        <div className="mt-8">
          <Link to="/podcasts" className="text-[#1e3a5f] hover:underline">
            ← Back to Podcasts
          </Link>
        </div>
      </div>
    </div>
  )
}
