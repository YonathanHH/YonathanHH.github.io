export interface Project {
  id: string;
  title: string;
  category: string;
  stack: string[];
  github: string;
  description: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "PROJ-001",
    title: "Geothermal Asset Transition Tool",
    category: "ML · Energy",
    stack: ["Python", "XGBoost", "Scikit-Learn", "Pandas", "Streamlit"],
    github: "https://github.com/YonathanHH/Geothermal_OilGas_Well_Rep_Classification",
    description: "Built and deployed a classification model (XGBoost and Streamlit) to assess abandoned oil wells for renewable energy conversion, automating asset viability screening.",
    featured: true,
  },
  {
    id: "PROJ-002",
    title: "Household Energy Consumption Predictor",
    category: "ML · Energy",
    stack: ["Python", "Scikit-Learn", "Pandas", "Jupyter Notebook"],
    github: "https://github.com/YonathanHH/Household_Energy_Consumption_end_to_end_Portfolio",
    description: "Built a scikit-learn regression model trained on features including household size, temperature, AC usage, and peak-hour consumption, then deployed it as a live Streamlit web app.",
    featured: true,
  },
  {
    id: "PROJ-003",
    title: "Bank Marketing Campaign — Term Deposits Prediction",
    category: "ML · Business Intelligence",
    stack: ["Python", "XGBoost", "Scikit-Learn", "Streamlit", "Tableau"],
    github: "https://github.com/jcdspurwadhika/JCDSJKTPM-34_Alpha",
    description: "Built a complete, team-based data science solution — including EDA, BI dashboard, classification model, and deployable Streamlit application — to predict term deposit subscription probability.",
  },
  {
    id: "PROJ-004",
    title: "Python Learning Application",
    category: "Python App · Education",
    stack: ["Python", "CLI", "OOP"],
    github: "https://github.com/YonathanHH/Python_Learning_Application",
    description: "Designed and built an interactive Python learning application delivered entirely through the terminal, offering exercises, case studies, and quizzes.",
  },
  {
    id: "PROJ-005",
    title: "Electricity Mix Generator",
    category: "Python App · Energy Analytics",
    stack: ["Python", "Plotly", "Pandas"],
    github: "https://github.com/YonathanHH/Electricity_Mix_Generator",
    description: "Build a Python application that ingests, processes, and visualizes electricity generation data across different regions and energy source types.",
  },
  {
    id: "PROJ-006",
    title: "Airbnb Bangkok Listings Analysis",
    category: "Data Analysis · Market Segmentation",
    stack: ["Python", "Pandas", "Plotly", "Tableau"],
    github: "https://github.com/YonathanHH/DataAnalysis_BangkokAirBNB_Backpackers",
    description: "Analyze Bangkok Airbnb listing data to uncover market segmentation patterns, pricing dynamics, and competitive positioning opportunities.",
  },
  {
    id: "PROJ-007",
    title: "Global Powerplant Insight",
    category: "Data Analysis · Geospatial",
    stack: ["Python", "Plotly", "Jupyter Notebook", "Tableau"],
    github: "https://github.com/YonathanHH/Global_Powerplant_EDA",
    description: "Perform a comprehensive geospatial and statistical analysis of the global power plant database to visualize the state of renewable energy transitions.",
  },
  {
    id: "PROJ-008",
    title: "Hotel Booking Cancellation Prediction",
    category: "ML · Hospitality Analytics",
    stack: ["Python", "XGBoost", "Scikit-Learn", "Pandas"],
    github: "https://github.com/YonathanHH/Predicting_Hotel_Cancellations_in_Portugal",
    description: "Build a machine learning classification model to predict whether a hotel booking is likely to be cancelled, using historical booking data.",
  },
  {
    id: "PROJ-009",
    title: "Diabetes Prediction",
    category: "ML · Health Analytics",
    stack: ["Python", "Scikit-Learn", "Statsmodels", "Pandas"],
    github: "https://github.com/YonathanHH/Diabetes_Prediction_Regression_Problem",
    description: "Develop a regression-based predictive model to estimate diabetes probability using standard demographic and clinical health metrics.",
  },
  {
    id: "PROJ-010",
    title: "E-Waste Generation Modeling",
    category: "Research · Sustainability",
    stack: ["Python", "Weibull Distribution", "Scipy"],
    github: "https://github.com/YonathanHH/weibull-ewaste-modeling-indonesia",
    description: "Develop a rigorous statistical model to quantify e-waste generation from Indonesia's data center sector, segmented by operator tier.",
  },
  {
    id: "PROJ-011",
    title: "WaveThesis — Permeable Aquifers",
    category: "Research · MSc Thesis",
    stack: ["Python", "AUTOUGH2", "Leapfrog Geo"],
    github: "https://github.com/YonathanHH/WaveThesis",
    description: "Investigate the permeability structure and fluid flow behavior of permeable aquifers located at basaltic lava flow contact zones.",
  },
  {
    id: "PROJ-012",
    title: "ML-Driven Feasibility Assessment",
    category: "ML · Energy Transition",
    stack: ["Python", "XGBoost", "Scikit-Learn", "Streamlit"],
    github: "https://github.com/YonathanHH/Geothermal_OilGas_Well_Rep_Classification",
    description: "Predicts the feasibility of converting abandoned oil and gas wells into geothermal energy production assets using a machine learning classification approach.",
  },
  {
    id: "PROJ-013",
    title: "EuroSAT Land Classification",
    category: "Deep Learning · Remote Sensing",
    stack: ["Python", "HuggingFace", "ViT", "Transformers"],
    github: "https://github.com/YonathanHH/EuroSatRGB-LandClassification",
    description: "Build a multi-class land cover classifier using the EuroSAT benchmark dataset derived from Sentinel-2 satellite imagery.",
  },
  {
    id: "PROJ-014",
    title: "LSTM IDX Stocks Forecaster",
    category: "Deep Learning · Financial Analytics",
    stack: ["Python", "TensorFlow", "Keras", "LSTM", "Pandas"],
    github: "https://github.com/YonathanHH/IDX_LSTM_Forecaster",
    description: "Built and deployed an end-to-end LSTM model using KERAS on IDX/IHSG data, including a full data pipeline, resulting in a live stock forecaster.",
    featured: true,
  }
];
