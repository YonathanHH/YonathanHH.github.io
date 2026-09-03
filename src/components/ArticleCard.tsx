import { motion, useReducedMotion } from 'motion/react';
import { Article } from '../data/articles';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function ArticleCard({ article, index }: { article: Article; index: number }) {
  const reduceMotion = useReducedMotion();
  const delay = reduceMotion ? 0 : Math.min(index, 6) * 0.06;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col h-full bg-white dark:bg-[#22211e] rounded-xl overflow-hidden border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-300 shadow-sm hover:shadow-md group"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={article.image}
          alt=""
          width={640}
          height={384}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {article.date}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {article.readTime}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">
          {article.summary}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            to={`/articles/${article.id}`}
            className="inline-flex items-center text-[var(--color-primary-text)] font-medium hover:underline"
          >
            Read Article<span className="sr-only">: {article.title}</span>
            <ArrowRight className="ml-1" size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
