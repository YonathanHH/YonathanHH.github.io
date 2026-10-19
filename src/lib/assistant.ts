/**
 * The portfolio assistant. Everything it does happens in the visitor's
 * browser: no API key, no proxy, no request leaves the page.
 *
 * It works in two stages, the way a person answering from a folder of notes
 * would. First it *finds* the relevant material - BM25 over the site's own
 * data modules, with a small synonym layer so "energy work" reaches the
 * geothermal projects and "where did he study" reaches the CV. Then it
 * *composes* a short answer from what it found: structured lists when the
 * question asks for a list, otherwise the sentences of the best-matching
 * entry that actually carry the query's terms.
 *
 * It never writes prose of its own about Yonathan. Every claim in an answer
 * is a sentence that exists in src/data.
 */
import { articles, type Article } from '../data/articles';
import { biography } from '../data/biography';
import { chatbotFaq } from '../data/chatbotFaq';
import { chatbotFaqId } from '../data/chatbotFaqId';
import { cvSections } from '../data/cv';
import { profile } from '../data/profile';
import { projects, type Project } from '../data/projects';
import { skills } from '../data/skills';
import { getDocs, type Doc, type DocKind } from './knowledge';

export type AssistantReply = {
  /** Markdown - the chat panel renders it. */
  text: string;
  route?: string;
  routeLabel?: string;
};

/** Synonym hits count for less than the visitor's own words. */
const SYNONYM_WEIGHT = 0.45;

/** Share of the question's meaningful terms the best match must cover before
 *  the answer is worth showing. Below it, saying "I don't know" is better. */
const CONFIDENCE_FLOOR = 0.34;

const BM25_K1 = 1.5;
const BM25_B = 0.75;

const MAX_LIST_ITEMS = 4;
const MAX_ANSWER_CHARS = 560;

const FALLBACK_TEXT =
  'I only know what is on this site: Yonathan’s background, projects, articles, skills, and CV. Try asking about geothermal work, machine learning projects, forecasting, education, or how to get in touch.';

/**
 * Words carrying no topic. Dropping them is not just tidiness: a word the
 * corpus has never seen scores the *highest* possible IDF, so leaving
 * "related" in "any projects related with financial" buries the one word that
 * mattered and the question misses everything.
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'to', 'in', 'for', 'is', 'are', 'was', 'were',
  'he', 'his', 'him', 'she', 'her', 'they', 'them', 'what', 'who', 'how', 'why',
  'when', 'where', 'does', 'did', 'do', 'has', 'have', 'had', 'on', 'with',
  'about', 'me', 'tell', 'you', 'your', 'i', 'it', 'that', 'this', 'these',
  'can', 'could', 'would', 'show', 'any', 'some', 'there', 'from', 'at', 'by',
  'be', 'been', 'as', 'or', 'if', 'so', 'give', 'know', 'anything', 'more',
  'much', 'many', 'please', 'here', 'like', 'want', 'us', 'we',
  // Relational filler - the connective tissue of a question, never its subject.
  'related', 'relating', 'relate', 'regarding', 'concerning', 'involving',
  'involve', 'involved', 'using', 'use', 'used', 'kind', 'type', 'sort',
  'similar', 'area', 'areas', 'field', 'topic', 'topics', 'thing', 'things',
  'stuff', 'other', 'another', 'also', 'get', 'got', 'see', 'look', 'looking',
  'find', 'need', 'something', 'anyone', 'include', 'including', 'maybe',
  'good', 'best', 'great', 'nice', 'well', 'made', 'make',
]);

/**
 * The same job for Indonesian questions. Kept in its own set rather than
 * merged, so the English list stays readable. Nothing here is a topic word:
 * "proyek" is not stopped, it is translated before tokenising, and a word
 * that survives without a translation is left alone so an Indonesian
 * question about something absent still reads as a miss instead of a match.
 */
const ID_STOP_WORDS = new Set([
  'ada', 'adakah', 'aja', 'aku', 'anda', 'apa', 'apakah', 'atau', 'bagaimana',
  'bagaimanakah', 'banget', 'banyak', 'beberapa', 'begitu', 'beliau', 'belum',
  'bantu', 'bantuan', 'beri', 'berikan', 'bisa', 'bisakah', 'boleh', 'buka',
  'bukan', 'butuh', 'cari', 'carikan', 'cerita', 'ceritakan', 'coba', 'contoh',
  'dalam', 'dapat',
  'dapatkah', 'dari', 'daripada', 'deh', 'dengan', 'di', 'dia', 'dimana',
  'dirinya', 'dong', 'gimana', 'halo', 'hai', 'hanya', 'harus', 'ia', 'ialah',
  'info', 'informasi', 'ingin', 'ini', 'itu', 'jelaskan', 'juga', 'kah',
  'kalian', 'kami', 'kamu',
  'kapan', 'kasih', 'ke', 'kenapa', 'kepada', 'kita', 'kok', 'lagi', 'lah',
  'lihat', 'makasih', 'malam', 'mana', 'mau', 'membuat', 'mempunyai',
  'mengapa', 'mengenai', 'mereka', 'merupakan', 'milik', 'miliknya',
  'minta', 'misalnya', 'mohon', 'nih', 'nya', 'oke', 'pada', 'padanya', 'pagi',
  'paling', 'pernah', 'perkenalkan', 'pun', 'punya', 'saja', 'sangat', 'saya',
  'sebagai', 'secara', 'sedang', 'sebutkan', 'sehingga', 'selamat', 'seperti',
  'setiap', 'siang', 'siapa', 'siapakah', 'sih', 'soal', 'sore', 'sudah',
  'supaya', 'tahu', 'tampilkan', 'tau', 'telah', 'tentang', 'tentangnya',
  'terhadap', 'terima', 'terkait', 'tersedia', 'tersebut', 'tidak',
  'tunjukkan', 'tolong', 'tuh', 'untuk', 'ya', 'yaitu', 'yakni', 'yang',
  'berapa', 'akan', 'bagi', 'bagian', 'berbasis', 'bidang', 'cara', 'dulu',
  'jenis', 'jumlah', 'khusus', 'lama', 'macam', 'masih', 'oleh', 'orang',
  'perihal', 'pertama', 'sektor', 'seputar', 'seluruh', 'semua', 'sering',
  'sekitar', 'sesuatu', 'tanya', 'bertanya', 'tanpa', 'tema', 'tempat', 'terbaru',
  'topik', 'ringkas', 'ringkasan', 'rangkum', 'rangkuman',
  'total', 'utama', 'versi', 'waktu',
]);

/**
 * Terms that mean the same thing to a visitor but not to a string match.
 * Each group expands in every direction, at a reduced weight - this is what
 * stands in for the embedding model, and for a corpus this size it is enough.
 */
const SYNONYM_GROUPS: string[][] = [
  ['ai', 'ml', 'machine', 'learning', 'model', 'modelling', 'modeling', 'algorithm', 'neural', 'deep'],
  ['energy', 'geothermal', 'renewable', 'power', 'electricity', 'sustainable', 'sustainability'],
  ['forecast', 'forecasting', 'prediction', 'predictive', 'timeseries', 'lstm', 'stock', 'trend'],
  ['education', 'study', 'studied', 'degree', 'university', 'college', 'school', 'master', 'masters', 'msc', 'bachelor', 'bsc', 'graduate', 'thesis'],
  ['experience', 'job', 'career', 'role', 'position', 'employer', 'employment', 'intern', 'internship', 'worked'],
  ['cv', 'resume', 'curriculum'],
  ['article', 'blog', 'post', 'write', 'writing', 'wrote', 'medium', 'story'],
  ['skill', 'tool', 'stack', 'technology', 'tech', 'software', 'proficiency'],
  ['contact', 'email', 'linkedin', 'hire', 'reach', 'connect', 'whatsapp', 'recruiter'],
  ['project', 'portfolio', 'built', 'build', 'app', 'application', 'repo', 'github'],
  ['geology', 'geoscience', 'geological', 'basin', 'structural', 'reservoir'],
  ['data', 'analytics', 'analysis', 'analyst', 'science', 'scientist'],
  ['vision', 'computer', 'image', 'imagery', 'satellite', 'remote', 'sensing', 'cnn'],
  ['financial', 'finance', 'financing', 'money', 'stock', 'trading', 'trade',
   'investment', 'market', 'bank', 'banking', 'deposit', 'economics', 'fintech',
   'price', 'pricing', 'quantitative', 'backtest'],
  ['nlp', 'sentiment', 'text', 'language', 'linguistic', 'comment', 'opinion'],
  ['recommendation', 'recommender', 'recommend', 'collaborative', 'filtering',
   'movielens', 'netflix', 'anime', 'personalization'],
  ['chatbot', 'chat', 'rag', 'llm', 'assistant', 'retrieval', 'agent', 'bot', 'gemini'],
  ['dashboard', 'tableau', 'powerbi', 'visualization', 'visualisation', 'report',
   'reporting', 'looker', 'bi'],
  ['geospatial', 'gis', 'qgis', 'arcgis', 'mapping', 'spatial', 'geographic'],
  ['churn', 'customer', 'crm', 'retention', 'segmentation', 'behavior', 'behaviour'],
  ['classification', 'classify', 'regression', 'clustering', 'supervised'],
  ['automation', 'automate', 'workflow', 'n8n', 'slack', 'scheduling'],
  ['esg', 'green', 'circular', 'waste', 'decarbonization', 'emission', 'environmental'],
  ['deployment', 'deploy', 'streamlit', 'production', 'pipeline'],
];

/**
 * Words that describe the *shape* of a question rather than its subject.
 * "What geothermal projects has he built?" is about geothermal; ranking on
 * "projects" and "built" as well would pull in every project ever described
 * as built. They are dropped before ranking, never before intent matching.
 */
const INTENT_WORDS = [
  'project', 'projects', 'portfolio', 'repo', 'repos', 'repository', 'build', 'built',
  'app', 'application', 'article', 'articles', 'blog', 'post', 'posts', 'write',
  'writing', 'wrote', 'written', 'medium', 'skill', 'skills', 'tool', 'tools',
  'stack', 'cv', 'resume', 'list', 'show', 'case', 'work', 'working', 'works',
];

/** Naming Yonathan is not a topic - every document on this site is about him. */
const PERSON_WORDS = [
  'yonathan', 'hary', 'hutagalung', 'himself', 'background', 'biography', 'bio',
  'profile', 'introduce',
];

/** Plurals and tenses: "forecasting" and "forecaster" both reach "forecast". */
const INFLECTIONAL = ['ings', 'ing', 'ers', 'er', 'ed', 'es', 's'];

/**
 * Word-family endings: "finance", "financing", and "financial" all reach
 * "financ". Without this pass they are three unrelated tokens, and asking for
 * "finance projects" finds only whichever one the page happens to spell that
 * way - the exact bug this fixes.
 */
const DERIVATIONAL = [
  'ization', 'ational', 'ations', 'ation', 'ically', 'ality', 'ially', 'ical',
  'ance', 'ence', 'ment', 'ness', 'ity', 'ial', 'al', 'e',
];

/**
 * The length guard is what keeps this safe: a root shorter than four
 * characters is rejected and the next suffix tried, so "series" cannot
 * collapse to "ser" and collide with "server" and "service".
 */
function strip(word: string, suffixes: string[]): string {
  if (word.length <= 4) return word;

  for (const suffix of suffixes) {
    if (word.endsWith(suffix)) {
      const root = word.slice(0, -suffix.length);
      if (root.length >= 4) return root;
    }
  }

  return word;
}

function stem(word: string): string {
  return strip(strip(word, INFLECTIONAL), DERIVATIONAL);
}

function tokenize(text: string): string[] {
  const words: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  return words
    .filter((word) => {
      if (word.length <= 1 || STOP_WORDS.has(word) || ID_STOP_WORDS.has(word)) return false;

      // Indonesian suffixes attach to the word, so "caranya" has to be
      // recognised as the stop word "cara".
      const bare = word.replace(/(?:nya|kah|lah|pun)$/, '');
      return !(bare !== word && ID_STOP_WORDS.has(bare));
    })
    .map(stem);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Indonesian is recognised by its function words rather than by a dictionary:
 * "apa", "yang", and "dengan" do not appear in English questions, so one of
 * them is already good evidence. A short list of unmistakably Indonesian topic
 * words counts too, because a question can be all content and no grammar.
 */
const ID_MARKERS = [
  'apa', 'apakah', 'siapa', 'siapakah', 'bagaimana', 'gimana', 'kenapa',
  'mengapa', 'kapan', 'dimana', 'mana', 'berapa', 'yang', 'dengan', 'untuk',
  'dari', 'bisa', 'tidak', 'bukan', 'adalah', 'saya', 'aku', 'kamu', 'anda',
  'dia', 'sudah', 'belum', 'punya', 'ingin', 'mau', 'dong', 'sih', 'kah',
  'aja', 'saja', 'banget', 'juga', 'atau', 'tentang', 'mengenai', 'ini', 'itu',
  'ada', 'tolong', 'mohon', 'coba', 'terima', 'kasih', 'makasih', 'halo',
  'hai', 'pagi', 'siang', 'sore', 'malam', 'selamat', 'perkenalkan', 'jelaskan',
  'ceritakan', 'tampilkan',
  'tunjukkan', 'sebutkan', 'berikan', 'carikan', 'bantu', 'bantuan', 'kita',
  'kami', 'mereka', 'kerja', 'proyek', 'proyeknya', 'projek', 'portofolio',
  'karya', 'keterampilan', 'keahlian', 'kemampuan', 'pendidikan',
  'pengalaman', 'pekerjaan', 'karier', 'karir', 'magang', 'kuliah', 'gelar',
  'universitas', 'kampus', 'tesis', 'sarjana', 'hubungi', 'kontak', 'surel',
  'tersedia', 'peluang', 'lowongan', 'rekrut', 'artikel', 'tulisan',
  'menulis', 'riwayat', 'energi', 'geotermal', 'panas', 'bumi',
  'pembelajaran', 'kecerdasan', 'buatan', 'peramalan', 'prediksi',
  'rekomendasi', 'klasifikasi', 'regresi', 'keuangan', 'saham', 'dasbor',
  'visualisasi', 'keberlanjutan', 'terbarukan', 'listrik', 'konsumsi',
  'sumur', 'ilmu',
];

/** "pendidikannya" and "apakah" are the same marker as their root. */
const ID_MARKER_PATTERN = new RegExp(
  `\\b(${ID_MARKERS.join('|')})(?:nya|kah|lah|pun)?\\b`,
);

function isIndonesian(text: string): boolean {
  return ID_MARKER_PATTERN.test(normalize(text));
}

/**
 * Indonesian query terms mapped to the English words the retriever already
 * knows, so there is no second index to build or keep in sync. Only the
 * question is translated; the corpus stays English, which is why an Indonesian
 * answer cites titles, categories, and links instead of quoting prose.
 */
const ID_TO_EN: Record<string, string> = {
  // Phrases first: longest wins, so "pembelajaran mesin" becomes one term
  // rather than "learning" and "machine" competing on their own.
  'daftar riwayat hidup': 'cv',
  'riwayat hidup': 'cv',
  'pembelajaran mesin': 'machine learning',
  'pembelajaran mendalam': 'deep learning',
  'kecerdasan buatan': 'artificial intelligence',
  'kecerdasan artifisial': 'artificial intelligence',
  'model bahasa besar': 'large language model',
  'model bahasa': 'language model',
  'pengolahan bahasa alami': 'natural language processing',
  'penglihatan komputer': 'computer vision',
  'penginderaan jauh': 'remote sensing',
  'deret waktu': 'time series',
  'ilmu data': 'data science',
  'ilmuwan data': 'data scientist',
  'analisis data': 'data analysis',
  'rekayasa data': 'data engineering',
  'sistem rekomendasi': 'recommendation system',
  'jaringan saraf': 'neural network',
  'energi terbarukan': 'renewable energy',
  'panas bumi': 'geothermal',
  'limbah elektronik': 'e waste',
  'perubahan iklim': 'climate change',
  'pasar saham': 'stock market',
  'rumah tangga': 'household',
  'bahan bakar': 'fuel',
  'gas alam': 'natural gas',
  'minyak dan gas': 'oil and gas',
  'bawah permukaan': 'subsurface',
  'latar belakang': 'background',
  'pengalaman kerja': 'work experience',
  'basis data': 'database',
  'pangkalan data': 'database',
  'tanggung jawab': 'responsibility',
  // Single words
  proyek: 'project',
  proyeknya: 'project',
  projek: 'project',
  projeknya: 'project',
  projectnya: 'project',
  portofolio: 'portfolio',
  karya: 'project',
  karyanya: 'project',
  repo: 'repository',
  repositori: 'repository',
  energi: 'energy',
  geotermal: 'geothermal',
  terbarukan: 'renewable',
  keberlanjutan: 'sustainability',
  berkelanjutan: 'sustainable',
  listrik: 'electricity',
  konsumsi: 'consumption',
  sumur: 'well',
  geologi: 'geology',
  geosains: 'geoscience',
  batuan: 'rock',
  panas: 'heat',
  bumi: 'earth',
  uap: 'steam',
  tenaga: 'power',
  surya: 'solar',
  angin: 'wind',
  baterai: 'battery',
  karbon: 'carbon',
  emisi: 'emission',
  limbah: 'waste',
  efisiensi: 'efficiency',
  prediksi: 'prediction',
  peramalan: 'forecasting',
  klasifikasi: 'classification',
  regresi: 'regression',
  klasterisasi: 'clustering',
  rekomendasi: 'recommendation',
  dasbor: 'dashboard',
  visualisasi: 'visualization',
  analisis: 'analysis',
  analisa: 'analysis',
  analitik: 'analytics',
  statistik: 'statistical',
  pemodelan: 'modelling',
  simulasi: 'simulation',
  otomatisasi: 'automation',
  otomatis: 'automated',
  kecerdasan: 'intelligence',
  buatan: 'artificial',
  pembelajaran: 'learning',
  mesin: 'machine',
  mendalam: 'deep',
  saraf: 'neural',
  jaringan: 'network',
  citra: 'image',
  gambar: 'image',
  penglihatan: 'vision',
  bahasa: 'language',
  teks: 'text',
  sentimen: 'sentiment',
  asisten: 'assistant',
  agen: 'agent',
  pencarian: 'search',
  vektor: 'vector',
  pelatihan: 'training',
  penerapan: 'deployment',
  keterampilan: 'skills',
  keterampilannya: 'skills',
  keahlian: 'skills',
  keahliannya: 'skills',
  kemampuan: 'skills',
  kemampuannya: 'skills',
  skill: 'skills',
  skillnya: 'skills',
  alat: 'tools',
  perkakas: 'tools',
  teknologi: 'technology',
  pemrograman: 'programming',
  pengkodean: 'coding',
  awan: 'cloud',
  penyimpanan: 'storage',
  pendidikan: 'education',
  pendidikannya: 'education',
  kuliah: 'study',
  studi: 'study',
  belajar: 'study',
  gelar: 'degree',
  universitas: 'university',
  kampus: 'campus',
  sekolah: 'school',
  tesis: 'thesis',
  disertasi: 'thesis',
  magister: 'master',
  sarjana: 'bachelor',
  pengalaman: 'experience',
  pengalamannya: 'experience',
  pekerjaan: 'work',
  pekerjaannya: 'work',
  kerja: 'work',
  kerjanya: 'work',
  karier: 'career',
  karir: 'career',
  magang: 'internship',
  posisi: 'position',
  peran: 'role',
  jabatan: 'position',
  artikel: 'article',
  artikelnya: 'article',
  tulisan: 'writing',
  tulisannya: 'writing',
  menulis: 'writing',
  postingan: 'post',
  kontak: 'contact',
  kontaknya: 'contact',
  hubungi: 'contact',
  menghubungi: 'contact',
  surel: 'email',
  telepon: 'phone',
  peluang: 'opportunities',
  lowongan: 'hiring',
  rekrut: 'recruit',
  rekrutmen: 'recruit',
  direkrut: 'recruit',
  wawancara: 'interview',
  tentang: 'about',
  tentangnya: 'about',
  siapa: 'who',
  profil: 'profile',
  profilnya: 'profile',
  biografi: 'biography',
  biografinya: 'biography',
  dirinya: 'himself',
  keuangan: 'finance',
  keuangannya: 'finance',
  finansial: 'financial',
  saham: 'stock',
  pasar: 'market',
  investasi: 'investment',
  perdagangan: 'trading',
  ekonomi: 'economics',
  harga: 'price',
  risiko: 'risk',
  aset: 'asset',
  transisi: 'transition',
  pelanggan: 'customer',
  penjualan: 'sales',
  pemasaran: 'marketing',
  bisnis: 'business',
  industri: 'industry',
  perusahaan: 'company',
  organisasi: 'organization',
  intelijen: 'intelligence',
  penerbangan: 'aviation',
  cuaca: 'weather',
  bencana: 'disaster',
  gempa: 'earthquake',
  satelit: 'satellite',
  peta: 'map',
  pemetaan: 'mapping',
  geospasial: 'geospatial',
  wilayah: 'region',
  lahan: 'land',
  tanah: 'soil',
  pertanian: 'agriculture',
  hutan: 'forest',
  akuifer: 'aquifer',
  permeabel: 'permeable',
  nuklir: 'nuclear',
  hidrogen: 'hydrogen',
  daftar: 'list',
  // Verbs, mapped to the English forms the retriever already understands
  dibuat: 'built',
  buat: 'build',
  dideploy: 'deployed',
  mendeploy: 'deployed',
  dikerjakan: 'work',
  mengerjakan: 'work',
  dikembangkan: 'developed',
  mengembangkan: 'developed',
  melakukan: 'do',
  mendapatkan: 'get',
  memberikan: 'give',
  menunjukkan: 'show',
  mencari: 'find',
  melihat: 'see',
  menggunakan: 'using',
  digunakan: 'used',
  dipakai: 'used',
  memakai: 'using',
};

const ID_PHRASES = Object.entries(ID_TO_EN).sort(
  (a, b) => b[0].split(' ').length - a[0].split(' ').length || b[0].length - a[0].length,
);

function translateToEnglish(text: string): string {
  let output = ` ${normalize(text)} `;

  for (const [indonesian, english] of ID_PHRASES) {
    output = output.replace(new RegExp(`\\b${indonesian}\\b`, 'g'), ` ${english} `);
  }

  return output.replace(/\s+/g, ' ').trim();
}

const INTENT_TERMS = new Set(INTENT_WORDS.map(stem));
const PERSON_TERMS = new Set(PERSON_WORDS.map(stem));

const SYNONYMS = (() => {
  const map = new Map<string, Set<string>>();

  for (const group of SYNONYM_GROUPS) {
    const stems = new Set(group.map(stem));

    for (const term of stems) {
      const related = map.get(term) ?? new Set<string>();
      for (const other of stems) if (other !== term) related.add(other);
      map.set(term, related);
    }
  }

  return map;
})();

type QueryTerm = { term: string; weight: number };

function expand(tokens: string[]): QueryTerm[] {
  const weights = new Map<string, number>();

  for (const token of tokens) weights.set(token, 1);

  for (const token of tokens) {
    for (const related of SYNONYMS.get(token) ?? []) {
      if (!weights.has(related)) weights.set(related, SYNONYM_WEIGHT);
    }
  }

  return [...weights].map(([term, weight]) => ({ term, weight }));
}

type SearchIndex = {
  docs: Doc[];
  frequencies: Map<string, number>[];
  lengths: number[];
  documentFrequency: Map<string, number>;
  averageLength: number;
};

let searchIndex: SearchIndex | null = null;

function getIndex(): SearchIndex {
  if (searchIndex) return searchIndex;

  const docs = getDocs();

  // The title counts twice: a project's name is a stronger signal than any
  // one sentence of its description.
  const tokens = docs.map((doc) => [
    ...tokenize(doc.title),
    ...tokenize(doc.title),
    ...tokenize(doc.tags.join(' ')),
    ...tokenize(doc.body),
  ]);

  const frequencies = tokens.map((docTokens) => {
    const counts = new Map<string, number>();
    for (const token of docTokens) counts.set(token, (counts.get(token) ?? 0) + 1);
    return counts;
  });

  const documentFrequency = new Map<string, number>();
  for (const docTokens of tokens) {
    for (const token of new Set(docTokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const lengths = tokens.map((docTokens) => docTokens.length);
  const averageLength = lengths.reduce((total, length) => total + length, 0) / lengths.length;

  searchIndex = { docs, frequencies, lengths, documentFrequency, averageLength };
  return searchIndex;
}

/** Builds the index ahead of the first question, so opening the panel - not
 *  answering - pays for it. */
export function warmAssistant(): void {
  getIndex();
}

function idf(index: SearchIndex, term: string): number {
  const containing = index.documentFrequency.get(term) ?? 0;
  return Math.log(1 + (index.docs.length - containing + 0.5) / (containing + 0.5));
}

function bm25(index: SearchIndex, terms: QueryTerm[], position: number): number {
  const frequencies = index.frequencies[position];
  const length = index.lengths[position];

  let score = 0;

  for (const { term, weight } of terms) {
    const frequency = frequencies.get(term);
    if (!frequency) continue;

    const normalization = BM25_K1 * (1 - BM25_B + (BM25_B * length) / index.averageLength);
    score += weight * idf(index, term) * ((frequency * (BM25_K1 + 1)) / (frequency + normalization));
  }

  return score;
}

/**
 * How much of what the visitor actually asked this document accounts for.
 *
 * BM25 alone cannot tell "no good match" from "best of a bad lot" - it always
 * ranks something first. Coverage is the guard: a document answers the
 * question only if it contains the question's rarer terms. Synonym matches
 * count half, since they are our substitution, not the visitor's word.
 */
function relevance(
  index: SearchIndex,
  terms: QueryTerm[],
  position: number,
): { coverage: number; matched: number } {
  const asked = terms.filter((term) => term.weight === 1);
  if (!asked.length) return { coverage: 0, matched: 0 };

  const frequencies = index.frequencies[position];

  let covered = 0;
  let total = 0;
  let matched = 0;

  for (const { term } of asked) {
    const weight = idf(index, term);
    total += weight;

    if (frequencies.has(term)) {
      covered += weight;
      matched += 1;
    } else {
      const related = SYNONYMS.get(term);
      if (related && [...related].some((other) => frequencies.has(other))) covered += weight * 0.5;
    }
  }

  return { coverage: total ? covered / total : 0, matched };
}

/** `matched` counts the visitor's own words the document contains, which is
 *  the difference between "no strong match" and "nothing at all". */
type Hit = { doc: Doc; score: number; coverage: number; matched: number };

function search(terms: QueryTerm[], limit = 12): Hit[] {
  const index = getIndex();

  return index.docs
    .map((doc, position) => ({
      doc,
      score: bm25(index, terms, position),
      ...relevance(index, terms, position),
    }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Documents of one kind that answer the question about as well as the best of
 * them does. The relative cut is what keeps a list honest: for "geothermal
 * projects", entries matched only through a synonym score half as well as a
 * literal match and drop out, but for a two-word topic where nothing matches
 * both words, the half-matches are the answer and they stay.
 */
function relevantHits(hits: Hit[], kind: DocKind): Hit[] {
  const matching = hits.filter((hit) => hit.doc.kind === kind && hit.coverage >= CONFIDENCE_FLOOR);
  if (!matching.length) return [];

  const best = Math.max(...matching.map((hit) => hit.coverage));

  return matching.filter((hit) => hit.coverage >= best * 0.75);
}

/**
 * Detects a question about one thing by name - "tell me about the Geothermal
 * Asset Transition Tool" - by asking how much of the *title* the visitor
 * typed, rather than how much of the question the document matched.
 */
function namedEntity(hits: Hit[], topicTokens: string[]): Hit | null {
  if (topicTokens.length < 2) return null;

  const asked = new Set(topicTokens);

  for (const hit of hits.slice(0, 3)) {
    if (hit.doc.kind !== 'project' && hit.doc.kind !== 'article') continue;

    const titleTokens = new Set(tokenize(hit.doc.title));
    if (titleTokens.size < 2) continue;

    const overlap = [...titleTokens].filter((token) => asked.has(token)).length / titleTokens.size;
    if (overlap >= 0.6) return hit;
  }

  return null;
}

/**
 * Picks the navigation target by summing scores per route across the top
 * hits rather than trusting the single best document - one long article chunk
 * should not outvote two CV entries that agree.
 */
function pickRoute(hits: Hit[]): Pick<AssistantReply, 'route' | 'routeLabel'> {
  const considered = hits.slice(0, 4);
  if (!considered.length) return {};

  const weights = new Map<string, { label: string; weight: number }>();

  for (const hit of considered) {
    const existing = weights.get(hit.doc.route);
    weights.set(hit.doc.route, {
      label: hit.doc.routeLabel,
      weight: (existing?.weight ?? 0) + hit.score,
    });
  }

  const [route, best] = [...weights.entries()].sort((a, b) => b[1].weight - a[1].weight)[0];

  return { route, routeLabel: best.label };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'“(])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, '')}…`;
}

function firstSentence(text: string): string {
  return splitSentences(text)[0] ?? text;
}

/**
 * Extractive summary: keeps the sentences that carry the query's terms, in
 * their original order, and stops at MAX_ANSWER_CHARS. This is why answers
 * read as quotes rather than paraphrase - nothing here can invent a fact.
 */
function summarize(body: string, terms: QueryTerm[], limit: number): string {
  const index = getIndex();
  const sentences = splitSentences(body);

  if (sentences.length <= limit) return truncate(sentences.join(' '), MAX_ANSWER_CHARS);

  const scored = sentences.map((sentence, position) => {
    const tokens = new Set(tokenize(sentence));

    let score = 0;
    for (const { term, weight } of terms) {
      if (tokens.has(term)) score += weight * idf(index, term);
    }

    // A small lead bias: the opening sentence usually states the subject.
    return { sentence, position, score: score + (position === 0 ? 0.6 : 0) };
  });

  const kept = scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.sentence);

  return truncate(kept.join(' '), MAX_ANSWER_CHARS);
}

function bullets(lines: string[]): string {
  return lines.map((line) => `- ${line}`).join('\n');
}

function projectById(id?: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

function articleById(id?: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

function projectBullet(project: Project): string {
  return `**${project.title}**: ${truncate(firstSentence(project.description), 150)}`;
}

/**
 * The themes the portfolio actually covers, counted from the category field
 * rather than written down here - so this stays true as projects are added.
 */
function projectThemes(limit: number): { label: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const project of projects) {
    for (const part of project.category.split('·')) {
      const label = part.trim();
      if (label) counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

/* ---------------------------------------------------------------------- */
/* Answer composers                                                       */
/* ---------------------------------------------------------------------- */

function answerFromProject(project: Project, terms: QueryTerm[]): AssistantReply {
  return {
    text: [
      `**${project.title}** · ${project.category}`,
      summarize(project.description, terms, 2),
      `Stack: ${project.stack.join(', ')}. [Source code](${project.github})`,
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Browse projects',
  };
}

function answerFromArticle(article: Article, doc: Doc, terms: QueryTerm[]): AssistantReply {
  return {
    text: [
      `From **“${article.title}”** (${article.date}):`,
      summarize(doc.body, terms, 3),
    ].join('\n\n'),
    route: `/articles/${article.id}`,
    routeLabel: 'Read the article',
  };
}

function listProjects(terms: QueryTerm[], hits: Hit[], hasTopic: boolean): AssistantReply {
  const strong = relevantHits(hits, 'project');

  // Failing the confidence floor is not the same as matching nothing: a
  // document that contains the visitor's word is still worth naming, as long
  // as the answer says it is a near miss rather than a fit.
  const partial = hits.filter((hit) => hit.doc.kind === 'project' && hit.matched > 0);
  const ranked = strong.length ? strong : partial;

  const matches = ranked
    .slice(0, MAX_LIST_ITEMS)
    .map((hit) => projectById(hit.doc.refId))
    .filter((project): project is Project => Boolean(project));

  // One clearly-named project deserves its own answer, not a list of one.
  if (strong.length && matches.length === 1) return answerFromProject(matches[0], terms);

  if (matches.length) {
    return {
      text: [
        strong.length
          ? `${matches.length} of Yonathan’s ${projects.length} projects fit that best:`
          : `Nothing matches that exactly, but these come closest:`,
        bullets(matches.map(projectBullet)),
      ].join('\n\n'),
      route: '/projects',
      routeLabel: 'Browse projects',
    };
  }

  // Asked about a topic that is genuinely not here. Say so, and say what is.
  if (hasTopic) {
    return {
      text: [
        `I don’t see a project on that. The ${projects.length} projects here cluster around:`,
        bullets(
          projectThemes(6).map(
            ({ label, count }) => `**${label}**: ${count} project${count === 1 ? '' : 's'}`,
          ),
        ),
      ].join('\n\n'),
      route: '/projects',
      routeLabel: 'Browse projects',
    };
  }

  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const themes = projectThemes(3).map((theme) => theme.label.toLowerCase());

  return {
    text: [
      `Yonathan has ${projects.length} projects in the portfolio, mostly ${themes.join(', ')}. Three he features:`,
      bullets(featured.map(projectBullet)),
      'Ask about a theme, for example geothermal, forecasting, financial analytics, or recommenders.',
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Browse projects',
  };
}

function listArticles(terms: QueryTerm[], hits: Hit[]): AssistantReply {
  // Asking what he wrote *about* something is a question about the piece, not
  // a request for the reading list.
  const [best] = relevantHits(hits, 'article');

  if (best) {
    const article = articleById(best.doc.refId);
    if (article) return answerFromArticle(article, best.doc, terms);
  }

  return {
    text: [
      `Yonathan has written ${articles.length} articles on this site:`,
      bullets(
        articles.map(
          (article) => `**${article.title.trim()}**: ${truncate(article.summary, 140)} (${article.readTime})`,
        ),
      ),
    ].join('\n\n'),
    route: '/articles',
    routeLabel: 'Read articles',
  };
}

/**
 * The best-fitting skill entry, judged from the question's side first - "SQL"
 * is a complete question about "SQL (MySQL, BigQuery)" even though it is a
 * third of the entry. The entry's own density only breaks ties, which is what
 * stops "deep learning" from landing on "Python (…scikit-learn)".
 */
function bestSkillMatch(
  terms: QueryTerm[],
): { group: string; item: string; items: string[] } | null {
  const asked = new Set(terms.filter((term) => term.weight === 1).map((term) => term.term));
  if (!asked.size) return null;

  let best: { group: string; item: string; items: string[]; score: number } | null = null;

  for (const [group, items] of Object.entries(skills)) {
    for (const item of items) {
      const tokens = tokenize(item);
      if (!tokens.length) continue;

      const matched = tokens.filter((token) => asked.has(token));

      const answered = matched.length / asked.size;
      if (answered < 0.5) continue;

      const score = answered + 0.25 * (matched.length / tokens.length);
      if (!best || score > best.score) best = { group, item, items, score };
    }
  }

  return best;
}

function answerSkills(terms: QueryTerm[]): AssistantReply {
  const best = bestSkillMatch(terms);

  if (best) {
    return {
      text: [
        `Yes, ${best.item} sits in Yonathan’s **${best.group}** toolkit.`,
        `The full group: ${best.items.join(', ')}.`,
      ].join('\n\n'),
      route: '/',
      routeLabel: 'See all skills',
    };
  }

  return {
    text: [
      'Yonathan’s toolkit, as listed on the site:',
      bullets(
        Object.entries(skills).map(
          ([group, items]) => `**${group}**: ${truncate(items.join(', '), 180)}`,
        ),
      ),
    ].join('\n\n'),
    route: '/',
    routeLabel: 'See all skills',
  };
}

function answerFromCv(sectionId: string, terms: QueryTerm[]): AssistantReply {
  const section = cvSections.find((candidate) => candidate.id === sectionId);
  if (!section) return { text: FALLBACK_TEXT };

  const index = getIndex();

  // Every entry is listed, but the one the question is really about gets its
  // detail line - that is the difference between a CV dump and an answer.
  const ranked = section.entries.map((entry) => {
    const tokens = new Set(tokenize(`${entry.title} ${entry.meta} ${entry.points.join(' ')}`));

    let relevance = 0;
    for (const { term, weight } of terms) {
      if (tokens.has(term)) relevance += weight * idf(index, term);
    }

    return { entry, relevance };
  });

  const detailed = ranked.slice().sort((a, b) => b.relevance - a.relevance)[0];

  return {
    text: [
      `Yonathan’s ${section.heading.toLowerCase()}:`,
      bullets(
        ranked.map(({ entry }) =>
          entry === detailed.entry && detailed.relevance > 0
            ? `**${entry.title}**: ${entry.meta}. ${truncate(firstSentence(entry.points[0]), 180)}`
            : `**${entry.title}**: ${entry.meta}`,
        ),
      ),
    ].join('\n\n'),
    route: '/cv',
    routeLabel: 'Open CV',
  };
}

function answerCv(): AssistantReply {
  const counts = cvSections.map(
    (section) => `${section.entries.length} ${section.heading.toLowerCase()} entries`,
  );

  return {
    text: `The CV page has ${counts.join(' and ')}: roles, dates, and what each one involved.`,
    route: '/cv',
    routeLabel: 'Open CV',
  };
}

function answerAbout(terms: QueryTerm[]): AssistantReply {
  return {
    text: summarize(biography.intro.join(' '), terms, 2),
    route: '/biography',
    routeLabel: 'Open biography',
  };
}

function answerContact(): AssistantReply {
  const { email, linkedin, github, medium, whatsapp } = profile.links;

  return {
    text: [
      `${profile.shortName} is open to opportunities in ${profile.openTo}.`,
      bullets([
        `Email: [${email}](mailto:${email})`,
        `LinkedIn: [linkedin.com/in/yonathanhary](${linkedin})`,
        `GitHub: [YonathanHH](${github})`,
        `Medium: [@yonathanhary1](${medium})`,
        `WhatsApp: [message directly](${whatsapp})`,
      ]),
    ].join('\n\n'),
    route: '/biography',
    routeLabel: 'Open biography',
  };
}

function answerCapabilities(): AssistantReply {
  return {
    text: [
      'I answer from this site’s own content. Nothing I say is generated, and nothing you type leaves your browser. I can cover:',
      bullets([
        `**Projects**: all ${projects.length} of them, by topic or by name`,
        '**Background**: biography and profile summary',
        '**CV**: working experience and education',
        '**Skills**: tools, platforms, and domain expertise',
        `**Articles**: the ${articles.length} pieces published here`,
        '**Contact**: how to reach Yonathan',
      ]),
    ].join('\n\n'),
  };
}

type FaqEntry = {
  keywords: string[];
  answer: string;
  route?: string;
  routeLabel?: string;
};

/** The original keyword FAQ, kept as the last stop before giving up. */
function answerFromFaqItems(query: string, items: FaqEntry[]): AssistantReply | null {
  const normalized = normalize(query);

  const ranked = items
    .map((item) => ({
      item,
      score: item.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalize(keyword);

        if (normalized === normalizedKeyword) return score + 6;
        if (normalized.includes(normalizedKeyword)) return score + 3;

        const words = normalizedKeyword.split(' ');
        return score + words.filter((word) => normalized.includes(word)).length;
      }, 0),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 2) return null;

  return { text: best.item.answer, route: best.item.route, routeLabel: best.item.routeLabel };
}

function answerFromFaq(query: string): AssistantReply | null {
  return answerFromFaqItems(query, chatbotFaq);
}

function answerFromFaqId(query: string): AssistantReply | null {
  return answerFromFaqItems(query, chatbotFaqId);
}

/* ---------------------------------------------------------------------- */
/* Intent routing                                                         */
/* ---------------------------------------------------------------------- */

const GREETING = /^(hi|hai|halo|hello|hey|yo|good (morning|afternoon|evening|day))\b/;
const THANKS = /\b(thanks|thank you|thx|makasih|terima kasih)\b/;
const CAPABILITIES = /\b(what can you do|who are you|what are you|how (do|can) i use you)\b|^help$/;
const CONTACT = /\b(contact|email|e mail|linkedin|hire|hiring|reach|connect|available|availability|whatsapp|recruit\w*|freelance|opportunit\w*)\b/;
const ARTICLES = /\b(articles?|blog|blogs|posts?|writing|writes|wrote|written|medium)\b/;
const PROJECTS = /\b(projects?|portfolio|case stud\w*|repos?|repositor\w*|built|build)\b/;
const SKILLS = /\b(skills?|stack|tools?|tooling|tech|technolog\w*|software|proficien\w*|languages?)\b/;
const EDUCATION = /\b(education|study|studied|studies|degree|university|college|school|masters?|msc|bachelors?|bsc|gpa|graduat\w*|thesis|campus)\b/;
const EXPERIENCE = /\b(experience|jobs?|work history|working experience|career|employ\w*|roles?|positions?|intern\w*)\b/;
const CV = /\b(cv|resume|curriculum vitae)\b/;
const ABOUT = /\b(who is|about (yonathan|him|himself)|tell me about (yonathan|him|himself)|introduce|background|biography|profile)\b/;

/**
 * Answers a visitor's question.
 *
 * Synchronous by design: ranking a few dozen documents is a millisecond of
 * work, so there is nothing to await, nothing to rate limit, and nothing that
 * can be offline.
 */
export function askAssistant(query: string): AssistantReply {
  const trimmed = query.trim();
  if (!trimmed) return answerCapabilities();

  // A question written in Indonesian is answered in Indonesian, whether the
  // panel's own labels are English or not.
  if (isIndonesian(trimmed)) return askAssistantId(trimmed);

  const normalized = normalize(trimmed);
  const tokens = tokenize(trimmed);
  const terms = expand(tokens);

  // What the question is *about*, with the question's own scaffolding removed.
  const topicTokens = tokens.filter(
    (token) => !INTENT_TERMS.has(token) && !PERSON_TERMS.has(token),
  );
  const topics = topicTokens.length ? expand(topicTokens) : terms;

  const hits = search(terms);
  // No topic left after the scaffolding - "what projects does he have?" - so
  // there is nothing to rank, and the list answers fall back to highlights.
  // The window is wide here: a list answer must see every project that fits,
  // and synonyms alone can fill a narrow one with near misses.
  const topicHits = topicTokens.length ? search(topics, 24) : [];

  // The best-scoring document that actually covers the question. Taking
  // hits[0] instead would let a long, term-rich article outrank the one entry
  // that contains every word the visitor typed.
  const top = hits.find((hit) => hit.coverage >= CONFIDENCE_FLOOR);

  if (GREETING.test(normalized)) {
    return {
      text: `Hi, ask me anything about ${profile.shortName}: his projects, background, CV, skills, or articles.`,
    };
  }

  if (THANKS.test(normalized)) return { text: 'Anytime. Ask away if something else comes up.' };
  if (CAPABILITIES.test(normalized)) return answerCapabilities();

  // A thing asked for by name outranks every intent: "tell me about the
  // Geothermal Asset Transition Tool" is not a question about tools.
  const named = namedEntity(topicHits, topicTokens);

  if (named) {
    const project = named.doc.kind === 'project' ? projectById(named.doc.refId) : undefined;
    if (project) return answerFromProject(project, topics);

    const article = articleById(named.doc.refId);
    if (article) return answerFromArticle(article, named.doc, topics);
  }

  if (CONTACT.test(normalized)) return answerContact();
  if (ARTICLES.test(normalized)) return listArticles(topics, topicHits);
  if (PROJECTS.test(normalized)) return listProjects(topics, topicHits, topicTokens.length > 0);
  if (SKILLS.test(normalized)) return answerSkills(terms);
  if (EDUCATION.test(normalized)) return answerFromCv('education', terms);
  if (EXPERIENCE.test(normalized)) return answerFromCv('experience', terms);
  if (CV.test(normalized)) return answerCv();

  // "Tell me about him" is a biography question; "tell me about the
  // geothermal tool" only looks like one, so a real topic wins.
  if (ABOUT.test(normalized) && !topicTokens.length) return answerAbout(terms);

  if (top) {
    // "Has he used Docker?" is answered by the skill, not by reciting the
    // whole toolkit the skill sits in.
    if (top.doc.kind === 'skills') return answerSkills(terms);

    if (top.doc.kind === 'project') {
      const project = projectById(top.doc.refId);
      if (project) return answerFromProject(project, terms);
    }

    if (top.doc.kind === 'article') {
      const article = articleById(top.doc.refId);
      if (article) return answerFromArticle(article, top.doc, terms);
    }

    if (top.doc.kind === 'cv') {
      const [sectionId] = (top.doc.refId ?? '').split('|');
      if (sectionId) return answerFromCv(sectionId, terms);
    }

    return { text: summarize(top.doc.body, terms, 3), ...pickRoute(hits) };
  }

  return answerFromFaq(trimmed) ?? { text: FALLBACK_TEXT };
}

/* ---------------------------------------------------------------------- */
/* Indonesian answers                                                     */
/* ---------------------------------------------------------------------- */

const ID_LANGUAGE =
  /\b(bahasa indonesia|indonesian|bisa bahasa|boleh bahasa|dapat bahasa|ngomong bahasa|berbahasa indonesia)\b/;
const ID_GREETING =
  /^(halo|hallo|hai|hi|hello|hey|selamat (pagi|siang|sore|malam)|pagi|siang|sore|malam)\b/;
const ID_THANKS = /\b(terima kasih|terimakasih|makasih|thanks|thank you|thx)\b/;
const ID_CAPABILITIES =
  /\b(siapa (kamu|anda)|kamu (ini )?siapa|anda (ini )?siapa|apa yang bisa (kamu|anda) lakukan|kamu (bisa|dapat) apa|apa saja yang bisa|bantuan)\b|^(help|bantuan)$/;
const ID_CONTACT =
  /\b(kontak\w*|hubungi|menghubungi|email\w*|surel|linkedin|whatsapp|telepon|rekrut\w*|direkrut|peluang|lowongan|lamaran|wawancara)\b/;
const ID_ARTICLES = /\b(artikel\w*|tulisan\w*|blog|menulis|postingan)\b/;
const ID_PROJECTS = /\b(proyek\w*|projek\w*|portofolio|karya\w*|repo\w*)\b/;
const ID_SKILLS =
  /\b(keterampilan\w*|keahlian\w*|kemampuan\w*|skill\w*|stack|teknologi|alat|tools?|bahasa|pemrograman)\b/;
const ID_EDUCATION =
  /\b(pendidikan\w*|kuliah|studi|gelar|universitas\w*|kampus|sekolah|tesis|magister|sarjana|msc|bsc|gpa)\b/;
const ID_EXPERIENCE =
  /\b(pengalaman\w*|pekerjaan\w*|kerja\w*|karier|karir|magang|posisi|peran|jabatan)\b/;
const ID_CV = /\b(cv\w*|resume|daftar riwayat hidup|riwayat hidup)\b/;
const ID_ABOUT =
  /\b(tentang\w*|siapa\w*|profil\w*|biografi\w*|latar belakang|perkenalkan|perkenalan)\b/;
const ID_DEFINITION = /\b(apa itu|apakah itu|apa yang dimaksud|pengertian|jelaskan)\b/;
const ID_SKILL_QUESTION =
  /\b(bisa|boleh|dapat|menguasai|mengerti|paham|mahir|pakai|memakai|menggunakan|dipakai)\b/;

const FALLBACK_TEXT_ID =
  'Saya hanya tahu isi situs ini: latar belakang, proyek, artikel, keterampilan, dan CV Yonathan. Coba tanyakan tentang proyek geotermal, machine learning, forecasting, pendidikan, atau cara menghubungi.';

/** Skill group labels are authored in English; these are their Indonesian names. */
const SKILL_GROUP_ID: Record<string, string> = {
  'Programming & Data': 'Pemrograman & Data',
  'AI & Machine Learning': 'AI & Machine Learning',
  'Data Engineering & Databases': 'Data Engineering & Basis Data',
  'Geothermal & Subsurface': 'Geotermal & Bawah Permukaan',
  'GIS & Scientific Tools': 'GIS & Perangkat Ilmiah',
  'Cloud & Development': 'Cloud & Pengembangan',
  'Energy & Research': 'Energi & Riset',
  Languages: 'Bahasa',
};

/**
 * A named project in Indonesian: facts that need no translation (title,
 * category, stack, links) plus Indonesian framing. The English description is
 * deliberately left on the page rather than quoted into a half-translated
 * answer; the route button is one tap away.
 */
function answerProjectId(project: Project): AssistantReply {
  const links = [
    project.website ? `[Buka aplikasi](${project.website})` : null,
    `[Kode sumber](${project.github})`,
  ].filter((link): link is string => Boolean(link));

  return {
    text: [
      `**${project.title}**`,
      `Kategori: ${project.category.trim()}. Stack: ${project.stack.join(', ')}.`,
      bullets(links),
      'Detail lengkap ada di halaman proyek.',
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Buka semua proyek',
  };
}

function answerArticleId(article: Article): AssistantReply {
  return {
    text: `**${article.title.trim()}** (${article.date}, ${article.readTime}). Buka halaman artikel untuk membaca tulisan lengkapnya.`,
    route: `/articles/${article.id}`,
    routeLabel: 'Baca artikel',
  };
}

function listProjectsId(hits: Hit[], hasTopic: boolean): AssistantReply {
  const strong = relevantHits(hits, 'project');
  const partial = hits.filter((hit) => hit.doc.kind === 'project' && hit.matched > 0);
  const ranked = strong.length ? strong : partial;

  const matches = ranked
    .slice(0, MAX_LIST_ITEMS)
    .map((hit) => projectById(hit.doc.refId))
    .filter((project): project is Project => Boolean(project));

  if (strong.length && matches.length === 1) return answerProjectId(matches[0]);

  if (matches.length) {
    return {
      text: [
        strong.length
          ? `${matches.length} dari ${projects.length} proyek Yonathan yang paling cocok:`
          : 'Tidak ada yang persis cocok, tetapi ini yang paling dekat:',
        bullets(matches.map((project) => `**${project.title}**: ${project.category.trim()}`)),
      ].join('\n\n'),
      route: '/projects',
      routeLabel: 'Buka proyek',
    };
  }

  if (hasTopic) {
    return {
      text: [
        'Saya tidak menemukan proyek dengan topik itu.',
        `Dari ${projects.length} proyek yang ada, coba topik seperti energi, machine learning, forecasting, atau rekomendasi.`,
      ].join('\n\n'),
      route: '/projects',
      routeLabel: 'Buka proyek',
    };
  }

  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return {
    text: [
      `Yonathan punya ${projects.length} proyek, sebagian besar di bidang energi, machine learning, dan analisis data. Tiga yang ditonjolkan:`,
      bullets(featured.map((project) => `**${project.title}**: ${project.category.trim()}`)),
      'Tanyakan topik tertentu, misalnya geotermal, forecasting, atau analisis keuangan.',
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Buka proyek',
  };
}

function listArticlesId(hits: Hit[]): AssistantReply {
  const [best] = relevantHits(hits, 'article');

  if (best) {
    const article = articleById(best.doc.refId);
    if (article) return answerArticleId(article);
  }

  return {
    text: [
      `Yonathan menulis ${articles.length} artikel di situs ini:`,
      bullets(
        articles.map(
          (article) => `**${article.title.trim()}** (${article.date}, ${article.readTime})`,
        ),
      ),
    ].join('\n\n'),
    route: '/articles',
    routeLabel: 'Baca artikel',
  };
}

function answerSkillsId(terms: QueryTerm[]): AssistantReply {
  const best = bestSkillMatch(terms);

  if (best) {
    return {
      text: [
        `Ya, ${best.item} termasuk dalam kelompok **${SKILL_GROUP_ID[best.group] ?? best.group}**.`,
        `Kelompok lengkapnya: ${best.items.join(', ')}.`,
      ].join('\n\n'),
      route: '/',
      routeLabel: 'Lihat semua keterampilan',
    };
  }

  return {
    text: [
      'Keterampilan Yonathan, seperti yang terdaftar di situs:',
      bullets(
        Object.entries(skills).map(
          ([group, items]) =>
            `**${SKILL_GROUP_ID[group] ?? group}**: ${truncate(items.join(', '), 180)}`,
        ),
      ),
    ].join('\n\n'),
    route: '/',
    routeLabel: 'Lihat semua keterampilan',
  };
}

/**
 * Lists a CV section by role and dates only. The bullet prose is English, and
 * an Indonesian answer that quotes it would read as two languages stapled
 * together; the CV page carries the detail.
 */
function answerCvSectionId(sectionId: string): AssistantReply {
  const section = cvSections.find((candidate) => candidate.id === sectionId);
  if (!section) return { text: FALLBACK_TEXT_ID, route: '/cv', routeLabel: 'Lihat CV' };

  const heading =
    section.id === 'education'
      ? 'Pendidikan'
      : section.id === 'experience'
        ? 'Pengalaman kerja'
        : section.heading;

  return {
    text: [
      `${heading} ${profile.shortName}:`,
      bullets(section.entries.map((entry) => `**${entry.title.trim()}**: ${entry.meta}`)),
    ].join('\n\n'),
    route: '/cv',
    routeLabel: 'Lihat CV',
  };
}

function answerCvId(): AssistantReply {
  const counts = cvSections.map((section) => ({
    heading:
      section.id === 'education'
        ? 'pendidikan'
        : section.id === 'experience'
          ? 'pengalaman kerja'
          : section.heading.toLowerCase(),
    count: section.entries.length,
  }));

  return {
    text: `Halaman CV berisi ${counts
      .map((entry) => `${entry.count} entri ${entry.heading}`)
      .join(' dan ')}: peran, tanggal, dan rincian tiap peran.`,
    route: '/cv',
    routeLabel: 'Lihat CV',
  };
}

function answerAboutId(): AssistantReply {
  const item = chatbotFaqId.find((entry) => entry.id === 'about');

  return {
    text: item?.answer ?? FALLBACK_TEXT_ID,
    route: item?.route ?? '/biography',
    routeLabel: item?.routeLabel ?? 'Buka biografi',
  };
}

function answerContactId(): AssistantReply {
  const { email, linkedin, github, medium, whatsapp } = profile.links;

  return {
    text: [
      `${profile.shortName} terbuka untuk peluang di bidang ${profile.openTo}.`,
      bullets([
        `Email: [${email}](mailto:${email})`,
        `LinkedIn: [linkedin.com/in/yonathanhary](${linkedin})`,
        `GitHub: [YonathanHH](${github})`,
        `Medium: [@yonathanhary1](${medium})`,
        `WhatsApp: [kirim pesan langsung](${whatsapp})`,
      ]),
    ].join('\n\n'),
    route: '/biography',
    routeLabel: 'Buka biografi',
  };
}

function answerCapabilitiesId(): AssistantReply {
  return {
    text: [
      'Saya menjawab dari konten situs ini. Tidak ada jawaban yang dihasilkan model bahasa, dan tidak ada yang Anda tulis yang keluar dari browser. Saya bisa membahas:',
      bullets([
        `**Proyek**: semua ${projects.length} proyek, berdasarkan topik atau nama`,
        '**Latar belakang**: biografi dan ringkasan profil',
        '**CV**: pengalaman kerja dan pendidikan',
        '**Keterampilan**: alat, platform, dan keahlian domain',
        `**Artikel**: ${articles.length} tulisan yang diterbitkan di sini`,
        '**Kontak**: cara menghubungi Yonathan',
      ]),
    ].join('\n\n'),
  };
}

function answerLanguageId(): AssistantReply {
  return {
    text: 'Ya, saya bisa menjawab dalam bahasa Indonesia. Silakan tanya tentang proyek, pengalaman, pendidikan, keterampilan, atau cara menghubungi Yonathan.',
  };
}

/**
 * The Indonesian twin of askAssistant: translate the question, keep the same
 * search, then compose from Indonesian templates so nothing is machine
 * translated into the answer.
 */
function askAssistantId(query: string): AssistantReply {
  const normalized = normalize(query);
  const tokens = tokenize(translateToEnglish(query));
  const terms = expand(tokens);

  const topicTokens = tokens.filter(
    (token) => !INTENT_TERMS.has(token) && !PERSON_TERMS.has(token),
  );
  const topics = topicTokens.length ? expand(topicTokens) : terms;

  const hits = search(terms);
  const topicHits = topicTokens.length ? search(topics, 24) : [];
  const top = hits.find((hit) => hit.coverage >= CONFIDENCE_FLOOR);

  if (ID_GREETING.test(normalized)) {
    return {
      text: `Halo, tanyakan apa saja tentang ${profile.shortName}: proyek, latar belakang, CV, keterampilan, atau artikelnya.`,
    };
  }

  if (ID_THANKS.test(normalized)) {
    return { text: 'Sama-sama. Silakan tanya lagi kalau ada yang lain.' };
  }

  if (ID_CAPABILITIES.test(normalized)) return answerCapabilitiesId();
  if (ID_LANGUAGE.test(normalized)) return answerLanguageId();

  const named = namedEntity(topicHits, topicTokens);

  if (named) {
    const project = named.doc.kind === 'project' ? projectById(named.doc.refId) : undefined;
    if (project) return answerProjectId(project);

    const article = articleById(named.doc.refId);
    if (article) return answerArticleId(article);
  }

  if (ID_CONTACT.test(normalized)) return answerContactId();
  if (ID_ARTICLES.test(normalized)) return listArticlesId(topicHits);
  if (ID_PROJECTS.test(normalized)) return listProjectsId(topicHits, topicTokens.length > 0);
  if (ID_SKILLS.test(normalized)) return answerSkillsId(terms);
  if (ID_EDUCATION.test(normalized)) return answerCvSectionId('education');
  if (ID_EXPERIENCE.test(normalized)) return answerCvSectionId('experience');
  if (ID_CV.test(normalized)) return answerCvId();

  if (ID_ABOUT.test(normalized) && !topicTokens.length) return answerAboutId();

  // "Apa itu geothermal" asks for the topic, not for one project that happens
  // to carry the word, so the written entry is the better answer.
  if (ID_DEFINITION.test(normalized)) {
    const faq = answerFromFaqId(query);
    if (faq) return faq;
  }

  // "Bisa Python?" asks about the skill, even though a project called Python
  // Learning Application also matches the word.
  if (ID_SKILL_QUESTION.test(normalized)) {
    const skill = bestSkillMatch(terms);
    if (skill || !topicTokens.length) return answerSkillsId(terms);
  }

  if (top) {
    if (top.doc.kind === 'skills') return answerSkillsId(terms);

    if (top.doc.kind === 'project') {
      const project = projectById(top.doc.refId);
      if (project) return answerProjectId(project);
    }

    if (top.doc.kind === 'article') {
      const article = articleById(top.doc.refId);
      if (article) return answerArticleId(article);
    }

    if (top.doc.kind === 'cv') {
      const [sectionId] = (top.doc.refId ?? '').split('|');
      if (sectionId) return answerCvSectionId(sectionId);
    }

    if (top.doc.kind === 'biography') return answerAboutId();
  }

  return answerFromFaqId(query) ?? { text: FALLBACK_TEXT_ID };
}
