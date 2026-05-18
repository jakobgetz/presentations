# Presentations

A personal hub for slide decks — authored in plain HTML, published via GitHub Pages.

## Structure

```
presentations/
├── index.html          ← Hub (this site)
└── presentations/
    └── transformers/   ← One presentation
        ├── index.html
        ├── style.css
        └── script.js
```

Each presentation lives in `presentations/<name>/` and must include an `index.html` at its root, plus any CSS/JS assets.

## Workflow

**Author locally**
Open `presentations/<name>/index.html` directly in your browser — no build step.

**Publish**
```bash
git add .
git commit -m "Add <name> presentation"
git push origin main
```
The `gh-pages` branch is auto-published to GitHub Pages. Presentations appear at `/presentations/<name>/`.

## Adding a Presentation

1. Create a folder: `presentations/<name>/`
2. Add `index.html` and any assets (CSS, JS, images)
3. `git add . && git commit && git push`

Links on the site are relative to the site root and point to `presentations/<name>/`.

## Notes

- For richer features, consider using [reveal.js](https://revealjs.com/) or [Marp](https://marp.app/) for Markdown-first slides.
- The hub page (`index.html`) is on the `gh-pages` branch. The `main` branch holds the source content.