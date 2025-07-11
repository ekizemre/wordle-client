import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const baslat = (yol) => {
    if (nickname.trim().length < 3) {
      alert("Lütfen en az 3 harfli bir isim girin.");
      return;
    }
    navigate(`${yol}?nickname=${nickname}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Wordle PvP'ye Hoşgeldiniz</h1>

      <input
        type="text"
        placeholder="İsminizi girin"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={styles.input}
      />

      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => baslat("/kategoriler")}>
          Rastgele Rakiple Oyna
        </button>
        <button style={styles.button} onClick={() => baslat("/oda-kur")}>
          Oda Kur & Katıl
        </button>
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

export default HomePage;
