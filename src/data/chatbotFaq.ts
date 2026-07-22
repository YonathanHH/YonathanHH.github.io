export type ChatbotFaqItem = {
  id: string;
  keywords: string[];
  answer: string;
  route?: string;
  routeLabel?: string;
};

export const chatbotFaq: ChatbotFaqItem[] = [
  {
    id: 'about',
    keywords: ['who are you', 'about', 'background', 'introduce', 'yonathan'],
    answer:
      "Yonathan Hary Hutagalung is a data scientist and geothermal energy researcher focused on end-to-end data science, sustainable energy, machine learning, and analytics.",
    route: '/biography',
    routeLabel: 'Open biography',
  },
  {
    id: 'education',
    keywords: ['education', 'study', 'master', 'msc', 'university', 'degree'],
    answer:
      'Yonathan has a sustainable energy science master’s background and combines it with geoscience, analytics, and machine learning work.',
    route: '/cv',
    routeLabel: 'View CV',
  },
  {
    id: 'projects',
    keywords: ['projects', 'portfolio', 'work', 'build', 'case study'],
    answer:
      'The portfolio includes machine learning, sustainability, geothermal, and forecasting projects with a mix of analysis, modeling, and deployment work.',
    route: '/projects',
    routeLabel: 'Browse projects',
  },
  {
    id: 'energy',
    keywords: ['energy', 'geothermal', 'sustainability', 'renewable', 'oil well'],
    answer:
      'Yonathan’s portfolio includes geothermal and broader energy analytics work, including sustainability-focused and energy-system projects.',
    route: '/projects',
    routeLabel: 'See energy projects',
  },
  {
    id: 'ml',
    keywords: ['machine learning', 'ml', 'deep learning', 'model', 'ai'],
    answer:
      'Yonathan works on practical machine learning projects spanning forecasting, classification, computer vision, and analytics use cases.',
    route: '/projects',
    routeLabel: 'See ML projects',
  },
  {
    id: 'timeseries',
    keywords: ['time series', 'forecasting', 'lstm', 'stock', 'idx'],
    answer:
      'Time-series forecasting is one of Yonathan’s stronger themes, including financial forecasting work such as LSTM-based IDX projects.',
    route: '/projects',
    routeLabel: 'Open forecasting projects',
  },
  {
    id: 'skills',
    keywords: ['skills', 'tools', 'stack', 'technology', 'python', 'sql', 'streamlit'],
    answer:
      'Key skills include Python, SQL, machine learning, deep learning, analytics, deployment-oriented workflows, and energy-domain problem solving.',
    route: '/',
    routeLabel: 'Back to home',
  },
  {
    id: 'articles',
    keywords: ['articles', 'blog', 'writing', 'medium', 'posts'],
    answer:
      'Yonathan also writes articles and technical content that complement the portfolio projects.',
    route: '/articles',
    routeLabel: 'Read articles',
  },
  {
    id: 'cv',
    keywords: ['cv', 'resume', 'experience', 'work history'],
    answer:
      'You can view Yonathan’s CV for a structured summary of experience, education, and technical background.',
    route: '/cv',
    routeLabel: 'Open CV',
  },
  {
    id: 'contact',
    keywords: ['contact', 'linkedin', 'hire', 'reach', 'connect'],
    answer:
      'Yonathan is open to collaboration and professional opportunities in data science, machine learning, and energy analytics.',
    route: '/biography',
    routeLabel: 'Open biography',
  },
  {
    id: 'chatbot_help',
    keywords: ['help', 'what can you do', 'what do you do', 'how to use'],
    answer:
      'I can help you explore Yonathan’s background, projects, articles, CV, skills, and contact direction. Try asking about geothermal work, machine learning projects, forecasting, or experience.',
  },
];