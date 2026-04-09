# FlowFin — Personal Money Manager

> Production-ready React + Vite finance dashboard with Firebase Auth, Firestore real-time sync, Chart.js analytics, and PWA support. Deploy to Vercel in minutes.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 18, Vite 5, Lucide Icons         |
| Styling     | Pure CSS (dark/light theme variables)  |
| Charts      | Chart.js 4 + react-chartjs-2           |
| Auth        | Firebase Authentication (Email + Google)|
| Database    | Firebase Firestore (real-time)         |
| Offline     | Service Worker (Workbox via vite-plugin-pwa) |
| Deployment  | Vercel                                 |

---

## Features

- **Auth** — Email/password sign-up & sign-in + Google OAuth
- **Transactions** — Add income/expense with category, description, amount, date
- **Real-time sync** — Firestore `onSnapshot` keeps all tabs in sync
- **Analytics** — Bar chart (6-month income vs expense) + Pie chart (expense categories)
- **Search & filter** — Filter by type, category, and free-text search
- **Delete** — Remove transactions instantly; UI + Firestore update in real-time
- **CSV Export** — Export filtered transactions as a `.csv` file
- **Dark / Light mode** — Fintech dark default with one-click toggle
- **PWA** — Installable on mobile/desktop, offline support, custom icon
- **LocalStorage fallback** — Transactions cached locally for offline access

---

## Quick Start

### 1. Clone / Download

```bash
git clone https://github.com/your-username/flowfin.git
cd flowfin
npm install
```

### 2. Firebase Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name → Continue
3. **Authentication** → Get started → Enable **Email/Password** and **Google**
4. **Firestore Database** → Create database → Start in **production mode**
   - Add this security rule:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /transactions/{docId} {
           allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
           allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
         }
       }
     }
     ```
5. **Project Settings** (⚙ icon) → **Your apps** → Add app → Web (`</>`)
6. Copy the `firebaseConfig` values.

### 3. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

### Option A — CLI

```bash
npm install -g vercel
vercel
```

Follow prompts. Then add environment variables:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... repeat for all VITE_ keys
vercel --prod
```

### Option B — Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. **Framework Preset**: Vite (auto-detected)
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables** → Add all 6 `VITE_FIREBASE_*` keys
8. Click **Deploy** ✅

> `vercel.json` is already included to handle SPA client-side routing.

---

## Project Structure

```
flowfin/
├── public/
│   ├── icons/
│   │   ├── icon-192.png       # PWA icon
│   │   └── icon-512.png       # PWA splash icon
│   └── favicon.ico
├── src/
│   ├── firebase/
│   │   └── config.js          # Firebase init
│   ├── context/
│   │   └── AuthContext.jsx    # Auth provider + hooks
│   ├── hooks/
│   │   └── useTransactions.js # Firestore CRUD + aggregates
│   ├── pages/
│   │   ├── Auth.jsx           # Login / Sign-up
│   │   └── Dashboard.jsx      # Main dashboard
│   ├── components/
│   │   ├── Layout.jsx         # Sidebar + topbar + mobile nav
│   │   ├── StatCard.jsx       # Balance / income / expense cards
│   │   ├── Charts.jsx         # Bar + Pie charts
│   │   ├── TransactionList.jsx# Search, filter, delete, export
│   │   └── AddModal.jsx       # Add transaction modal
│   ├── utils/
│   │   └── categories.js      # Category list + colors + fmt()
│   ├── styles/
│   │   └── global.css         # All styles (dark/light tokens)
│   ├── App.jsx                # Auth gate
│   └── main.jsx               # Entry point
├── .env.example               # Firebase config template
├── vercel.json                # SPA routing for Vercel
├── vite.config.js             # Vite + PWA plugin config
└── package.json
```

---

## Firestore Index

If you see an index error in the console, create a composite index:

- Collection: `transactions`
- Fields: `uid` (Ascending) + `createdAt` (Descending)

Firebase Console → Firestore → Indexes → Add Index

---

## License

MIT — free to use and modify.
