from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.shared import OxmlElement, qn
from docx.enum.style import WD_STYLE_TYPE

doc = Document()

# Set margins
section = doc.sections[0]
section.top_margin = Inches(1)
section.bottom_margin = Inches(1)
section.left_margin = Inches(1)
section.right_margin = Inches(1)

# Default font
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)

def add_center_bold(text, size=12, space_after=0, space_before=0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(size)
    r.font.name = 'Times New Roman'
    return p

# Cover page
add_center_bold("O'ZBEKISTON RESPUBLIKASI", size=14, space_after=2)
add_center_bold("OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI", size=14, space_after=2)
add_center_bold("TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI", size=14, space_after=10)
add_center_bold('"Kompyuter injiniringi" fakulteti', size=12, space_after=2)
add_center_bold('"Dasturiy injiniring" yo\'nalishi', size=12, space_after=24)

add_center_bold("3-kurs talabasi Sultonmurodova Farangizning", size=12, space_after=4)
add_center_bold('"Farangiz" loyihasi uchun g\'oyalar banki, ijtimoiy aloqa va real vaqt chat platformasini ishlab chiqish', size=12, space_after=4)
add_center_bold("mavzusida tayyorlagan", size=12, space_after=18)

# Big title
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(30)
r = p.add_run("KURS ISHI")
r.bold = True
r.font.size = Pt(22)
r.font.name = 'Times New Roman'

add_center_bold("Toshkent – 2026", size=12, space_before=24)

doc.add_page_break()

# Helper: dot leader tab stop
def set_tab_stop_with_dots(paragraph, position_inches=6.5):
    pPr = paragraph._p.get_or_add_pPr()
    tabs = pPr.find(qn('w:tabs'))
    if tabs is None:
        tabs = OxmlElement('w:tabs')
        pPr.append(tabs)
    tab = OxmlElement('w:tab')
    tab.set(qn('w:val'), 'right')
    tab.set(qn('w:leader'), 'dot')
    tab.set(qn('w:pos'), str(int(position_inches*1440)))
    tabs.append(tab)

# MUNDARIJA
doc.add_paragraph("MUNDARIJA", style='Heading 1')

contents = [
("KIRISH", "3"),
("1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI", "5"),
("1.1. Mavzu dolzarbligi va muammo qo'yilishi", "5"),
("1.2. Loyiha maqsadi va vazifalari", "6"),
("1.3. Asosiy foydalanuvchi rollari", "7"),
("1.4. Funktsional talablar", "8"),
("1.5. Nofunktsional talablar", "9"),
("1.6. Analoglar va farqlovchi jihatlar", "10"),
("1.7. Foydalanish ssenariylari (use-case)", "11"),
("2-BOB. ARXITEKTURA VA TEXNOLOGIYALAR", "13"),
("2.1. Umumiy tizim arxitekturasi", "13"),
("2.2. Backend: Django, DRF, Channels", "14"),
("2.3. Web frontend: Next.js va UI qatlam", "16"),
("2.4. Mobile: Expo va React Native", "17"),
("2.5. Ma'lumotlar almashinuvi va API uslubi", "19"),
("2.6. DevOps va konteynerlash", "20"),
("2.7. Komponentlararo integratsiya", "21"),
("3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI", "22"),
("3.1. Foydalanuvchi va autentifikatsiya modeli", "22"),
("3.2. G'oyalar, teglar, izohlar va reaksiyalar", "23"),
("3.3. Kuzatish (follow) va bildirishnomalar", "24"),
("3.4. Chat xonalari, xabarlar va qo'ng'iroqlar", "25"),
("3.5. Fayl saqlash va media oqimlari", "26"),
("3.6. ER diagramma tavsifi", "27"),
("4-BOB. FUNKTSIONAL MODULLAR TAHLILI", "28"),
("4.1. Ro'yxatdan o'tish va kirish", "28"),
("4.2. G'oyalar yaratish va boshqarish", "29"),
("4.3. Izohlar va layklar", "30"),
("4.4. Kuzatish va profil boshqaruvi", "31"),
("4.5. Bildirishnomalar", "32"),
("4.6. Real vaqt chat", "33"),
("4.7. Ovozli/video qo'ng'iroqlar", "34"),
("4.8. Qidiruv, trend va filtrlar", "35"),
("4.9. Bookmark va saqlash", "36"),
("4.10. Xalqaro til qo'llab-quvvatlashi (i18n)", "37"),
("4.11. Admin panel va moderatsiya", "38"),
("5-BOB. FOYDALANUVCHI INTERFEYSI VA UX", "39"),
("5.1. Web ilova interfeysi", "39"),
("5.2. Mobil ilova interfeysi", "40"),
("5.3. Dizayn tizimi va theme boshqaruvi", "41"),
("5.4. UX tamoyillari va foydalanish qulayligi", "42"),
("6-BOB. TESTLASH VA SIFAT NAZORATI", "43"),
("6.1. Backend testlari", "43"),
("6.2. API tekshirish", "44"),
("6.3. Manual test ssenariylari", "45"),
("6.4. Ishonchlilik va regressiya", "46"),
("7-BOB. XAVFSIZLIK VA ISHONCHLILIK", "47"),
("7.1. JWT va sessiya xavfsizligi", "47"),
("7.2. Ma'lumotlarni validatsiya qilish", "48"),
("7.3. Tarmoqli himoya va rate-limit", "49"),
("7.4. Fayl yuklash xavfsizligi", "50"),
("7.5. Zaxira va tiklash strategiyasi", "51"),
("8-BOB. ISHGA TUSHIRISH VA DEPLOY", "52"),
("8.1. Muhit sozlamalari", "52"),
("8.2. Docker Compose bilan ishga tushirish", "53"),
("8.3. Nginx va ishlab chiqarish muhiti", "54"),
("8.4. Monitoring va loglar", "55"),
("8.5. Kengaytirish va skalalash", "56"),
("9-BOB. NATIJALAR VA KELAJAK REJALAR", "57"),
("XULOSA", "59"),
("FOYDALANILGAN ADABIYOTLAR", "61"),
("ILOVALAR", "62"),
]

for title, page in contents:
    p = doc.add_paragraph()
    set_tab_stop_with_dots(p, 6.5)
    run = p.add_run(title)
    run.bold = True if (title.isupper() or "BOB" in title or title in ["XULOSA","ILOVALAR","FOYDALANILGAN ADABIYOTLAR","KIRISH"]) else False
    p.add_run("\t"+page)

doc.add_page_break()

# Content (major sections) - add key parts from user text. Due to size, include all as provided.
def add_h1(text): doc.add_paragraph(text, style='Heading 1')
def add_h2(text): doc.add_paragraph(text, style='Heading 2')
def add_h3(text): doc.add_paragraph(text, style='Heading 3')
def add_para(text):
    p = doc.add_paragraph(text)
    p.paragraph_format.space_after = Pt(6)
    return p
def add_bullets(items):
    for it in items:
        doc.add_paragraph(it, style='List Bullet')

# KIRISH
add_h1("KIRISH")
add_para("Bugungi globallashuv va axborot texnologiyalari jadal rivojlanayotgan davrda, insoniyatning eng qimmatli resurslaridan biri bu – g'oyalar va axborot hisoblanadi. Jamiyatdagi har qanday ijobiy o'zgarishlar, innovatsiyalar va texnologik yutuqlar dastlab kichik bir g'oya sifatida tug'iladi. Biroq, ko'plab ajoyib g'oyalar o'z vaqtida kerakli odamlar bilan bo'lishilmaganligi, yetarlicha muhokama qilinmaganligi yoki shunchaki eshitilmasdan qolganligi sababli amalga oshmay qolmoqda. Ijtimoiy tarmoqlar bugungi kunda hayotimizning ajralmas qismiga aylangan bo'lsa-da, ularning aksariyati ko'ngilochar kontentga ixtisoslashgan bo'lib, jiddiy, ilmiy yoki innovatsion g'oyalarni muhokama qilish uchun maxsus maydonni taqdim eta olmaydi.")
add_para('Shu nuqtai nazardan, "Farangiz" loyihasining yaratilishi zamon talabiga munosib javob hisoblanadi. Ushbu platforma foydalanuvchilarning real muammolar va innovatsion yechimlar bo\'yicha aniq, mazmunli fikr almashinuvini tashkil etishga qaratilgan bo\'lib, u shunchaki xabar almashish vositasi emas, balki "g\'oyalar inkubatori" vazifasini bajaradi. Loyiha g\'oyalarni tuzilmalashtirilgan shaklda taqdim etish, ularni izohlash, baholash, kuzatish va muhokama qilish, shuningdek real vaqt chat va video qo\'ng\'iroqlar orqali sifatli muloqot qilish imkonini beradi.')
add_para('Ushbu kurs ishining asosiy maqsadi - "Farangiz" loyihasini loyihalash va ishlab chiqish jarayonini ilmiy-texnik nuqtai nazardan chuqur tahlil qilishdan iborat. Ish davomida zamonaviy dasturlash texnologiyalari, xususan Python (Django), JavaScript (Next.js, React Native) va real vaqt tizimlari (WebSocket) imkoniyatlari o\'rganiladi va amaliyotga tatbiq etiladi. Shuningdek, loyihaning arxitekturasi, ma\'lumotlar bazasi tuzilishi, xavfsizlik masalalari va foydalanuvchi interfeysi dizayni bo\'yicha qabul qilingan qarorlar ilmiy asoslab beriladi.')
add_para('Kurs ishi nafaqat nazariy bilimlarni mustahkamlash, balki real dunyo muammolariga yechim bo\'la oladigan, kengaytiriluvchan va bozor talablariga javob beradigan dasturiy mahsulot yaratish ko\'nikmalarini rivojlantirishga xizmat qiladi. "Farangiz" platformasi kelajakda talabalar, startapchilar, investorlar va barcha ijodkor insonlar uchun muloqot ko\'prigi bo\'lib xizmat qilishi kutilmoqda.')

doc.add_page_break()

# 1-BOB
add_h1("1-BOB. LOYIHA G'OYASI VA TALABLAR TAHLILI")
add_h2("1.1. Mavzu dolzarbligi va muammo qo'yilishi")
add_para("Zamonaviy raqamli iqtisodiyotda startaplar va innovatsion loyihalar drayver rolini o'ynaydi. Statistik ma'lumotlarga ko'ra, har yili dunyo bo'yicha minglab startaplar ro'yxatdan o'tadi, biroq ularning juda oz qismi muvaffaqiyatga erishadi. Muvaffaqiyatsizlikning asosiy sabablaridan biri – bu g'oyaning bozor talablariga mos kelmasligi va o'z vaqtida konstruktiv fidbek (feedback) olinmaganligidir. Yosh tadbirkorlar, talabalar, muhandislar va ijodkorlar uchun o'z g'oyalarini keng ommaga yoki, aksincha, tor doiradagi mutaxassislarga taqdim etib, ularning fikrini o'rganish juda muhimdir.")
add_para("Afsuski, mavjud ommabop ijtimoiy tarmoqlar (Instagram, TikTok, Facebook) asosan vizual kontent va qisqa muddatli e'tibor (short attention span) ga qaratilgan. Bu platformalarda jiddiy matnli g'oyalar, texnik loyihalar yoki ilmiy takliflar \"shovqin\" ichida yo'qolib ketadi. G'oyalarni tizimli saqlash, kategoriyalarga ajratish va ularni professional darajada muhokama qilish uchun ixtisoslashgan vositalar yetishmaydi. LinkedIn kabi professional tarmoqlar mavjud bo'lsa-da, ular ko'proq ish qidirish va korporativ aloqalarga yo'naltirilgan bo'lib, \"g'oyalar banki\" formatini to'liq bera olmaydi.")
add_para("\"Farangiz\" platformasining dolzarbligi aynan shu bo'shliqni to'ldirish bilan belgilanadi. Muammo shundaki, g'oyalarni baholash, izohlash va konstruktiv fikr bildirish uchun strukturalangan, qulay va xavfsiz muhit yo'q. Foydalanuvchilar o'z fikrlarini yozib qoldiradigan, boshqalar esa bu fikrlarni xolis baholay oladigan markazlashgan tizimga ehtiyoj sezilmoqda. Shu bois, loyihada g'oyalarni tizimli saqlash, tahlil qilish va jamoaviy muhokama qilish imkoniyatini yaratish asosiy vazifa qilib belgilandi.")

add_h2("1.2. Loyiha maqsadi va vazifalari")
p = add_para("Loyiha maqsadi: Har xil soha vakillari uchun o'z g'oyalarini erkin joylashtirish, boshqalar g'oyalarini baholash va muhokama qilish, foydalanuvchilarni kuzatish, bildirishnomalar olish hamda real vaqt rejimida (chat, video) aloqani ta'minlovchi, yuqori yuklamalarga bardoshli Web va Mobil platformani yaratish.")
add_para("Ushbu maqsadga erishish uchun quyidagi aniq vazifalar belgilandi va amalga oshirilmoqda:")
add_bullets([
"G'oyalarni boshqarish tizimini ishlab chiqish: Foydalanuvchilarga g'oyalarni yaratish, tahrirlash, o'chirish va ularga media fayllar (rasm, hujjat) biriktirish imkoniyatini berish.",
"Klassifikatsiya va qidiruv: G'oyalarni teglar, kategoriyalar va kalit so'zlar bo'yicha samarali qidirish va filtrlash mexanizmini yaratish.",
"Ijtimoiy interaktivlik: Izohlar tizimi, layk funksiyasi, bookmark (saqlab qo'yish) va ulashish imkoniyatlarini joriy etish.",
"Foydalanuvchi profili va tarmoq: Foydalanuvchilarning shaxsiy kabinetini shakllantirish, kuzatuv (follow/unfollow) tizimi va foydalanuvchi statistikasini (obunachilar, layklar soni) ko'rsatish.",
"Real vaqt kommunikatsiyasi: WebSocket protokoli asosida ishlaydigan tezkor xabar almashish (chat) tizimini va WebRTC asosidagi ovozli/video qo'ng'iroqlarni integratsiya qilish.",
"Bildirishnomalar tizimi: Foydalanuvchi faoliyatiga oid muhim o'zgarishlarni (yangi izoh, layk, obuna) real vaqtda yetkazish (Push Notifications).",
"Cross-platform yechim: Web (Next.js) va mobil (Expo) platformalarida yagona ma'lumotlar bazasi va biznes mantiq asosida ishlovchi ekotizim yaratish.",
"Xavfsizlik: Foydalanuvchi ma'lumotlarini himoyalash, sessiyalarni xavfsiz boshqarish (JWT) va kiberhujumlarga qarshi choralar ko'rish."
])

add_h2("1.3. Asosiy foydalanuvchi rollari")
add_para("Tizimning xavfsizligi va ma'lumotlar yaxlitligini ta'minlash maqsadida foydalanuvchilar aniq belgilangan rollarga ajratiladi. Har bir rol tizimda ma'lum bir huquq va vakolatlarga ega:")
add_bullets([
"Mehmon foydalanuvchi (Guest): Tizimga ro'yxatdan o'tmagan foydalanuvchilar. Ular faqat ochiq (public) g'oyalarni ko'rishlari va qidiruvdan foydalanishlari mumkin. Ularda g'oya yaratish, izoh qoldirish yoki baholash huquqi mavjud emas.",
"Ro'yxatdan o'tgan foydalanuvchi (Authenticated User): Tizimning to'liq imkoniyatlaridan foydalanuvchi asosiy qatlam. Ular o'z profillarini yaratadilar, g'oya nashr qiladilar, boshqalar bilan muloqotga kirishadilar, guruh chatlari tashkil qiladilar va bildirishnomalar oladilar.",
"Administrator (Superuser): Tizim boshqaruvchisi. Admin barcha kontentni (g'oyalar, izohlar, chatlar) nazorat qilish, qoidabuzar foydalanuvchilarni bloklash, tizim sozlamalarini o'zgartirish va umumiy statistikani ko'rish huquqiga ega."
])

add_h2("1.4. Funktsional talablar")
add_para('Funktsional talablar tizim nima qilishi kerakligini aniq belgilab beradi. "Farangiz" loyihasi uchun eng muhim funktsional talablar quyidagilardir:')
add_bullets([
"Avtorizatsiya va Autentifikatsiya: Foydalanuvchilar email, username va parol orqali ro'yxatdan o'tishi kerak. Tizim JWT (JSON Web Token) standartidan foydalanib, foydalanuvchi sessiyasini xavfsiz saqlashi lozim. Parol unutilganda emailga kod yuborish orqali tiklash imkoniyati bo'lishi shart.",
"CRUD (Create, Read, Update, Delete) amallari: Foydalanuvchi g'oya yaratish, uni o'qish, o'z g'oyasini tahrirlash va o'chirish imkoniyatiga ega bo'lishi kerak.",
"Ijtimoiy funksiyalar: Boshqa foydalanuvchilarni qidirish, ularning profilini ko'rish va 'Kuzatish' (Follow) tugmasini bosish. Kuzatilayotgan foydalanuvchilarning yangi g'oyalari alohida tasmada (Feed) ko'rinishi kerak.",
"Interaktivlik: G'oyalarga munosabat bildirish (Like) va ularni kelajak uchun saqlash (Bookmark) funksiyalari ishlashi kerak.",
"Chat va Qo'ng'iroqlar: Foydalanuvchilar o'rtasida shaxsiy xabarlar almashish, fayllar yuborish, ovozli xabarlar qoldirish va video qo'ng'iroqlar amalga oshirish funksiyasi real vaqt rejimida, kechikishlarsiz ishlashi talab etiladi.",
"Bildirishnomalar (Notifications): Tizim ichidagi har qanday muhim hodisa haqida foydalanuvchiga darhol xabar berilishi kerak."
])

add_h2("1.5. Nofunktsional talablar")
add_para("Nofunktsional talablar tizimning sifati, ishlash tezligi va xavfsizligini belgilaydi:")
add_bullets([
"Ishonchlilik (Reliability): Tizim 24/7 rejimida uzluksiz ishlashi, ma'lumotlar bazasi muntazam zaxira (backup) qilinishi kerak.",
"Xavfsizlik (Security): Foydalanuvchi parollari shifrlangan holda (hash) saqlanishi, API so'rovlari HTTPS protokoli orqali himoyalanishi, CSRF va XSS hujumlariga qarshi himoya mexanizmlari bo'lishi shart.",
"Kengaytiriluvchanlik (Scalability): Tizim arxitekturasi foydalanuvchilar soni keskin oshganda ham server resurslarini osonlik bilan ko'paytirishga moslashgan bo'lishi kerak (Docker va Microservices elementlari).",
"Samaradorlik (Performance): Sahifalar yuklanish tezligi 2 sekunddan oshmasligi, qidiruv natijalari millisekundlarda chiqishi kerak. Buning uchun keshlash (Redis) texnologiyalaridan foydalaniladi.",
"Moslashuvchanlik (Responsiveness): Web interfeys barcha turdagi qurilmalarda buzilmasdan, chiroyli ko'rinishda ochilishi kerak."
])

add_h2("1.6. Analoglar va farqlovchi jihatlar")
add_para("Dunyoda va mahalliy bozorda g'oyalar bilan ishlashga qaratilgan ba'zi platformalar mavjud (masalan, Pinterest, Product Hunt, Reddit). Biroq, \"Farangiz\" loyihasi quyidagi jihatlari bilan ulardan farq qiladi:")
add_bullets([
"Markazlashgan e'tibor: Pinterest faqat rasmga, Product Hunt faqat tayyor startapga urg'u bersa, \"Farangiz\" hali amalga oshmagan, xom g'oyalarni ham shakllantirishga yordam beradi.",
"Lokalizatsiya: O'zbek auditoriyasi uchun maxsus moslashtirilgan interfeys va mahalliy to'lov/integratsiya imkoniyatlarini (kelajakda) ko'zda tutadi.",
"Real vaqt aloqasi: Ko'p platformalarda faqat izohlar bor, lekin \"Farangiz\"da to'g'ridan-to'g'ri muallif bilan chat va video orqali bog'lanish imkoniyati integratsiya qilingan.",
"Gibrid platforma: Ham veb-sayt, ham mobil ilova sifatida to'liq sinxron ishlashi foydalanuvchiga xohlagan vaqtda, xohlagan qurilmadan kirish imkonini beradi."
])

add_h2("1.7. Foydalanish ssenariylari (use-case)")
add_para("Tizim ishlashini yaxshiroq tushunish uchun tipik foydalanish ssenariylarini keltiramiz:")
add_bullets([
"Ssenariy A (G'oya muallifi): Foydalanuvchi yangi innovatsion loyiha o'ylab topdi. U tizimga kiradi -> 'G'oya yaratish' tugmasini bosadi -> G'oya nomini, tavsifini yozadi -> Chizma yoki sxemalarni rasm sifatida yuklaydi -> Teglarni tanlaydi (masalan, #IT, #Startup) -> 'Nashr qilish'ni bosadi. Birozdan so'ng unga bildirishnoma keladi: 'Sizning g'oyangizga 5 ta layk va 2 ta izoh qoldirildi'.",
"Ssenariy B (Investor/Kuzatuvchi): Foydalanuvchi qiziqarli g'oyalarni izlamoqda. U 'Explore' bo'limiga kiradi -> 'Texnologiya' kategoriyasini tanlaydi -> Qiziq g'oyani topadi -> Uni o'qib chiqib, 'Bookmark' tugmasini bosadi -> Muallif profiliga o'tib, 'Follow' qiladi -> 'Chat' tugmasini bosib, hamkorlik taklifini yozadi.",
"Ssenariy C (Guruh muhokamasi): Talabalar guruhi bir loyiha ustida ishlamoqda. Ular 'Guruh chati' yaratadilar -> G'oya havolasini chatga tashlaydilar -> Real vaqtda muhokama qilib, audio xabarlar orqali fikr almashadilar -> Video qo'ng'iroq qilib, yakuniy qarorga keladilar."
])

doc.add_page_break()

# 2-BOB
add_h1("2-BOB. ARXITEKTURA VA TEXNOLOGIYALAR")
add_h2("2.1. Umumiy tizim arxitekturasi")
add_para("Loyiha arxitekturasi zamonaviy Monorepo (Monolithic Repository) tamoyili asosida qurilgan. Bu shuni anglatadiki, Backend, Frontend va Mobile ilova kodlari bitta git repozitoriysida saqlanadi. Bu yondashuv kodni boshqarishni osonlashtiradi, versiyalar nomutanosibligini oldini oladi va jamoaviy ishlashni tezlashtiradi.")
add_para("Tizim uchta asosiy qatlamdan iborat:")
add_bullets([
"Backend (Server tomon): Barcha biznes logika, ma'lumotlar bazasi bilan ishlash, autentifikatsiya va APIlarni taqdim etish uchun javobgar.",
"Frontend (Mijoz tomon): Foydalanuvchi ko'radigan va ishlatadigan veb-interfeys.",
"Mobile (Mobil ilova): Smartfonlar uchun maxsus optimallashtirilgan ilova."
])
add_para("Ushbu qatlamlar o'zaro REST API (HTTP so'rovlari) va WebSocket (doimiy ulanish) protokollari orqali ma'lumot almashadilar. Ma'lumotlar markazlashgan PostgreSQL bazasida saqlanadi, tezkor amallar va kesh uchun Redis texnologiyasi qo'llaniladi.")

add_h2("2.2. Backend: Django, DRF, Channels")
add_para("Loyiha server qismi uchun Python dasturlash tilidagi eng mashhur va ishonchli freymvorklardan biri – Django 5 tanlandi. Django \"batteries included\" tamoyiliga ega bo'lib, xavfsizlik, ma'lumotlar bazasi bilan ishlash (ORM) va admin paneli kabi ko'plab tayyor vositalarni taqdim etadi.")
add_para("API yaratish uchun Django REST Framework (DRF) ishlatildi. DRF yordamida ma'lumotlar JSON formatiga o'tkaziladi (Serialization) va mijozlarga yetkaziladi. Bu frontend va mobil ilova bilan oson integratsiya qilish imkonini beradi.")
add_para("Real vaqt rejimida ishlash (chat, bildirishnomalar) uchun standart HTTP protokoli yetarli emas. Shu sababli, Django ekotizimidagi Django Channels kutubxonasi qo'llaniladi. Channels loyihani ASGI rejimiga o'tkazib, WebSocket ulanishlarini ushlab turish va asinxron xabarlar almashish imkonini beradi. Bu serverga minglab foydalanuvchilar bir vaqtda chatda yozishganda ham yuklamani ko'tarishga yordam beradi.")

add_h2("2.3. Web frontend: Next.js va UI qatlam")
add_para("Veb qismi uchun React kutubxonasiga asoslangan Next.js freymvorki tanlandi. Next.js bugungi kunda eng zamonaviy frontend texnologiyasi hisoblanib, u bir qator ustunliklarga ega:")
add_bullets([
"SSR (Server-Side Rendering): Sahifalar serverda tayyorlanib, brauzerga yuboriladi. Bu saytning yuklanish tezligini oshiradi va qidiruv tizimlari (SEO) uchun muhim.",
"Routing: Fayl tizimiga asoslangan qulay marshrutlash (App Router).",
"Optimallashtirish: Rasmlar va shriftlarni avtomatik optimallashtirish."
])
add_para("Dizayn va tashqi ko'rinish uchun Tailwind CSS ishlatildi. Ma'lumotlarni serverdan olish va boshqarish uchun TanStack Query (React Query) kutubxonasi qo'llanilgan, bu esa ma'lumotlarni keshlash, yangilash va sinxronlashtirish muammolarini hal qiladi.")

add_h2("2.4. Mobile: Expo va React Native")
add_para("Mobil ilova React Native texnologiyasi asosida qurilgan. React Native bitta kod yozish orqali ham iOS, ham Android tizimlariga ilova yaratish imkonini beradi (Cross-platform). Bu ishlab chiqish vaqtini va resurslarni 2 barobar tejaydi.")
add_para("Rivojlanishni yanada tezlashtirish uchun Expo platformasidan foydalanildi. Expo React Native ustiga qurilgan bo'lib, u tayyor kutubxonalar to'plamini taqdim etadi. Expo Router yordamida ilova ichidagi navigatsiya xuddi web-saytdagi kabi oson tashkil etilgan.")

add_h2("2.5. Ma'lumotlar almashinuvi va API uslubi")
add_para("Loyiha REST API arxitektura uslubiga tayanadi. Har bir resurs (masalan, g'oya, foydalanuvchi, izoh) o'zining unikal URL manziliga (Endpoint) ega.")
add_para("Masalan:")
add_bullets([
"GET /api/ideas/ - barcha g'oyalarni olish.",
"POST /api/ideas/ - yangi g'oya yaratish.",
"GET /api/ideas/5/ - 5-ID li g'oyani ko'rish."
])
add_para("API dokumentatsiyasi avtomatik ravishda Swagger (OpenAPI) orqali generatsiya qilinadi. Tokenga asoslangan autentifikatsiya uchun Simple JWT ishlatiladi.")

add_h2("2.6. DevOps va konteynerlash")
add_para("Zamonaviy dasturlashda muhit farqlari sababli xatoliklar bo'lmasligi uchun Docker konteynerlash texnologiyasi qo'llaniladi. Loyihaning har bir qismi (Backend, Frontend, DB, Redis) alohida, izolyatsiya qilingan konteynerlarda ishlaydi.")
add_para("Docker Compose vositasi orqali barcha xizmatlar bitta buyruq (docker compose up) bilan ishga tushiriladi.")

add_h2("2.7. Komponentlararo integratsiya")
add_para("Tizim komponentlari o'zaro uzviy bog'langan:")
add_bullets([
"Frontend -> Backend: Axios orqali HTTP so'rovlar yuboradi va JSON ma'lumot oladi.",
"Mobile -> Backend: Xuddi shunday API so'rovlar yuboradi. Rasmlar multipart/form-data formatida yuklanadi.",
"Chat: Frontend va Mobile ilovalar backenddagi WebSocket serverga (ws://...) ulanadi va doimiy kanal orqali xat yozishadi.",
"Push Notifications: Backenddan Expo serverlariga so'rov yuboriladi, Expo esa Google (FCM) va Apple (APNs) serverlari orqali foydalanuvchi telefoniga bildirishnoma yetkazadi."
])

doc.add_page_break()

# 3-BOB
add_h1("3-BOB. MA'LUMOTLAR MODELI VA MA'LUMOTLAR BAZASI")
add_h2("3.1. Foydalanuvchi va autentifikatsiya modeli")
add_para("Har qanday ijtimoiy platformaning o'zagi – bu foydalanuvchidir. User modeli standart Django modelidan kengaytirilgan holda quyidagi qo'shimcha ma'lumotlarni saqlaydi:")
add_bullets([
"username, email (unikal identifikatorlar)",
"avatar (profil rasmi) va bio (qisqa ma'lumot)",
"role (foydalanuvchi darajasi)",
"followers_count va following_count (keshlangan statistika)",
"expo_push_token (mobil qurilma tokeni)"
])
add_para("Xavfsizlik nuqtai nazaridan parollar ochiq holda saqlanmaydi, ular PBKDF2 algoritmi yordamida shifrlanadi (hashlanadi).")

add_h2("3.2. G'oyalar, teglar, izohlar va reaksiyalar")
add_para("Tizimning asosiy ob'ekti – Idea (G'oya) modeli. U quyidagi tuzilishga ega:")
add_bullets([
"title (G'oya nomi - qidiruv uchun indekslanadi)",
"content (G'oya matni - HTML yoki Markdown formatida bo'lishi mumkin)",
"category (Yo'nalishi: IT, Biznes, Ta'lim va h.k.)",
"author (Muallifga Foreign Key bog'lanish)",
"created_at (Yaratilgan vaqti)"
])
add_para("G'oyalarni guruhlash uchun Tag modeli ishlatiladi (Many-to-Many). Comment modeli esa daraxtsimon tuzilishga ega bo'lib, izoh ichida izoh qoldirish (Reply) imkonini beradi. Like va Bookmark modellari munosabatni saqlaydi va UniqueConstraint bilan cheklanadi.")

add_h2("3.3. Kuzatish (follow) va bildirishnomalar")
add_para("Follow modeli orqali \"Kim kimga obuna bo'lgan\" ma'lumot saqlanadi. Notification modeli esa asinxron tarzda ishlaydi: masalan, A foydalanuvchi B ning g'oyasiga layk bossa, tizim avtomatik ravishda B uchun Notification ob'ektini yaratadi (turi: 'like', holati: 'o'qilmagan').")

add_h2("3.4. Chat xonalari, xabarlar va qo'ng'iroqlar")
add_para("Chat tizimi uchun ikkita asosiy model mavjud:")
add_bullets([
"ChatRoom: Suhbat xonasi. U ikki kishilik (shaxsiy) yoki ko'p kishilik (guruh) bo'lishi mumkin. Unda qatnashchilar ro'yxati (participants) saqlanadi.",
"Message: Xabar. U qaysi xonaga tegishliligi, kim yuborganligi, matni va biriktirilgan fayli haqida ma'lumot saqlaydi. Xabarlar tarixini saqlash va tartiblash uchun vaqt tamg'asi (timestamp) ishlatiladi."
])
add_para("Qo'ng'iroqlar uchun CallSession modeli ishlatilib, u qo'ng'iroq holati va davomiyligini qayd etib boradi.")

add_h2("3.5. Fayl saqlash va media oqimlari")
add_para("Foydalanuvchilar yuklagan rasmlar va fayllar ma'lumotlar bazasida saqlanmaydi. Ular serverning fayl tizimida (media/ papkasida) yoki bulutli omborlarda (S3) saqlanadi. Ma'lumotlar bazasida esa faqat fayl yo'li saqlanadi. Rasmlar yuklanganda ularning o'lchamini avtomatik kichraytirish (compression) algoritmlari qo'llaniladi.")

add_h2("3.6. ER diagramma tavsifi")
add_para("Loyiha ma'lumotlar bazasi relyatsion tuzilishga ega. Barcha jadvallar o'zaro mantiqiy bog'langan:")
add_bullets([
"One-to-Many: Bir foydalanuvchi -> Ko'p g'oyalar.",
"Many-to-Many: G'oyalar <-> Teglar.",
"One-to-One: Foydalanuvchi -> Profil sozlamalari."
])
add_para("Ushbu tuzilish ma'lumotlarning takrorlanmasligini va ma'lumotlar yaxlitligini ta'minlaydi.")

doc.add_page_break()

# 4-BOB
add_h1("4-BOB. FUNKTSIONAL MODULLAR TAHLILI")
add_h2("4.1. Ro'yxatdan o'tish va kirish")
add_para("Ro'yxatdan o'tish jarayonida foydalanuvchidan email tasdiqlash (Email Verification) so'ralishi mumkin. Kirish qismida JWT tokenlar ishlatiladi: Access Token (qisqa muddatli) so'rovlar uchun, Refresh Token (uzoq muddatli) esa yangi access token olish uchun ishlatiladi.")

add_h2("4.2. G'oyalar yaratish va boshqarish")
add_para("Bu modul WYSIWYG muharririni o'z ichiga oladi. Rasm yuklash drag-and-drop usulida ishlaydi. Nashr qilishdan oldin \"Qoralama\" (Draft) sifatida saqlash imkoniyati ham mavjud. G'oya ro'yxatida Infinite Scroll texnologiyasi qo'llanilgan.")

add_h2("4.3. Izohlar va layklar")
add_para("Izohlar moduli rekursiv so'rovlar asosida ishlaydi. Foydalanuvchi izoh yozganda, u darhol ma'lumotlar bazasiga yoziladi va WebSocket orqali boshqa foydalanuvchilarga ham ko'rinadi. Layk bosilganda Debounce texnikasi qo'llaniladi.")

add_h2("4.4. Kuzatish va profil boshqaruvi")
add_para("Profil sahifasi foydalanuvchining \"vizitkasi\" hisoblanadi. Follow bosilganda bog'lanish yaratiladi va kuzatuvchining tasmasiga (Feed) yangi kontentlarni yetkazib berish algoritmlari ishga tushadi.")

add_h2("4.5. Bildirishnomalar")
add_para("Bildirishnomalar ikki xil bo'ladi:")
add_bullets([
"In-app notifications: Ilova ichida qo'ng'iroqcha belgisida qizil nuqta bilan ko'rsatiladigan tarix.",
"Push notifications: Ilova yopilgan bo'lsa ham telefon ekraniga keladigan xabarlar."
])
add_para("Bu modul Expo Push API xizmati bilan integratsiya qilingan.")

add_h2("4.6. Real vaqt chat")
add_para("Xabarlar avval vaqtincha xotirada (Redis) saqlanishi, keyin esa doimiy bazaga o'tkazilishi mumkin. Chatda Typing indikatori, read receipts va onlayn/oflayn status real vaqtda yangilanadi.")

add_h2("4.7. Ovozli/video qo'ng'iroqlar")
add_para("Video aloqa uchun Agora platformasi SDK si ishlatilgan. Tizim signaling va token generation vazifasini bajaradi, video oqimi esa to'g'ridan-to'g'ri foydalanuvchilar o'rtasida bo'ladi.")

add_h2("4.8. Qidiruv, trend va filtrlar")
add_para("Qidiruv tizimi PostgreSQL Full-Text Search (SearchVector) dan foydalanadi. Trend algoritmi esa so'nggi 24 soat yoki 7 kun ichida eng ko'p aktivlik to'plagan g'oyalarni hisoblab chiqadi.")

add_h2("4.9. Bookmark va saqlash")
add_para("Foydalanuvchi \"Saqlanganlar\" ro'yxatini shaxsiy papkadek ishlatadi. Bu yozuvlar faqat foydalanuvchining o'ziga ko'rinadi va maxfiylik saqlanadi.")

add_h2("4.10. Xalqaro til qo'llab-quvvatlashi (i18n)")
add_para("Frontendda next-i18next yordamida barcha matnlar kalit so'zlar orqali chaqiriladi. Backendda esa tarjima qilinadigan maydonlar alohida saqlanishi mumkin.")

add_h2("4.11. Admin panel va moderatsiya")
add_para("Django Admin paneli django-jazzmin kabi mavzular bilan bezatiladi. Adminlar uchun dashboardlar tuzilib, statistikalar grafiklarda ko'rsatiladi.")

doc.add_page_break()

# 5-BOB
add_h1("5-BOB. FOYDALANUVCHI INTERFEYSI VA UX")
add_h2("5.1. Web ilova interfeysi")
add_para("Veb-dizaynda Mobile-First yondashuvi qo'llanilgan. Asosiy e'tibor kontentga qaratilgan: ortiqcha bezaklar olib tashlangan. Ranglar psixologiyasi hisobga olinib, ishonch va xotirjamlik uyg'otuvchi ranglar tanlangan.")

add_h2("5.2. Mobil ilova interfeysi")
add_para("Mobil ilovada native his-tuyg'uni berish muhim. Tugmalar o'lchami barmoq bilan bosishga qulay (kamida 44x44 px). Navigatsiya pastki panel (Bottom Tab Bar) orqali amalga oshiriladi.")

add_h2("5.3. Dizayn tizimi va theme boshqaruvi")
add_para("Loyiha uchun Dizayn Tizimi ishlab chiqilgan: typography, ranglar, spacing va komponentlar standartlashtirilgan. Qorong'u rejim (Dark Mode) ko'z zo'riqishini kamaytirish va batareyani tejash uchun joriy etilgan.")

add_h2("5.4. UX tamoyillari va foydalanish qulayligi")
add_para("UX bo'yicha Yakob Nilsenning 10 ta evristikasi inobatga olingan. Masalan: holat ko'rinishi (yuklanmoqda...), tushunarli atamalar, xatolardan himoya va foydalanuvchiga tuzatishga yordam berish.")

doc.add_page_break()

# 6-BOB
add_h1("6-BOB. TESTLASH VA SIFAT NAZORATI")
add_h2("6.1. Backend testlari")
add_para("Kodning to'g'ri ishlashiga ishonch hosil qilish uchun Unit Testlar yozilgan. Pythonning pytest kutubxonasi yordamida har bir funksiya va klass alohida tekshiriladi.")

add_h2("6.2. API tekshirish")
add_para("Backend va Frontend o'rtasidagi ko'prik bo'lgan API lar integration testlar orqali tekshiriladi. Postman yordamida turli so'rovlar yuborilib, javob status kodi va ma'lumotlar tuzilishi nazorat qilinadi.")

add_h2("6.3. Manual test ssenariylari")
add_para("Avtomatlashtirilgan testlardan tashqari, qo'lda testlash ham o'tkaziladi. Turli qurilmalarda va turli internet tezliklarida sinov qilinadi.")

add_h2("6.4. Ishonchlilik va regressiya")
add_para("Yangi o'zgarish kiritilganda eski funksiyalar buzilmasligi uchun Regressiya testlari o'tkaziladi. CI/CD orqali har bir commit avtomatik tarzda testdan o'tkaziladi.")

doc.add_page_break()

# 7-BOB
add_h1("7-BOB. XAVFSIZLIK VA ISHONCHLILIK")
add_h2("7.1. JWT va sessiya xavfsizligi")
add_para("JWT mobil ilovalar uchun qulay, biroq noto'g'ri saqlansa o'g'irlanishi mumkin. Shu sababli Refresh Tokenlar HttpOnly cookie larda saqlanadi, Access tokenlar esa xotirada saqlanadi va tez-tez yangilanadi.")

add_h2("7.2. Ma'lumotlarni validatsiya qilish")
add_para("\"Hech qachon foydalanuvchi kiritgan ma'lumotga ishonma\" tamoyili asosida barcha kiruvchi ma'lumotlar serverda tekshiriladi. Serializer validatorlar format va cheklovlarni nazorat qiladi.")

add_h2("7.3. Tarmoqli himoya va rate-limit")
add_para("DDoS va brute-force hujumlariga qarshi throttling (rate limiting) qo'llaniladi. Masalan, bir IP dan login urinishlari cheklanadi.")

add_h2("7.4. Fayl yuklash xavfsizligi")
add_para("Faylning kengaytmasi va haqiqiy MIME type tekshiriladi. Fayl nomlari tasodifiy belgilar bilan almashtiriladi.")

add_h2("7.5. Zaxira va tiklash strategiyasi")
add_para("Avtomatik backup tizimi yo'lga qo'yilgan: baza har kuni arxivlanadi va xavfsiz omborga yuboriladi. Recovery rejalar ma'lumot yo'qotilishini minimallashtiradi.")

doc.add_page_break()

# 8-BOB
add_h1("8-BOB. ISHGA TUSHIRISH VA DEPLOY")
add_h2("8.1. Muhit sozlamalari")
add_para("Atrof-muhit o'zgaruvchilari (.env) orqali Debug va maxfiy kalitlar boshqariladi. .env fayllar Git ga qo'shilmaydi.")

add_h2("8.2. Docker Compose bilan ishga tushirish")
add_para("Docker Compose orqali butun infrastruktura yagona konfiguratsiyada ta'riflanadi. Serverda loyihani ko'chirib olish va bitta buyruq bilan ishga tushirish mumkin.")

add_h2("8.3. Nginx va ishlab chiqarish muhiti")
add_para("Django yoki Next.js serverini bevosita internetga ochish o'rniga Nginx reverse proxy ishlatiladi. U statik fayllarni tez uzatadi va HTTPS ni ta'minlaydi.")

add_h2("8.4. Monitoring va loglar")
add_para("Logging xatolarni qayd qiladi. Prometheus va Grafana yordamida yuklama, xotira va so'rovlar soni monitoring qilinadi.")

add_h2("8.5. Kengaytirish va skalalash")
add_para("Loyiha horizontal scaling ga mos: bir nechta server ishga tushirib, load balancing qilish mumkin. Ma'lumotlar bazasi va fayl omborlari alohida ajratilishi mumkin.")

doc.add_page_break()

# 9-BOB
add_h1("9-BOB. NATIJALAR VA KELAJAK REJALAR")
add_para("Erishilgan natijalar:")
add_bullets([
"To'liq funktsional platforma: Ro'yxatdan o'tishdan tortib, g'oya nashr qilish va muloqotgacha bo'lgan jarayonlar ishlamoqda.",
"Zamonaviy arxitektura: Django 5, Next.js 14, React Native asosida kengaytiriluvchan va xavfsiz qurildi.",
"Real vaqt imkoniyatlari: Chat va bildirishnomalar kechikishsiz ishlaydi.",
"Kross-platform: Web, Android va iOS ilovalari yaratildi va integratsiya qilindi."
])
add_para("Kelajakdagi rejalar:")
add_bullets([
"AI integratsiyasi: Tavsiya (recommendation) tizimi va g'oya matnini tekshirish/to'ldirish uchun AI yordamchisi.",
"Monetizatsiya: Premium obuna va investorlar bilan bog'lovchi pullik xizmatlar.",
"Moderatsiya tizimini kuchaytirish: Spam va nomaqbul kontentni avtomatik aniqlash uchun ML modellar.",
"Video striming: G'oyalarni jonli efirda pitching qilish."
])

doc.add_page_break()

# XULOSA
add_h1("XULOSA")
add_para("Xulosa qilib aytganda, \"Farangiz\" loyihasi g'oyalarni samarali almashish va rivojlantirish masalasiga texnologik yechim sifatida ishlab chiqildi. Kurs ishi davomida axborot tizimini loyihalash, arxitekturasini qurish va boshqarish bo'yicha amaliy tajriba orttirildi.")
add_para("Tahlillar tanlangan texnologiyalar steki bugungi kun talablariga to'liq javob berishini ko'rsatadi. Monorepo arxitekturasi va DevOps vositalari ishlab chiqish jarayonini sanoat standartlari darajasiga olib chiqadi.")
add_para("\"Farangiz\" platformasi O'zbekistonning raqamli ekotizimida o'z o'rnini topishiga va yoshlarning innovatsion salohiyatini ro'yobga chiqarishga xizmat qilishiga ishonchimiz komil.")

doc.add_page_break()

# FOYDALANILGAN ADABIYOTLAR
add_h1("FOYDALANILGAN ADABIYOTLAR VA MANBALAR")
refs = [
"Django Software Foundation. Django Documentation (v5.0). https://docs.djangoproject.com/",
"Vercel. Next.js Documentation (App Router). https://nextjs.org/docs",
"Meta Platforms. React Native Documentation. https://reactnative.dev/",
"Tom Christie. Django REST Framework. https://www.django-rest-framework.org/",
"Andrew Godwin. Django Channels & Daphne. https://channels.readthedocs.io/",
"Expo. Expo Documentation & Guides. https://docs.expo.dev/",
"PostgreSQL Global Development Group. PostgreSQL 16 Documentation. https://www.postgresql.org/docs/",
"Redis Ltd. Redis Documentation. https://redis.io/docs/",
"Martin Fowler. \"Microservices\" va \"MonolithFirst\" maqolalari. https://martinfowler.com/",
"Robert C. Martin. \"Clean Architecture: A Craftsman's Guide to Software Structure and Design\". Prentice Hall, 2017."
]
for i, ref in enumerate(refs, 1):
    doc.add_paragraph(f"{i}. {ref}")

doc.add_page_break()

# ILOVALAR
add_h1("ILOVALAR")
add_h2("Ilova A. Asosiy API Endpointlar (Texnik Hujjat)")
add_para("Quyida tizimning asosiy dasturiy interfeyslari (API) ro'yxati keltirilgan:")
add_h3("Autentifikatsiya:")
add_bullets([
"POST /api/auth/register - Yangi foydalanuvchini ro'yxatdan o'tkazish.",
"POST /api/auth/login - Tizimga kirish (JWT token olish).",
"POST /api/auth/refresh - Access tokenni yangilash."
])
add_h3("G'oyalar:")
add_bullets([
"GET /api/ideas/ - G'oyalar ro'yxatini olish (filtrlar bilan).",
"POST /api/ideas/ - Yangi g'oya yaratish.",
"GET /api/ideas/{id}/ - G'oya haqida to'liq ma'lumot olish.",
"PATCH /api/ideas/{id}/ - G'oyani tahrirlash.",
"DELETE /api/ideas/{id}/ - G'oyani o'chirish."
])
add_h3("Interaktivlik:")
add_bullets([
"POST /api/ideas/{id}/like/ - G'oyaga layk bosish/olish.",
"POST /api/ideas/{id}/bookmark/ - G'oyani saqlash/o'chirish.",
"GET /api/ideas/{id}/comments/ - G'oya izohlarini olish."
])
add_h3("Chat:")
add_bullets([
"GET /api/chat/rooms/ - Mening chatlarim ro'yxati.",
"GET /api/chat/rooms/{id}/messages/ - Chatdagi xabarlar tarixi."
])

add_h2("Ilova B. Loyiha Fayl Tuzilmasi (Monorepo)")
code = """farangiz-monorepo/
├── backend/                # Server qismi (Django)
│   ├── apps/               # Ilovalar (modullar)
│   │   ├── accounts/       # Foydalanuvchilar
│   │   ├── ideas/          # G'oyalar logikasi
│   │   ├── chat/           # Chat va WebSocket
│   │   └── notifications/  # Bildirishnomalar
│   ├── config/             # Asosiy sozlamalar (settings.py)
│   ├── media/              # Yuklangan fayllar
│   └── manage.py           # Boshqaruv skripti
├── frontend/               # Web qismi (Next.js)
│   ├── app/                # Sahifalar (App Router)
│   ├── components/         # Qayta ishlatiluvchi UI qismlar
│   ├── lib/                # Utils va API klient
│   └── public/             # Statik fayllar
├── mobile/                 # Mobil qismi (Expo)
│   ├── app/                # Mobil ekranlar (Expo Router)
│   ├── assets/             # Rasmlar va ikonkal
│   └── components/         # Mobil UI komponentlar
├── nginx/                  # Web server sozlamalari
└── docker-compose.yml      # Konteynerlarni boshqarish fayli
"""
p = doc.add_paragraph()
p.style = doc.styles['No Spacing'] if 'No Spacing' in doc.styles else doc.styles['Normal']
run = p.add_run(code)
run.font.name = 'Consolas'
run.font.size = Pt(10)

out_path = "/mnt/data/Farangiz_kurs_ishi.docx"
doc.save(out_path)
out_path
