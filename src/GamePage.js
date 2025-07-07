import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socket from "./socket"; // DÜZGÜN ŞEKİLDE TEKİL SOCKET KULLANIMI

function GamePage() {
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get("nickname");
  const { kategori } = useParams();

  const [dogruKelime, setDogruKelime] = useState("");
  const [tahmin, setTahmin] = useState("");
  const [gecmisTahminler, setGecmisTahminler] = useState([]); // [{ kelime: 'elma', renkler: ['correct', ...] }]
  const [sonuc, setSonuc] = useState("");
  const [siraBende, setSiraBende] = useState(false);
  const [sure, setSure] = useState(30);
  const [rematchIstekVar, setRematchIstekVar] = useState(false);
  const [rematchBekleniyor, setRematchBekleniyor] = useState(false);
  const [benimAdim, setBenimAdim] = useState("");
  const [rakipAd, setRakipAd] = useState("");

  useEffect(() => {
    socket.emit("join_game", { kategori, nickname });

    socket.on("match_found", (kelime) => setDogruKelime(kelime));
    socket.on("opponent_guess", (kelime, renkler) =>
      setGecmisTahminler((prev) => [...prev, { kelime, renkler }])
    );
    socket.on("your_turn", (seninSirandaMi) => {
      setSiraBende(seninSirandaMi);
      setSure(30);
    });
    socket.on("game_result", (mesaj) => setSonuc(mesaj));
    socket.on("rematch_request", () => setRematchIstekVar(true));
    socket.on("rematch_response", (cevap) => {
      setRematchBekleniyor(false);
      if (cevap === "yes") {
        setDogruKelime("");
        setGecmisTahminler([]);
        setSonuc("");
        setSiraBende(false);
        setSure(30);
        socket.emit("join_game", { kategori, nickname });
      } else {
        alert("Rakip tekrar oynamak istemedi.");
      }
    });
    socket.on("nickname_info", ({ sen, rakip }) => {
      setBenimAdim(sen);
      setRakipAd(rakip);
    });

    return () => {
      socket.off("match_found");
      socket.off("opponent_guess");
      socket.off("your_turn");
      socket.off("game_result");
      socket.off("rematch_request");
      socket.off("rematch_response");
      socket.off("nickname_info");
    };
  }, [kategori, nickname]);

  useEffect(() => {
    if (!siraBende || sonuc) return;
    const interval = setInterval(() => {
      setSure((prev) => {
        if (prev === 1) {
          socket.emit("guess", { tahmin: "-----", kategori });
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [siraBende, sonuc]);

  const tahminGonder = () => {
    if (tahmin.length !== 5) return;
    socket.emit("guess", { tahmin, kategori });
    setTahmin("");
  };

  const harfKutusu = (renk) => {
    if (renk === "correct") return "green";
    if (renk === "present") return "gold";
    return "gray";
  };

  return (
    <div style={styles.container}>
      <h2>{kategori.toUpperCase()} Kategorisi</h2>
      {benimAdim && rakipAd && <div><strong>{benimAdim}</strong> vs <strong>{rakipAd}</strong></div>}
      {sonuc && <div style={styles.resultBox}><h3>{sonuc}</h3></div>}
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
        disabled={!siraBende || sonuc}
        style={styles.input}
        placeholder="5 HARFLİ TAHMİN"
      />
      <button
  onClick={tahminGonder}
  disabled={!siraBende || sonuc}
  className="fancy-button"
>
  Gönder
</button>


      {sonuc && (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => socket.emit("join_game", { kategori, nickname })} style={styles.button}>
            Yeni Oyuncu ile Oyna
          </button>
          <button onClick={() => {
            setRematchBekleniyor(true);
            socket.emit("rematch_request");
          }} style={styles.button}>
            Rakip ile Tekrar Oyna
          </button>
        </div>
      )}

      {rematchIstekVar && (
        <div style={{ marginTop: 10 }}>
          <p>Rakip tekrar oynamak istiyor. Kabul ediyor musun?</p>
          <button onClick={() => socket.emit("rematch_response", "yes")} style={styles.button}>Evet</button>
          <button onClick={() => socket.emit("rematch_response", "no")} style={styles.button}>Hayır</button>
        </div>
      )}
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


export default GamePage;
