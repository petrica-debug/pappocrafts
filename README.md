# PappoCrafts

An online marketplace for handmade products and artisanal goods by Roma entrepreneurs in the Western Balkans.

## Project Structure

```
pappocrafts/
├── frontend/    # Next.js 14 (App Router, TypeScript, Tailwind CSS)
├── backend/     # Django 5 + Django REST Framework (Phase 2)
└── README.md
```

## Getting Started

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000).

### Backend (Django) — Phase 2

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Django 5, Django REST Framework, PostgreSQL
- **Payments**: Stripe (Direct integration)
- **Deployment**: Vercel (frontend), AWS (backend — Phase 2)

## Roadmap

- [x] Phase 1 — Landing page with waitlist
- [ ] Phase 2 — Full marketplace (auth, listings, cart, checkout, seller dashboard)
- [ ] Phase 3 — Reviews, messaging, multi-language, analytics
