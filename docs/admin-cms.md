# Admin roadmap

`/admin/` is a custom login interface that leads to the dashboard at `/admin/dashboard/`. It intentionally has no authentication or CMS integration yet; both are planned before the dashboard can be treated as a secure internal system.

## Planned module order

1. Authentication and editor roles.
2. News composer with draft/publish workflow.
3. Member profile editor and image upload.
4. Gallery album manager.
5. Publication manager.

## Content layout

```text
content/
  posts/<slug>/index.md          News article
  posts/<slug>/images/           Article images
  members/<slug>/main.md         Member profile
  members/<slug>/images/         Portrait/source images
  gallery/<slug>/index.md        Gallery album
  gallery/<slug>/images/         Album images
app/admin/                       Admin dashboard interface
```
