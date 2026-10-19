/**
 * Indonesian answers for the portfolio assistant.
 *
 * Same shape as the English FAQ so the assistant can rank either list. These
 * carry the prose answers that would otherwise be quoted in English; project,
 * article, skill, and CV answers are composed from the structured data modules
 * instead, so counts and titles can never drift from the pages.
 */
export type ChatbotFaqIdItem = {
  id: string;
  keywords: string[];
  answer: string;
  route?: string;
  routeLabel?: string;
};

export const chatbotFaqId: ChatbotFaqIdItem[] = [
  {
    id: 'about',
    keywords: ['siapa', 'profil', 'biografi', 'latar belakang', 'perkenalkan'],
    answer:
      'Yonathan Hary Hutagalung adalah data scientist dan peneliti energi geotermal dengan latar belakang MSc Sustainable Energy Science dari Reykjavik University dan BSc Geologi. Pekerjaannya menghubungkan pemodelan reservoir geotermal, interpretasi geologi, dan analisis data.',
    route: '/biography',
    routeLabel: 'Buka biografi',
  },
  {
    id: 'education',
    keywords: ['pendidikan', 'kuliah', 'studi', 'gelar', 'universitas', 'kampus', 'sekolah', 'tesis', 'magister', 'sarjana'],
    answer:
      'Yonathan memiliki MSc Sustainable Energy Science dari Reykjavik University, Islandia, dan BSc Geologi dari University of Canterbury, Selandia Baru. Ia juga menyelesaikan program Data Analysis and Machine Learning di Purwadhika Digital Technology School.',
    route: '/cv',
    routeLabel: 'Lihat CV',
  },
  {
    id: 'experience',
    keywords: ['pengalaman', 'pekerjaan', 'kerja', 'karier', 'karir', 'magang', 'posisi', 'peran'],
    answer:
      'Pengalaman Yonathan mencakup analisis makro global, solusi AI presales, manajemen proyek relawan, dan asisten pengajar di Reykjavik University. Rincian peran dan tanggalnya ada di halaman CV.',
    route: '/cv',
    routeLabel: 'Lihat CV',
  },
  {
    id: 'projects',
    keywords: ['proyek', 'projek', 'portofolio', 'karya'],
    answer:
      'Portofolio Yonathan mencakup proyek di bidang energi, geotermal, machine learning, AI, dan analisis data. Banyak di antaranya sudah dideploy dan bisa dibuka langsung.',
    route: '/projects',
    routeLabel: 'Buka proyek',
  },
  {
    id: 'energy',
    keywords: ['energi', 'geotermal', 'geothermal', 'panas bumi', 'terbarukan', 'keberlanjutan'],
    answer:
      'Proyek energinya mencakup klasifikasi sumur minyak terbengkalai untuk konversi geotermal, prediksi konsumsi listrik rumah tangga, pemodelan limbah elektronik, dan digital twin reservoir geotermal.',
    route: '/projects',
    routeLabel: 'Buka proyek',
  },
  {
    id: 'ml',
    keywords: ['machine learning', 'pembelajaran mesin', 'kecerdasan buatan', 'deep learning', 'ai', 'ml'],
    answer:
      'Proyek machine learning-nya mencakup forecasting, klasifikasi, computer vision, dan sistem rekomendasi, dari eksplorasi data sampai deployment.',
    route: '/projects',
    routeLabel: 'Buka proyek',
  },
  {
    id: 'forecasting',
    keywords: ['forecasting', 'peramalan', 'prediksi', 'time series', 'deret waktu', 'lstm'],
    answer:
      'Forecasting time series adalah salah satu tema terkuatnya, termasuk proyek LSTM untuk saham IDX dan prediksi konsumsi energi.',
    route: '/projects',
    routeLabel: 'Buka proyek',
  },
  {
    id: 'skills',
    keywords: ['keterampilan', 'keahlian', 'kemampuan', 'skill', 'stack', 'teknologi', 'alat'],
    answer:
      'Keterampilan utamanya meliputi Python, SQL, machine learning, deep learning, analitik data, dan pemodelan reservoir geotermal.',
    route: '/',
    routeLabel: 'Lihat keterampilan',
  },
  {
    id: 'articles',
    keywords: ['artikel', 'tulisan', 'blog', 'menulis'],
    answer:
      'Yonathan juga menulis artikel teknis tentang microgrid, energi di Indonesia, dan pemodelan akuifer.',
    route: '/articles',
    routeLabel: 'Baca artikel',
  },
  {
    id: 'cv',
    keywords: ['cv', 'daftar riwayat hidup', 'riwayat hidup', 'resume'],
    answer:
      'Halaman CV berisi pengalaman kerja dan pendidikan lengkap dengan peran, tanggal, dan detailnya.',
    route: '/cv',
    routeLabel: 'Lihat CV',
  },
  {
    id: 'contact',
    keywords: ['kontak', 'hubungi', 'email', 'surel', 'linkedin', 'whatsapp', 'rekrut', 'peluang', 'lowongan'],
    answer:
      'Yonathan terbuka untuk peluang di bidang data science, machine learning, dan analitik energi. Anda bisa menghubunginya lewat email, LinkedIn, GitHub, Medium, atau WhatsApp.',
    route: '/biography',
    routeLabel: 'Buka biografi',
  },
];
