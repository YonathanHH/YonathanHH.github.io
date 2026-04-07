import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Briefcase, GraduationCap, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        {/* Background Image with Flip */}
        <div 
          className="absolute inset-0 z-0 scale-x-[-1]"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* 50% Black Overlay */}
        <div className="absolute inset-0 z-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
              Bridging <span className="text-teal-300">Geoscience</span> and <span className="text-teal-300">Machine Learning</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
              I'm Yonathan Hary Hutagalung, a Data Scientist and Geothermal Energy Researcher delivering end-to-end data science projects from EDA through model deployment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[#015257] transition-colors"
              >
                View Projects
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-white dark:bg-[#22211e] border-y border-[var(--color-primary)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(skills).map(([category, items], idx) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--color-primary)] border-b border-[var(--color-primary)]/20 pb-2">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="mr-2 text-[var(--color-primary)]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              A selection of my most impactful work spanning energy sector ML tools, deep learning for remote sensing, and financial time series forecasting.
            </p>
          </div>
          <Link
            to="/projects"
            className="hidden md:inline-flex items-center text-[var(--color-primary)] font-medium hover:underline"
          >
            View all projects
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center text-[var(--color-primary)] font-medium hover:underline"
          >
            View all projects
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[var(--color-primary)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Connect</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              I'm currently open to new opportunities in data science, machine learning, and energy analytics. Feel free to reach out if you'd like to collaborate or just say hi!
            </p>
            <a
              href="https://www.linkedin.com/in/yonathanhary/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-[var(--color-primary)] font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Linkedin className="mr-2" size={24} />
              Connect on LinkedIn
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
