O'ZBEKISTON RESPUBLIKASI
TIIAME
Ekologiya va huquq fakulteti
Raqamli texnologiyalar va sun'iy intellekt kafedrasi

KURS ISHI

Mavzu: "Farangiz" loyihasi uchun g'oyalar banki, ijtimoiy aloqa va real vaqt chat platformasini ishlab chiqish

Bajardi: Sultonmurodova Farangiz, 213-guruh, 3-bosqich,
Dasturiy injiniring yo'nalishi
Rahbar: -

Toshkent - 2026

============================================================
ANNOTATSIYA

Ushbu kurs ishida "Farangiz" nomli monorepo dasturiy loyihasi asosida g'oyalarni baham ko'rish, izohlar va baholash, foydalanuvchilarni kuzatish, bildirishnomalar hamda real vaqt chat funksiyalariga ega platforma tahlil qilindi va texnik yechimlar yoritildi. Loyiha uch qismdan tashkil topgan: backend (Django + DRF + Channels), web frontend (Next.js + TypeScript + Tailwind CSS) va mobile (Expo + React Native). Kurs ishida tizimning funktsional va nofunktsional talablari, arxitektura, ma'lumotlar modeli, API interfeyslari, xavfsizlik, testlash, deploy va rivojlantirish istiqbollari batafsil bayon qilindi. Natijada amaliyotga tatbiq etilishi mumkin bo'lgan, kengaytiriladigan va ko'p platformali yechim taklif etildi.

Kalit so'zlar: g'oyalar banki, Django, DRF, WebSocket, Next.js, Expo, React Native, JWT, real vaqt chat, bildirishnoma, monorepo.

============================================================
MUNDARIJA

KIRISH
1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI
  1.1. Mavzu dolzarbligi va muammo qo'yilishi
  1.2. Loyiha maqsadi va vazifalari
  1.3. Asosiy foydalanuvchi rollari
  1.4. Funktsional talablar
  1.5. Nofunktsional talablar
  1.6. Analoglar va farqlovchi jihatlar
2-BOB. ARXITEKTURA VA TEXNOLOGIYALAR
  2.1. Umumiy tizim arxitekturasi
  2.2. Backend: Django, DRF, Channels
  2.3. Web frontend: Next.js va UI qatlam
  2.4. Mobile: Expo va React Native
  2.5. Ma'lumotlar almashinuvi va API uslubi
  2.6. DevOps va konteynerlash
3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI
  3.1. Foydalanuvchi va autentifikatsiya modeli
  3.2. G'oyalar, teglar, izohlar va reaksiyalar
  3.3. Kuzatish (follow) va bildirishnomalar
  3.4. Chat xonalari, xabarlar va qo'ng'iroqlar
  3.5. Fayl saqlash va media oqimlari
4-BOB. FUNKTSIONAL MODULLAR TAHLILI
  4.1. Ro'yxatdan o'tish va kirish
  4.2. G'oyalar yaratish va boshqarish
  4.3. Izohlar va layklar
  4.4. Kuzatish va profil boshqaruvi
  4.5. Bildirishnomalar
  4.6. Real vaqt chat
  4.7. Ovozli/video qo'ng'iroqlar
  4.8. Xalqaro til qo'llab-quvvatlashi (i18n)
  4.9. Admin panel va moderatsiya
5-BOB. FOYDALANUVCHI INTERFEYSI VA UX
  5.1. Web ilova interfeysi
  5.2. Mobil ilova interfeysi
  5.3. Dizayn tizimi va theme boshqaruvi
6-BOB. TESTLASH VA SIFAT NAZORATI
  6.1. Backend testlari
  6.2. API tekshirish
  6.3. Manual test ssenariylari
7-BOB. XAVFSIZLIK VA ISHONCHLILIK
  7.1. JWT va sessiya xavfsizligi
  7.2. Ma'lumotlarni validatsiya qilish
  7.3. Tarmoqli himoya va rate-limit
  7.4. Fayl yuklash xavfsizligi
8-BOB. ISHGA TUSHIRISH VA DEPLOY
  8.1. Muhit sozlamalari
  8.2. Docker Compose bilan ishga tushirish
  8.3. Nginx va ishlab chiqarish muhiti
  8.4. Monitoring va loglar
9-BOB. NATIJALAR VA KELAJAK REJALAR
XULOSA
FOYDALANILGAN ADABIYOTLAR
ILOVALAR

============================================================
KIRISH

Bugungi raqamli jamiyatda yangi g'oyalarni tez, tushunarli va xavfsiz tarzda baham ko'rish muhim ahamiyatga ega. Ijtimoiy tarmoqlarda ko'p hollarda yuzaki fikrlar, shov-shuv yoki noaniq baholashlar ustun bo'ladi. "Farangiz" loyihasi esa foydalanuvchilarning real muammolar va innovatsion yechimlar bo'yicha aniq, mazmunli fikr almashinuvini tashkil etishga qaratilgan. Loyiha g'oyalarni tuzilmalashtirilgan shaklda taqdim etish, ularni izohlash, baholash, kuzatish va muhokama qilish, shuningdek real vaqt chat orqali muloqot qilish imkonini beradi.

Ushbu kurs ishining maqsadi - "Farangiz" loyihasini loyihalash va ishlab chiqish jarayonini ilmiy-texnik nuqtai nazardan tahlil qilish, arxitektura va texnologik qarorlarni asoslab berish hamda loyiha funksiyalarini to'liq yoritishdir.

============================================================
1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI

1.1. Mavzu dolzarbligi va muammo qo'yilishi

Startaplar, talabalar, muhandislar va ijodkorlar uchun g'oyalarni baham ko'rish va jamoaviy muhokama qilish platformasi juda muhim. An'anaviy ijtimoiy tarmoqlarda g'oyalar ko'pincha noto'g'ri talqin qilinadi yoki e'tibordan chetda qoladi. Shuning uchun, ixtisoslashgan g'oyalar banki platformasi kerak bo'ladi. "Farangiz" platformasi aynan shu ehtiyojni qondirishni maqsad qiladi.

1.2. Loyiha maqsadi va vazifalari

Maqsad: g'oyalarni joylash, baholash va muhokama qilish, foydalanuvchilarni kuzatish, bildirishnomalar olish hamda real vaqt chat orqali aloqani ta'minlovchi ko'p platformali tizim yaratish.

Vazifalar:
- g'oyalarni yaratish, tahrirlash va o'chirish imkoniyatlarini taqdim etish;
- g'oyalarni teglar, kategoriya va qidiruv bo'yicha filtrlay olish;
- izohlar tizimi va layk funksiyasini joriy etish;
- foydalanuvchi profili, kuzatuv (follow) va statistik ko'rsatkichlarni taqdim etish;
- real vaqt chat va xabar almashish imkoniyatini yaratish;
- bildirishnomalar orqali faoliyatni tezkor yetkazish;
- web va mobil platformalarda bir xil funksional imkoniyatlarni ta'minlash;
- xavfsizlik va ishonchlilikni ta'minlash.

1.3. Asosiy foydalanuvchi rollari

Tizim quyidagi rollarni nazarda tutadi:
- Mehmon foydalanuvchi: ochiq g'oyalarni ko'radi, qidiradi, ammo yozish va baholash imkoniga ega emas.
- Ro'yxatdan o'tgan foydalanuvchi: g'oya yaratadi, izoh qoldiradi, layk bosadi, chat qiladi, profilini boshqaradi.
- Administrator: tizim kontentini boshqaradi, zararli kontentni o'chiradi, foydalanuvchilarni nazorat qiladi.

1.4. Funktsional talablar

Asosiy talablar:
- Ro'yxatdan o'tish va kirish (JWT asosida).
- Profil yaratish va tahrirlash (avatar, bio, kontaktlar).
- G'oya yaratish: sarlavha, qisqa tavsif, to'liq tavsif, kategoriya, teglar, rasm.
- G'oyalarni tahrirlash va o'chirish (faqat muallif).
- G'oyalar tasmalari: umumiy, trend, kuzatilganlar.
- Qidiruv va filtr: sarlavha, kategoriya, teg bo'yicha.
- Izohlar: g'oya uchun izoh qoldirish, o'chirish, javob berish (reply), pin.
- Layk va bookmark funksiyalari.
- Kuzatish (follow/unfollow) va foydalanuvchi statistikasi.
- Bildirishnomalar: layk, izoh, follow uchun.
- Real vaqt chat: shaxsiy va guruh chatlar.
- Fayl biriktirish: rasm, audio, hujjat.
- Push bildirishnomalar (mobil ilovada).
- Ovozli/video qo'ng'iroqlar (Agora integratsiyasi asosida).

1.5. Nofunktsional talablar

- Ishonchlilik: tizim barqaror ishlashi, ma'lumotlar yo'qolmasligi.
- Xavfsizlik: JWT, parol siyosati, rate-limit, CSRF va CORS nazorati.
- Kengaytiriluvchanlik: monorepo arxitektura, modulli backend.
- Samaradorlik: Redis kesh, paginatsiya, full-text search.
- Moslashuvchanlik: web va mobile interfeyslar.
- Lokalizatsiya: UI matnlarini ko'p tilga moslash (uz/ru/en).

1.6. Analoglar va farqlovchi jihatlar

Mavjud ijtimoiy platformalarda g'oyalar umumiy kontent ichida yo'qolib ketishi mumkin. "Farangiz" loyihasi esa aynan g'oya almashish va konstruktiv fikr bildirishga yo'naltirilgan. Shuningdek, real vaqt chat va push bildirishnomalar integratsiyasi platformani jamoaviy ishlash uchun qulay qiladi.

============================================================
2-BOB. ARXITEKTURA VA TEXNOLOGIYALAR

2.1. Umumiy tizim arxitekturasi

Loyiha monorepo tarzida tashkil etilgan va uchta asosiy moduldan iborat:
- Backend: biznes mantiq, API va real vaqt tarmoqlar.
- Web frontend: brauzer orqali foydalanuvchi interfeysi.
- Mobile: iOS va Android uchun mobil ilova.

Arxitektura asosida REST API va WebSocket protokollari ishlatiladi. Ma'lumotlar PostgreSQL bazasida saqlanadi, Redis esa real vaqt xabarlar va keshlash uchun ishlatiladi.

2.2. Backend: Django, DRF, Channels

Backend Django 5 asosida qurilgan. DRF (Django REST Framework) orqali API endpointlar yaratilgan. Channels kutubxonasi WebSocket orqali real vaqt chatni ta'minlaydi. JWT autentifikatsiya va refresh tokenlar orqali xavfsiz sessiya boshqariladi.

Backend asosiy komponentlari:
- apps.accounts: foydalanuvchi modeli, autentifikatsiya, follow tizimi.
- apps.ideas: g'oyalar, izohlar, layklar, bookmarklar.
- apps.notifications: bildirishnomalar.
- apps.chat: chat xonalar, xabarlar, qo'ng'iroqlar.

2.3. Web frontend: Next.js va UI qatlam

Web ilova Next.js (App Router) asosida qurilgan. TypeScript orqali turlar aniqligi ta'minlanadi. UI Tailwind CSS yordamida bezatilgan. React Query server ma'lumotlarini kesh qilish va sinxronlashtirishda ishlatiladi. WebSocket orqali chat real vaqt rejimida ishlaydi.

2.4. Mobile: Expo va React Native

Mobil ilova Expo asosida qurilgan. Expo Router ilova marshrutlashini soddalashtiradi. React Native orqali iOS va Android uchun bir xil kod bazasi ishlatiladi. Mobil ilova push bildirishnomalar (expo-notifications), geolokatsiya (expo-location), fayl va media boshqaruvi (expo-file-system, expo-image-picker) funksiyalarini qo'llab-quvvatlaydi.

2.5. Ma'lumotlar almashinuvi va API uslubi

Barcha asosiy funktsiyalar REST API orqali ishlaydi. Real vaqt chat va qo'ng'iroqlar uchun WebSocket kanali ishlatiladi. API endpointlar drf-spectacular orqali hujjatlashtirilgan va Swagger UI orqali ko'rish mumkin.

2.6. DevOps va konteynerlash

Loyiha Docker Compose orqali ishga tushiriladi. Compose faylida quyidagi xizmatlar mavjud:
- Postgres (ma'lumotlar bazasi)
- Redis (kesh va WebSocket broker)
- Backend (Django + Daphne)
- Frontend (Next.js)
- Nginx (reverse proxy, SSL, statik fayllar)

Bu yondashuv lokal va ishlab chiqarish muhitlarini bir xil sozlamada ishlatish imkonini beradi.

============================================================
3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI

3.1. Foydalanuvchi va autentifikatsiya modeli

Foydalanuvchi modeli quyidagi maydonlarni o'z ichiga oladi:
- username, email, password
- bio, avatar_url, avatar_file
- telefon, joylashuv (location, latitude, longitude)
- portfolio_file
- expo_push_token

Qo'shimcha model va bog'lanishlar:
- Follow: foydalanuvchilarni kuzatish
- PasswordResetOTP: parol tiklash uchun OTP
- UserDevice: qurilma va tokenlarni saqlash

3.2. G'oyalar, teglar, izohlar va reaksiyalar

G'oya modeli:
- title, short_description, full_description
- category, tags (Many-to-Many)
- image (fayl)
- author
- views_count

Izohlar:
- comment (body), reply (parent), image
- like (comment like)

Reaksiyalar va saqlash:
- IdeaLike: g'oyaga layk
- Bookmark: g'oyani saqlash

3.3. Kuzatish (follow) va bildirishnomalar

Notification modeli:
- user (qabul qiluvchi)
- actor (harakat qilgan foydalanuvchi)
- idea (ixtiyoriy)
- notification_type (like, comment, follow)
- message, is_read

3.4. Chat xonalari, xabarlar va qo'ng'iroqlar

ChatRoom modeli:
- participants
- is_group, name, description
- created_by, avatar_url

Message modeli:
- room, sender
- body, reply_to
- image, audio, file
- created_at, is_read, is_deleted

Call modeli:
- room, caller, callee
- call_type (voice/video)
- status, duration
- agora_channel, agora_token

3.5. Fayl saqlash va media oqimlari

Backend media fayllarni media/ katalogida saqlaydi. G'oya rasmlari, izoh rasmlari, chat fayllari, avatarlar va portfoliolar shu katalogda joylashadi. Nginx orqali media fayllar statik tarzda tarqatiladi.

============================================================
4-BOB. FUNKTSIONAL MODULLAR TAHLILI

4.1. Ro'yxatdan o'tish va kirish

Foydalanuvchi JWT token asosida ro'yxatdan o'tadi va login qiladi. Refresh token cookie orqali saqlanadi. Parol siyosati qat'iyligi validatorlar orqali ta'minlanadi. Parolni tiklash uchun OTP yuborish mexanizmi mavjud.

4.2. G'oyalar yaratish va boshqarish

Foydalanuvchi g'oya yaratishi mumkin. G'oya sarlavha, qisqa va to'liq tavsif, kategoriya, teglar va rasm bilan birga saqlanadi. G'oya muallifi uni tahrirlash va o'chirish huquqiga ega.

4.3. Izohlar va layklar

G'oyalar uchun izohlar yoziladi. Har bir izohni layk qilish yoki o'chirish imkoniyati bor. Izohlar thread shaklida (parent/reply) tashkil etiladi.

4.4. Kuzatish va profil boshqaruvi

Foydalanuvchilar bir-birini kuzatishi mumkin. Kuzatish orqali foydalanuvchining g'oyalari "Following" tasmasida ko'rsatiladi. Profil sahifasida foydalanuvchi statistikasi: followers, following, ideas count ko'rsatiladi.

4.5. Bildirishnomalar

Loyihada bildirishnomalar quyidagi hodisalarda yaratiladi:
- g'oya layk qilinsa
- g'oyaga izoh qoldirilsa
- foydalanuvchi follow qilinsa

Mobil ilovada push bildirishnomalar (Expo push) mavjud.

4.6. Real vaqt chat

Chat funksiyasi WebSocket orqali ishlaydi. Chat xonalari shaxsiy yoki guruh bo'lishi mumkin. Xabarlar real vaqt rejimida yuboriladi va o'qilgan holati (read) belgilanishi mumkin. Fayl va media biriktirish imkoniyati bor.

4.7. Ovozli/video qo'ng'iroqlar

Agora SDK yordamida voice/video qo'ng'iroqlarni yaratish mexanizmi mavjud. Backend call modeli orqali qo'ng'iroq holatlari (calling, ringing, connected, ended) saqlanadi.

4.8. Xalqaro til qo'llab-quvvatlashi (i18n)

Loyiha UI matnlarini uch tilga moslashni qo'llab-quvvatlaydi: uz, ru, en. Backendda g'oya matnlari uchun i18n maydonlar ajratilgan.

4.9. Admin panel va moderatsiya

Django admin panel Jazzmin bilan bezatilgan. Admin foydalanuvchilarni, g'oyalarni, izohlarni va bildirishnomalarni boshqarishi mumkin.

============================================================
5-BOB. FOYDALANUVCHI INTERFEYSI VA UX

5.1. Web ilova interfeysi

Web ilova quyidagi sahifalarni o'z ichiga oladi:
- Home (g'oyalar tasmalari)
- Idea detail (g'oya va izohlar)
- Profile
- Chat va notifications
- Login va Register

UI elementlari Tailwind CSS yordamida yaratilgan. Interface minimalistik, tezkor va tushunarli tarzda ishlab chiqilgan.

5.2. Mobil ilova interfeysi

Mobil ilova Expo Router orqali (tabs) navigatsiyasiga ega:
- Feed (g'oyalar)
- Chat
- Notifications
- Profile

Mobil UI foydalanuvchi uchun qulay va tezkor boshqaruvni ta'minlaydi. Push bildirishnomalar real vaqt xabarlarni yetkazadi.

5.3. Dizayn tizimi va theme boshqaruvi

Loyihada ranglar palitrasi, typografiya, spacing va shadows kabi dizayn sistemasi mavjud. Theme boshqaruvi light/dark rejimlarini qo'llab-quvvatlaydi.

============================================================
6-BOB. TESTLASH VA SIFAT NAZORATI

6.1. Backend testlari

Backend uchun pytest asosida unit testlar yozilgan. Testlar quyidagilarni qamrab oladi:
- Auth va follow funksiyalari
- G'oya yaratish va validatsiya
- Izohlar va layklar
- Bildirishnomalar

6.2. API tekshirish

API endpointlar Swagger orqali ko'rib chiqiladi. Har bir endpoint uchun talablar va javob formatlari tekshiriladi.

6.3. Manual test ssenariylari

- Ro'yxatdan o'tish va login
- G'oya yaratish, tahrirlash, o'chirish
- Chatda xabar yuborish
- Bildirishnoma kelishi
- Profil va follow tekshirish

============================================================
7-BOB. XAVFSIZLIK VA ISHONCHLILIK

7.1. JWT va sessiya xavfsizligi

Access tokenlar qisqa muddatli, refresh tokenlar esa cookie orqali xavfsiz saqlanadi.

7.2. Ma'lumotlarni validatsiya qilish

Backendda serializerlar va validatorlar yordamida input tekshiruvlari amalga oshiriladi. Teglar uchun regex cheklovi, parol siyosati va string uzunligi nazorati mavjud.

7.3. Tarmoqli himoya va rate-limit

REST Framework throttle orqali anon va autentifikatsiyalangan foydalanuvchilarga so'rov limitlari qo'yilgan.

7.4. Fayl yuklash xavfsizligi

Fayllar serverda media/ katalogda saqlanadi. Fayl turlari va o'lchamlari chekli bo'lishi rejalashtirilgan.

============================================================
8-BOB. ISHGA TUSHIRISH VA DEPLOY

8.1. Muhit sozlamalari

Loyiha .env fayllar orqali konfiguratsiya qilinadi. Asosiy o'zgaruvchilar: DB, Redis, JWT, CORS, email.

8.2. Docker Compose bilan ishga tushirish

Tizim bir buyruq bilan ishga tushiriladi:
- docker compose up --build
- migratsiyalarni bajarish
- superuser yaratish

8.3. Nginx va ishlab chiqarish muhiti

Nginx reverse proxy sifatida xizmat qiladi. Statik fayllar va media fayllar Nginx orqali taqdim etiladi. SSL sertifikatlar bilan himoya qo'llab-quvvatlanadi.

8.4. Monitoring va loglar

Backend loglari fayl tizimida saqlanadi. Redis va Postgres healthcheck orqali nazorat qilinadi.

============================================================
9-BOB. NATIJALAR VA KELAJAK REJALAR

Natija sifatida "Farangiz" loyihasi g'oyalar banki, ijtimoiy muloqot va real vaqt chat funksiyalariga ega, ko'p platformali tizim sifatida shakllandi.

Kelajakdagi rejalashtirilgan imkoniyatlar:
- ML asosidagi g'oyalarni tavsiya qilish
- Moderatsiya va spam filtrlari
- Video kontent va live stream
- Kengaytirilgan analytics panel

============================================================
XULOSA

Ushbu kurs ishida "Farangiz" loyihasi batafsil tahlil qilindi. Loyiha zamonaviy web va mobil texnologiyalar asosida qurilgan bo'lib, foydalanuvchilar uchun g'oya almashish, baholash va real vaqt muloqot imkoniyatlarini taqdim etadi. Django backend, Next.js frontend va Expo mobil ilovasi integratsiyasi kuchli arxitektura yaratadi. Natijada tizim amaliyotga tatbiq etish uchun tayyor holatga keltirilgan.

============================================================
FOYDALANILGAN ADABIYOTLAR

1. Django hujjatlari.
2. Django REST Framework hujjatlari.
3. Next.js hujjatlari.
4. React va React Native hujjatlari.
5. WebSocket va real vaqt tizimlari bo'yicha manbalar.
6. PostgreSQL va Redis hujjatlari.

============================================================
ILOVALAR

Ilova A. API endpointlar ro'yxati (qisqacha)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/me
- GET /api/ideas
- POST /api/ideas
- GET /api/ideas/{id}
- PATCH /api/ideas/{id}
- DELETE /api/ideas/{id}
- POST /api/ideas/{id}/like
- GET /api/ideas/trending?days=7
- GET /api/ideas/following
- POST /api/ideas/{id}/bookmark
- GET /api/ideas/bookmarks
- GET /api/ideas/{id}/comments
- POST /api/ideas/{id}/comments
- DELETE /api/comments/{id}
- GET /api/notifications/
- POST /api/notifications/{id}/read/
- POST /api/notifications/read-all/
- GET /api/chat/rooms
- POST /api/chat/rooms/get-or-create/
- GET /api/chat/rooms/{id}/messages
- POST /api/chat/rooms/{id}/send_message/
- POST /api/calls

Ilova B. Tuzilma (monorepo)
- backend/
- frontend/
- mobile/
- nginx/

Ilova C. Tavsiya etilgan screenshotlar
- Home feed
- Idea detail
- Chat screen
- Profile screen
