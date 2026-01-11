// brain.js
const brain = require('brain.js');
const fs = require('fs');
const net = new brain.recurrent.LSTM();

let trainingData = [];
try {
  const corpusData = fs.readFileSync('training_corpus.json', 'utf8');
  trainingData = JSON.parse(corpusData);
  console.log(`Korpus ${trainingData.length} örnekle yüklendi.`);
} catch (e) {
  console.error("Konuşma korpusu bulunamadı, yedek eğitim verileri kullanılacak.");
  trainingData = [
    { input: "hello", output: "Hello, how can I help you?" },
    { input: "hi", output: "Hi there!" },
    { input: "naber", output: "İyiyim, teşekkürler! Sen nasılsın?" },
    { input: "nasılsın", output: "İyiyim, teşekkürler!" },
    { input: "iyi günler", output: "İyi günler, nasıl yardımcı olabilirim?" },
    { input: "hava", output: "Hava durumu değişken, ancak bugün ortalama 22 derece." },
    { input: "hava kaç derece", output: "Şu an hava yaklaşık 22 derece." },
    { input: "?", output: "Lütfen daha net bir soru sorar mısınız?" },
    { input: "çok anlamsız cevaplar sence", output: "Üzgünüm, bazen istenmeyen yanıtlar verebiliyorum. Sürekli öğreniyorum." },
    { input: "2+2", output: "4" },
    { input: "evet", output: "Evet, nasıl yardımcı olabilirim?" },
    { input: "iyi sen", output: "İyiyim, teşekkürler!" },
    { input: "a", output: "Merhaba, nasılsınız?" },
    { input: "b", output: "Ben bir sohbet botuyum." },
    { input: "x", output: "İyiyim, teşekkürler! Siz nasılsınız?" },
    { input: "efjweofwje", output: "Merhaba, nasılsınız?" },
    { input: "Anlamıyosun beni değil mi?", output: "Özür dilerim, sizi tam anlayamadım. Lütfen tekrar ifade eder misiniz?" }
  ];
}

function trainModel(data) {
  const options = {
    iterations: 500,
    log: true,
    logPeriod: 50,
    errorThresh: 0.01
  };
  console.log(`Sinir ağı ${data.length} örnekle eğitiliyor...`);
  net.train(data, options);
}

trainModel(trainingData);

function getResponse(input) {
  try {
    if (!input || typeof input !== 'string' || input.trim() === '') {
      throw new Error("Girdi boş olamaz.");
    }
    let response = net.run(input).trim();
    // Eğer üretilen cevap çok kısa veya anlamlı Türkçe karakterler içermiyorsa, fallback ver.
    if (response.length < 15 || response.toLowerCase().includes("düşünmeye çalışıyorum") || !/[aeıioöuü]/.test(response.toLowerCase())) {
      response = "Üzgünüm, bunu anlayamadım. Lütfen soruyu tekrar ifade eder misiniz?";
    }
    return response;
  } catch (error) {
    console.error("Sinir ağı hatası:", error);
    return "Üzgünüm, sorunuz hakkında bir cevap oluşturamadım.";
  }
}

async function updateTrainingData() {
  try {
    const apiUrl = 'https://api.example.com/training';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error("Eğitim verisi alınamadı. HTTP durum:", response.status);
      return;
    }
    const dynamicData = await response.json();
    if (!Array.isArray(dynamicData)) {
      console.error("Dinamik eğitim verisi dizi formatında değil.");
      return;
    }
    dynamicData.forEach(item => {
      if (item.input && item.output) {
        const exists = trainingData.some(existing =>
          existing.input.toLowerCase() === item.input.toLowerCase() &&
          existing.output.toLowerCase() === item.output.toLowerCase()
        );
        if (!exists) {
          trainingData.push(item);
        }
      }
    });
    console.log(`Güncellenmiş eğitim verisi sayısı: ${trainingData.length}`);
    trainModel(trainingData);
  } catch (error) {
    console.error("Eğitim verisi güncellenirken hata:", error);
  }
}

module.exports = { getResponse, updateTrainingData };
