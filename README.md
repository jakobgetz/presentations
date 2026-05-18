Presentations repository

Structure
- presentations/ : each presentation lives in its own folder, e.g. presentations/transformers/
  - Each presentation must include an index.html at its root and any assets (css/js/images)

Workflow
- Author a presentation in presentations/<name>/
  - Open presentations/<name>/index.html locally to preview
  - Commit and push to main
- A gh-pages branch is published to GitHub Pages. The site root lists presentations and links to each one at /presentations/<name>/

Adding a new presentation
1. Create a folder: presentations/<name>/
2. Add index.html and assets
3. git add, commit, push

Notes
- Links on the site are relative to the site root and point to presentations/<name>/
- For richer features, consider using reveal.js or Marp for Markdown-first slides.
