import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get("nickname") || "";
  const mode = searchParams.get("mode");

  const kategoriler = ["Hayvanlar", "Yiyecekler", "Ülkeler", "Teknoloji"];

  const kategoriSec = (kategori) => {
    const q = `nickname=${encodeURIComponent(nickname)}${mode === "bot" ? "&mode=bot" : ""}`;
    navigate(`/game/${kategori.toLowerCase()}?${q}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Kategori Seç</h2>
      <p style={styles.subtitle}>
        Merhaba <strong>{nickname}</strong>, bir kategori seç:
      </p>
      <div style={styles.buttonContainer}>
        {kategoriler.map((kategori) => (
          <button key={kategori} onClick={() => kategoriSec(kategori)} style={styles.button}>
            {kategori}
          </button>
        ))}
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
  subtitle: {
    maxWidth: "700px",
    textAlign: "center",
    lineHeight: 1.4,
  },
  buttonContainer: {
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

export default CategoryPage;
