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

The initial public profile for Nguyen Tien Dat was seeded from the VAL-UTEHY Hugging Face organization because the referenced Google Sites member directory could not be reliably extracted by the build environment. Verify and expand member records against the lab's authoritative roster before publication.
