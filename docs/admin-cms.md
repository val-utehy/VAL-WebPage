# Content admin

The content editor is served at `/admin/` and is powered by Decap CMS. It writes Markdown and uploaded media into this GitHub repository; every publish creates a commit, which then triggers the existing GitHub Pages deployment workflow.

## One-time production setup

1. Create a GitHub OAuth application for the content editors.
2. Deploy a small OAuth proxy with `/auth` and `/callback` routes. The proxy holds the GitHub OAuth client secret; do not put that secret in this repository.
3. In `public/admin/config.yml`, replace:
   - `CHANGE_ME/vision-learning-lab` with the real GitHub `owner/repository`;
   - `https://CHANGE_ME.example.com` with the HTTPS address of the OAuth proxy.
4. Set the OAuth application's callback URL to `<oauth-proxy-url>/callback` and allow the published `/admin/` URL as an editor origin.
5. Grant repository write access only to the trusted lab editors, then open `https://<site>/admin/` and choose **Login with GitHub**.

Decap's GitHub backend requires the separate OAuth proxy because GitHub's OAuth client secret cannot safely be sent to a static browser application. The proxy only performs login; content remains versioned in GitHub and is deployed by GitHub Actions.

## Local authoring

For local CMS development, run the Decap local-backend proxy alongside `npm run dev`. The committed configuration has `local_backend: true`; remove or override it only if your production environment does not support that setting.

## Content layout

```text
content/
  posts/<slug>/index.md          News article
  posts/<slug>/images/           Article images
  members/<slug>/main.md         Member profile
  members/<slug>/images/         Portrait/source images
  gallery/<slug>/index.md        Gallery album
  gallery/<slug>/images/         Album images
public/admin/                    Static CMS application and its config
```
