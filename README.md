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

