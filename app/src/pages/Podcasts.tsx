import { useState, useRef } from 'react';
import { Play, Pause, Clock, Calendar, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBlog } from '@/context/BlogContext';
import { toast } from 'sonner';

export function Podcasts() {
  const { podcasts } = useBlog();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (podcastId: string, audioUrl?: string) => {
    if (!audioUrl) {
      toast.info('Audio file not available for this episode');
      return;
    }

    if (currentlyPlaying === podcastId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentlyPlaying(podcastId);
      setIsPlaying(true);
      // Audio will auto-play when src changes
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const currentPodcast = podcasts.find(p => p.id === currentlyPlaying);

  return (
    <div className="min-h-screen pt-24 pb-32">
      {/* Hero */}
      <div className="bg-[#1e3a5f] text-white mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-white/70 font-medium text-sm uppercase tracking-wider">
                Listen & Learn
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Chasma Podcasts
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Deep conversations with IR experts, policymakers, and thought leaders. 
                Tune in for insights that shape global affairs.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-white/70" />
                  <span className="text-white/70">{podcasts.length} Episodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/70" />
                  <span className="text-white/70">New episodes weekly</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop"
                  alt="Podcast"
                  className="relative rounded-2xl w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Episodes</h2>
        
        <div className="space-y-6">
          {podcasts.map((podcast, index) => (
            <div
              key={podcast.id}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${
                currentlyPlaying === podcast.id ? 'ring-2 ring-[#1e3a5f]' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Cover Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                  <img
                    src={podcast.coverImage}
                    alt={podcast.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <button
                      onClick={() => handlePlay(podcast.id, podcast.audioUrl)}
                      className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                    >
                      {currentlyPlaying === podcast.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium">
                      EP {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(podcast.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {podcast.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {podcast.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {podcast.description}
                  </p>

                  {currentlyPlaying === podcast.id && (
                    <div className="space-y-2">
                      <Slider
                        value={[progress]}
                        onValueChange={handleSeek}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                          <Slider
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Never Miss an Episode
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to get notified when new episodes are released
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white">
              Apple Podcasts
            </Button>
            <Button variant="outline">
              Spotify
            </Button>
            <Button variant="outline">
              Google Podcasts
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Audio Player */}
      {currentPodcast?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentPodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          autoPlay
        />
      )}

      {/* Sticky Player Bar */}
      {currentPodcast && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <img
              src={currentPodcast.coverImage}
              alt={currentPodcast.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentPodcast.title}</p>
              <p className="text-sm text-gray-500">{currentPodcast.duration}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePlay(currentPodcast.id, currentPodcast.audioUrl)}
                className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
