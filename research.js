// research.js
async function search(query) {
  const apiUrl = `https://api.example.com/search?query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP hatası! Durum: ${response.status}`);
    }
    const data = await response.json();
    const summary = data.summary || data.result || "";
    return { query, result: summary };
  } catch (error) {
    console.error("Araştırma hatası:", error);
    return { query, result: "" };
  }
}

module.exports = { search };
