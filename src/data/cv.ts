export interface CvEntry {
  title: string;
  meta: string;
  points: string[];
}

export interface CvSection {
  id: string;
  heading: string;
  entries: CvEntry[];
}

export const cvSections: CvSection[] = [
  {
    id: 'experience',
    heading: 'Working Experience',
    entries: [
      {
        title: 'Junior Global Macro Analyst',
        meta: 'PT Bali Sunset Capital • Jul 2026 to Present',
        points: [
          'Write the daily US Session Opening note used by the trading desk, translating overnight macro and market moves into context traders can act on.',
          'Research central bank policy and macro data releases to inform the desks investment positioning.',
		  'Publish weekly US equity outlooks combining technical and fundamental analysis for client decision-making.'
        ],
      },
	  {
        title: 'AI Presales Solutions & Technical Operations Engineer ',
        meta: 'Lingkar Solution • Aug 2026 to Sep 2026',
        points: [
          'Developed a research-backed report on Indonesia’s e-waste lifecycle, mapping value creation opportunities across the data center ecosystem and identifying a potential annual revenue opportunity of USD 4.3M.',
          'Built a financial benefit framework showing how sustainable lending structures could support eWasteRJ’s growth, including estimated annual interest savings of IDR 3.75 to 5 billion.',
		  'Defined a practical KPI roadmap for e-waste diversion, linking operational targets to long-term facility performance and environmental impact.'
        ],
      },
	  {
        title: 'Junior Project Manager (Volunteer)',
        meta: 'eWasteRJ • Oct 2025 to Present',
        points: [
          'Worked the technical side of AI presales, turning client requirements into concrete data architecture and solution proposals.',
          'Built and maintained analytics infrastructure on PostgreSQL, Docker, Kafka, Debezium, and ClickHouse for real-time data pipelines.'
        ],
      },
      {
        title: 'Teaching Assistant',
        meta: 'Reykjavik University, Iceland • August 2023 to July 2024',
        points: [
          'Led technical curriculum development for geothermal reservoir modelling course, translating complex engineering concepts into applied learning modules using industry-standard simulation software (Leapfrog).',
          'Aerial Mapping using DJI Mavic 3 Pro to capture basaltic surface for carbon dioxide reservoir well drilling.',
        ],
      },
    ],
  },
  {
    id: 'education',
    heading: 'Education',
    entries: [
      {
        title: 'Data Analysis and Machine Learning',
        meta: 'Purwadhika Digital Technology School • Sept 2025 to March 2026',
        points: [
          'Intensive 600-hour curriculum focused on applied analytics: Python (Pandas, NumPy, Scikit-Learn), SQL databases, machine learning pipelines, and business intelligence tools (Tableau)',
          'Capstone projects spanning electricity generation optimization, predictive modeling for hospitality sector, and machine learning applications for energy asset transition',
        ],
      },
      {
        title: 'MSc Sustainable Energy Science',
        meta: 'Reykjavik University, Iceland • GPA: 3.85 / 4.00 • July 2022 to June 2024',
        points: [
          'Key Consulting Projects: Conducted techno-economic study for a geothermal power plant (NZ) and rural microgrids (Ghana), covering demand forecasting, cost modelling, and stakeholder assessment.',
          'Study Exchange: Selected for EU COST Action summer study (Associated with University of Ljubljana), presented prototype on geothermal waste heat.',
          'Leadership: Session Facilitator at Iceland Geothermal Conference 2024.',
        ],
      },
      {
        title: 'BSc Geology',
        meta: 'University of Canterbury, New Zealand • October 2018 to February 2022',
        points: [
          'Focus: Geostatistics, Basin Analysis, and Structural Geology.',
          'Leadership: Secretary, UC International Student Council.',
        ],
      },
    ],
  },
];
