# Deploy Checklist

## GitHub

```bash
git init
git add .
git commit -m "Launch AI for my inner circle"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

The following local files are intentionally ignored:

- `.env`
- `node_modules/`
- `dist/`
- root `harsha.png`
- root `harsha__biodata.pdf`

The deployed photo lives at:

```text
public/harsha.png
```

## Netlify

Build settings:

```text
Build command: npm run build
Publish directory: dist
Node version: 20.14.0
```

These are already captured in `netlify.toml`.

## Netlify Environment Variables

Add these in Netlify site settings:

```env
VITE_PUBLIC_SITE_URL=https://your-netlify-domain.netlify.app
VITE_HARSHA_WHATSAPP_NUMBER=918374283166
VITE_ENABLE_ANALYTICS=true
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Optional, only if continuing with Convex too:

```env
VITE_CONVEX_URL=
CONVEX_DEPLOY_KEY=
CONVEX_DEPLOYMENT=
```

Do not expose this as a `VITE_` variable:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

It is only for future server-side functions/admin jobs.

## Supabase

Run the SQL in:

```text
docs/supabase-schema.sql
```

The current browser app writes to:

- `visitors`
- `sessions`
- `survey_responses`
- `analytics_events`

Anonymous users can insert/update analytics data but cannot read it.
