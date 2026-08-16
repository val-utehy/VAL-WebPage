# News posts

Each post lives in its own folder:

```text
content/posts/<post-slug>/
  index.md
  images/
```

The site reads these files at build time. Put the cover image in the post's `images/` folder and set `cover` to its filename. Set `draft: true` to keep a post out of the public website.

Editors should normally create and publish posts at `/admin/`; this folder remains useful for reviewing changes in GitHub.
