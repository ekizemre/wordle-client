import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import socket from "./socket";

function OdaGamePage() {
  const { odakodu } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nickname = searchParams.get("nickname");
  const paramKategori = searchParams.get("kategori");
  const kategori = paramKategori || "YIYECEKLER";

  const [dogruKelime, setDogruKelime] = useState("");
  const [tahmin, setTahmin] = useState("");
  const [gecmisTahminler, setGecmisTahminler] = useState([]);
  const [sonuc, setSonuc] = useState("");
  const [siraBende, setSiraBende] = useState(false);
  const [sure, setSure] = useState(30);
  const [rakipAd, setRakipAd] = useState("");
  const [benimAdim, setBenimAdim] = useState("");

  useEffect(() => {
    if (kategori) {
      socket.emit("join_game_with_code", { odaKodu: odakodu, kategori, nickname });
    } else {
      socket.emit("join_game_random", { kategori: "Yiyecekler", nickname });
    }

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

    return () => {
      socket.off("match_found");
      socket.off("your_turn");
      socket.off("opponent_guess");
      socket.off("game_result");
      socket.off("nickname_info");
      socket.off("opponent_left");
    };
  }, [kategori, nickname, odakodu]);

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
  }, [siraBende, sonuc]);

  const tahminGonder = () => {
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
    socket.disconnect();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Kategori: {kategori?.toUpperCase()}</h2>
      <h4>Oda Kodu: {odakodu}</h4>

      {benimAdim && rakipAd && (
        <div style={{ marginBottom: 10 }}>
          <strong>{benimAdim}</strong> vs <strong>{rakipAd}</strong>
        </div>
      )}

      {sonuc && <div style={styles.resultBox}><h3>{sonuc}</h3></div>}
      <h3>{siraBende ? "✅ Sıra sende!" : "⏳ Rakibi bekliyoruz..."}</h3>
      {siraBende && <h4>Kalan Süre: {sure} saniye</h4>}

      <div style={styles.grid}>
        {gecmisTahminler.map(({ kelime, renkler }, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {kelime.split("").map((harf, i) => (
              <div key={i} style={{
                ...styles.cell,
                backgroundColor: harfKutusu(renkler?.[i]),
              }}>
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
        placeholder="5 harfli tahmin"
        style={styles.input}
      />
      <button
        onClick={tahminGonder}
        disabled={!siraBende || sonuc}
        style={styles.button}
      >
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
    backgroundColor: "#111",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "50px",
  },
  resultBox: {
    backgroundColor: "#222",
    padding: "10px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "yellow",
    fontSize: "20px",
  },
  grid: {
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    gap: "5px",
    marginBottom: "5px",
  },
  cell: {
    width: "40px",
    height: "40px",
    fontSize: "24px",
    textAlign: "center",
    lineHeight: "40px",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "4px",
  },
  input: {
    fontSize: "18px",
    padding: "10px",
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#61dafb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
};

export default OdaGamePage;
