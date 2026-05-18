# Brain.2 — Setup Guide

## 1. Supabase (base de données gratuite)

1. Va sur [supabase.com](https://supabase.com) → créé un compte gratuit
2. "New project" → donne un nom (ex: `brain2`)
3. Une fois le projet créé, va dans **SQL Editor**
4. Copie-colle tout le contenu de `supabase-schema.sql` et clique **Run**
5. Va dans **Settings → API** et copie :
   - `Project URL` → c'est ton `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → c'est ton `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Variables d'environnement

Édite le fichier `.env.local` à la racine du projet :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 3. Test local

```bash
npm run dev
```
Ouvre http://localhost:3000

## 4. Déploiement sur Vercel (gratuit)

1. Va sur [vercel.com](https://vercel.com) → créé un compte avec GitHub
2. Push le projet sur GitHub :
   ```bash
   git init
   git add .
   git commit -m "Brain.2 initial"
   git remote add origin https://github.com/TON_USER/brain2.git
   git push -u origin main
   ```
3. Sur Vercel → "New Project" → importe le repo `brain2`
4. Dans **Environment Variables**, ajoute les 2 variables Supabase
5. Deploy !

## 5. Installer sur iPhone

1. Ouvre l'URL Vercel dans **Safari** (pas Chrome)
2. Tap le bouton **Partager** (carré avec flèche)
3. "Sur l'écran d'accueil"
4. Brain.2 apparaît comme une vraie app !

## Reset quotidien (minuit)

Les tâches MORE et CARE se remettent à zéro automatiquement à minuit grâce au champ `date` en base de données. Aucun cron nécessaire.
