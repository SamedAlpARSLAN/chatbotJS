# chatbotJS — Node.js Tabanlı Yerel (Offline) Chatbot Prototipi

Bu repo; **Node.js** ile geliştirilmiş, **web arayüzü (public/)** üzerinden çalışan ve yanıt üretiminde **yerel veri/corpus dosyalarını (data/)** kullanan bir chatbot prototipini içerir. Proje; çok dilli (TR/EN/ES) metin derlemeleriyle (corpus) basit bir sohbet akışı, araştırma/deneme modülleri ve isteğe bağlı “exam/question” üretim mantığını aynı çatı altında toplamayı hedefler.

> Amaç: Harici API’ye bağımlı olmadan (offline/yerel), veri dosyaları üzerinden çalışan, akademik gösterim/teslim için anlaşılır ve kurulumu kolay bir chatbot demo projesi.
Şununun da altını çizmek isterim kendi verdiğim verilerle eğitilen ve kullanıcılarla anlık olarak cevap verebilen bir arayüzlü chatbot geliştirdim elbette temel yapıda ancak geliştirilebilir oldukça verimli sonuçlar elde ettim.
---

## İçerik
- [Öne Çıkanlar](#öne-çıkanlar)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Proje Yapısı](#proje-yapısı)
- [Veri (Corpus) Formatı](#veri-corpus-formatı)
- [Konfigürasyon](#konfigürasyon)
- [Akademik Notlar](#akademik-notlar)
- [Sınırlılıklar](#sınırlılıklar)
- [Lisans](#lisans)

---

## Öne Çıkanlar
- **Web UI**: `public/` altında HTML/CSS/JS ile basit bir arayüz.
- **Yerel veriyle çalışma**: `data/` altında çok dilli corpus dosyaları (TR/EN/ES).
- **Modüler mantık**: 
  - `brain.js` (model/öğrenme veya sınıflandırma denemeleri için ayrılmış modül),
  - `nlg.js` (yanıt üretimi / şablonlama),
  - `examGenerator.js` (soru/quiz üretim denemeleri),
  - `research.js` (deney/araştırma amaçlı yardımcı akışlar),
  - `db.js` (basit veri saklama/okuma mantığı).
- **Tek komutla kurulum**: `npm install` ile bağımlılıklar, `npm start` ile çalıştırma.

> Repo içinde `data/corpus-es.zip` dosyası da bulunuyor. Büyük dosyaları pushlamak istemiyorsan “Sınırlılıklar” bölümündeki notlara bak.

---

## Kurulum
### Gereksinimler
- **Node.js** (öneri: 18+)
- **npm** (Node ile birlikte gelir)

### Adımlar
```bash
# Projeyi klonla
git clone https://github.com/SamedAlpARSLAN/chatbotJS.git
cd chatbotJS

# Bağımlılıkları yükle
npm install
