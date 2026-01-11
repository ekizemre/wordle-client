import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import socket from "./socket";

function OdaGamePage() {
  const { odakodu } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nickname = searchParams.get("nickname") || "";
  const kategori = (searchParams.get("kategori") || "yiyecekler").toLowerCase();

  const [dogruKelime, setDogruKelime] = useState("");
  const [tahmin, setTahmin] = useState("");
  const [gecmisTahminler, setGecmisTahminler] = useState([]);
  const [sonuc, setSonuc] = useState("");
  const [siraBende, setSiraBende] = useState(false);
  const [sure, setSure] = useState(30);
  const [rakipAd, setRakipAd] = useState("");
  const [benimAdim, setBenimAdim] = useState("");

  useEffect(() => {
    if (!odakodu) return;
    if (nickname.trim().length < 3) return;

    socket.emit("join_game_with_code", { odaKodu: odakodu, kategori, nickname });

    socket.on("match_found", (kelime) => setDogruKelime(kelime));

    socket.on("your_turn", (seninSirandaMi) => {
      setSiraBende(seninSirandaMi);
      setSure(30);
    });

    socket.on("opponent_guess", (kelime, renkler) => {
      setGecmisTahminler((prev) => [...prev, { kelime, renkler }]);
    });

    socket.on("game_result", (msg) => {
      setSonuc(msg);
      setSiraBende(false);
    });

    socket.on("nickname_info", ({ sen, rakip }) => {
      setBenimAdim(sen);
      setRakipAd(rakip);
    });

    socket.on("opponent_left", () => {
      setSonuc("Rakibiniz oyunu terk etti ❌");
      setSiraBende(false);
    });

    socket.on("error", (msg) => {
      if (typeof msg === "string" && msg.trim()) alert(msg);
    });

    return () => {
      socket.off("match_found");
      socket.off("your_turn");
      socket.off("opponent_guess");
      socket.off("game_result");
      socket.off("nickname_info");
      socket.off("opponent_left");
      socket.off("error");
    };
  }, [odakodu, kategori, nickname]);

  useEffect(() => {
    if (!siraBende || sonuc) return;

    const timer = setInterval(() => {
      setSure((prev) => {
        if (prev === 1) {
          socket.emit("guess", { tahmin: "-----", odaKodu: odakodu });
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [siraBende, sonuc, odakodu]);

  const tahminGonder = () => {
    if (!siraBende || sonuc) return;
    if (tahmin.length !== 5) return;

    socket.emit("guess", { tahmin, odaKodu: odakodu });
    setTahmin("");
  };

  const harfKutusu = (renk) => {
    if (renk === "correct") return "green";
    if (renk === "present") return "gold";
    return "gray";
  };

  const oyundanCik = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Kategori: {kategori.toUpperCase()}</h2>
      <h4>Oda Kodu: {odakodu}</h4>

      {benimAdim && rakipAd && (
        <div style={{ marginBottom: 10 }}>
          <strong>{benimAdim}</strong> vs <strong>{rakipAd}</strong>
        </div>
      )}

      {sonuc && (
        <div style={styles.resultBox}>
          <h3>{sonuc}</h3>
        </div>
      )}

      <h3>{siraBende ? "✅ Sıra sende!" : "⏳ Rakibi bekliyoruz..."}</h3>
      {siraBende && <h4>Kalan Süre: {sure} saniye</h4>}

      <div style={styles.grid}>
        {gecmisTahminler.map(({ kelime, renkler }, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {kelime.split("").map((harf, i) => (
              <div
                key={i}
                style={{
                  ...styles.cell,
                  backgroundColor: harfKutusu(renkler?.[i]),
                }}
              >
                {harf.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      <input
        maxLength={5}
        value={tahmin}
        onChange={(e) => setTahmin(e.target.value.toLowerCase())}
        disabled={!siraBende || !!sonuc}
        placeholder="5 harfli tahmin"
        style={styles.input}
      />

      <button onClick={tahminGonder} disabled={!siraBende || !!sonuc} style={styles.button}>
        Gönder
      </button>

      <button
        onClick={oyundanCik}
        style={{ ...styles.button, backgroundColor: "#f66", marginTop: "20px" }}
      >
        Oyundan Çık
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0d1117",
    color: "#f0f6fc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  resultBox: {
    backgroundColor: "#1e2a38",
    padding: "12px 24px",
    borderRadius: "10px",
    marginBottom: "20px",
    color: "#facc15",
    fontSize: "22px",
    boxShadow: "0 0 10px rgba(250, 204, 21, 0.3)",
  },
  grid: {
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  cell: {
    width: "45px",
    height: "45px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "45px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  input: {
    fontSize: "20px",
    padding: "10px 16px",
    marginBottom: "16px",
    textTransform: "uppercase",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    width: "200px",
  },
  button: {
    padding: "10px 24px",
    fontSize: "16px",
    backgroundColor: "#238636",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "background-color 0.3s ease",
  },
};

export default OdaGamePage;
