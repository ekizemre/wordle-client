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
      <div style={styles.columns}>
        {/* ODA KUR */}
        <div style={styles.card}>
          <h2>Oda Kur</h2>
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

        {/* ODA KATIL */}
        <div style={styles.card}>
          <h2>Odaya Katıl</h2>
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
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // arka plan gradient
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "10px",
    color: "#f5f5f5",
    textShadow: "2px 2px 5px rgba(0,0,0,0.4)",
  },
  input: {
    fontSize: "18px",
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #61dafb",
    outline: "none",
    width: "260px",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "border-color 0.3s ease",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    padding: "14px 32px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    minWidth: "220px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
  },
};


export default RoomPage;
