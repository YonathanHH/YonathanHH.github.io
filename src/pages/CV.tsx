import { motion } from 'motion/react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { cvSections } from '../data/cv';

const sectionIcons: Record<string, typeof Briefcase> = {
  experience: Briefcase,
  education: GraduationCap,
};

export default function CV() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">Curriculum Vitae</h1>

        {cvSections.map((section) => {
          const Icon = sectionIcons[section.id] ?? Briefcase;

          return (
            <section key={section.id} className="mb-12 sm:mb-16">
              <div className="flex items-center mb-6 sm:mb-8 pb-2 border-b-2 border-[var(--color-primary)]/20">
                <Icon className="text-[var(--color-primary-text)] mr-3" size={28} />
                <h2 className="text-xl sm:text-2xl font-bold">{section.heading}</h2>
              </div>

              <div className="space-y-8 sm:space-y-10">
                {section.entries.map((entry) => (
                  <div
                    key={entry.title}
                    className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30"
                  >
                    <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
                    <h3 className="text-lg sm:text-xl font-bold">{entry.title}</h3>
                    <p className="text-[var(--color-primary-text)] font-medium mb-2 text-sm sm:text-base">{entry.meta}</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {entry.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </motion.div>
    </div>
  );
}
