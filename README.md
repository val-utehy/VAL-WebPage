# Vision and Learning Lab Website

A bilingual, theme-aware academic lab website built with **Next.js 16**, **TypeScript** and **Three.js**. The project keeps the existing VL metallic-orange identity, rounded typography and a restrained “From Pixels to Intelligence” visual direction.

## Project prompt

Build a premium academic research-lab website for **Vision and Learning Lab (VAL Lab)**. Preserve the existing information architecture and copper-orange identity. Use generous whitespace, rounded editorial typography and restrained Three.js motion. The opening sequence should use a restrained abstract 3D data field: a gently deforming wire surface, sparse depth points and a few muted signal paths. Do not place a 3D VL logo in the hero. The site must support English and Vietnamese, system light/dark preference, an explicit theme switch, Markdown-based member profiles and static deployment to GitHub Pages.

## Main features

- English and Vietnamese routes: `/en/` and `/vi/`
- Browser-language detection on the static root page
- Rounded local fonts: Nunito Variable and Roboto Variable
- Automatic system light/dark detection before React hydration
- Visible theme switch with the visitor’s choice stored in `localStorage`
- Lightweight vanilla Three.js neural-flow background with shader waves, depth particles, moving signal pulses and subtle pointer interaction
- Embedded lab intro video and poster
- Member directory generated from Markdown files
- Image gallery generated from Markdown files, with a responsive lightbox
- Static export to `out/`
- GitHub Actions workflow for GitHub Pages
- Automatic `basePath` handling for repository Pages such as `username.github.io/repository-name/`

## Local development

Use Node.js 22 or another version supported by the current Next.js release.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Run all checks:

```bash
npm run check
```

A production build creates a static website in `out/`:

```bash
npm run build
```

To preview the exported folder locally, use any static file server, for example:

```bash
npx serve out
```

## Theme behavior

The `beforeInteractive` theme script in `app/layout.tsx` resolves the theme before the page is painted:

1. Use `vllab-theme` from `localStorage` when the visitor has already selected a theme.
2. Otherwise follow `prefers-color-scheme` from the operating system.
3. Keep following system changes until the visitor explicitly uses the switch.

The toggle component is `components/ThemeToggle.tsx`. Theme-specific colors are grouped near the end of `app/globals.css` under `html[data-theme="light"]`.

## Manage content

Lab editors can create news posts, member profiles and gallery albums at `/admin/`. The CMS writes Markdown files to GitHub, then GitHub Actions rebuilds the static website. Before enabling it in production, follow [the admin setup guide](docs/admin-cms.md) to configure its GitHub OAuth proxy.

## Add a news post using Markdown

News posts live in:

```text
content/posts/<post-slug>/index.md
```

Copy `content/posts/_template/`, set `draft: false`, and place post images in that post's `images/` folder. The `/news` index and each individual news URL are created automatically on the next build.

## Add a member using Markdown

Member files live in:

```text
content/members/
```

To add a profile:

1. Copy `content/members/_template/` to a stable slug folder, for example `nguyen-van-a/`.
2. Fill in `main.md` in English and Vietnamese.
3. Add the portrait to `images/`; images are copied to `public/members/` during development and build.
4. Remove `draft: true`, or change it to `draft: false`.
5. Commit and push. The static People pages are regenerated automatically.

Example:

```md
---
name: Nguyen Van A
nameVi: Nguyễn Văn A
role: M.S. Student
roleVi: Học viên cao học
group: student
order: 100
photo: /members/nguyen-van-a.jpg
email: example@utehy.edu.vn
interests: Computer Vision|Object Detection
interestsVi: Thị giác máy tính|Phát hiện đối tượng
draft: false
---
English biography.
```

Supported groups:

```text
leadership
researcher
student
alumni
```

`lib/members.ts` reads the Markdown at build time. No CMS or database is required. The current seed profile is limited to a member whose identity could be verified through the lab’s public organization profile; expand it only from an authoritative roster before publishing.


## Add a gallery item using Markdown

Gallery entries live in:

```text
content/gallery/
```

To add an item:

1. Copy `content/gallery/_template.md`.
2. Rename it with a stable slug.
3. Place the image in `public/gallery/`.
4. Fill in English and Vietnamese metadata.
5. Set `draft: false`.
6. Commit and push; the gallery page and homepage preview are regenerated automatically.

The included gallery images are branded placeholders. Replace them with real lab photos before public launch.

## Deploy to GitHub Pages

The repository already includes:

```text
.github/workflows/deploy-pages.yml
next.config.ts
public/.nojekyll
```

Deployment steps:

1. Create a GitHub repository and push this project to the `main` branch.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push a commit or run **Deploy Next.js site to GitHub Pages** manually from the Actions tab.

The workflow runs `npm ci`, lint, static build, uploads `out/`, and deploys it through GitHub Pages. `next.config.ts` automatically detects a project repository in GitHub Actions and applies the repository name as `basePath`. For a user or organization site named `username.github.io`, no extra base path is added.

## Replace the sample film

Keep these paths so no component changes are needed:

```text
public/media/lab-intro.mp4
public/media/lab-intro-poster.jpg
```

Recommended format: short muted H.264 MP4, 16:9, compressed poster, no critical dialogue because the homepage video autoplays muted.

## Important editing locations

```text
content/members/                  Member Markdown files
content/gallery/                  Gallery Markdown files
content/posts/                    News-post Markdown files
public/admin/                     Decap CMS entry point and configuration
lib/members.ts                    Build-time member Markdown reader
lib/gallery.ts                    Build-time gallery Markdown reader
lib/posts.ts                      Build-time news-post Markdown reader
data/content.ts                   English/Vietnamese interface copy
data/site.ts                      Research, projects and partner data
components/LabScene.tsx           Vanilla Three.js hero background
components/ResearchMotionScene.tsx Minimal Three.js film backdrop
components/GalleryGrid.tsx        Gallery layout and lightbox
components/GalleryPreview.tsx     Homepage gallery section
components/LabFilm.tsx            Video player
app/layout.tsx                    Root document and early theme detection
components/ThemeToggle.tsx        Manual theme control
app/globals.css                   Layout, typography and color themes
.github/workflows/deploy-pages.yml GitHub Pages deployment
```

## Package lock

`package-lock.json` is lockfile version 3 and uses public `https://registry.npmjs.org/` package URLs. Do not commit a lockfile generated against a private company or development-environment registry, because GitHub Actions will not be able to reach it.
