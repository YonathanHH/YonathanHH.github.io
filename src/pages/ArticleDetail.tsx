import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { articles } from '../data/articles';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Markdown from 'react-markdown';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/articles"
          className="inline-flex items-center text-[var(--color-primary)] font-medium hover:underline mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Articles
        </Link>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {article.date}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {article.readTime}
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 shadow-md">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#22211e] rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm border border-[var(--color-primary)]/10">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[var(--color-primary)] prose-a:text-[var(--color-primary)]">
            <Markdown>{article.content}</Markdown>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
