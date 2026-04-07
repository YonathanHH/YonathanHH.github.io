import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

export default function CV() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">Curriculum Vitae</h1>
        
        {/* Experience Section */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center mb-6 sm:mb-8 pb-2 border-b-2 border-[var(--color-primary)]/20">
            <Briefcase className="text-[var(--color-primary)] mr-3" size={28} />
            <h2 className="text-xl sm:text-2xl font-bold">Working Experience</h2>
          </div>
          
          <div className="space-y-8 sm:space-y-10">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30">
              <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
              <h3 className="text-lg sm:text-xl font-bold">Sustainability Reporting Analyst (Volunteer)</h3>
              <p className="text-[var(--color-primary)] font-medium mb-2 text-sm sm:text-base">eWasteRJ • Oct 2025 to Present</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Quantified e-waste generation and economic recovery potential across the supply chain, then produced a sustainability report aligned to green-linked loan standards, directly informing circular economy policy and financing strategy.</li>
                <li>Green financing institutions required evidence-based sustainability data to structure loan frameworks.</li>
              </ul>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30">
              <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
              <h3 className="text-lg sm:text-xl font-bold">Teaching Assistant</h3>
              <p className="text-[var(--color-primary)] font-medium mb-2 text-sm sm:text-base">Reykjavik University, Iceland • August 2023 to July 2024</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Led technical curriculum development for geothermal reservoir modelling course, translating complex engineering concepts into applied learning modules using industry-standard simulation software (Leapfrog).</li>
                <li>Aerial Mapping using DJI Mavic 3 Pro to capture basaltic surface for carbon dioxide reservoir well drilling.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center mb-6 sm:mb-8 pb-2 border-b-2 border-[var(--color-primary)]/20">
            <GraduationCap className="text-[var(--color-primary)] mr-3" size={28} />
            <h2 className="text-xl sm:text-2xl font-bold">Education</h2>
          </div>
          
          <div className="space-y-8 sm:space-y-10">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30">
              <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
              <h3 className="text-lg sm:text-xl font-bold">Data Analysis and Machine Learning</h3>
              <p className="text-[var(--color-primary)] font-medium mb-2 text-sm sm:text-base">Purwadhika Digital Technology School • Sept 2025 to March 2026</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Intensive 600-hour curriculum focused on applied analytics: Python (Pandas, NumPy, Scikit-Learn), SQL databases, machine learning pipelines, and business intelligence tools (Tableau)</li>
                <li>Capstone projects spanning electricity generation optimization, predictive modeling for hospitality sector, and machine learning applications for energy asset transition</li>
              </ul>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30">
              <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
              <h3 className="text-lg sm:text-xl font-bold">MSc Sustainable Energy Science</h3>
              <p className="text-[var(--color-primary)] font-medium mb-2 text-sm sm:text-base">Reykjavik University, Iceland • GPA: 3.85 / 4.00 • July 2022 to June 2024</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Key Consulting Projects: Conducted techno-economic study for a geothermal power plant (NZ) and rural microgrids (Ghana), covering demand forecasting, cost modelling, and stakeholder assessment.</li>
                <li>Study Exchange: Selected for EU COST Action summer study (Associated with University of Ljubljana), presented prototype on geothermal waste heat.</li>
                <li>Leadership: Session Facilitator at Iceland Geothermal Conference 2024.</li>
              </ul>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-primary)]/30">
              <div className="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full -left-[9px] top-1"></div>
              <h3 className="text-lg sm:text-xl font-bold">BSc Geology</h3>
              <p className="text-[var(--color-primary)] font-medium mb-2 text-sm sm:text-base">University of Canterbury, New Zealand • October 2018 to February 2022</p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Focus: Geostatistics, Basin Analysis, and Structural Geology.</li>
                <li>Leadership: Secretary, UC International Student Council.</li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
