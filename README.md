# tHOME Konfigurator Smart Home

Kalkulator kosztów inteligentnego domu Loxone dla tHOME.

## Wdrożenie na konfigurator.thome.pl

### Krok 1 — GitHub
1. Wejdź na github.com i załóż konto (jeśli nie masz)
2. Kliknij **New repository** → nazwa: `thome-konfigurator` → **Create**
3. Kliknij **uploading an existing file**
4. Przeciągnij i upuść wszystkie pliki z tego folderu
5. Kliknij **Commit changes**

### Krok 2 — Vercel
1. Wejdź na vercel.com → **Sign up with GitHub**
2. Kliknij **Add New Project**
3. Wybierz repozytorium `thome-konfigurator`
4. Framework: **Vite** (wykryje automatycznie)
5. Kliknij **Deploy** — za ~1 minutę apka działa na vercel.app

### Krok 3 — Domena na LH.pl
1. Zaloguj się do panelu LH.pl
2. Wejdź w **Domeny → Strefa DNS → thome.pl**
3. Dodaj rekord:
   - Typ: **CNAME**
   - Nazwa: `konfigurator`
   - Wartość: `cname.vercel-dns.com`
   - TTL: 3600
4. Zapisz

### Krok 4 — Dodaj domenę w Vercel
1. W projekcie na Vercel → **Settings → Domains**
2. Wpisz: `konfigurator.thome.pl`
3. Kliknij **Add** → Vercel automatycznie wykryje DNS
4. Po ~10 minutach strona działa pod Twoją domeną z SSL

## Lokalny development

```bash
npm install
npm run dev
```
