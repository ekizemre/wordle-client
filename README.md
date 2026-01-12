Wordle PvP

Wordle PvP, React ve Node.js (Socket.IO) kullanılarak geliştirilmiş, gerçek zamanlı çok oyunculu ve bot destekli bir kelime tahmin oyunudur. Proje, hem PvP hem de tek oyunculu senaryolarda stabil çalışacak şekilde tasarlanmıştır.

Özellikler

Gerçek zamanlı PvP oyun yapısı

Bot ile tek oyunculu oynama modu

Oda kurma ve oda kodu ile katılma

Türkçe, 5 harfli kelime havuzu

Tekrar oynama (rematch) desteği

Stabil socket mimarisi ve aktif oda yönetimi

Bot Mantığı

Bot, seçilen kategoriye göre kelime havuzundan tahmin yapan basit bir yapıdadır. Oyuncu ile aynı oyun kurallarına tabidir ve PvP altyapısı ile aynı sistem üzerinden çalışır. Bu sayede oyun tek başına oynanabilir hâle gelirken, gerçek zamanlı oyun akışı bozulmaz.

Kullanılan Teknolojiler

Frontend: React

Backend: Node.js, Express

Realtime: Socket.IO

Kurulum
Client
cd client
npm install
npm start

Server
cd server
npm install
node index.js


Varsayılan olarak server 3001 portunda çalışır.

Oyun Modları

Rastgele PvP: Kategori seçerek rastgele rakiple eşleşme

Bot Modu: Rakip beklemeden tek başına oynama

Özel Oda: Oda kurarak arkadaşlarla oynama

Geliştirmeye Açık Alanlar

Daha akıllı bot mantığı

Skor ve istatistik sistemi

Daha geniş kelime havuzu

Yeniden bağlanma (reconnect) desteği

Not

Bu proje, gerçek zamanlı uygulamalarda state yönetimi ve socket mimarisini pratik etmek amacıyla geliştirilmiştir.
