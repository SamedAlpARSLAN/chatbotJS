// index.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const brain = require('./brain');
// Research entegrasyonu devre dışı bırakıldı; yalnızca brain.js yanıtları kullanılacak.
const nlg = require('./nlg');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Geliştirilmiş dil tespiti:
 * - Eğer metin Türkçe karakterler (ğ, ü, ş, ı, ö, ç) içeriyorsa veya 
 *   "naber", "nasılsın", "teşekkür", "iyi", "hava", "günler", "sen" gibi kelimeler varsa "tr"
 * - İspanyolca için "hola", "¿", "qué" kontrolü yapılır.
 * - Aksi halde "en" döner.
 */
function detectLanguage(text) {
  const lowerText = text.toLowerCase();
  if (/[ğüşıöç]/.test(text) ||
      lowerText.includes("naber") ||
      lowerText.includes("nasılsın") ||
      lowerText.includes("teşekkür") ||
      lowerText.includes("iyi") ||
      lowerText.includes("hava") ||
      lowerText.includes("günler") ||
      lowerText.includes("sen")) {
    return "tr";
  }
  if (lowerText.includes("hola") || lowerText.includes("¿") || lowerText.includes("qué")) {
    return "es";
  }
  return "en";
}

function isArithmetic(input) {
  const expr = input.replace(/\s+/g, '').replace(/=/g, '');
  return /^[0-9+\-*/().]+$/.test(expr);
}

function evaluateArithmetic(input) {
  const expr = input.replace(/=/g, '');
  try {
    return Function('"use strict"; return (' + expr + ')')();
  } catch (e) {
    throw new Error("Arithmetic evaluation failed.");
  }
}

// Fallback cevapları (her dil için)
const fallbackAnswers = {
  tr: [
    "Üzgünüm, bunu anlayamadım.",
    "Lütfen soruyu tekrar ifade eder misiniz?",
    "Bunu tam olarak anlamadım, tekrar sorabilir misiniz?"
  ],
  en: [
    "Sorry, I didn't understand that.",
    "Could you please rephrase your question?"
  ],
  es: [
    "Lo siento, no entendí eso.",
    "¿Podrías reformular tu pregunta?"
  ]
};

app.post('/chat', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return res.status(400).json({ error: 'Lütfen geçerli ve boş olmayan bir girdi sağlayın.' });
    }
    
    const trimmedInput = input.trim();
    const lang = detectLanguage(trimmedInput);
    
    // Eğer girdi yalnızca noktalama işaretlerinden veya çok kısa ise, doğrudan brain.js cevabını kullan.
    if (trimmedInput.length < 2 || /^[\?\!\.,]+$/.test(trimmedInput)) {
      const neuralFallback = brain.getResponse(trimmedInput).trim() ||
        (lang === "tr" ? fallbackAnswers.tr[Math.floor(Math.random() * fallbackAnswers.tr.length)] : 
         lang === "es" ? fallbackAnswers.es[Math.floor(Math.random() * fallbackAnswers.es.length)] :
         fallbackAnswers.en[Math.floor(Math.random() * fallbackAnswers.en.length)]);
      return res.json({ input: trimmedInput, response: neuralFallback });
    }
    
    // Aritmetik ifadeler kontrolü
    if (isArithmetic(trimmedInput)) {
      try {
        const result = evaluateArithmetic(trimmedInput);
        let responseText = "";
        if (lang === "tr") {
          responseText = `Sonuç: ${result}`;
        } else if (lang === "es") {
          responseText = `Resultado: ${result}`;
        } else {
          responseText = `Result: ${result}`;
        }
        return res.json({ input: trimmedInput, response: responseText });
      } catch (e) {
        console.error("Arithmetic evaluation error:", e);
      }
    }
    
    // Özel kural: Eğer sorguda "hava" ve "derece" geçiyorsa, kural tabanlı cevap ver.
    if (trimmedInput.toLowerCase().includes("hava") && trimmedInput.toLowerCase().includes("derece")) {
      let weatherAnswer;
      if (lang === "tr") {
        weatherAnswer = "Şu an hava yaklaşık 22 derece gibi görünüyor.";
      } else if (lang === "es") {
        weatherAnswer = "Parece que hace alrededor de 22 grados.";
      } else {
        weatherAnswer = "It seems to be around 22 degrees.";
      }
      return res.json({ input: trimmedInput, response: weatherAnswer });
    }
    
    // Neural network (brain.js) cevabını al
    let neuralResponse = brain.getResponse(trimmedInput).trim();
    
    // Eğer neural cevap çok kısa veya "düşünmeye çalışıyorum" gibi genel ifadeler içeriyorsa,
    // veya hiç anlamlı Türkçe karakterler içermiyorsa, fallback cevabı seç.
    if (
      neuralResponse.length < 15 ||
      neuralResponse.toLowerCase().includes("düşünmeye çalışıyorum") ||
      (lang === "tr" && !/[aeıioöuü]/.test(neuralResponse.toLowerCase()))
    ) {
      neuralResponse = fallbackAnswers[lang][Math.floor(Math.random() * fallbackAnswers[lang].length)];
    }
    
    // Sonuç olarak neuralResponse'yi döndür (NLG modülü bu örnekte sadece minimal sarmalama yapacak)
    // Bu modülde ekstra bir sarmalama yerine, direkt insan gibi cevap vermesi tercih ediliyor.
    res.json({ input: trimmedInput, response: neuralResponse });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/update', async (req, res) => {
  try {
    await brain.updateTrainingData();
    await nlg.updateNLGData();
    res.json({ message: 'Eğitim verileri ve NLG şablonları başarıyla güncellendi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
