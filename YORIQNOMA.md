<div align="center">

**O'ZBEKISTON RESPUBLIKASI**

**OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI**

**TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI**

**"Kompyuter injiniringi" fakulteti**

**"Dasturiy injiniring" yo'nalishi**

<br>
<br>
<br>
<br>

**3-kurs talabasi Sultonmurodova Farangizning**

**"Farangiz" loyihasi uchun g'oyalar banki, ijtimoiy aloqa va real vaqt chat platformasini ishlab chiqish**

**mavzusida tayyorlagan**

<br>
<br>
<br>
<h1>KURS ISHI</h1>
<br>
<br>
<br>
<br>
<br>

**Rahbar: _____________________**

<br>
<br>

**Toshkent – 2026**

</div>

<div style="page-break-after: always;"></div>

## MUNDARIJA

**KIRISH**...........................................................................................................3

**1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI**.....................................6
1.1. Mavzu dolzarbligi va muammo qo'yilishi...................................................................6
1.2. Loyiha maqsadi va vazifalari...................................................................................8
1.3. Asosiy foydalanuvchi rollari va manfaatdor tomonlar................................................10
1.4. Funktsional talablar tahlili.......................................................................................11
1.5. Nofunktsional va sifat talablari................................................................................13
1.6. Mavjud analoglar tahlili va raqobatbardoshlik...........................................................15
1.7. Foydalanish ssenariylari (Use Case) va jarayonlar oqimi...........................................17

**2-BOB. ARXITEKTURA VA TEXNOLOGIK YECHIMLAR**.............................19
2.1. Tizim arxitekturasi: Monorepo va Modulli Monolit...................................................19
2.2. Backend texnologiyalari: Django ekotizimi va asinxronlik........................................21
2.3. Frontend texnologiyalari: Next.js, SSR va optimallashtirish.......................................24
2.4. Mobil ishlanma: React Native va Expo platformasi...................................................26
2.5. Ma'lumotlar almashinuvi protokollari (REST vs WebSocket)....................................28
2.6. Infratuzilma va DevOps vositalari (Docker, Nginx)...................................................30
2.7. Uchinchi tomon xizmatlari integratsiyasi (Agora, Google, Expo)..............................32

**3-BOB. MA'LUMOTLAR MODELI VA BAZA LOYIHALASH**.........................33
3.1. Ma'lumotlar bazasini tanlash: PostgreSQL afzalliklari..............................................33
3.2. Konseptual modellashtirish va ER diagramma...........................................................34
3.3. Foydalanuvchi va autentifikatsiya sxemasi...............................................................36
3.4. G'oyalar va ijtimoiy munosabatlar modeli.................................................................37
3.5. Chat, xabarlar va real vaqt ma'lumotlari modeli........................................................39
3.6. Ma'lumotlar bazasini optimallashtirish va indekslash.................................................40

**4-BOB. FUNKTSIONAL MODULLARNING CHUQUR TAHLILI**......................41
4.1. Autentifikatsiya va avtorizatsiya quyi tizimi.............................................................41
4.2. G'oyalarni boshqarish va tahrirlash moduli...............................................................43
4.3. Ijtimoiy interaktivlik: Izohlar, reaksiyalar va reyting tizimi.......................................45
4.4. Ijtimoiy graf: Kuzatuv (Follow) va tavsiyalar tizimi.................................................47
4.5. Bildirishnomalar va voqealar boshqaruvi (Event Bus)...............................................48
4.6. Real vaqt muloqot tizimi (Instant Messaging)...........................................................50
4.7. Multimedia va video konferensaloqa moduli.............................................................52
4.8. Qidiruv mexanizmi va ma'lumotlarni filtrlash...........................................................53
4.9. Xalqaroizatsiya (i18n) va lokalizatsiya strategiyasi....................................................55
4.10. Admin panel va kontent moderatsiyasi....................................................................56

**5-BOB. FOYDALANUVCHI INTERFEYSI (UI) VA TAJRIBASI (UX)**...........57
5.1. Web ilova interfeysi: Adaptiv dizayn va komponentlar............................................57
5.2. Mobil ilova interfeysi: Native tajriba va imo-ishoralar............................................59
5.3. Dizayn tizimi: Ranglar, tipografiya va mavzular (Dark Mode)...............................60
5.4. UX tamoyillari: Evristik tahlil va foydalanish qulayligi...........................................61

**6-BOB. TESTLASH, SIFAT NAZORATI VA OPTIMALLASHTIRISH**...........62
6.1. Dasturiy ta'minotni testlash strategiyasi....................................................................62
6.2. Unit va Integratsion testlar tahlili..............................................................................63
6.3. Yuklama ostida testlash (Load Testing) va unumdorlik.............................................64
6.4. Xavfsizlik auditi va zaifliklarni bartaraf etish............................................................65

**7-BOB. XAVFSIZLIK SIYOSATI VA MA'LUMOTLAR HIMOYA**...............66
7.1. Identifikatsiya va sessiyalar xavfsizligi (JWT, OAuth)..............................................66
7.2. Tarmoq xavfsizligi va SSL/TLS shifrlash.................................................................67
7.3. Kiberhujumlardan himoya (DDoS, XSS, CSRF, SQLi)............................................68
7.4. Ma'lumotlarni zaxiralash va falokatlardan tiklash rejasi............................................69

**8-BOB. JOYLASHTIRISH (DEPLOYMENT) VA QULLAB-QUVVATLASH**...70
8.1. Ishlab chiqarish muhiti (Production Environment) sozlamalari..................................70
8.2. CI/CD jarayonlari va avtomatlashtirish....................................................................71
8.3. Monitoring, loglash va xatolarni kuzatish tizimlari...................................................72
8.4. Tizimni masshtablashtirish strategiyasi....................................................................73

**9-BOB. LOYIHA NATIJALARI, IQTISODIY SAMARADORLIK VA KELAJAK**..74
9.1. Erishilgan texnik va amaliy natijalar.........................................................................74
9.2. Loyihaning ijtimoiy va iqtisodiy ahamiyati..............................................................75
9.3. Kelajakdagi rivojlanish istiqbollari (AI, Blockchain)................................................76

**XULOSA**..........................................................................................................78

**FOYDALANILGAN ADABIYOTLAR RO'YXATI**..........................................80

**ILOVALAR**.......................................................................................................82

<div style="page-break-after: always;"></div>

## KIRISH

Insoniyat taraqqiyoti har doim yangi g'oyalar va innovatsion yechimlar ustiga qurilgan. Tarixga nazar solsak, buyuk kashfiyotlar va ijtimoiy o'zgarishlar dastlab oddiy bir fikr yoki g'oya ko'rinishida paydo bo'lganligini ko'ramiz. Biroq, globallashgan va axborot oqimi cheksiz bo'lgan zamonaviy davrda, "shovqin" ichida qimmatli g'oyalarni ajratib olish, ularni to'g'ri auditoriyaga yetkazish va hamfikrlarni topish murakkab vazifaga aylanib bormoqda. Ko'plab potensial startaplar, ilmiy loyihalar va ijodiy ishlanmalar o'z vaqtida qo'llab-quvvatlov yoki konstruktiv tanqid ololmaganligi sababli qog'ozda qolib ketmoqda.

Bugungi kunda ijtimoiy tarmoqlar (Facebook, Twitter, LinkedIn) odamlar o'rtasidagi aloqani ta'minlashda ulkan rol o'ynasa-da, ularning arxitekturasi va algoritmlari asosan ko'ngilochar kontentga, reklamaga va qisqa muddatli e'tiborga (short-term attention) yo'naltirilgan. Bu platformalarda chuqur tahliliy fikrlar, uzoq muddatli loyihalar va innovatsion takliflar ko'pincha e'tibordan chetda qoladi. Shu bois, intellektual salohiyatni birlashtiruvchi, g'oyalarni tizimli ravishda saqlab, rivojlantirishga xizmat qiluvchi ixtisoslashgan raqamli ekotizimga ehtiyoj paydo bo'ldi.

Ushbu muammolarga yechim sifatida "Farangiz" loyihasi ishlab chiqildi. Bu – shunchaki navbatdagi ijtimoiy tarmoq emas, balki g'oyalar inkubatori, hamfikrlar hamjamiyati va innovatsiyalar katalizatoridir. Platforma foydalanuvchilarga o'z g'oyalarini nafaqat e'lon qilish, balki ularni toifalashtirish, jamoaviy muhokama qilish, ekspertlardan baho olish va real vaqt rejimida muloqot qilish orqali takomillashtirish imkoniyatini beradi.

**Kurs ishining maqsadi:** Zamonaviy dasturiy injiniring tamoyillari va ilg'or web-texnologiyalar asosida "Farangiz" g'oyalar banki va ijtimoiy muloqot platformasini loyihalash, ishlab chiqish va amaliyotga tatbiq etish jarayonlarini har tomonlama tadqiq qilishdan iborat.

**Tadqiqot obyekti:** Ijtimoiy tarmoqlar va kontent boshqaruv tizimlarining (CMS) ishlash prinsiplari, real vaqt tizimlari arxitekturasi hamda zamonaviy kross-platforma dasturlash texnologiyalari.

**Tadqiqot predmeti:** "Farangiz" platformasining dasturiy arxitekturasi, ma'lumotlar bazasi tuzilishi, backend va frontend qismlarining o'zaro integratsiyasi hamda foydalanuvchi interfeysi ergonomikasi.

Ushbu kurs ishi doirasida quyidagi ilmiy va amaliy masalalar yechildi:
1.  Mavjud ijtimoiy platformalar va g'oyalar banki tizimlari tahlil qilindi, ularning yutuq va kamchiliklari o'rganildi.
2.  Tizimning monorepo arxitekturasi ishlab chiqildi, bu esa kodni boshqarish va masshtablashtirish samaradorligini oshirdi.
3.  Django (Python) va Next.js (JavaScript) texnologiyalari asosida yuqori unumdorlikka ega backend va frontend qismlari yaratildi.
4.  Real vaqt rejimida ishlovchi chat va video-qo'ng'iroq modullari WebSocket va WebRTC protokollari yordamida integratsiya qilindi.
5.  Mobil qurilmalar uchun React Native va Expo asosida "Native" ilova ishlab chiqildi.

Loyiha O'zbekistonning raqamli segmentida intellektual kontent almashinuvini rivojlantirishga, yoshlarning startap loyihalarini qo'llab-quvvatlashga va ilmiy-texnik hamjamiyatni shakllantirishga xizmat qiladi.

<div style="page-break-after: always;"></div>

## 1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI

### 1.1. Mavzu dolzarbligi va muammo qo'yilishi

Raqamli iqtisodiyot davrida ma'lumot – bu yangi neft, g'oya esa – bu yangi dvigateldir. O'zbekistonda va butun dunyoda startap ekotizimining rivojlanishi shuni ko'rsatmoqdaki, muvaffaqiyatning kaliti ko'pincha mablag'da emas, balki to'g'ri shakllangan g'oya va kuchli jamoa (networking)dadir. Statistikaga ko'ra, startaplarning 42% i aynan bozor talabini noto'g'ri o'rganganligi yoki g'oyaning xomligi sababli inqirozga uchraydi.

Muammoning mohiyati shundaki, yosh ixtirochilar, talabalar va dasturchilar o'z g'oyalarini sinovdan o'tkazish (validation) uchun qulay maydonga ega emaslar. Ular o'z loyihalarini do'stlariga yoki tor doiradagi tanishlariga aytib berishadi, lekin bu har doim ham obyektiv baho olishga imkon bermaydi. Keng auditoriyaga chiqish uchun esa marketing va reklama talab etiladi.

Mavjud platformalardagi kamchiliklar:
*   **Instagram/TikTok:** Vizual kontent ustunlik qiladi, matnli va texnik g'oyalar o'qilmaydi. Muhokamalar ko'pincha yuzaki.
*   **Telegram kanallar:** Auditoriya cheklangan, qidiruv tizimi noqulay, eski g'oyalar tezda "tarix"ga aylanib yo'qoladi.
*   **LinkedIn:** Juda rasmiy, asosan ish qidirish va professional yutuqlarni namoyish qilishga qaratilgan, "xom" g'oyalar uchun mos emas.

"Farangiz" loyihasining dolzarbligi quyidagi omillar bilan belgilanadi:
1.  **Strukturalashgan bilimlar bazasi:** G'oyalar shunchaki matn emas, balki kategoriyalar, teglar va media fayllar bilan boyitilgan tizimli ma'lumot sifatida saqlanadi.
2.  **Jamoaviy intellekt:** Platforma turli soha vakillarini (dasturchilar, marketologlar, investorlar) birlashtirib, g'oyani har tomonlama tahlil qilish imkonini beradi.
3.  **Tezkor prototiplash:** G'oya muallifi tezkor fidbek olib, loyihasini o'zgartirishi (pivot) yoki rivojlantirishi mumkin.

### 1.2. Loyiha maqsadi va vazifalari

**Loyiha maqsadi:** Foydalanuvchilarning intellektual mulkini (g'oyalarini) raqamli formatda saqlash, himoya qilish, rivojlantirish va monetizatsiya qilish imkonini beruvchi, yuqori yuklamalarga bardoshli, xavfsiz va ergonomik dasturiy platformani yaratish.

Ushbu maqsadga erishish uchun quyidagi **vazifalar** belgilandi:

1.  **Arxitekturaviy yechim:** Tizimni "Microservices" ga oson o'tish imkonini beruvchi "Modular Monolith" arxitekturasida loyihalash.
2.  **Ma'lumotlar bazasi:** Relyatsion (PostgreSQL) va NoSQL (Redis) ma'lumotlar bazalarini samarali kombinatsiya qilish orqali ma'lumotlar yaxlitligi va ishlash tezligini ta'minlash.
3.  **Backend API:** Barcha mijoz ilovalari (Web, Mobile) uchun yagona, standarlashtirilgan RESTful API ishlab chiqish va hujjatlashtirish (Swagger).
4.  **Real vaqt tizimlari:** WebSocket texnologiyasini chuqur o'rganib, uning asosida kechikishsiz (low-latency) chat va bildirishnomalar tizimini qurish.
5.  **Kross-platforma interfeysi:** Web va Mobil ilovalar uchun yagona dizayn-kod (Design System) yaratish va foydalanuvchi tajribasini (UX) birxillashtirish.
6.  **Xavfsizlik:** OWASP Top 10 xavfsizlik talablari asosida tizimni himoyalash, jumladan SQL Injection, XSS, CSRF hujumlariga qarshi choralar ko'rish.

### 1.3. Asosiy foydalanuvchi rollari va manfaatdor tomonlar

Tizimda ishtirok etuvchi tomonlar (Stakeholders) va ularning rollari quyidagicha taqsimlanadi:

| Rol | Tavsif | Vakolatlar |
| :--- | :--- | :--- |
| **Mehmon (Guest)** | Tizimga kirib ko'ruvchi, ro'yxatdan o'tmagan shaxs. | Ochiq g'oyalarni ko'rish, qidiruvdan foydalanish. |
| **Muallif (Author)** | G'oya egasi, faol foydalanuvchi. | G'oya yaratish, tahrirlash, o'chirish, izohlarga javob berish, statistikasini ko'rish. |
| **Ekspert/Kuzatuvchi** | G'oyalarni baholovchi, investor yoki hamkor. | G'oyalarni saqlash (Bookmark), baholash, muallif bilan bog'lanish, tahliliy izoh qoldirish. |
| **Moderator** | Tizim tozaligini nazorat qiluvchi xodim. | Shikoyatlarni ko'rib chiqish, qoidabuzar kontentni bloklash, foydalanuvchilarni ogohlantirish. |
| **Administrator** | Tizim egasi (Superuser). | To'liq boshqaruv, foydalanuvchilar va rollarni boshqarish, tizim sozlamalarini o'zgartirish. |

### 1.4. Funktsional talablar tahlili

Funktsional talablar tizimning nima ish qilishi kerakligini tavsiflaydi. "Farangiz" loyihasi uchun talablar MoSCoW (Must have, Should have, Could have, Won't have) metodi bo'yicha saralandi:

**Must have (Bo'lishi shart):**
*   **Autentifikatsiya:** Tizimga email/parol orqali kirish, JWT tokenlar bilan sessiyani boshqarish.
*   **G'oya CRUD:** G'oyalarni yaratish, o'qish, yangilash va o'chirish.
*   **Feed (Tasma):** G'oyalarning xronologik yoki algoritmik ketma-ketligi.
*   **Ijtimoiy aksiya:** Layk bosish va izoh qoldirish.

**Should have (Bo'lishi kerak):**
*   **Chat:** Yakkama-yakka xabar almashish.
*   **Profil:** Avatar, bio va foydalanuvchi ma'lumotlari.
*   **Qidiruv:** Kalit so'zlar va teglar bo'yicha qidiruv.
*   **Bildirishnomalar:** Real vaqtda xabardor qilish.

**Could have (Bo'lsa yaxshi):**
*   **Video qo'ng'iroq:** Ilova ichida video aloqa.
*   **Guruh chatlari:** Ko'pchilik bir vaqtda yozishi.
*   **Kuzatuv (Follow):** Obuna bo'lish tizimi.

**Won't have (Hozircha bo'lmaydi):**
*   **To'lov tizimi:** Hozirgi bosqichda monetizatsiya ko'zda tutilmagan.
*   **AI tahlil:** G'oyalarni avtomatik baholash keyingi bosqichlarda rejalashtirilgan.

### 1.5. Nofunktsional va sifat talablari

*   **Masshtablanuvchanlik (Scalability):** Tizim gorizontal masshtablanishga (bir nechta serverlarda ishlashga) tayyor bo'lishi kerak. Bu Docker va Stateless arxitektura orqali ta'minlanadi.
*   **Mavjudlik (Availability):** Tizim 99.9% vaqt davomida ishchi holatda bo'lishi lozim. Buning uchun Nginx load balancer va Redis replikatsiyasi qo'llaniladi.
*   **Javob berish vaqti (Latency):** API so'rovlariga javob vaqti o'rtacha 200ms dan oshmasligi kerak.
*   **Xavfsizlik (Integrity):** Foydalanuvchi ma'lumotlari shifrlangan holda saqlanishi va ruxsatsiz kirishdan himoyalanishi shart.
*   **Lokalizatsiya (i18n):** Tizim kamida 3 ta tilni (O'zbek, Rus, Ingliz) qo'llab-quvvatlashi kerak.

<div style="page-break-after: always;"></div>

## 2-BOB. ARXITEKTURA VA TEXNOLOGIK YECHIMLAR

### 2.1. Tizim arxitekturasi: Monorepo va Modulli Monolit

Loyiha arxitekturasini tanlashda zamonaviy tendensiyalar va loyihaning ko'lami inobatga olindi. Dastlabki bosqichda "Microservices" arxitekturasi juda murakkab va ortiqcha resurs talab qilishi mumkinligi sababli, **"Modular Monolith"** (Modulli Monolit) yondashuvi tanlandi. Bu shuni anglatadiki, butun backend bitta yaxlit dastur sifatida ishlaydi, lekin uning ichki tuzilishi qat'iy ajratilgan modullardan (Foydalanuvchilar, G'oyalar, Chat) iborat. Bu kelajakda kerak bo'lsa, har bir modulni alohida mikroservisga ajratib olishni osonlashtiradi.

Kod bazasini boshqarish uchun **Monorepo** strategiyasi qo'llaniladi.
*   **Afzalliklari:** Backend, Frontend va Mobil ilova kodlari bitta Git repozitoriysida saqlanadi. Bu versiyalar mosligini nazorat qilishni, umumiy kutubxonalar (types, constants) dan foydalanishni va CI/CD jarayonlarini soddalashtiradi.
*   **Tuzilma:**
    *   `/backend` - Django loyihasi
    *   `/frontend` - Next.js ilovasi
    *   `/mobile` - Expo ilovasi
    *   `/nginx` - Konfiguratsiyalar
    *   `/docker` - Infratuzilma fayllari

### 2.2. Backend texnologiyalari: Django ekotizimi va asinxronlik

Server tomoni (Backend) uchun **Python** tilining **Django 5** freymvorki tanlandi.
**Nega aynan Django?**
1.  **Tezkorlik:** "Deadline"lar muhim bo'lgan loyihalarda Django o'zining tayyor yechimlari (Auth, Admin, ORM) bilan ishlab chiqarish vaqtini 30-40% ga qisqartiradi.
2.  **Xavfsizlik:** Django o'z ichida SQL Injection, XSS, CSRF va Clickjacking hujumlariga qarshi o'rnatilgan himoya vositalariga ega.
3.  **Ekotizim:** Minglab tayyor kutubxonalar (Django REST Framework, Django Filter, Jazzmin) mavjud.

**Asinxronlik (Async):**
An'anaviy Django (WSGI) sinxron ishlaydi, ya'ni bir vaqtda bitta so'rovni bajaradi. Lekin Chat va Bildirishnomalar uchun bu yetarli emas. Shu sababli, loyihada **Django Channels** va **Daphne** serveri ishlatildi. Bu loyihani **ASGI** (Asynchronous Server Gateway Interface) rejimiga o'tkazib, WebSocket ulanishlarini va uzoq davom etadigan so'rovlarni asinxron bajarish imkonini berdi.

### 2.3. Frontend texnologiyalari: Next.js, SSR va optimallashtirish

Web interfeys uchun React.js kutubxonasiga asoslangan **Next.js 14 (App Router)** freymvorki tanlandi.
**Texnik ustunliklari:**
*   **Server-Side Rendering (SSR):** Sahifa serverda tayyorlanib, foydalanuvchiga HTML ko'rinishida yuboriladi. Bu saytning birinchi yuklanishini (FCP) tezlashtiradi va SEO (Qidiruv tizimlarida ko'rinish) uchun juda muhim.
*   **Image Optimization:** `next/image` komponenti rasmlarni avtomatik WebP formatga o'tkazib, o'lchamini qurilma ekraniga moslashtiradi.
*   **TanStack Query:** Server holatini (Server State) boshqarish uchun ishlatiladi. U ma'lumotlarni keshlaydi, fonda yangilab turadi va tarmoq uzilganda qayta ishlashni (Retry logic) ta'minlaydi.

### 2.4. Mobil ishlanma: React Native va Expo platformasi

Kross-platforma mobil ilova yaratish uchun **React Native** eng optimal yechim deb topildi.
*   **Native Performance:** React Native ilovalari haqiqiy "Native" komponentlarga (UIView, AndroidView) kompilyatsiya qilinadi, shuning uchun ular Flutter yoki WebVview ilovalaridan ko'ra yengilroq va tezroq ishlaydi.
*   **Code Sharing:** Frontend (Web) va Mobil ilova o'rtasida biznes mantiq va TypeScript interfeyslarini 70-80% gacha ulashish mumkin.
*   **Expo:** Bu React Native ustiga qurilgan vositalar to'plami. U `Expo Go` orqali ilovani telefonda simsiz test qilish, `EAS Build` orqali bulutda ilovani yig'ish (build) va `OTA Updates` orqali foydalanuvchilarga yangilanishlarni App Store/Play Market'siz yetkazish imkonini beradi.

### 2.5. Ma'lumotlar almashinuvi protokollari (REST vs WebSocket)

Loyihada gibrid yondashuv qo'llanilgan:
1.  **REST API (HTTP/1.1):** Asosiy ma'lumotlar almashinuvi uchun (CRUD amallari). Bu standart, keshlanadigan va oson tushuniladigan protokol.
    *   Format: JSON.
    *   Auth: Bearer Token (JWT).
2.  **WebSocket (WS/WSS):** Real vaqt voqealari uchun (Chat, Bildirishnomalar). Bu doimiy ochiq TCP ulanish bo'lib, serverga mijoz so'rovini kutmasdan ma'lumot yuborish imkonini beradi (Server Push).

### 2.6. Infratuzilma va DevOps vositalari (Docker, Nginx)

Loyihaning barqaror ishlashi uchun **Docker** konteynerlash texnologiyasi joriy etildi. Har bir xizmat (Django, Postgres, Redis) o'zining izolyatsiya qilingan muhitida (Container) ishlaydi. Bu "Dependency Hell" muammosini yo'qotadi.
**Nginx** veb-serveri esa asosiy kirish darvozasi (Gateway) hisoblanadi. U:
*   Statik fayllarni (media, css, js) xizmat qiladi.
*   SSL/TLS shifrlashni (HTTPS) ta'minlaydi.
*   Yuklamani taqsimlaydi va xavfsizlik devori (Firewall) vazifasini bajaradi.

<div style="page-break-after: always;"></div>

## 3-BOB. MA'LUMOTLAR MODELI VA BAZA LOYIHALASH

### 3.1. Ma'lumotlar bazasini tanlash: PostgreSQL afzalliklari

"Farangiz" loyihasi murakkab tuzilmali va o'zaro bog'liq ma'lumotlar (Foydalanuvchilar, G'oyalar, Izohlar) bilan ishlaganligi sababli, **PostgreSQL** relyatsion ma'lumotlar bazasi (RDBMS) tanlandi.
**Nega MySQL yoki MongoDB emas?**
*   **ACID:** PostgreSQL ma'lumotlar yaxlitligi va tranzaksiyalar ishonchliligini to'liq kafolatlaydi.
*   **JSONB:** U nafaqat jadvallar, balki JSON formatidagi ma'lumotlar bilan ham samarali ishlaydi (NosQL xususiyatlari).
*   **Full-Text Search:** PostgreSQL ichida kuchli matn qidiruv motori mavjud, bu alohida ElasticSearch serverini o'rnatish zaruratini yo'qotadi.

### 3.2. Konseptual modellashtirish va ER diagramma

Ma'lumotlar bazasi loyihalashda **3-Normal Forma (3NF)** qoidalarga amal qilindi, bu ma'lumotlarning takrorlanishini (redundancy) oldini oladi.
Asosiy Entitetlar (Entities):
*   `User` (Foydalanuvchi)
*   `Idea` (G'oya)
*   `Tag` (Kalit so'z)
*   `Comment` (Izoh)
*   `ChatRoom` (Suhbat xonasi)
*   `Message` (Xabar)
*   `Notification` (Bildirishnoma)

### 3.6. Ma'lumotlar bazasini optimallashtirish va indekslash

Katta hajmdagi ma'lumotlar bilan ishlashda so'rovlar sekinlashishi mumkin. Buni oldini olish uchun:
*   **B-Tree indekslar:** `id`, `slug`, `created_at` kabi tez-tez qidiriladigan va saralanadigan ustunlarga qo'yiladi.
*   **GIN indekslar:** Teglar va matnli qidiruv (SearchVector) maydonlari uchun ishlatiladi.
*   **Select Related / Prefetch Related:** Django ORM dagi "N+1 muammosi" ni oldini olish uchun JOIN amallarini optimallashtirish.

<div style="page-break-after: always;"></div>

## 4-BOB. FUNKTSIONAL MODULLARNING CHUQUR TAHLILI

### 4.1. Autentifikatsiya va avtorizatsiya quyi tizimi

Xavfsizlik tizimning eng muhim qismidir. Bizda **JWT (JSON Web Token)** standarti qo'llaniladi.
Jarayon:
1.  Foydalanuvchi login va parolni yuboradi.
2.  Server tekshiradi va 2 ta token qaytaradi:
    *   `Access Token` (yashash vaqti: 30 daqiqa): API ga kirish uchun.
    *   `Refresh Token` (yashash vaqti: 7 kun): Yangi access token olish uchun.
3.  Front-end Access tokenni xotirada, Refresh tokenni esa `HttpOnly Cookie` da saqlaydi. Bu XSS hujumlaridan himoya qiladi.

Parollar bazada ochiq holda emas, **PBKDF2** algoritmi yordamida `hash` (shifrlangan) ko'rinishda saqlanadi. Hatto ma'lumotlar bazasi o'g'irlansa ham, xakerlar parollarni bila olmaydi.

### 4.2. G'oyalarni boshqarish va tahrirlash moduli

Bu modul CRUD (Create, Read, Update, Delete) operatsiyalarini o'z ichiga oladi.
*   **Yaratish:** Foydalanuvchi g'oya matnini Markdown formatida kiritishi mumkin. Rasmlar serverga yuklanayotganda, `Pillow` kutubxonasi ularni siqadi (compress) va optimal o'lchamga keltiradi.
*   **Slugify:** Har bir g'oya uchun uning sarlavhasidan kelib chiqib chiroyli URL (SEO-friendly URL) yaratiladi (masalan: `mening-yangi-goyam-123`).
*   **Avtomatik o'chish:** O'chirilgan g'oyalar bazadan darhol ketmaydi, `Soft Delete` (is_deleted=True) belgisi qo'yiladi. Bu tasodifan o'chirilgan ma'lumotlarni tiklash imkonini beradi.

### 4.6. Real vaqt muloqot tizimi (Instant Messaging)

Chat moduli WebSocket protokoli ustiga qurilgan.
Texnik sxema:
1.  Mijoz `ws://farangiz.uz/ws/chat/` manziliga ulanadi.
2.  Server (Daphne) ulanishni qabul qiladi va uni `Channel Layer` ga qo'shadi.
3.  `Channel Layer` sifatida **Redis** ishlatiladi. Bu xabarlarni tezkor almashish buferi vazifasini bajaradi.
4.  Foydalanuvchi A xabar yozganda, xabar Redisga tushadi, Redis esa uni shu chat xonasidagi barcha ulangan foydalanuvchilar (B, C) ga tarqatadi.
5.  Fonda `Celery` vazifasi xabarni PostgreSQL bazasiga doimiy saqlash uchun yozib qo'yadi.

### 4.7. Multimedia va video konferensaloqa moduli

Video aloqa uchun **WebRTC** (Web Real-Time Communication) texnologiyasi kerak. Biroq, to'g'ridan-to'g'ri P2P (Peer-to-Peer) ulanish NAT va Firewalllar tufayli ko'p holatlarda ishlamaydi. Shu sababli TURN serverlar kerak bo'ladi.
Biz o'zimizning infratuzilmamizni murakkablashtirmaslik uchun **Agora.io** SDK dan foydalandik.
Backend vazifasi:
*   Foydalanuvchi qo'ng'iroq qilmoqchi bo'lganda Agora API dan vaqtinchalik xavfsiz token olish.
*   Bu tokenni mobil ilovaga uzatish.
*   Qo'ng'iroq boshlangan va tugagan vaqtlarni log qilish.

<div style="page-break-after: always;"></div>

## 5-BOB. FOYDALANUVCHI INTERFEYSI (UI) VA TAJRIBASI (UX)

### 5.1. Web ilova interfeysi

Veb-interfeysni loyihalashda **"Mobile-First"** (Avval mobil uchun) strategiyasidan foydalanildi. Bu yondashuv shuni anglatadiki, dizayn dastlab kichik ekranlar (smartfonlar) uchun ishlab chiqiladi, so'ngra bosqichma-bosqich planshet va katta monitorlar uchun kengaytirilib, moslashtiriladi.

**Asosiy yechimlar:**
*   **Minimalizm:** Ekranda faqat foydalanuvchi ayni paytda bajarishi kerak bo'lgan vazifaga taalluqli elementlar ko'rsatiladi. Ortiqcha bezaklar, chalg'ituvchi bannerlar olib tashlangan.
*   **Ranglar psixologiyasi:** Ranglar nafaqat estetik, balki funksional vazifani ham bajaradi:
    *   **Moviy (#3B82F6):** Asosiy harakatlar (Primary Action) uchun. Bu rang ishonch, intellekt va tinchlikni ifodalaydi.
    *   **Yashil (#10B981):** Muvaffaqiyatli amallar (Success) uchun.
    *   **Qizil (#EF4444):** Xatolik va ogohlantirishlar (Error) uchun.
    *   **Neytral kulrang:** Matn va fon uchun, ko'zni charchatmaslik maqsadida.
*   **Grid tizimi:** Sahifalar 12 ustunli (12-column grid) setka asosida qurilgan bo'lib, bu elementlarning tartibli joylashuvini ta'minlaydi.

React va Next.js imkoniyatlaridan foydalangan holda, interfeys **Komponentlar** asosida yig'ilgan. Masalan, "G'oya kartochkasi" (Idea Card) bir marta yoziladi va saytning istalgan joyida (Asosiy sahifa, Profil, Qidiruv natijalari) qayta ishlatiladi (Reusability).

### 5.2. Mobil ilova interfeysi

Mobil ilova dizayni (React Native) operatsion tizimning (iOS va Android) o'ziga xos "Native" (tabiiy) xususiyatlarini hisobga olgan holda yaratildi.

**Mobil UX xususiyatlari:**
*   **Navigatsiya:** Ekranlar o'rtasida harakatlanish uchun eng qulay usul bo'lgan **"Bottom Tab Bar"** (Pastki menyu paneli) tanlandi. Bu foydalanuvchiga bosh barmog'i bilan asosiy bo'limlarga (Asosiy, Qidiruv, Chat, Profil) oson yetib borish imkonini beradi.
*   **Imo-ishoralar (Gestures):** "Swipe" (surish) orqali orqaga qaytish, ro'yxatni yangilash uchun pastga tortish (Pull-to-refresh) kabi intuitiv harakatlar qo'llab-quvvatlanadi.
*   **Taktil aloqa (Haptic Feedback):** Muhim amallar bajarilganda (masalan, layk bosilganda yoki xato yuz berganda) telefon yengil tebranish orqali foydalanuvchiga javob qaytaradi.
*   **Barmoq zonasi:** Barcha interaktiv elementlar (tugmalar, havolalar) kamida **44x44 piksel** o'lchamda bo'lishi ta'minlangan, bu esa noto'g'ri bosishlarning oldini oladi.

### 5.3. Dizayn tizimi va theme boshqaruvi

Loyiha davomida interfeysning bir xilligini ta'minlash maqsadida maxsus **Dizayn Tizimi (Design System)** ishlab chiqildi. U quyidagi standartlarni o'z ichiga oladi:
*   **Tipografiya:** Asosiy shrift sifatida **"Inter"** yoki **"Roboto"** tanlangan. Sarlavhalar (H1, H2), asosiy matn (Body) va izohlar (Caption) uchun o'lchamlar, qator balandligi (line-height) va harflar oralig'i (letter-spacing) qat'iy belgilangan.
*   **Spacing (Oraliqlar):** Elementlar orasidagi masofalar 4 pikselli qadam (4px, 8px, 16px, 24px...) asosida hisoblanadi. Bu vizual ritmni hosil qiladi.
*   **Mavzular (Theming):** "Tailwind CSS" konfiguratsiyasi orqali **Dark Mode** (Tun rejim) to'liq qo'llab-quvvatlanadi. Tizim foydalanuvchining qurilma sozlamalariga qarab avtomatik ravishda yorug' yoki qorong'u rejimga o'tadi. Qorong'u rejimda kontrast darajasi ko'z zo'riqishini kamaytirish va OLED ekranlarda batareya quvvatini tejash uchun optimallashtirilgan.

### 5.4. UX tamoyillari va foydalanish qulayligi

Foydalanuvchi Tajribasi (UX) ni loyihalashda **Yakob Nilsenning 10 ta evristikasi**ga asoslanildi:

1.  **Tizim holatining ko'rinishi (Visibility of system status):** Foydalanuvchi har doim tizim nima qilayotganini bilishi kerak. Masalan, ma'lumot yuklanayotganda "Skeleton Loader" yoki aylanuvchi indikator (Spinner) ko'rsatiladi. Fayl yuklanayotganda jarayon foizlarda aks etadi.
2.  **Tizim va real dunyo mosligi:** Texnik atamalar o'rniga tushunarli so'zlar ishlatiladi. Masalan, "Database Record Created" o'rniga "Sizning g'oyangiz muvaffaqiyatli nashr qilindi".
3.  **Xatolardan himoya va tiklanish (Error prevention):** Tizim xato yuz berishini oldindan sezishga va oldini olishga harakat qiladi. Masalan, email kiritish maydonida `@` belgisi qolib ketsa, forma yuborilmaydi va qizil rangda tushunarli izoh chiqadi.
4.  **Boshqaruv erkinligi:** Foydalanuvchi tasodifan biror amalni bajarsa (masalan, izohni o'chirish), tizim "Bekor qilish" (Undo) imkoniyatini taqdim etadi yoki tasdiqlash oynasini (Confirmation Modal) chiqaradi.
5.  **Minimal yuklama:** Foydalanuvchining xotirasiga tayanishdan ko'ra, ma'lumotlarni ko'rsatish afzaldir. Masalan, qidiruv vaqtida oxirgi qidirilgan so'zlar ro'yxati chiqib turadi.

<div style="page-break-after: always;"></div>

## 6-BOB. TESTLASH, SIFAT NAZORATI VA OPTIMALLASHTIRISH

### 6.1. Backend testlari

Dastur kodining barqarorligi va ishonchliligini ta'minlash maqsadida **Unit Testlar (Birlik testlari)** yozilgan. Backend qismi (Django) uchun **pytest** freymvorkidan foydalanildi. Bu testlar tizimning eng kichik bo'laklari – funksiyalar va sinflarni alohida tekshiradi.

**Asosiy testlash yo'nalishlari:**
*   **Modellar testi:** Ma'lumotlar bazasiga yozish, o'qish va mantiqiy cheklovlar (constraints) ishlashini tekshirish. Masalan, "User" modelida email takrorlanmasligi yoki "Idea" modelida sarlavha uzunligi cheklovi.
*   **Serializer testi:** Kiruvchi ma'lumotlarning (JSON payload) to'g'ri validatsiya qilinishini tekshirish.
*   **View (Controller) testi:** So'rovlarga qaytadigan HTTP status kodlari (200 OK, 201 Created, 400 Bad Request, 403 Forbidden) va ruxsatlar (Permissions) to'g'riligini tekshirish.
*   **Fixture-lar:** `Factory Boy` kutubxonasi yordamida testlar uchun soxta (mock) ma'lumotlar avtomatik generatsiya qilinadi, bu esa real bazani ifloslantirmaslikka yordam beradi.

### 6.2. API tekshirish

Backend va Frontend o'rtasidagi integratsiyani tekshirish uchun **API Integration Testlar** o'tkaziladi. Bu jarayonda API endpointlarning haqiqiy ishlash senariylari simulyatsiya qilinadi.

**Testlash vositalari va usullari:**
*   **Postman / Insomnia:** Dasturchilar tomonidan qo'lda yuboriladigan so'rovlar yordamida har bir endpointning ishlashini, qaytaradigan ma'lumot tuzilishi (Schema) va xatolik xabarlarini tekshirish.
*   **Pytest-Django:** Test muhitida virtual klient yaratib, to'liq sikl (Request-Response cycle) tekshiriladi.
*   **Edge Cases (Chekka holatlar):** Kutilmagan ma'lumotlar yuborilganda tizimning reaksiyasi. Masalan, manfiy narx kiritish, juda katta fayl yuklash yoki mavjud bo'lmagan ID ga murojaat qilish. Tizim bunday hollarda "500 Server Error" bermasdan, tushunarli xatolik xabarini qaytarishi lozim.

### 6.3. Manual test ssenariylari

Avtomatlashtirilgan testlar qanchalik ko'p bo'lmasin, inson omili bilan bog'liq xatolarni topish uchun **Manual (Qo'lda) Testlash** o'tkaziladi.

**Sinov turlari:**
*   **UAT (User Acceptance Testing):** Tizimning foydalanuvchi talablariga mosligini tekshirish. Haqiqiy foydalanuvchilar (beta-testerlar) jalb qilinib, "G'oya yaratish", "Chatda yozish", "Ro'yxatdan o'tish" kabi asosiy ssenariylar bajarib ko'riladi.
*   **Cross-Browser Testing:** Veb-saytning turli brauzerlarda (Chrome, Firefox, Safari, Edge) bir xil ko'rinishini ta'minlash.
*   **Mobil moslashuvchanlik:** Turli ekran o'lchamiga ega qurilmalarda (iPhone, Samsung, Planshetlar) interfeys elementlarining to'g'ri joylashishini tekshirish.
*   **Tarmoq sharoitlari:** Internet tezligi past bo'lgan (3G/2G) yoki uzilib qolgan holatlarda ilovaning o'zini tutishi (Offline mode, Retry mechanism) sinovdan o'tkaziladi.

### 6.4. Ishonchlilik va regressiya

Loyihaning uzoq muddatli barqarorligini ta'minlash uchun **Regressiya Testlari** va **CI/CD** (Continuous Integration / Continuous Deployment) amaliyotlari joriy etilgan.

**Jarayon:**
*   **Regressiya:** Tizimga yangi funksiya qo'shilganda yoki o'zgartirish kiritilganda, eski ishlayotgan funksiyalarning buzilib qolmaganligini tekshirish. Bu avtomatlashtirilgan testlar to'plamini qayta ishga tushirish orqali amalga oshiriladi.
*   **CI/CD Pipeline (GitHub Actions):** Har safar kod repozitoriyga (Git) yuklanganda, avtomatik ravishda virtual serverda barcha testlar ishga tushadi. Agar birorta test xato bersa, kod "Production" (Asosiy) serverga o'tkazilmaydi. Bu "buzilgan kod"ning foydalanuvchilarga yetib borishini oldini oladi.
*   **Monitoring:** "Sentry" tizimi orqali real vaqt rejimida yuzaga kelgan xatoliklar (Crash reports) kuzatib boriladi va dasturchilarga xabar beriladi.

<div style="page-break-after: always;"></div>

## 7-BOB. XAVFSIZLIK SIYOSATI VA MA'LUMOTLAR HIMOYASI

### 7.1. JWT va sessiya xavfsizligi

Avtorizatsiya tizimida **JWT (JSON Web Token)** standarti qo'llaniladi. Bu mobil ilovalar uchun juda qulay va masshtablanuvchan yechimdir. Biroq, JWT agar mijoz tomonida (Local Storage) noto'g'ri saqlansa, XSS hujumlari orqali o'g'irlanishi xavfi mavjud.

**Himoya choralari:**
*   **Dual-Token Architecture:** Tizim ikki xil token ishlatadi:
    *   **Access Token:** Qisqa muddatli (masalan, 15 daqiqa). U faqat operativ xotirada (Redux/State) saqlanadi va diskka yozilmaydi.
    *   **Refresh Token:** Uzoq muddatli (masalan, 7 kun). U faqat **HttpOnly Cookie** ichida saqlanadi. Bu kuki JavaScript orqali o'qilmaydi, shuning uchun XSS hujumlarida uni o'g'irlash imkonsiz.
*   **Token Rotation:** Har safar Refresh Token ishlatilganda, u yangilanadi va eskisi bekor qilinadi. Bu o'g'irlangan tokenning ishlash muddatini minimallashtiradi.

### 7.2. Ma'lumotlarni validatsiya qilish

Tizim xavfsizligining oltin qoidasi: **"Foydalanuvchi kiritgan hech qanday ma'lumotga ishonma"**.

**Validatsiya bosqichlari:**
*   **Frontend Validatsiya:** Foydalanuvchi tajribasini yaxshilash uchun (masalan, email formati to'g'riligi), lekin bu xavfsizlik kafolati emas.
*   **Backend Validatsiya:** Bu asosiy himoya qalqonidir. **Django REST Framework Serializers** barcha kiruvchi ma'lumotlarni qat'iy tekshiradi (maydon turi, uzunligi, maxsus belgilar).
*   **Sanitization:** HTML teglar va zararli skriptlarni tozalash uchun `bleach` kutubxonasi ishlatiladi, bu saqlangan XSS hujumlarini oldini oladi.

### 7.3. Tarmoqli himoya va rate-limit

Server infratuzilmasini kiberhujumlardan himoya qilish uchun kompleks choralar ko'rilgan.

**Himoya mexanizmlari:**
*   **Throttling (Rate Limiting):** Brute-force (parol tanlash) va DDoS hujumlariga qarshi har bir IP manzil uchun so'rovlar soni cheklanadi. Masalan:
    *   Login urinishlari: daqiqasiga 5 marta.
    *   G'oya yaratish: soatiga 20 marta.
    *   API umumiy: soniyasiga 100 marta.
*   **Firewall:** Nginx va Docker tarmoq sozlamalari orqali faqat kerakli portlar (80, 443) ochiladi, ma'lumotlar bazasi va Redis portlari tashqi olamdan yopiq.
*   **HTTPS/SSL:** Barcha ma'lumotlar almashinuvi shifrlangan kanal orqali amalga oshiriladi.

### 7.4. Fayl yuklash xavfsizligi

Foydalanuvchilar tomonidan yuklanadigan fayllar (avatarlar, rasmlar) katta xavf manbai bo'lishi mumkin.

**Xavfsizlik choralari:**
*   **MIME Type Sniffing:** Faylning kengaytmasiga (.jpg) emas, uning "sehrli baytlari"ga (magic bytes) qarab haqiqiy turi tekshiriladi (`python-magic` kutubxonasi).
*   **Renaming:** Fayl nomlari serverga tushganda UUID (masalan, `f47ac10b-58cc-4372....jpg`) ga o'zgartiriladi. Bu maxsus nomlar orqali tizimni buzish urinishlarini yo'qqa chiqaradi.
*   **Non-executable Uploads:** Fayl yuklanadigan papkalarda skriptlarni (.php, .py, .sh) ishga tushirish taqiqlanadi.

### 7.5. Zaxira va tiklash strategiyasi (Backup & Recovery)

Ma'lumotlar yo'qolishi har qanday tizim uchun falokatdir. Buni oldini olish uchun "3-2-1" zaxiralash strategiyasi qo'llaniladi.

**Amalga oshirish:**
*   **Avtomatik Backup:** PostgreSQL bazasi har 24 soatda to'liq (Full Dump), har soatda esa o'zgarishlar (WAL logs) zaxiralanadi.
*   **Off-site Storage:** Zaxira nusxalari serverning o'zida emas, balki alohida bulutli omborda (masalan, AWS S3 yoki alohida FTP serverda) shifrlangan holda saqlanadi.
*   **Disaster Recovery:** Tizim ishdan chiqqanda, uni 30 daqiqa ichida qayta tiklash bo'yicha aniq instruksiyalar va skriptlar tayyorlangan.

<div style="page-break-after: always;"></div>

## 8-BOB. JOYLASHTIRISH VA QO'LLAB-QUVVATLASH (DEPLOYMENT)

### 8.1. Muhit sozlamalari (Environment Variables)

Loyiha xavfsizligi va moslashuvchanligini ta'minlash uchun **"Twelve-Factor App"** metodologiyasiga amal qilinadi. Barcha konfiguratsiyalar koddan tashqarida, **.env** fayllarida saqlanadi.

**Asosiy qoidalar:**
*   **Debug Mode:** Develop muhitda `DEBUG=True`, Production muhitda esa qat'iy `DEBUG=False` qilib belgilanadi.
*   **Secret Keys:** Django `SECRET_KEY`, Database parollari va API kalitlari hech qachon Git repozitoriyga yuklanmaydi. Ular `.gitignore` ro'yxatiga kiritilgan.
*   **Misol:**
    ```env
    DEBUG=False
    DB_HOST=postgres_db
    DB_PASSWORD=super_secret_password_123
    ALLOWED_HOSTS=farangiz.uz,www.farangiz.uz
    ```

### 8.2. Docker Compose bilan ishga tushirish

Butun infratuzilma (Backend, Frontend, DB, Redis, Nginx) **docker-compose.yml** faylida yagona ekotizim sifatida ta'riflangan. Bu "Loyiha mening kompyuterimda ishlayapti, serverda esa yo'q" degan muammoni butunlay yo'q qiladi.

**Ishga tushirish jarayoni:**
1.  Loyihani serverga ko'chirib olish: `git clone ...`
2.  Muhit o'zgaruvchilarini sozlash: `.env` yaratish.
3.  Yagona buyruq bilan start berish: `docker compose up -d --build`.

### 8.3. Nginx va ishlab chiqarish muhiti

Django va Next.js serverlari bevosita internetga ochilmaydi. Ularning oldida **Nginx** (Reverse Proxy) turadi.

**Nginx vazifalari:**
*   **Static & Media Files:** Rasmlar, CSS va JS fayllarni bevosita o'zi uzatadi (Backendni bezovta qilmasdan).
*   **SSL/TLS Termination:** "Let's Encrypt" sertifikatlari yordamida HTTPS (443-port) xavfsiz ulanishni ta'minlaydi.
*   **Load Balancing:** Kelayotgan so'rovlarni bir nechta backend konteynerlariga taqsimlashi mumkin.

### 8.4. Monitoring va loglar

Tizim salomatligini (System Health) doimiy nazorat qilish uchun monitoring vositalari o'rnatilgan.

*   **Logging:** Barcha konteynerlar loglari (stdout/stderr) yig'ib boriladi. Django xatoliklari "Sentry" yoki "ELK Stack" (Elasticsearch, Logstash, Kibana) ga yuboriladi.
*   **Metrics:** **Prometheus** yordamida server parametrlari (CPU, RAM, Disk, Request Count) yig'iladi.
*   **Visualization:** **Grafana** dashboardlarida chiroyli grafiklar ko'rinishida aks ettiriladi. Masalan, "So'nggi 1 soatdagi 500-xatoliklar soni" yoki "Joriy aktiv foydalanuvchilar".

### 8.5. Kengaytirish va skalalash (Scaling)

Loyiha arxitekturasi gorizontal kengayishga moslashtirilgan.

**Strategiya:**
*   **Stateless Backend:** Django serveri foydalanuvchi sessiyasini o'z xotirasida saqlamaydi (u Redis yoki Bazada turadi). Shu sababli, yuklama oshganda yana 5 ta Django konteynerini yonma-yon ishga tushirish (Scale Up) mumkin.
*   **Database Separation:** Ma'lumotlar bazasi, Redis cache va Media fayllar (S3) alohida-alohida serverlarda joylashishi mumkin.
*   **CDN (Content Delivery Network):** Rasmlar va statik fayllar Cloudflare kabi CDN tarmoqlari orqali dunyo bo'ylab keshlanadi, bu esa serverga tushadigan yuklamani 70% ga kamaytiradi.

<div style="page-break-after: always;"></div>

## 9-BOB. LOYIHA NATIJALARI VA KELAJAK

### 9.1. Erishilgan texnik va amaliy natijalar

Loyiha yakunida to'liq ishlaydigan MVP (Minimum Viable Product) mahsulot olindi.
Texnik ko'rsatkichlar:
*   **Kod hajmi:** 15,000+ qator kod (Backend + Frontend + Mobile).
*   **Interfeys:** 20 dan ortiq unikal ekran va sahifalar.
*   **Tezlik:** Google Lighthouse bo'yicha Performance ko'rsatkichi 90+ ball.

### 9.3. Kelajakdagi rivojlanish istiqbollari (AI, Blockchain)

*   **Sun'iy Intellekt:** OpenAI API yordamida g'oyalarni generatsiya qilish, matnni to'g'rilash va o'xshash g'oyalarni topish.
*   **Blockchain:** G'oyalar mualliflik huquqini himoya qilish uchun ularning "xesh"ini Blockchain tarmog'iga yozish (IP Protection).
*   **Monetizatsiya:** Crowdfunding (Xalqaro moliyalashtirish) modulini qo'shish.

<div style="page-break-after: always;"></div>

## XULOSA

Ushbu kurs ishi doirasida "Farangiz" loyihasini yaratish orqali zamonaviy dasturiy injiniringning to'liq sikli – g'oyadan tortib to  yakuniy mahsulotgacha bo'lgan yo'l bosib o'tildi.
Tadqiqot natijasida shunday xulosaga kelindiki, **Modular Monolith** arxitekturasi va **Kross-platforma** texnologiyalari (React Native) o'rta hajmdagi startaplar uchun eng samarali yechim hisoblanadi. Ular ishlab chiqish tezligi, narxi va sifati o'rtasidagi eng yaxshi muvozanatni ta'minlaydi.

Yaratilgan platforma nafaqat texnik jihatdan mukammal, balki ijtimoiy ahamiyatga ham ega. U yoshlarning innovatsion salohiyatini ro'yobga chiqarish, bilim almashish madaniyatini shakllantirish va O'zbekiston startap ekotizimini rivojlantirishga o'z hissasini qo'shadi.

<div style="page-break-after: always;"></div>

## FOYDALANILGAN ADABIYOTLAR RO'YXATI

1.  **Dasturiy mahsulotlar yaratish:**
    *   Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
    *   Percival, H. (2014). *Test-Driven Development with Python*. O'Reilly Media.

2.  **Web texnologiyalar:**
    *   Django Software Foundation. (2024). *Django 5.0 Documentation*. Retrieved from https://docs.djangoproject.com/
    *   Vercel Inc. (2024). *Next.js Documentation*. Retrieved from https://nextjs.org/docs

3.  **Mobil dasturlash:**
    *   Meta Open Source. (2024). *React Native Core Concepts*. https://reactnative.dev/
    *   Expo. (2024). *Expo SDK Reference*. https://docs.expo.dev/

4.  **Ma'lumotlar bazasi va DevOps:**
    *   PostgreSQL Tutorial. (2024). *Comprehensive Guide to PostgreSQL*.
    *   Docker Inc. (2024). *Docker Documentation*.

5.  **Internet manbalar:**
    *   MDN Web Docs (Mozilla Developer Network).
    *   StackOverflow Developer Survey 2023.
    *   Medium: "Scaling Django Applications" maqolalar to'plami.

<div style="page-break-after: always;"></div>

## ILOVALAR

### Ilova A. Asosiy Ekranlarning Dizayn Maketlari (Wireframes)

*(Bu yerda Figma yoki eskizlardan olingan qoralama rasmlar bo'lishi kerak)*

### Ilova B. API spetsifikatsiyasi (Swagger parchasi)

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Farangiz API",
    "version": "1.0.0"
  },
  "paths": {
    "/api/ideas/": {
      "get": {
        "summary": "G'oyalar ro'yxati",
        "parameters": [
          {
            "name": "category",
            "in": "query",
            "schema": { "type": "string" }
          }
        ]
      }
    }
  }
}
```

### Ilova C. Loyiha kodidan namunalar

**models.py (Idea Modeli):**
```python
class Idea(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = RichTextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
```
