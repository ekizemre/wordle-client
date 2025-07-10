import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoomPage() {
  const navigate = useNavigate();

  const [kurAd, setKurAd] = useState("");
  const [kurKategori, setKurKategori] = useState("");
  const [katilKod, setKatilKod] = useState("");
  const [katilAd, setKatilAd] = useState("");
  const [katilKategori, setKatilKategori] = useState("");

  const odaKur = () => {
    if (kurAd.trim().length < 3 || !kurKategori) {
      alert("Lütfen geçerli bir ad ve kategori girin.");
      return;
    }
    const odaKodu = Math.random().toString(36).substring(2, 7);
    navigate(`/oda/${odaKodu}?nickname=${kurAd}&kategori=${kurKategori}`);
  };

  const odayaKatil = () => {
    if (katilAd.trim().length < 3 || !katilKod || !katilKategori) {
      alert("Lütfen geçerli bir ad, oda kodu ve kategori girin.");
      return;
    }
    navigate(`/oda/${katilKod}?nickname=${katilAd}&kategori=${katilKategori}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Oda Kur veya Katıl</h2>
      <div style={styles.columns}>
        {/* ODA KUR */}
        <div style={styles.card}>
          <h3>Oda Kur</h3>
          <input
            placeholder="Takma Ad"
            value={kurAd}
            onChange={(e) => setKurAd(e.target.value)}
            style={styles.input}
          />
          <select
            value={kurKategori}
            onChange={(e) => setKurKategori(e.target.value)}
            style={styles.input}
          >
            <option value="">Kategori Seçin</option>
            <option value="Hayvanlar">Hayvanlar</option>
            <option value="Yiyecekler">Yiyecekler</option>
            <option value="Şehirler">Şehirler</option>
          </select>
          <button onClick={odaKur} style={styles.button}>Oluştur ve Başla</button>
        </div>

        {/* ODAYA KATIL */}
        <div style={styles.card}>
          <h3>Odaya Katıl</h3>
          <input
            placeholder="Oda Kodu"
            value={katilKod}
            onChange={(e) => setKatilKod(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Takma Ad"
            value={katilAd}
            onChange={(e) => setKatilAd(e.target.value)}
            style={styles.input}
          />
          <select
            value={katilKategori}
            onChange={(e) => setKatilKategori(e.target.value)}
            style={styles.input}
          >
            <option value="">Kategori Seçin</option>
            <option value="Hayvanlar">Hayvanlar</option>
            <option value="Yiyecekler">Yiyecekler</option>
            <option value="Şehirler">Şehirler</option>
          </select>
          <button onClick={odayaKatil} style={styles.button}>Katıl</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: "2.4rem",
    marginBottom: "30px",
    color: "#f5f5f5",
    textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: "900px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    backdropFilter: "blur(5px)",
  },
  input: {
    fontSize: "16px",
    padding: "10px",
    borderRadius: "8px",
    border: "2px solid #61dafb",
    outline: "none",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
  },
};

export default RoomPage;
