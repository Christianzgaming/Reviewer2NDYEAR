# GitHub-Powered Academic Reviewer Archive

The site reads your **content repo** (e.g. `academic-archive`) live through the GitHub Git Trees API. Nothing is hardcoded:
push a folder, HTML, or PDF to GitHub and it appears within ~15 seconds. Dotfiles and `README.md` are hidden.

## Content folder
By default only the `Reviewer` folder is shown as Home (set `CONTENT_ROOT` to change it; set it empty to show the whole repo).

## Deploy
1. Push this project to its own GitHub repo and import it in Vercel.
2. Add Environment Variables (Project → Settings):
   | Name | Value |
   |---|---|
   | `GITHUB_TOKEN` | Fine-grained PAT, **Contents: Read & write**, only for your content repo |
   | `GITHUB_OWNER` | your GitHub username/org |
   | `GITHUB_REPO` | content repo name, e.g. `academic-archive` |
   | `GITHUB_BRANCH` | `main` (optional) |
   | `ADMIN_PASSWORD` | password for the admin dashboard |
   | `SESSION_SECRET` | long random string (`openssl rand -hex 32`) |
3. Deploy. Click 🔐 on the site to enter admin mode (add/rename/delete/upload/edit; each action = one commit).

## URLs
`/b/CC4/1ST%20SEM/reviewers` (folder) and `/v/CC4/1ST%20SEM/reviewers/lesson-1.html` (reviewer). Refresh and sharing work via the Vercel rewrite.

## Security notes
- The token lives only in server env vars (`api/*`). The browser only holds a short-lived signed admin session token.
- Reviewer HTML renders in a sandboxed iframe (scripts allowed, no access to the site's origin), so quizzes like your CC4 one run fine.
- Uploads go through the API (Vercel body limit ~4.5 MB); add bigger files straight on GitHub.
