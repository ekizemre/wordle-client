import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function CreateRoomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultNick = searchParams.get("nickname") || "";

  const [nickname, setNickname] = useState(defaultNick);
  const [kategori, setKategori] = useState("");

  const kategoriler = useMemo(() => (["Hayvanlar", "Yiyecekler", "Renkler"]), []);

  const odaKur = () => {
    if (nickname.trim().length < 3) {
      alert("Lütfen en az 3 harfli bir nickname girin.");
      return;
    }
    if (!kategori) {
      alert("Lütfen bir kategori seçin.");
      return;
    }

    const odaKodu = uuidv4().split("-")[0];
    const q = `nickname=${encodeURIComponent(nickname)}&kategori=${encodeURIComponent(
      kategori.toLowerCase()
    )}`;
    navigate(`/oda/${odaKodu}?${q}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Oda Kur</h2>

      <input
        type="text"
        placeholder="Takma Ad (Nickname)"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={styles.input}
      />

      <select value={kategori} onChange={(e) => setKategori(e.target.value)} style={styles.input}>
        <option value="">Kategori Seçin</option>
        {kategoriler.map((kat) => (
          <option key={kat} value={kat}>
            {kat}
          </option>
        ))}
      </select>

      <button onClick={odaKur} style={styles.button}>
        Oda Oluştur ve Başla
      </button>
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

export default CreateRoomPage;
