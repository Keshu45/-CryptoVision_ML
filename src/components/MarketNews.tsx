import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  body: string;
  published_on: number;
  imageurl: string;
}

export function MarketNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/market-news');
        const data = await response.json();
        
        if (data.success) {
          setNews(data.data);
        } else {
          setError(data.error || 'Failed to fetch news');
        }
      } catch (err) {
        setError('Error fetching market news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Optional: Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-zinc-500">
        <span className="text-sm font-mono tracking-widest uppercase animate-pulse">Loading intel feed...</span>
      </div>
    );
  }

  if (error || news.length === 0) {
    return null; // Fail silently to not clutter the dashboard
  }

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
        <Newspaper className="w-4 h-4 text-zinc-500" />
        Market Intelligence Feed
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 overflow-hidden hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] relative"
          >
            {item.imageurl && (
              <div className="h-32 w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                <img 
                  src={item.imageurl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 dark:opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-500 font-semibold">{item.source}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  {formatDistanceToNow(item.published_on * 1000, { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-sm text-zinc-900 dark:text-zinc-200 font-medium leading-relaxed group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-3 mb-2 flex-1">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {item.body}
              </p>
              
              <div className="mt-4 flex items-center gap-1 text-xs font-mono text-zinc-400 dark:text-zinc-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">
                READ REPORT <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
