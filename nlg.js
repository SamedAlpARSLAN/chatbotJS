// nlg.js
// Bu modül, dış araştırma kullanılmadığında cevabı minimal biçimde sarmalamak için kullanılacak.
function getNLGResponse(intent, params = {}) {
  const lang = params.lang || "en";
  const useResearch = params.useResearch === true;
  let templatesForLang;
  
  if (!useResearch) {
    if (lang === "tr") {
      templatesForLang = {
        info: [
          "{{info}}",
          "Cevabım: {{info}}"
        ],
        default: [
          "Üzgünüm, bunu anlayamadım.",
          "Lütfen soruyu tekrar ifade eder misiniz?"
        ]
      };
    } else if (lang === "es") {
      templatesForLang = {
        info: [
          "{{info}}",
          "Mi respuesta: {{info}}"
        ],
        default: [
          "Lo siento, no entendí eso.",
          "¿Podrías reformular tu pregunta?"
        ]
      };
    } else {
      templatesForLang = {
        info: [
          "{{info}}",
          "My answer: {{info}}"
        ],
        default: [
          "I'm not sure how to respond to that.",
          "Could you please clarify your question?"
        ]
      };
    }
  } else {
    // Eğer araştırma kullanılacaksa (bu senaryoda kullanılmıyor)
    if (lang === "tr") {
      templatesForLang = {
        info: [
          "Araştırmalarıma göre, şunları buldum: {{info}}",
          "Elde ettiğim bilgilere dayanarak, şunu söyleyebilirim: {{info}}"
        ],
        default: [
          "Bu konuda nasıl cevap vereceğimi bilemiyorum.",
          "Lütfen soruyu tekrar formüle ediniz."
        ]
      };
    } else if (lang === "es") {
      templatesForLang = {
        info: [
          "Según mi investigación, encontré lo siguiente: {{info}}",
          "Después de analizar la información, concluí: {{info}}"
        ],
        default: [
          "No estoy seguro de cómo responder a eso.",
          "¿Podrías clarificar tu pregunta?"
        ]
      };
    } else {
      templatesForLang = {
        info: [
          "Based on my research, here's what I found: {{info}}",
          "After analyzing the available information, I concluded: {{info}}"
        ],
        default: [
          "I'm not sure how to respond to that.",
          "Could you please clarify your question?"
        ]
      };
    }
  }
  
  const availableTemplates = (templatesForLang[intent] && templatesForLang[intent].length > 0)
    ? templatesForLang[intent]
    : templatesForLang.default;
  const chosenTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  let response = chosenTemplate;
  for (const key in params) {
    if (key === "lang" || key === "useResearch") continue;
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    response = response.replace(regex, params[key]);
  }
  return response;
}

async function updateNLGData() {
  try {
    const apiUrl = 'https://api.example.com/nlg-templates';
    const response = await fetch(apiUrl);
    if (response.ok) {
      const dynamicTemplates = await response.json();
      console.log('NLG templates updated successfully.');
    } else {
      console.error('Failed to update NLG templates. Status:', response.status);
    }
  } catch (error) {
    console.error('Error while updating NLG templates:', error);
  }
}

module.exports = { getNLGResponse, updateNLGData };
