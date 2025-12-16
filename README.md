# Employee Management System (EMS)

## Tech Stack
- Backend: Node.js, Express, MongoDB, Redis, BullMQ
- Frontend: React, Axios
- Queue: BullMQ
- Database: MongoDB

## Cara Menjalankan Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
node src/workers/notification.worker.js
node src/workers/importCSV.worker.js

## Postman Collection

Project ini dilengkapi dengan Postman Collection untuk pengujian API.

### Cara Menggunakan
1. Buka Postman
2. Klik **Import**
3. Pilih file `EMS.postman_collection.json`
4. Pilih environment `EMS Local`
5. Jalankan endpoint `Auth Login` terlebih dahulu
6. Endpoint lain otomatis menggunakan token

## 📂 Sample CSV

Folder `sample-csv` berisi:

- `employees-small.csv`  
  Contoh CSV kecil untuk testing manual import

- `generate-large-csv.js`  
  Script Node.js untuk menghasilkan CSV besar (ribuan data)

### Generate CSV besar
```bash
cd sample-csv
node generate-large-csv.js
