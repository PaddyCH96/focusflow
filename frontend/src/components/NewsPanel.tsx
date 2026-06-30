"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Newspaper, ExternalLink, RefreshCw, Loader2 } from "lucide-react"

type NewsItem = {
  id: number
  title: string
  url: string
  time: number
  by: string
}

export default function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    setError(false)
    try {
      // Using HackerNews public API (Top Stories)
      const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      const dynamicIds = await res.json()
      
      // Fetch only first 4 stories for high-denstiy reading
      const storyPromises = dynamicIds.slice(0, 4).map((id: number) => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
      )
      
      const stories = await Promise.all(storyPromises)
      setNews(stories)
    } catch (err) {
      console.error("News fetch failed:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="projection-card ethopic-glass rounded-3xl p-6 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 text-primary">
          <Newspaper size={18} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Quick Read</h2>
        </div>
        <button 
          onClick={fetchNews} 
          disabled={loading}
          className="p-1.5 rounded-full hover:bg-surface-hover text-text-muted transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        </button>
      </div>

      <div className="space-y-4">
        {loading && news.length === 0 ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="py-4 text-xs text-rose-500 font-medium text-center">
            Could not retrieve latest feeds.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {news.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-3 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border-line transition-all cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              >
                <div className="flex justify-between items-start space-x-2">
                  <h3 className="text-xs font-semibold text-text-main line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <ExternalLink size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
                <div className="mt-2 flex items-center text-[10px] text-text-muted space-x-2">
                  <span>by {item.by}</span>
                  <span>•</span>
                  <span>{new Date(item.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border-line">
        <p className="text-[10px] text-text-muted italic text-center">
          &ldquo;Vidya Dadati Vinayam&rdquo; — Knowledge gives humility.
        </p>
      </div>
    </div>
  )
}
