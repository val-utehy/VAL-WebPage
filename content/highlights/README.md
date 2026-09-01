# Highlights

Each published milestone has one Markdown file:

```text
content/highlights/<highlight-slug>/
  index.md
  images/                 # optional cover and inline assets
```

Use this frontmatter schema. `date` must be an ISO date so the timeline can sort entries correctly. English values are the default; the `Vi` fields are used for the Vietnamese page.

```md
---
title: "A concise public milestone"
titleVi: "Một cột mốc ngắn gọn"
date: "2026-07-16"
category: "Paper acceptance"
categoryVi: "Bài báo được chấp nhận"
side: "right"                 # left or right on the desktop timeline
timelineYear: "2026"          # optional override for the visual date
timelineMonth: "JUL"          # leave blank when only the year is known
excerpt: "One sentence shown in the timeline."
excerptVi: "Một câu hiển thị trong timeline."
author: "VAL Lab"
authorVi: "VAL Lab"
cover: "cover.jpg"              # optional, stored in images/
coverAlt: "Description of image" # required if cover is supplied
coverAltVi: "Mô tả ảnh"
featured: false
draft: false
---

Write the full highlight here using paragraphs, `##` headings and `-` bullet lists.
```

Set `draft: true` to exclude an entry from the public timeline. The public route is `/en/highlights/<highlight-slug>` (or `/vi/...`).
