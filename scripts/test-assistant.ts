/**
 * Smoke test for the portfolio assistant. Runs the same code the browser
 * runs, so the answers printed here are exactly what a visitor would see.
 *
 * No key, no network, no service — just: npm run test:chat
 */
import { askAssistant } from '../src/lib/assistant';

const questions = [
  'Tell me about Yonathan',
  'Show energy projects',
  'What machine learning projects are here?',
  'How can I view the CV?',
  'What geothermal projects has he built?',
  'Does he do time series forecasting?',
  'Has he used Docker?',
  'What did he write about microgrids?',
  'Where did he do his masters?',
  'What is his working experience?',
  'Tell me about the Geothermal Asset Transition Tool',
  'How do I contact him?',
  'hi',
  'what can you do',
  'Can he cook a good rendang?',
  'Does he know SQL?',
  'what is his GPA',
  'deep learning',
  'What did he do at Reykjavik University?',
  'show me his articles',
  'what projects does he have',
  'Tell me about the PyTOUGH assistant',
  'Where is he from?',
  // Topic queries: filler words must not sink them, and a topic that is not
  // in the portfolio must be admitted rather than answered with the featured three.
  'Is there any projects related with financial?',
  'Does he have any finance projects?',
  'computer vision projects',
  'show me NLP projects',
  'any chatbot or RAG projects?',
  'recommendation system projects',
  'geospatial projects',
  'projects using Streamlit',
  'does he have any blockchain projects?',
];

for (const question of questions) {
  const reply = askAssistant(question);
  const button = reply.routeLabel ? `${reply.routeLabel} -> ${reply.route}` : '(none)';

  console.log(`\nQ: ${question}`);
  console.log(`   button: ${button}`);
  console.log(`   A: ${reply.text.replace(/\n/g, '\n      ')}`);
}
