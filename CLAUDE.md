# BLK PHX LABS — Landing Page

Personal link-in-bio landing page for **Fabian Alvarez-Primo**.  
Static HTML/CSS/JS. No frameworks, no build step, no dependencies.

---

## Project Structure

```
/
├── index.html        ← the entire site (single file)
├── CLAUDE.md         ← this file
└── .gitignore
```

---

## Deploy to GitHub Pages

### First-time setup

1. Create a new repo on GitHub named exactly: `fabzy4l.github.io`
   - Go to https://github.com/new
   - Set visibility to **Public**
   - Do NOT initialize with README, .gitignore, or license

2. From this project folder in your terminal:

```bash
git init
git remote add origin https://github.com/fabzy4l/fabzy4l.github.io.git
git add index.html
git commit -m "launch"
git branch -M main
git push -u origin main
```

3. GitHub Pages activates automatically for `username.github.io` repos.  
   Your site will be live at: **https://fabzy4l.github.io**  
   (allow ~60 seconds for first deploy)

---

## Push updates

After editing `index.html`:

```bash
git add index.html
git commit -m "update"
git push
```

Site rebuilds in ~30 seconds automatically.

---

## Adding a link card

Each link is an `<a>` tag with class `link-card`. To add **El Rant** (or any new link), copy this block and paste it before the closing `</div>` of the `.links` div:

```html
<a href="YOUR_URL_HERE" target="_blank" rel="noopener" class="link-card">
  <div class="link-left">
    <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
    </svg>
    <div class="link-meta">
      <span class="link-name">El Rant</span>
      <span class="link-sub">Science comedy podcast · 2020</span>
    </div>
  </div>
  <svg class="link-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
</a>
```

Replace `YOUR_URL_HERE` with the Spotify/Apple/YouTube link when ready.

---

## Updating your resume link

Find this line in `index.html`:

```html
<a href="#" class="link-card" id="resume-link">
```

Replace the `#` with your PDF URL. Options:
- Upload the PDF to this same repo and link it as `./resume.pdf`
- Use a Google Drive share link (set to "anyone with link can view")
- Use a LinkedIn profile PDF export URL

---

## What NOT to commit

See `.gitignore`. Never commit:
- `.env` files or anything with API keys
- Claude config/session files
- OS junk (`.DS_Store`, `Thumbs.db`)

---

## Notes for Claude Code

- This is a **single static HTML file**. Do not introduce a build system, npm, or frameworks unless explicitly asked.
- Do not modify `.gitignore`.
- Preserve the CSS variable system (`--ember`, `--bg`, etc.) when editing styles.
- Commit messages should be lowercase and minimal (e.g. `update`, `add el rant link`, `fix email`).
- Do not add AI tool attribution, co-authorship comments, or generator signatures anywhere in the code.
