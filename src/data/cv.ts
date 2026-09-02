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
        title: 'Sustainability Reporting Analyst (Volunteer)',
        meta: 'eWasteRJ • Oct 2025 to Present',
        points: [
          'Quantified e-waste generation and economic recovery potential across the supply chain, then produced a sustainability report aligned to green-linked loan standards, directly informing circular economy policy and financing strategy.',
          'Green financing institutions required evidence-based sustainability data to structure loan frameworks.',
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
