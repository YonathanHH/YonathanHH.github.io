import { motion } from 'motion/react';

export default function Biography() {
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
              <strong>Yonathan Hary Hutagalung</strong> is a data scientist and geothermal energy researcher with an MSc in Sustainable Energy from Reykjavík University and a BSc in Geology. 
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
              He bridges two domains — rigorous geoscience and applied machine learning — delivering end-to-end data science projects from EDA through model deployment. 
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
              His work spans energy sector ML tools, deep learning for remote sensing, financial time series forecasting, and sustainability research.
            </p>
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[var(--color-primary)]/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-primary)]">Profile Summary</h3>
              <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Data analyst and ML enthusiast specializing in energy systems, sustainability, and financial data. Deployed production-ready models including an LSTM-based stock forecaster for IDX/IHSG and an end-to-end household energy consumption predictor with a live Streamlit interface, both end-to-end from data wrangling to Streamlit deployment. Across a wider project portfolio covering deep learning, predictive analytics, and BI dashboards, the consistent focus has been translating domain-specific data into decisions that are actually usable. Proficient in Python, SQL, Scikit-Learn, KERAS, and Tableau, with a GitHub portfolio to back it all up.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
