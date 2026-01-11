import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socket from "./socket";

function GamePage() {
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get("nickname");
  const mode = searchParams.get("mode");
  const { kategori } = useParams();

  const [dogruKelime, setDogruKelime] = useState("");
  const [tahmin, setTahmin] = useState("");
  const [gecmisTahminler, setGecmisTahminler] = useState([]);
  const [sonuc, setSonuc] = useState("");
  const [siraBende, setSiraBende] = useState(false);
  const [sure, setSure] = useState(30);
  const [rematchIstekVar, setRematchIstekVar] = useState(false);
  const [rematchBekleniyor, setRematchBekleniyor] = useState(false);
  const [benimAdim, setBenimAdim] = useState("");
  const [rakipAd, setRakipAd] = useState("");

  const resetGameUI = useCallback(() => {
    setDogruKelime("");
    setTahmin("");
    setGecmisTahminler([]);
    setSonuc("");
    setSiraBende(false);
    setSure(30);
    setRematchIstekVar(false);
    setRematchBekleniyor(false);
  }, []);

  const startNewMatch = useCallback(() => {
    resetGameUI();

    if (mode === "bot") {
      socket.emit("play_vs_bot", { kategori, nickname });
    } else {
      socket.emit("join_game", { kategori, nickname });
    }
  }, [kategori, nickname, mode, resetGameUI]);

  useEffect(() => {
    if (!nickname || !kategori) return;

    if (!socket.connected) socket.connect();
    startNewMatch();

    const onMatchFound = (kelime) => {
      setDogruKelime(kelime);
      setTahmin("");
      setGecmisTahminler([]);
      setSonuc("");
      setRematchIstekVar(false);
      setRematchBekleniyor(false);
    };

    const onOpponentGuess = (kelime, renkler) => {
      setGecmisTahminler((prev) => [...prev, { kelime, renkler }]);
    };

    const onYourTurn = (seninSirandaMi) => {
      setSiraBende(seninSirandaMi);
      setSure(30);
    };

    const onGameResult = (mesaj) => {
      setSonuc(mesaj);
      setSiraBende(false);
    };

    const onRematchRequest = () => setRematchIstekVar(true);

    const onRematchResponse = (cevap) => {
      setRematchBekleniyor(false);
      if (cevap === "yes") {
        resetGameUI();
      } else {
        alert("Rakip tekrar oynamak istemedi.");
      }
    };

    const onNicknameInfo = ({ sen, rakip }) => {
      setBenimAdim(sen);
      setRakipAd(rakip);
    };

    socket.on("match_found", onMatchFound);
    socket.on("opponent_guess", onOpponentGuess);
    socket.on("your_turn", onYourTurn);
    socket.on("game_result", onGameResult);
    socket.on("rematch_request", onRematchRequest);
    socket.on("rematch_response", onRematchResponse);
    socket.on("nickname_info", onNicknameInfo);

    return () => {
      socket.off("match_found", onMatchFound);
      socket.off("opponent_guess", onOpponentGuess);
      socket.off("your_turn", onYourTurn);
      socket.off("game_result", onGameResult);
      socket.off("rematch_request", onRematchRequest);
      socket.off("rematch_response", onRematchResponse);
      socket.off("nickname_info", onNicknameInfo);
    };
  }, [kategori, nickname, mode, resetGameUI, startNewMatch]);

  useEffect(() => {
    if (!siraBende || sonuc) return;
    const interval = setInterval(() => {
      setSure((prev) => {
        if (prev === 1) {
          setSiraBende(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [siraBende, sonuc]);

  const tahminGonder = () => {
    if (tahmin.length !== 5 || sonuc) return;
    socket.emit("guess", { tahmin: tahmin.toLowerCase(), kategori });
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

      {benimAdim && rakipAd && (
        <div>
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
                style={{ ...styles.cell, backgroundColor: harfKutusu(renkler?.[i]) }}
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
        style={styles.input}
        placeholder="5 HARFLİ TAHMİN"
      />

      <button onClick={tahminGonder} disabled={!siraBende || !!sonuc} className="fancy-button">
        Gönder
      </button>

      {sonuc && (
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <button onClick={startNewMatch} style={styles.button}>
            Yeni Oyuncu ile Oyna
          </button>

          <button
            onClick={() => {
              if (mode === "bot") {
                startNewMatch();
                return;
              }
              setRematchBekleniyor(true);
              socket.emit("rematch_request");
            }}
            style={styles.button}
            disabled={rematchBekleniyor}
          >
            Rakip ile Tekrar Oyna
          </button>
        </div>
      )}

      {rematchIstekVar && (
        <div style={{ marginTop: 10 }}>
          <p>Rakip tekrar oynamak istiyor. Kabul ediyor musun?</p>
          <button onClick={() => socket.emit("rematch_response", "yes")} style={styles.button}>
            Evet
          </button>
          <button onClick={() => socket.emit("rematch_response", "no")} style={styles.button}>
            Hayır
          </button>
        </div>
      )}
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
  resultBox: {
    background: "rgba(0,0,0,0.25)",
    padding: "12px 20px",
    borderRadius: "12px",
  },
  grid: { marginBottom: "10px" },
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
  },
  button: {
    padding: "14px 22px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    minWidth: "220px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
  },
  cell: {
    width: "40px",
    height: "40px",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    color: "#fff",
    backgroundColor: "#555",
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "center",
  },
};

export default GamePage;
