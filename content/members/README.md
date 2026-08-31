# Member content

Each visible profile has its own folder in this directory. To add a member:

1. Copy `_template/` to a new folder such as `nguyen-van-a/`.
2. Fill in `nguyen-van-a/main.md`.
3. Put the web-ready portrait in `nguyen-van-a/images/` and name it `profile` (for example, `profile.jpg`, `profile.png`, or `profile.webp`).
4. Run `npm run dev` or `npm run build`; member images are copied to `public/members/` automatically.
5. Remove `draft: true` or change it to `draft: false`.
6. Commit and push. GitHub Actions will rebuild the People page and the member detail page automatically.

Use one of these groups: `faculty`, `phd_student`, `masters_student`, `undergraduate_researcher`, `research_associate`, or `alumni`. Research associates are active lab collaborators who have graduated but still contribute; alumni are no longer active in the lab. Use `|` to separate research interests. `order` controls display order.

Each member folder can contain its own `publications.md`. Add one field block per paper and separate blocks with `---`; use `|` between authors. The website automatically combines duplicate co-authored records for the common Publications page, while each member profile shows only its own file. Names are emphasized only when they map to an existing member profile. Entries are ordered by year, then Faculty → PhD → other active members.

Profiles for the students listed on <https://sites.google.com/view/vallab/members> were ingested from that page: name, role prefix (NCS -> `phd_student`, HVCH -> `masters_student`, no prefix -> `undergraduate_researcher`), email and portrait. Six people show the site's shared default avatar rather than a photo; no image was saved for them, so the profile falls back to initials.

Two members share the name Nguyen Van Dat and are kept apart by folder only (`nguyen-van-dat`, `nguyen-van-dat-2`); rename them if a clearer distinction exists. Mobile numbers appear on the source page but were deliberately not ingested, because `phone` renders as a public `tel:` link on the profile page. `nguyen-tien-dat` predates the ingest and was left as curated; its Hugging Face role was kept rather than replaced with the roster entry.

`bioVi` is a single frontmatter line, so a multi-paragraph Vietnamese biography separates its paragraphs with the two characters \n\n; the English biography goes in the document body below the frontmatter and uses ordinary blank lines.

Bios and research interests are placeholders. Fill them in before treating these profiles as final.
