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
  1.7. Foydalanish ssenariylari (use-case)
2-BOB. ARXITEKTURA VA TEXNOLOGIYALAR
  2.1. Umumiy tizim arxitekturasi
  2.2. Backend: Django, DRF, Channels
  2.3. Web frontend: Next.js va UI qatlam
  2.4. Mobile: Expo va React Native
  2.5. Ma'lumotlar almashinuvi va API uslubi
  2.6. DevOps va konteynerlash
  2.7. Komponentlararo integratsiya
3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI
  3.1. Foydalanuvchi va autentifikatsiya modeli
  3.2. G'oyalar, teglar, izohlar va reaksiyalar
  3.3. Kuzatish (follow) va bildirishnomalar
  3.4. Chat xonalari, xabarlar va qo'ng'iroqlar
  3.5. Fayl saqlash va media oqimlari
  3.6. ER diagramma tavsifi
4-BOB. FUNKTSIONAL MODULLAR TAHLILI
  4.1. Ro'yxatdan o'tish va kirish
  4.2. G'oyalar yaratish va boshqarish
  4.3. Izohlar va layklar
  4.4. Kuzatish va profil boshqaruvi
  4.5. Bildirishnomalar
  4.6. Real vaqt chat
  4.7. Ovozli/video qo'ng'iroqlar
  4.8. Qidiruv, trend va filtrlar
  4.9. Bookmark va saqlash
  4.10. Xalqaro til qo'llab-quvvatlashi (i18n)
  4.11. Admin panel va moderatsiya
5-BOB. FOYDALANUVCHI INTERFEYSI VA UX
  5.1. Web ilova interfeysi
  5.2. Mobil ilova interfeysi
  5.3. Dizayn tizimi va theme boshqaruvi
  5.4. UX tamoyillari va foydalanish qulayligi
6-BOB. TESTLASH VA SIFAT NAZORATI
  6.1. Backend testlari
  6.2. API tekshirish
  6.3. Manual test ssenariylari
  6.4. Ishonchlilik va regressiya
7-BOB. XAVFSIZLIK VA ISHONCHLILIK
  7.1. JWT va sessiya xavfsizligi
  7.2. Ma'lumotlarni validatsiya qilish
  7.3. Tarmoqli himoya va rate-limit
  7.4. Fayl yuklash xavfsizligi
  7.5. Zaxira va tiklash strategiyasi
8-BOB. ISHGA TUSHIRISH VA DEPLOY
  8.1. Muhit sozlamalari
  8.2. Docker Compose bilan ishga tushirish
  8.3. Nginx va ishlab chiqarish muhiti
  8.4. Monitoring va loglar
  8.5. Kengaytirish va skalalash
9-BOB. NATIJALAR VA KELAJAK REJALAR
XULOSA
FOYDALANILGAN ADABIYOTLAR
ILOVALAR

============================================================
KIRISH

Bugungi raqamli jamiyatda yangi g'oyalarni tez, tushunarli va xavfsiz tarzda baham ko'rish muhim ahamiyatga ega. Ijtimoiy tarmoqlarda ko'p hollarda yuzaki fikrlar, shov-shuv yoki noaniq baholashlar ustun bo'ladi. "Farangiz" loyihasi esa foydalanuvchilarning real muammolar va innovatsion yechimlar bo'yicha aniq, mazmunli fikr almashinuvini tashkil etishga qaratilgan. Loyiha g'oyalarni tuzilmalashtirilgan shaklda taqdim etish, ularni izohlash, baholash, kuzatish va muhokama qilish, shuningdek real vaqt chat orqali muloqot qilish imkonini beradi.

Ushbu kurs ishining maqsadi - "Farangiz" loyihasini loyihalash va ishlab chiqish jarayonini ilmiy-texnik nuqtai nazardan tahlil qilish, arxitektura va texnologik qarorlarni asoslab berish hamda loyiha funksiyalarini to'liq yoritishdir. Asosiy e'tibor ishlab chiqilgan modullar o'rtasidagi integratsiya, ma'lumotlar modeli va foydalanuvchi tajribasiga qaratiladi. Loyiha bazasida g'oya almashish muhitini yaratish, uning adolatli baholanishini ta'minlash va foydalanuvchilar o'rtasida real vaqt muloqotni yo'lga qo'yish turadi.

============================================================
1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI

1.1. Mavzu dolzarbligi va muammo qo'yilishi

Startaplar, talabalar, muhandislar va ijodkorlar uchun g'oyalarni baham ko'rish va jamoaviy muhokama qilish platformasi juda muhim. An'anaviy ijtimoiy tarmoqlarda g'oyalar ko'pincha noto'g'ri talqin qilinadi yoki e'tibordan chetda qoladi. Shu sababli, ixtisoslashgan g'oyalar banki platformasi talab qilinadi. "Farangiz" platformasi aynan shu ehtiyojni qondirishni maqsad qiladi.

Muammo shundaki, g'oyalarni baholash, izohlash va konstruktiv fikr bildirish uchun strukturalangan muhit yo'q. Shu bois loyihada g'oyalarni tizimli saqlash, tahlil qilish va jamoaviy muhokama qilish imkoniyati yaratiladi. Tizim foydalanuvchilarga g'oyalarni izohlash, yoqtirish (like), saqlab qo'yish (bookmark) hamda kuzatish (follow) orqali faoliyatni boshqarish imkonini beradi.

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

Loyihaning yakuniy maqsadi - g'oya almashish jarayonini soddalashtirish, jamoaviy fikr almashish uchun qulay muhit yaratish va foydalanuvchilar o'rtasidagi muloqotni kuchaytirishdir.

1.3. Asosiy foydalanuvchi rollari

Tizim quyidagi rollarni nazarda tutadi:
- Mehmon foydalanuvchi: ochiq g'oyalarni ko'radi, qidiradi, ammo yozish va baholash imkoniga ega emas.
- Ro'yxatdan o'tgan foydalanuvchi: g'oya yaratadi, izoh qoldiradi, layk bosadi, chat qiladi, profilini boshqaradi.
- Administrator: tizim kontentini boshqaradi, zararli kontentni o'chiradi, foydalanuvchilarni nazorat qiladi.

Har bir rolga mos ruxsatlar tizimi backendda aniq nazorat qilinadi. Masalan, g'oyani tahrirlash faqat muallifga ruxsat etiladi, admin esa barcha g'oyalarni boshqarishi mumkin.

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

Funktsional talablar dasturiy ta'minotning asosiy imkoniyatlarini ifodalaydi. Har bir funksiyani bajarish jarayoni qisqa va intuitiv bo'lishi lozim. Masalan, g'oya yaratish uchun foydalanuvchi atigi bir nechta maydonni to'ldiradi va yuboradi, keyin esa g'oya tasmasida ko'rinadi.

1.5. Nofunktsional talablar

- Ishonchlilik: tizim barqaror ishlashi, ma'lumotlar yo'qolmasligi.
- Xavfsizlik: JWT, parol siyosati, rate-limit, CSRF va CORS nazorati.
- Kengaytiriluvchanlik: monorepo arxitektura, modulli backend.
- Samaradorlik: Redis kesh, paginatsiya, full-text search.
- Moslashuvchanlik: web va mobile interfeyslar.
- Lokalizatsiya: UI matnlarini ko'p tilga moslash (uz/ru/en).
- Ux tomonidan qulaylik: minimal kliks, tez yuklanish, aniq navigatsiya.

Bu talablar tizimning sifat ko'rsatkichlarini ta'minlaydi. Masalan, samaradorlik talabi qidiruv va ro'yxatlash jarayonlarini tezkor qiladi, xavfsizlik talabi esa foydalanuvchi ma'lumotlarini himoya qiladi.

1.6. Analoglar va farqlovchi jihatlar

Mavjud ijtimoiy platformalarda g'oyalar umumiy kontent ichida yo'qolib ketishi mumkin. "Farangiz" loyihasi esa aynan g'oya almashish va konstruktiv fikr bildirishga yo'naltirilgan. Shuningdek, real vaqt chat va push bildirishnomalar integratsiyasi platformani jamoaviy ishlash uchun qulay qiladi. Loyiha monorepo yondashuvi bilan web va mobil ilovalarni birgalikda boshqarish imkoniyatini beradi.

1.7. Foydalanish ssenariylari (use-case)

- Ssenariy 1: foydalanuvchi ro'yxatdan o'tadi, profilini to'ldiradi va birinchi g'oyasini joylaydi.
- Ssenariy 2: boshqa foydalanuvchi g'oyani ko'radi, izoh qoldiradi va layk bosadi.
- Ssenariy 3: muallifga bildirishnoma keladi va u chat orqali muhokamani davom ettiradi.
- Ssenariy 4: foydalanuvchi trend g'oyalarni ko'rib, o'ziga foydali bo'lgan g'oyalarni bookmark qiladi.
- Ssenariy 5: guruh chatda bir nechta foydalanuvchilar g'oya ustida ishlaydi va qo'shimcha fayllarni biriktiradi.

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

Backend ichida ORM (Django ORM) orqali ma'lumotlar bazasi bilan ishlash soddalashtirilgan. Serializerlar APIga chiqadigan JSON formatni belgilaydi. ViewSetlar esa CRUD amallarni bir joyda yig'ib, kodni ixchamlashtiradi.

2.3. Web frontend: Next.js va UI qatlam

Web ilova Next.js (App Router) asosida qurilgan. TypeScript orqali turlar aniqligi ta'minlanadi. UI Tailwind CSS yordamida bezatilgan. React Query server ma'lumotlarini kesh qilish va sinxronlashtirishda ishlatiladi. WebSocket orqali chat real vaqt rejimida ishlaydi. Next.js sahifalarida SEO va tezkor rendering imkoniyatlari mavjud.

2.4. Mobile: Expo va React Native

Mobil ilova Expo asosida qurilgan. Expo Router ilova marshrutlashini soddalashtiradi. React Native orqali iOS va Android uchun bir xil kod bazasi ishlatiladi. Mobil ilova push bildirishnomalar (expo-notifications), geolokatsiya (expo-location), fayl va media boshqaruvi (expo-file-system, expo-image-picker) funksiyalarini qo'llab-quvvatlaydi.

2.5. Ma'lumotlar almashinuvi va API uslubi

Barcha asosiy funktsiyalar REST API orqali ishlaydi. Real vaqt chat va qo'ng'iroqlar uchun WebSocket kanali ishlatiladi. API endpointlar drf-spectacular orqali hujjatlashtirilgan va Swagger UI orqali ko'rish mumkin. API javoblari JSON formatida bo'ladi. Foydalanuvchi autentifikatsiyasi JWT tokenlari bilan boshqariladi.

2.6. DevOps va konteynerlash

Loyiha Docker Compose orqali ishga tushiriladi. Compose faylida quyidagi xizmatlar mavjud:
- Postgres (ma'lumotlar bazasi)
- Redis (kesh va WebSocket broker)
- Backend (Django + Daphne)
- Frontend (Next.js)
- Nginx (reverse proxy, SSL, statik fayllar)

Bu yondashuv lokal va ishlab chiqarish muhitlarini bir xil sozlamada ishlatish imkonini beradi. Har bir servis alohida konteynerda ishlashi tizimni kengaytirish va boshqarishni osonlashtiradi.

2.7. Komponentlararo integratsiya

Frontend va mobile ilovalar backend REST API orqali ma'lumot oladi. Chat real vaqt bo'lgani uchun WebSocket orqali xabarlar almashiladi. API endpointlar autentifikatsiya talab qilganda JWT tokenlar ishlatiladi. Push bildirishnomalar mobil ilovada Expo tokenlari orqali yuboriladi.

============================================================
3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI

3.1. Foydalanuvchi va autentifikatsiya modeli

Foydalanuvchi modeli quyidagi maydonlarni o'z ichiga oladi:
- username, email, password
- bio, avatar_url, avatar_file
- birth_date, phone, location
- latitude, longitude (geolokatsiya)
- portfolio_file
- expo_push_token

Qo'shimcha model va bog'lanishlar:
- Follow: foydalanuvchilarni kuzatish
- PasswordResetOTP: parol tiklash uchun OTP
- UserDevice: qurilma va tokenlarni saqlash

Register jarayonida foydalanuvchidan portfolio fayl (PDF, DOC, DOCX yoki ZIP) yuklash talab qilinadi. Bu talab foydalanuvchi haqida qo'shimcha ma'lumot yig'ish va platformada ishonchlilikni oshirishga xizmat qiladi.

3.2. G'oyalar, teglar, izohlar va reaksiyalar

G'oya modeli:
- title (max 120), short_description (max 280), full_description (max 5000)
- category (max 80), tags (Many-to-Many)
- image (fayl)
- author
- views_count

G'oyalar uchun i18n maydonlari mavjud: title_i18n, short_description_i18n, full_description_i18n, category_i18n. Bu maydonlar g'oya tarjimalarini saqlashga imkon beradi.

Izohlar:
- comment (body), reply (parent), image
- like (comment like)
- is_pinned (muallif yoki admin tomonidan pinlash)

Reaksiyalar va saqlash:
- IdeaLike: g'oyaga layk
- Bookmark: g'oyani saqlash

3.3. Kuzatish (follow) va bildirishnomalar

Notification modeli:
- user (qabul qiluvchi)
- actor (harakat qilgan foydalanuvchi)
- idea (ixtiyoriy)
- notification_type (like, comment, follow)
- message, is_read, created_at

3.4. Chat xonalari, xabarlar va qo'ng'iroqlar

ChatRoom modeli:
- participants (ko'p foydalanuvchi)
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

3.6. ER diagramma tavsifi

Ma'lumotlar modeli quyidagi asosiy bog'lanishlardan iborat:
- User 1..* Idea (muallif - g'oyalar)
- Idea *..* Tag (g'oyalar va teglar)
- Idea 1..* Comment (g'oya - izohlar)
- Comment 1..* Comment (reply)
- User *..* Idea (IdeaLike va Bookmark)
- User *..* User (Follow)
- User 1..* Notification
- User *..* ChatRoom (participants)
- ChatRoom 1..* Message
- ChatRoom 1..* Call

============================================================
4-BOB. FUNKTSIONAL MODULLAR TAHLILI

4.1. Ro'yxatdan o'tish va kirish

Foydalanuvchi JWT token asosida ro'yxatdan o'tadi va login qiladi. Refresh token cookie orqali saqlanadi. Parol siyosati qat'iyligi validatorlar orqali ta'minlanadi. Parolni tiklash uchun OTP yuborish mexanizmi mavjud. OTP yuborishda qayta so'rov uchun cooldown va maksimal urinishlar cheklovi mavjud.

4.2. G'oyalar yaratish va boshqarish

Foydalanuvchi g'oya yaratishi mumkin. G'oya sarlavha, qisqa va to'liq tavsif, kategoriya, teglar va rasm bilan birga saqlanadi. G'oya muallifi uni tahrirlash va o'chirish huquqiga ega. G'oya ko'rilganida views_count avtomatik oshadi. G'oya o'zgartirilsa, i18n maydonlari ham mos ravishda yangilanadi.

4.3. Izohlar va layklar

G'oyalar uchun izohlar yoziladi. Har bir izohni layk qilish yoki o'chirish imkoniyati bor. Izohlar thread shaklida (parent/reply) tashkil etiladi. Izohlar uchun image biriktirish mumkin.

4.4. Kuzatish va profil boshqaruvi

Foydalanuvchilar bir-birini kuzatishi mumkin. Kuzatish orqali foydalanuvchining g'oyalari "Following" tasmasida ko'rsatiladi. Profil sahifasida foydalanuvchi statistikasi: followers, following, total_ideas, total_likes_received ko'rsatiladi. Profil tahrirlashda avatar va portfolio faylini yangilash mumkin.

4.5. Bildirishnomalar

Loyihada bildirishnomalar quyidagi hodisalarda yaratiladi:
- g'oya layk qilinsa
- g'oyaga izoh qoldirilsa
- foydalanuvchi follow qilinsa

Mobil ilovada push bildirishnomalar (Expo push) mavjud. Notificationlar o'qilgan holatga o'tkazilishi mumkin.

4.6. Real vaqt chat

Chat funksiyasi WebSocket orqali ishlaydi. Chat xonalari shaxsiy yoki guruh bo'lishi mumkin. Xabarlar real vaqt rejimida yuboriladi va o'qilgan holati (read) belgilanishi mumkin. Fayl va media biriktirish imkoniyati bor. Message modeli reply_to maydoni orqali javob xabarlarni bog'laydi.

4.7. Ovozli/video qo'ng'iroqlar

Agora SDK yordamida voice/video qo'ng'iroqlarni yaratish mexanizmi mavjud. Backend call modeli orqali qo'ng'iroq holatlari (calling, ringing, connected, ended) saqlanadi. Mobil ilovada call kontekstlari mavjud.

4.8. Qidiruv, trend va filtrlar

G'oyalar qidiruvi full-text search asosida ishlaydi. Trend bo'limi so'nggi 7 kunlik layklar bo'yicha saralangan g'oyalarni ko'rsatadi. Filtrlar kategoriya, teg va muallifga asoslanadi. Qidiruvda sarlavha, qisqa va to'liq tavsif bo'yicha search vector ishlatiladi.

4.9. Bookmark va saqlash

Foydalanuvchi o'zi yoqtirgan g'oyalarni bookmark qilib saqlaydi. Bu ro'yxat keyinchalik "My bookmarks" bo'limidan ko'rinadi. Bookmarklar unique bo'lib, takroran bosilganda o'chiriladi.

4.10. Xalqaro til qo'llab-quvvatlashi (i18n)

Loyiha UI matnlarini uch tilga moslashni qo'llab-quvvatlaydi: uz, ru, en. Backendda g'oya matnlari uchun i18n maydonlar ajratilgan. API javobida foydalanuvchi Accept-Language headeriga mos tarjima qaytariladi.

4.11. Admin panel va moderatsiya

Django admin panel Jazzmin bilan bezatilgan. Admin foydalanuvchilarni, g'oyalarni, izohlarni va bildirishnomalarni boshqarishi mumkin. Admin viewsetlar orqali g'oyalarni va izohlarni markazlashgan boshqarish imkoniyati mavjud.

============================================================
5-BOB. FOYDALANUVCHI INTERFEYSI VA UX

5.1. Web ilova interfeysi

Web ilova quyidagi sahifalarni o'z ichiga oladi:
- Home (g'oyalar tasmalari)
- Idea detail (g'oya va izohlar)
- Profile
- Chat va notifications
- Login va Register

UI elementlari Tailwind CSS yordamida yaratilgan. Interface minimalistik, tezkor va tushunarli tarzda ishlab chiqilgan. Web interfeysda g'oya kartalari, profil statistikasi va chat oynalari foydalanuvchiga qulay ko'rinishda taqdim etiladi.

5.2. Mobil ilova interfeysi

Mobil ilova Expo Router orqali (tabs) navigatsiyasiga ega:
- Feed (g'oyalar)
- Chat
- Notifications
- Profile

Mobil UI foydalanuvchi uchun qulay va tezkor boshqaruvni ta'minlaydi. Push bildirishnomalar real vaqt xabarlarni yetkazadi. Mobil ilovada map view va geolokatsiya ko'rsatish imkoniyati mavjud.

5.3. Dizayn tizimi va theme boshqaruvi

Loyihada ranglar palitrasi, typografiya, spacing va shadows kabi dizayn sistemasi mavjud. Theme boshqaruvi light/dark rejimlarini qo'llab-quvvatlaydi. Ranglar to'plami constants orqali boshqariladi.

5.4. UX tamoyillari va foydalanish qulayligi

UI foydalanuvchi uchun minimal kognitiv yuk bilan mo'ljallangan. Har bir asosiy funksiya 2-3 bosqichda bajariladi. Navigatsiya tablar orqali sodda boshqariladi. Search va filter foydalanuvchini tezda kerakli g'oyaga olib boradi.

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

6.4. Ishonchlilik va regressiya

Har bir yangi funksional qo'shilganda regressiya testlar o'tkaziladi. Asosiy foydalanish yo'llari (register, login, create idea, comment, like) doimiy tekshiriladi.

============================================================
7-BOB. XAVFSIZLIK VA ISHONCHLILIK

7.1. JWT va sessiya xavfsizligi

Access tokenlar qisqa muddatli, refresh tokenlar esa cookie orqali xavfsiz saqlanadi. Refresh tokenlar HTTP-only cookie bo'lgani sababli ularni JS orqali o'qib bo'lmaydi.

7.2. Ma'lumotlarni validatsiya qilish

Backendda serializerlar va validatorlar yordamida input tekshiruvlari amalga oshiriladi. Teglar uchun regex cheklovi, parol siyosati va string uzunligi nazorati mavjud.

7.3. Tarmoqli himoya va rate-limit

REST Framework throttle orqali anon va autentifikatsiyalangan foydalanuvchilarga so'rov limitlari qo'yilgan. Login uchun maxsus limit alohida qo'llanadi.

7.4. Fayl yuklash xavfsizligi

Fayllar serverda media/ katalogda saqlanadi. Fayl turlari va o'lchamlari chekli bo'lishi rejalashtirilgan.

7.5. Zaxira va tiklash strategiyasi

PostgreSQL ma'lumotlar bazasi uchun backup strategiyasi ishlab chiqiladi. Redis kesh bo'lgani uchun yo'qolishi tizimga jiddiy ta'sir qilmaydi. Media fayllar alohida backup qilinadi.

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

8.5. Kengaytirish va skalalash

Kelajakda tizim yuklamasi oshsa, backend servislarini gorizontal kengaytirish mumkin. Redis va Postgres resurslari alohida serverlarga ko'chiriladi. CDN orqali statik fayllarni tez yetkazish rejalashtiriladi.

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


============================================================
ILOVA D. API BATAFSIL TAVSIFI (KENGAYTIRILGAN)

Quyida "Farangiz" loyihasidagi asosiy endpointlar, ularning vazifasi, autentifikatsiya talabi va kutiladigan maydonlari batafsil bayon qilinadi. Ushbu bo'lim amaliyotda API bilan ishlash jarayonini tushunishga yordam beradi.

D.1. Auth va accounts endpointlari

1) POST /api/auth/register
- Maqsad: yangi foydalanuvchini ro'yxatdan o'tkazish.
- Auth: talab qilinmaydi.
- Request (multipart/form-data yoki JSON):
  - username (3-150 belgi, ruxsat etilgan belgilar: harf, raqam, @ . + - _)
  - email (majburiy)
  - password (min 8, max 128, validator bilan tekshiriladi)
  - bio (ixtiyoriy, max 500)
  - birth_date (majburiy)
  - phone (majburiy, max 30)
  - location (majburiy, max 255)
  - portfolio_file (majburiy fayl: PDF/DOC/DOCX/ZIP)
- Natija: yangi foydalanuvchi JSON ko'rinishida qaytadi.

2) POST /api/auth/login
- Maqsad: login qilish va access token olish.
- Auth: talab qilinmaydi.
- Request: username va password.
- Natija: access token va (ixtiyoriy) refresh token. Refresh token odatda httpOnly cookie sifatida yuboriladi.

3) POST /api/auth/refresh
- Maqsad: access tokenni yangilash.
- Auth: talab qilinmaydi, ammo refresh token kerak.
- Request: refresh (body yoki cookie).
- Natija: yangi access token.

4) POST /api/auth/logout
- Maqsad: chiqish va refresh cookie'ni tozalash.
- Auth: ixtiyoriy.
- Natija: muvaffaqiyat xabari.

5) GET /api/auth/me
- Maqsad: joriy foydalanuvchi profilini olish.
- Auth: talab qilinadi.
- Natija: profil maydonlari (email, username, bio, location va h.k.).

6) POST /api/auth/password-otp/request
- Maqsad: parolni o'zgartirish uchun OTP yuborish.
- Auth: talab qilinadi.
- Natija: OTP yuborilganligi haqida xabar.

7) POST /api/auth/password-otp/verify
- Maqsad: OTP ni tekshirish va yangi parol o'rnatish.
- Auth: talab qilinadi.
- Request: code (majburiy), password (ixtiyoriy, agar yangi parol berilsa).
- Natija: tasdiqlash yoki parol yangilandi xabari.

8) GET /api/users
- Maqsad: foydalanuvchilar ro'yxatini olish.
- Auth: ixtiyoriy.
- Query: search (username bo'yicha).
- Natija: foydalanuvchilar ro'yxati.

9) GET /api/users/{id}
- Maqsad: foydalanuvchi profilini ko'rish.
- Auth: ixtiyoriy.
- Natija: profil, follower/following statistikasi, is_following belgisi.

10) GET/PATCH /api/users/me
- Maqsad: joriy foydalanuvchini ko'rish va yangilash.
- Auth: talab qilinadi.
- PATCH orqali: bio, avatar_url, avatar_file, email, username, phone, location, expo_push_token va h.k. yangilanadi.

11) POST /api/users/me/avatar
- Maqsad: avatar faylini alohida yuklash.
- Auth: talab qilinadi.
- Request: avatar (fayl).
- Natija: avatar_url.

12) POST /api/users/{id}/follow
- Maqsad: follow/unfollow funksiyasi.
- Auth: talab qilinadi.
- Natija: Followed yoki Unfollowed.

13) GET /api/users/{id}/followers
- Maqsad: foydalanuvchining followers ro'yxati.
- Auth: ixtiyoriy.

14) GET /api/users/{id}/following
- Maqsad: foydalanuvchining following ro'yxati.
- Auth: ixtiyoriy.

15) GET /api/users/{id}/comments
- Maqsad: foydalanuvchi yozgan izohlar ro'yxati.
- Auth: ixtiyoriy.

16) /api/devices (DeviceViewSet)
- POST /api/devices: device_id, device_name va refresh_token yuboriladi.
- POST /api/devices/{id}/terminate: qurilmani log out qilish.
- POST /api/devices/deactivate: joriy device_id ni o'chirish.

D.2. G'oyalar endpointlari

1) GET /api/ideas
- Maqsad: g'oyalar ro'yxati.
- Query: search, category, tag, author, ordering.
- Natija: g'oyalar ro'yxati va paginatsiya.

2) POST /api/ideas
- Maqsad: yangi g'oya yaratish.
- Auth: talab qilinadi.
- Request:
  - title, short_description, full_description, category
  - tags (list yoki vergul bilan ajratilgan string)
  - image (ixtiyoriy)
- Natija: yangi g'oya.

3) GET /api/ideas/{id}
- Maqsad: bitta g'oyani olish.
- Natija: g'oya, comment_count, like_count, user_liked, user_bookmarked.

4) PATCH /api/ideas/{id}
- Maqsad: g'oyani yangilash (faqat muallif).
- Auth: talab qilinadi.

5) DELETE /api/ideas/{id}
- Maqsad: g'oyani o'chirish (faqat muallif).

6) POST /api/ideas/{id}/like
- Maqsad: layk toggle qilish.
- Natija: Liked yoki Like removed.

7) POST /api/ideas/{id}/bookmark
- Maqsad: bookmark toggle qilish.

8) GET /api/ideas/bookmarks
- Maqsad: foydalanuvchining saqlagan g'oyalari.

9) GET /api/ideas/following
- Maqsad: kuzatilgan foydalanuvchilarning g'oyalari.

10) GET /api/ideas/trending?days=7
- Maqsad: trend g'oyalar.

11) GET /api/ideas/{id}/comments
- Maqsad: g'oya izohlarini olish.

12) POST /api/ideas/{id}/comments
- Maqsad: g'oya uchun izoh qoldirish.

13) DELETE /api/comments/{id}
- Maqsad: izohni o'chirish.

14) /api/comments/public
- Maqsad: umumiy izohlar ro'yxati (PublicComment).

D.3. Bildirishnomalar endpointlari

1) GET /api/notifications/
- Maqsad: foydalanuvchi bildirishnomalarini olish.

2) POST /api/notifications/{id}/read/
- Maqsad: bildirishnomani o'qilgan qilish.

3) POST /api/notifications/read-all/
- Maqsad: barcha bildirishnomalarni o'qilgan qilish.

D.4. Chat endpointlari

1) GET /api/chat/rooms
- Maqsad: foydalanuvchi chat xonalari ro'yxati.

2) POST /api/chat/rooms/get-or-create/
- Maqsad: boshqa foydalanuvchi bilan chat xonasi yaratish.
- Request: other_user_id.

3) POST /api/chat/rooms/create-group/
- Maqsad: guruh chat yaratish.
- Request: name, description, is_private, member_ids.

4) GET /api/chat/rooms/groups/
- Maqsad: ochiq guruhlarni qidirish.

5) POST /api/chat/rooms/{id}/join
- Maqsad: ochiq guruhga qo'shilish.

6) POST /api/chat/rooms/{id}/leave
- Maqsad: guruhdan chiqish.

7) GET /api/chat/rooms/{id}/members
- Maqsad: guruh a'zolari.

8) POST /api/chat/rooms/{id}/kick
- Maqsad: guruhdan foydalanuvchini chiqarish.

9) POST /api/chat/rooms/{id}/add-member
- Maqsad: guruhga a'zo qo'shish.

10) POST /api/chat/rooms/{id}/set-admin
- Maqsad: admin huquqlarini berish/olish.

11) GET /api/chat/rooms/{id}/messages
- Maqsad: xabarlar ro'yxati.

12) POST /api/chat/rooms/{id}/send_message
- Maqsad: xabar yuborish.
- Request: body, image, audio, file, reply_to, audio_duration.
- Cheklovlar: message max 2000 belgi, file max 50MB.

D.5. Qo'ng'iroqlar endpointlari

1) POST /api/calls/start
- Maqsad: qo'ng'iroqni boshlash.
- Request: room_id, callee_id, call_type (voice/video).

2) POST /api/calls/{id}/answer
- Maqsad: qo'ng'iroqni qabul qilish.

3) POST /api/calls/{id}/reject
- Maqsad: qo'ng'iroqni rad etish.

4) POST /api/calls/{id}/end
- Maqsad: qo'ng'iroqni tugatish.

5) GET /api/calls/active
- Maqsad: faol qo'ng'iroqni tekshirish.

6) GET /api/calls/history
- Maqsad: qo'ng'iroqlar tarixi.

============================================================
ILOVA E. MA'LUMOT MAYDONLARI (MODEL DARAJASI)

E.1. User modeli (asosiy maydonlar)
- username, email, password
- bio, avatar_url, avatar_file
- birth_date, phone, location
- latitude, longitude
- portfolio_file
- expo_push_token

E.2. Follow modeli
- follower (User)
- following (User)
- created_at

E.3. PasswordResetOTP modeli
- user, code_hash
- created_at, expires_at
- used_at, attempt_count

E.4. UserDevice modeli
- user, device_id, device_name
- fcm_token, refresh_token
- last_active, is_active

E.5. Idea modeli
- title, short_description, full_description
- title_i18n, short_description_i18n, full_description_i18n
- category, category_i18n
- tags (ManyToMany)
- image, author
- created_at, updated_at
- views_count

E.6. Tag modeli
- name

E.7. Comment modeli
- idea, author, parent
- body, body_i18n
- image, is_pinned
- created_at

E.8. IdeaLike va CommentLike
- idea/comment, user, created_at

E.9. Bookmark modeli
- user, idea, created_at

E.10. Notification modeli
- user, actor, idea
- notification_type, message
- is_read, created_at

E.11. ChatRoom modeli
- participants, is_group, name
- description, is_private
- created_by, avatar_url
- created_at, updated_at

E.12. ChatRoomMembership
- room, user, role
- can_delete_messages, can_kick, can_invite, can_manage_admins
- joined_at, last_read_at

E.13. Message modeli
- room, sender, reply_to
- body, image, audio, file
- audio_duration, audio_size
- file_name, file_size
- created_at, updated_at
- is_read, is_deleted, is_edited
- message_type

E.14. Call modeli
- room, caller, callee
- call_type, status
- agora_channel, agora_token
- started_at, ended_at, duration

============================================================
ILOVA F. ISH JARAYONI VA ALGORITMLAR (QISQACHA)

F.1. G'oya yaratish algoritmi
1) Foydalanuvchi g'oya formani to'ldiradi.
2) Frontend validatsiyadan o'tkazadi.
3) Backendga POST /api/ideas yuboriladi.
4) Backend serializer orqali maydonlarni tekshiradi.
5) Idea modeli saqlanadi, teglar yaratilib bog'lanadi.
6) Natija sifatida yangi g'oya qaytadi.

F.2. Like toggle algoritmi
1) Foydalanuvchi layk tugmasini bosadi.
2) Backend IdeaLike mavjudligini tekshiradi.
3) Agar mavjud bo'lsa o'chiradi, bo'lmasa yaratadi.
4) Muallifga bildirishnoma yuboriladi.

F.3. Follow toggle algoritmi
1) Foydalanuvchi Follow bosadi.
2) Follow mavjud bo'lsa o'chiriladi, bo'lmasa yaratiladi.
3) Notifikatsiya yaratiladi.

F.4. Chat xabar yuborish algoritmi
1) Xabar matni yoki media tanlanadi.
2) Backend fayl turi va o'lchamini tekshiradi.
3) Message modeli saqlanadi.
4) WebSocket orqali xabar real vaqt yetkaziladi.
5) Push bildirishnoma yuboriladi.

F.5. Qo'ng'iroq algoritmi
1) Caller POST /api/calls/start yuboradi.
2) Agora kanal va token yaratiladi.
3) Call modeli saqlanadi.
4) WebSocket orqali callee ga signal yuboriladi.
5) Callee qabul qilsa /answer, rad etsa /reject.

============================================================
ILOVA G. EKRANLAR TAVSIFI (WEB VA MOBILE)

G.1. Web - Home
- G'oyalar tasmasi (trending, following, all).
- Qidiruv paneli va filterlar.

G.2. Web - Idea Detail
- G'oya sarlavha, tavsif, kategoriya.
- Layk, izohlar va stats.

G.3. Web - Profile
- Foydalanuvchi ma'lumotlari.
- Followers va following soni.

G.4. Mobile - Feed
- G'oyalar ro'yxati kartalar ko'rinishida.
- Pull to refresh.

G.5. Mobile - Chat
- Suhbatlar ro'yxati.
- Xabarlar sahifasi.

G.6. Mobile - Notifications
- Bildirishnomalar listi.

G.7. Mobile - Profile
- Profil ma'lumotlari va sozlamalar.

============================================================
ILOVA H. TEXNIK TALABLAR VA CHEKLOVLAR

- Django 5, DRF 3.15, Channels 4.
- PostgreSQL 15.
- Redis 7.
- Next.js 14.
- Expo 54.
- Auth JWT, refresh cookie.
- Fayl yuklash cheklovlari: chat fayllari 50MB gacha.
- Tag cheklovi: 10 tagdan ortiq bo'lmasligi.

============================================================
ILOVA I. QO'SHIMCHA IZOH VA TAVSIYALAR

- Tizimda kontent moderatsiyasini kuchaytirish uchun admin panel imkoniyatlari kengaytirilishi mumkin.
- Kengaytirilgan analitika paneli qo'shilsa, foydalanuvchilar faoliyatini kuzatish osonlashadi.
- Ijtimoiy ulashish funksiyasi marketing uchun foydali bo'ladi.



============================================================
ILOVA J. NAZARIY ASOSLAR (AMALIYOTGA TEGISHLI UMUMIY QISM)

J.1. Klient-server arxitekturasi

Zamonaviy web va mobil ilovalar odatda klient-server arxitekturasi asosida quriladi. Bu yondashuvda frontend (klient) foydalanuvchi interfeysini taqdim etadi, backend (server) esa biznes mantiqni bajaradi va ma'lumotlarni qayta ishlaydi. "Farangiz" loyihasida ham aynan shu model tanlangan. Bu arxitektura bir necha afzalliklarga ega: kodning modulga bo'linganligi, xizmatlarni mustaqil kengaytirish imkoniyati va xavfsizlikni markazlashgan holda boshqarish.

Klient-server yondashuvida asosiy tamoyil - mas'uliyatlarni ajratish. Klient qismida UI, state boshqaruvi va foydalanuvchi oqimi bo'lsa, server qismida autentifikatsiya, ruxsatlar, validatsiya, ma'lumotlar saqlash va biznes qoidalar mavjud. Bu ajratish kelajakda tizimni kengaytirishni osonlashtiradi.

J.2. REST arxitekturasi

REST (Representational State Transfer) - web xizmatlarni qurishda keng qo'llaniladigan arxitektura uslubi. REST tamoyillariga ko'ra, har bir resurs uchun URL belgilanadi va unga HTTP metodlari (GET, POST, PATCH, DELETE) orqali murojaat qilinadi. "Farangiz" loyihasidagi API endpointlar ham aynan REST asosida qurilgan. Masalan, /api/ideas resursi g'oyalarni yaratish va olishga xizmat qiladi.

REST yondashuvi quyidagi afzalliklarni beradi:
- Oson tushuniladigan API tuzilmasi
- Cache'lash imkoniyatlari
- Stateless (holatsiz) so'rovlar, ya'ni har bir request mustaqil bo'ladi
- Integratsiyani soddalashtiradi

J.3. JWT autentifikatsiyasi

JWT (JSON Web Token) - foydalanuvchini autentifikatsiya qilish uchun token asosidagi yondashuv. Foydalanuvchi login qilganda, server access token beradi. Klient keyingi so'rovlarda ushbu tokenni Authorization headerida yuboradi. Token ichida foydalanuvchi identifikatori va muddati saqlanadi. "Farangiz" loyihasida refresh token ham qo'llanilib, access tokenning qisqa muddatli bo'lishi xavfsizlikni oshiradi.

JWT yondashuvi session asosidagi usuldan farqli o'laroq, serverda sessiya saqlashni talab qilmaydi. Bu esa tizimni oson skalalashga imkon beradi.

J.4. WebSocket va real vaqt tizimlari

Real vaqt chat va qo'ng'iroq funksiyalari uchun WebSocket protokoli ishlatiladi. WebSocket HTTPdan farqli ravishda doimiy ulanib turuvchi kanal yaratadi va ikki tomonlama real vaqt ma'lumot almashinuvini ta'minlaydi. Bu usul chat, notifikatsiya va real vaqt o'yinlarda keng qo'llaniladi.

"Farangiz" loyihasida WebSocket Channels yordamida implementatsiya qilingan. Xabar yuborilganda server uni real vaqt rejimida boshqa foydalanuvchilarga uzatadi, bu esa chatning tezkor ishlashini ta'minlaydi.

J.5. MVC va Django arxitekturasi

Django frameworkida MVC (Model-View-Controller) ga o'xshash MTV (Model-Template-View) konsepsiyasi mavjud. Model ma'lumotlar bazasi bilan ishlaydi, View mantiqni bajaradi, Template UI render qiladi. DRF (Django REST Framework) orqali esa ViewSet va Serializer tushunchalari qo'llaniladi. Serializerlar API formatini, ViewSetlar esa CRUD funksiyalarini bajaradi.

"Farangiz" loyihasida har bir modul (accounts, ideas, chat, notifications) o'z model, serializer va viewlari bilan alohida tashkil etilgan. Bu struktura kodni tushunarli va modulga bo'lingan qiladi.

J.6. React va komponentlar modeli

React - komponentlarga asoslangan UI kutubxonasi bo'lib, UI ni kichik bo'laklarga bo'lish imkonini beradi. Har bir komponent o'z state va propslari bilan mustaqil ishlaydi. Bu yondashuv UI ni qayta foydalanish va testlashni osonlashtiradi. "Farangiz" web va mobil ilovalarida React komponent modeli asosiy arxitekturaviy yo'nalish sifatida qabul qilingan.

J.7. Cross-platform mobil ishlab chiqish

React Native va Expo platformalari bir xil kod bazasi orqali iOS va Android ilovalarni ishlab chiqish imkonini beradi. Bu vaqt va xarajatlarni sezilarli kamaytiradi. Mobil ilovada native funksiyalar (kamera, mikrofon, fayl tizimi, push notification) Expo modulllari orqali ishlatiladi.

J.8. Ma'lumotlar bazasini normallashtirish

Ma'lumotlar bazasini normallashtirish redundansni kamaytiradi va ma'lumotlarni izchil saqlashga yordam beradi. "Farangiz" loyihasida g'oyalar, teglar, izohlar va foydalanuvchilar alohida jadvallarda saqlanadi. Many-to-Many bog'lanishlar (g'oya-teg) normallashtirish tamoyillariga mos keladi.

J.9. Indekslash va optimizatsiya

Katta hajmdagi ma'lumotlarda tezkor qidiruv va saralash uchun indekslar juda muhim. "Farangiz" loyihasida created_at va views_count kabi maydonlarga indekslar qo'yilgan. Bu trend g'oyalar yoki so'nggi g'oyalarni tez chiqarish imkonini beradi.

J.10. Kesh va tezkorlik

Redis kesh tizimi ma'lumotlarni tezkor qayta ishlash imkonini beradi. Chat xabarlarini keshda saqlash, unread countni hisoblash kabi vazifalarda Redis qo'llanilgan. Kesh ishlatilganda databasega tushadigan yuk kamayadi va tizim tezkor ishlaydi.

J.11. Pagination va samaradorlik

Paginatsiya foydalanuvchi uchun ham, server uchun ham samarali. Juda ko'p ma'lumotni bir vaqtning o'zida qaytarish o'rniga, tizim ma'lumotlarni sahifalab beradi. DRF paginatsiya klassi orqali bu avtomatik amalga oshirilgan.

J.12. Qidiruv va filtr

Full-text search tizimi foydalanuvchiga katta ma'lumotlar ichidan kerakli g'oyani tez topishga yordam beradi. Django PostgreSQL search vectorlari yordamida qidiruv implementatsiya qilingan. Bundan tashqari kategoriya, teg va muallif bo'yicha filtrlar mavjud.

J.13. Rate limit va xavfsizlik

Tizimga hujumlar (bruteforce, spam) oldini olish uchun rate-limit ishlatiladi. DRF throttle orqali har bir foydalanuvchining so'rov soni cheklanadi. Login endpointi uchun alohida limit qo'yilgan.

J.14. Docker va konteynerlash

Docker konteynerlari ilovani izolyatsiya qiladi va muhitni standartlashtiradi. Bu dastur bir xil tarzda har qanday serverda ishlashini ta'minlaydi. Docker Compose esa bir nechta servislarni (db, backend, frontend) birgalikda boshqaradi.

J.15. CI/CD konsepsiyasi

CI/CD (Continuous Integration / Continuous Deployment) dasturiy ta'minotni tez va xavfsiz yetkazish imkonini beradi. Garchi loyiha hozirda lokal dev muhitga qaratilgan bo'lsa-da, kelajakda GitHub Actions yoki boshqa CI/CD vositalari qo'llanilishi mumkin.

J.16. UI/UX tamoyillari

Foydalanuvchi tajribasini yaxshilash uchun UI soddaligi, oqilona ranglar, aniq tipografiya va minimal kliklar kerak. "Farangiz" dizaynida ham foydalanuvchi tezda g'oya yaratishi va muloqot qilishiga e'tibor qaratilgan.

J.17. Accessibility va inkluziv dizayn

Zamonaviy ilovalarda accessibility muhim o'rin tutadi. Font o'lchami, kontrast, navigatsiya qulayligi va screen reader qo'llab-quvvatlashi loyihani ko'proq foydalanuvchilar uchun qulay qiladi. Bu tamoyillarni kelajakda kengaytirish rejalashtiriladi.

============================================================
ILOVA K. QO'SHIMCHA TAHLIL VA BAHOLASH

K.1. Risklar tahlili
- Texnik risk: real vaqt chat va qo'ng'iroqlar barqarorligi.
- Xavfsizlik risk: foydalanuvchi ma'lumotlarini himoya qilish.
- Ishlash risk: katta trafikda server yuklanishi.

K.2. Risklarni kamaytirish
- Redis kesh va indekslar orqali tezkorlik.
- JWT va rate-limit orqali xavfsizlik.
- Docker va Nginx orqali boshqariladigan deploy.

K.3. Baholash mezonlari
- Funktsional talablar bajarilishi.
- Tizim barqarorligi va tezligi.
- Foydalanuvchi uchun qulaylik.

============================================================
ILOVA L. LOYIHA REJASI VA BOSQICHLAR

Loyiha quyidagi bosqichlarda amalga oshiriladi:
1) Talablarni yig'ish va tahlil.
2) Arxitektura dizaynini aniqlash.
3) Ma'lumotlar bazasi modelini ishlab chiqish.
4) Backend API ishlab chiqish.
5) Web frontend ishlab chiqish.
6) Mobil ilova ishlab chiqish.
7) Testlash va optimizatsiya.
8) Deploy va hujjatlashtirish.

============================================================
ILOVA M. FOYDALANUVCHI YO'RIQNOMASI (QISQA)

1) Ro'yxatdan o'tish: register sahifasida username, email, parol va portfolio fayl yuklanadi.
2) Login: username va parol bilan kirish.
3) G'oya yaratish: "New Idea" bo'limida sarlavha va tavsif yoziladi.
4) Izoh qoldirish: g'oya detail sahifasida izoh yoziladi.
5) Chat: foydalanuvchi profilidan chat boshlanadi.
6) Profil: sozlamalar va avatarni yangilash.



============================================================
ILOVA N. MODULLAR BO'YICHA KENGAYTIRILGAN TAHLIL

N.1. Accounts va autentifikatsiya moduli

Accounts moduli foydalanuvchi hayot siklini boshqaradi: ro'yxatdan o'tish, login, profilni ko'rish va tahrirlash, parolni tiklash, hamda qurilmalar ro'yxatini yuritish. "Farangiz" loyihasida ro'yxatdan o'tish jarayoni oddiy email-parol mexanizmidan ko'ra ko'proq ma'lumot talab qiladi. Bu orqali foydalanuvchini haqiqiyligini oshirish, spam va soxta profil ehtimolini kamaytirish ko'zda tutilgan. Ro'yxatdan o'tishda portfolio faylini talab qilish ham shu maqsadga xizmat qiladi.

Login jarayonida JWT tokenlar ishlatiladi. Access token qisqa muddatli bo'lib, tez-tez yangilanadi. Refresh token esa httpOnly cookie sifatida saqlanadi, bu JS orqali o'g'irlashni qiyinlashtiradi. Parolni tiklashda OTP yuborish mexanizmi bor. OTPning amal qilish vaqti, maksimal urinishlar va qayta so'rov oralig'i serverda nazorat qilinadi. Bu tizim foydalanuvchi xavfsizligini kuchaytiradi.

Profilni tahrirlash jarayonida avatar URL yoki avatar faylini yangilash mumkin. Agar avatar fayl yuklansa, sistemada avatar_url tozalanadi va lokal fayl ustuvor bo'ladi. Foydalanuvchi bio, location, telefon raqami kabi maydonlarni tahrirlab, o'z profilini to'liqroq qiladi. Ushbu ma'lumotlar keyinchalik jamoa a'zolari uchun foydali bo'lishi mumkin.

Device moduli foydalanuvchi qurilmalarini boshqaradi. Bu modul mobil qurilma ID, device_name va refresh tokenni saqlaydi. Agar foydalanuvchi bir nechta qurilmadan foydalansa, har bir qurilma alohida qayd etiladi va kerak bo'lsa terminate qilish mumkin. Bu xavfsizlik nuqtai nazaridan foydali, chunki foydalanuvchi yo'qolgan qurilmani tizimdan chiqarib yuborishi mumkin.

N.2. Ideas moduli (g'oyalar boshqaruvi)

G'oyalar moduli loyiha yadrosidir. Har bir g'oya sarlavha, qisqa va to'liq tavsif, kategoriya va teglar bilan ifodalanadi. Kategoriya va teglar g'oyalarni strukturali qidirish va tahlil qilish uchun zarur. Taglar max 10 ta bo'lishi mumkin, har biri 50 belgidan oshmasligi kerak. Bu cheklovlar tizimning tartibli ishlashiga xizmat qiladi.

G'oyalar uchun i18n maydonlar mavjud bo'lib, har bir matnli maydonning tarjimasi alohida JSON sifatida saqlanadi. Bu yondashuv kelajakda ko'p tilli kontentni boshqarishni osonlashtiradi. Masalan, g'oya ingliz tilida yaratilgan bo'lsa, keyinchalik uzbek yoki rus tiliga tarjima qo'shish mumkin.

G'oyani ko'rish jarayonida views_count avtomatik oshadi. Bu ko'rsatkich g'oyaning mashhurligini aniqlashda ishlatiladi. Trend bo'limida esa so'nggi N kun ichida eng ko'p layk olgan g'oyalar ko'rsatiladi. Bu algoritm g'oyalarni vaqt bo'yicha dinamik tarzda saralash imkonini beradi.

G'oyani tahrirlash faqat muallifga ruxsat etilgan. Bu xavfsizlik qoidasi ma'lumotlar yaxlitligini saqlaydi. G'oyani o'chirish ham muallif yoki admin tomonidan amalga oshirilishi mumkin.

N.3. Comments va reaksiyalar moduli

Izohlar g'oyaning muhokama maydonidir. Har bir izoh muallifga va g'oyaga bog'langan. Izohlar ierarxik (parent/reply) bo'lishi mumkin, bu esa muhokamani chuqurroq qilish imkonini beradi. Izohlar uchun image yuklash imkoniyati ham mavjud. Bu foydalanuvchilar uchun vizual tushuntirishlarni qo'shish imkonini beradi.

Izohlar va g'oyalar layk qilish mexanizmi o'xshash: user va object bo'yicha unique bog'lanish yaratiladi. Agar layk mavjud bo'lsa, qayta bosilganda o'chiriladi. Bu oddiy va tushunarli UX yaratadi. Layklar muallifga bildirishnoma yuboradi va g'oyaning ommabopligini oshiradi.

PublicComment modeli esa umumiy devor yoki umumiy izohlar bo'limi uchun ishlatiladi. Bu modul turli vaziyatlarda umumiy fikr almashish imkonini beradi.

N.4. Notifications moduli

Bildirishnomalar foydalanuvchining faoliyatini kuzatib borishga yordam beradi. Ular uchta asosiy holatda yaratiladi: g'oya layk qilinsa, izoh yozilsa yoki follow bosilsa. Notification modeli message va type maydonlari orqali foydalanuvchiga tushunarli matn qaytaradi.

Bildirishnomalarning is_read flagi foydalanuvchi ko'rgan yoki ko'rmaganini aniqlaydi. Foydalanuvchi bitta notificationni yoki barcha notificationlarni o'qilgan qilish imkoniga ega. Mobil ilovada bu bildirishnomalar push orqali ham yuboriladi, bu esa foydalanuvchining real vaqt xabardor bo'lishini ta'minlaydi.

N.5. Chat moduli

Chat moduli real vaqt kommunikatsiyaning asosi hisoblanadi. Chat xonalari shaxsiy yoki guruh bo'lishi mumkin. Shaxsiy chat ikki foydalanuvchi orasida avtomatik yaratiladi. Guruh chatlar esa maxsus create-group endpoint orqali yaratiladi, u yerda owner va admin roli mavjud.

Guruh chatlarda a'zo qo'shish, chiqarish, admin tayinlash kabi boshqaruv imkoniyatlari bor. ChatRoomMembership modeli orqali rollar va ruxsatlar nazorat qilinadi. Bu yondashuv guruh chatni tartibli boshqarishga imkon beradi.

Chat xabarlarida turli media turlarini yuborish mumkin: matn, rasm, audio, hujjat. Fayl turlariga cheklov qo'yilgan va maksimal o'lcham 50MB. Audio xabarlar uchun duration (uzunlik) ham hisoblanadi, bu UI da ko'rsatish uchun kerak.

Xabarlar o'qilgan holati read receipts orqali belgilanadi. Shaxsiy chatlarda unread count cache orqali hisoblanadi, guruh chatlarda esa last_read_at asosida aniqlanadi.

N.6. Calls moduli

Qo'ng'iroqlar moduli voice va video aloqalarni ta'minlaydi. Call lifecycle quyidagi holatlardan iborat: calling, ringing, connecting, connected, ended, rejected, missed, failed, busy. Qo'ng'iroq boshlanganida Agora kanal va token yaratiladi. Caller uchun token darhol qaytadi, callee esa /answer endpointi orqali o'z tokenini oladi.

Qo'ng'iroq jarayonida WebSocket signal almashinuvi ishlatiladi. Bu real vaqt qo'ng'iroqni boshqarish, reject yoki end signalni yetkazish uchun zarur. Qo'ng'iroq yakunlanganda duration hisoblanadi va call tarixiga yoziladi.

N.7. Mobile moduli

Mobil ilova Expo asosida ishlab chiqilgan. Mobil ilovada offline caching uchun React Query va AsyncStorage qo'llaniladi. Theme boshqaruvi light/dark rejimlarini qo'llab-quvvatlaydi. Push bildirishnomalar Expo tokenlari orqali ishlaydi, bu esa real vaqt xabarlarni foydalanuvchiga yetkazadi.

Mobile ilova geolokatsiya bilan ishlaydi va foydalanuvchi joylashuvini profilga bog'lash imkonini beradi. MapView komponenti orqali foydalanuvchi joylashuvi vizual ko'rsatiladi.

N.8. Web moduli

Web ilova Next.js App Router orqali sahifalarni boshqaradi. SSR (Server Side Rendering) va SSG (Static Site Generation) imkoniyatlari mavjud. React Query orqali data fetching va caching amalga oshiriladi. Form validatsiya uchun zod va react-hook-form ishlatiladi. UI komponentlari minimalistik bo'lib, g'oyalarni tez ko'rish va yaratishga yo'naltirilgan.

N.9. DevOps va deploy moduli

Loyiha Docker Compose orqali boshqariladi. Nginx reverse proxy sifatida ishlaydi va statik/media fayllarni foydalanuvchilarga taqdim etadi. Backend Daphne ASGI server orqali WebSocketni qo'llab-quvvatlaydi. Redis real vaqt chat va cache uchun ishlatiladi.

N.10. Performance va monitoring

Performance optimizatsiya uchun indekslar, cache, paginatsiya va minimal so'rovlar ishlatiladi. Monitoring uchun healthcheck endpointlar mavjud bo'lib, containerlar holati nazorat qilinadi. Loglar file tizimda saqlanadi, bu esa troubleshooting jarayonini osonlashtiradi.

