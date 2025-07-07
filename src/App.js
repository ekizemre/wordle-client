import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./HomePage";           // 🎯 Giriş ekranı (nickname, mod seçimi)
import CategoryPage from "./CategoryPage";   // 🎯 Rastgele eşleşme için kategori seçimi
import GamePage from "./GamePage";           // 🎮 Rastgele eşleşmeli oyun sayfası
import RoomPage from "./RoomPage";           // 🏠 Oda kurma ve kategori seçimi
import OdaGamePage from "./OdaGamePage";     // 🎮 Oda koduyla giriş yapılan oyun ekranı

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kategoriler" element={<CategoryPage />} />
        <Route path="/game/:kategori" element={<GamePage />} />
        <Route path="/oda-kur" element={<RoomPage />} />      {/* ✅ Oda kurma ekranı */}
        <Route path="/oda/:odakodu" element={<OdaGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
