# Gallery content

The gallery is generated from album folders in this directory.

To add an item:

1. Copy `_template/` and rename it using a lowercase slug, for example `cita/`.
2. Update `cita/index.md` with the album metadata.
3. Put web-ready photos in `cita/images/`.
4. Set `image: cover.jpg` in `index.md`; the website will serve it as `/gallery/cita/images/cover.jpg`.
5. Run `npm run dev` or `npm run build`; the image folders are automatically copied to `public/gallery/` for Next.js.
6. Commit the album folder with both `index.md` and `images/`.

An `index.md` can use an absolute legacy path such as `/gallery/example.jpg`, but new albums should use a filename such as `cover.jpg`. The included albums still use branded placeholder images; replace them with real lab photographs before public launch.
