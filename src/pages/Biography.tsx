import { motion } from 'motion/react';
import { biography } from '../data/biography';

export default function Biography() {
  const [lead, ...rest] = biography.intro;

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">Biography</h1>

        <div className="bg-white dark:bg-[#22211e] rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm border border-[var(--color-primary)]/10">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg sm:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              <strong>Yonathan Hary Hutagalung</strong>
              {lead.replace('Yonathan Hary Hutagalung', '')}
            </p>

            {rest.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 mb-6"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[var(--color-primary)]/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">
                {biography.profileSummaryHeading}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {biography.profileSummary}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
