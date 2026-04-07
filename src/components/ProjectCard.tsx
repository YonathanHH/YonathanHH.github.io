import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../data/projects';
import { motion } from 'motion/react';

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col h-full bg-white dark:bg-[#22211e] rounded-xl overflow-hidden border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            {project.category}
          </span>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]">
          {project.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
