// examGenerator.js
/**
 * Generates exam questions from provided lesson notes.
 * The function normalizes the text, splits it into sentences,
 * and then creates a variety of question types based on predefined templates.
 *
 * @param {string} lessonNotes - The lesson content from which to generate questions.
 * @returns {object} An object containing an array of generated questions and the total count.
 */
function generateQuestions(lessonNotes) {
  if (typeof lessonNotes !== 'string' || lessonNotes.trim() === '') {
    throw new Error("Lesson notes must be provided as a non-empty string.");
  }

  // Normalize whitespace and trim the text
  const normalizedText = lessonNotes.replace(/\s+/g, ' ').trim();

  // Split the text into sentences using punctuation marks (., !, ?) followed by a space
  const sentences = normalizedText
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  // Define a set of diverse question templates
  const templates = [
    'What does the following statement imply: "{{sentence}}"?',
    'Explain the significance of: "{{sentence}}".',
    'How would you interpret: "{{sentence}}"?',
    'What key concept is illustrated by: "{{sentence}}"?',
    'Discuss the meaning behind: "{{sentence}}".'
  ];

  // Generate a question for each sentence using a random template
  const questions = sentences.map(sentence => {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate.replace(/{{\s*sentence\s*}}/g, sentence);
  });

  return { questions, count: questions.length };
}

module.exports = { generateQuestions };
