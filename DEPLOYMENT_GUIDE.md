# 🚀 AgroPlant — VPS, Domain & SSL To'liq Qo'llanmasi

Ushbu qo'llanma **AgroPlant** platformasini yangi VPS serverda domen va bepul SSL (HTTPS) sertifikati bilan noldan ishga tushirish bo'yicha bosqichma-bosqich yo'riqnomadir.

---

## 1-QADAM: VPS Server Tanlash va Sotib Olish

Koreya kompaniyalari va xalqaro foydalanuvchilar uchun serverning javob tezligi (latency) muhim.
- **Tavsiya etiladigan provayderlar**:
  - **AWS Lightsail** (Seul `ap-northeast-2` mintaqasi — Janubiy Koreya uchun eng tezkor: ping < 5ms).
  - **DigitalOcean** (Singapore yoki Frankfurt — $4-$6/oy).
  - **Hetzner** (Arzon va kuchli — €4/oy).
- **Operatsion tizim (OS)**: **Ubuntu 22.04 LTS** yoki **Ubuntu 24.04 LTS**.
- **Resurslar**: 1 vCPU, 2 GB RAM (yoki 1 GB RAM + 2 GB Swap).

---

## 2-QADAM: Domen Sotib Olish va DNS Bog'lash

1. **Domen xarid qilish**:
   - Xalqaro domenlar (`.com`, `.shop`, `.kr`): Namecheap, Porkbun, GoDaddy.
   - O'zbekiston domeni (`.uz`): Eskiz.uz, Webname.uz.
2. **DNS A-Record sozlash**:
   - Domenni boshqarish paneliga (DNS Management) kiring:
   - **Type**: `A` | **Host**: `@` | **Value**: `VPS_SERVER_IP` | **TTL**: `Automatic / 3600`
   - **Type**: `A` | **Host**: `www` | **Value**: `VPS_SERVER_IP` | **TTL**: `Automatic / 3600`
   *(DNS yangilanishi 10 daqiqadan 2 soatgacha vaqt oladi)*.

---

## 3-QADAM: VPS Serverga Ulanish va Xavfsizlik

Kompyuteringiz terminalidan serverga ulaning:
```bash
ssh root@YOUR_VPS_IP
```

Server paketlarini yangilang va xavfsizlik devorini (Firewall) yoqing:
```bash
# Tizimni yangilash
apt update && apt upgrade -y

# Xavfsizlik devorini sozlash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 4-QADAM: Docker va Loyihani Yuklash

Serverda loyihani yuklab olish uchun qulay papka ochamiz:
```bash
# Docker va Docker Compose o'rnatish
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Loyihalarni klonlash
cd /var/www || mkdir -p /var/www && cd /var/www

# Frontend va Backend omborlarini tortib olish
git clone https://github.com/qazakhi515/AgroPlant.git
git clone https://github.com/qazakhi515/AgroPlant-React.git

# Backend papkasiga o'tish
cd /var/www/AgroPlant
```

### `.env` Faylini Sozlash:
`/var/www/AgroPlant/.env` faylini yarating yoki tahrirlang:
```bash
nano .env
```
Quyidagi ma'lumotlarni kiriting:
```env
PORT=3006
NODE_ENV=production
MONGO_URL=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.quqkbut.mongodb.net/AgroPlant?retryWrites=true&w=majority
SESSION_SECRET=agroplant_production_secure_key_2026
```
*(Saqlash uchun: `Ctrl + O` -> `Enter` -> `Ctrl + X`)*.

---

## 5-QADAM: Bitta Buyruq Bilan Ishga Tushirish (Deploy)

Avtomatik skript orqali ikkala konteynerni ishga tushiring:
```bash
chmod +x deploy.sh
./deploy.sh
```

Tekshirish:
```bash
docker compose ps
```
Ikkala konteyner (`agroplant-backend` va `agroplant-frontend`) **Up (running)** holatida bo'lishi kerak.
Endi brauzeringizda `http://YOUR_VPS_IP` manzilini ochsangiz, sayt ishlayotganini ko'rasiz!

---

## 6-QADAM: Bepul SSL (HTTPS) va Domenni O'rnatish

Domen orqali xavfsiz **`https://yourdomain.com`** holatida ochish uchun Let's Encrypt (Certbot) o'rnatamiz:

1. Serverning o'ziga Certbot o'rnatish:
```bash
apt install certbot python3-certbot-nginx -y
```

2. Domen nomingiz uchun bepul SSL olish:
```bash
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

3. Sertifikat olgach, `AgroPlant-React/nginx.conf` da SSL portini 443 ga ulab, konteynerlarni qayta ishga tushirasiz:
```bash
cd /var/www/AgroPlant && docker compose restart frontend
```

---

## 7-QADAM: Kelajakda Yangilanishlarni Yuklash (CI/CD)

Har gal GitHub ga kod push qilganingizdan so'ng, serverda shunchaki bitta buyruqni berish kifoya:
```bash
cd /var/www/AgroPlant && ./deploy.sh
```
Skript avtomatik ravishda yangi o'zgarishlarni tortib oladi, konteynerlarni nol uzilish bilan qayta quradi va eski keraksiz fayllarni tozalaydi!
