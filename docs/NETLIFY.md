# Netlify deployment

Import `elreco/retro` into Netlify and deploy the `main` branch.
The build settings are in `netlify.toml`; Netlify automatically installs its
Next.js adapter. No static export or custom redirect rule is needed.

Set these environment variables before the first deployment:

- `NEXT_PUBLIC_SUPABASE_URL`: the new Supabase project's URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: its public anon key, never a service-role key.
- `NEXT_PUBLIC_SITE_URL`: the final HTTPS Netlify site URL, used for metadata.

For a fresh Supabase project, run only `supabase/schema.sql` in SQL Editor.
Do not replay the historical migrations. Keep database passwords and private
keys out of Git. Local configuration belongs in the ignored `.env.local` file.

The application has no authentication and its database policies allow anonymous
read/write access to retrospective data. Room links are not an authorization
boundary: do not store confidential data in this installation.

The optional Vercel cron in `vercel.json` does not run on Netlify. No replacement
schedule is configured here. If Supabase pauses the free project for inactivity,
resume it from the Supabase dashboard.

Reference: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
