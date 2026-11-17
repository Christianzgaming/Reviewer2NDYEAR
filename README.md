# 🎓 GitHub-Powered Academic Reviewer Archive

Website na **direktang nagbabasa ng GitHub repo mo**. Walang hardcoded na folder: mag-add ka lang ng folder, HTML o PDF sa GitHub, at lalabas ito sa site (mga 15 segundo). May optional na admin para mag-manage ng files nang hindi binubuksan ang GitHub.

## Paano gumagana
- **GitHub ang source of truth.** Binabasa ng `api/tree.js` ang buong repo gamit ang Git Trees API.
- **Folder na `Reviewer`** ang Home ng site. Ang `api`, `public`, `package.json`, `vercel.json` at `README.md` ay hindi lumalabas.
- **HTML reviewers** bumubukas sa loob ng site (sandboxed iframe, gumagana pa rin ang scripts/quiz). **PDF at images** may preview. Ang ibang file ay may Download.
- **Admin writes** (upload, rename, delete, edit) dumadaan sa `api/admin.js`. Hindi napupunta sa browser ang GitHub token.

## Struktura ng repo
```
Reviewer2NDYEAR/            ← repo mo
├── Reviewer/               ← dito mo ilalagay ang lahat ng reviewer (ito ang Home ng site)
│   ├── CC4/
│   │   ├── 1ST SEM/
│   │   │   ├── reviewers/lesson-1.html
│   │   │   ├── pdf/reviewer.pdf
│   │   │   └── notes/additional-notes.html
│   │   └── 2ND SEM/
│   └── CC3/
├── api/                    ← server code (huwag galawin)
├── public/index.html       ← ang website
├── package.json
├── vercel.json
└── README.md
```

---

## SETUP (Step by step)

### Step 1: Ihanda ang GitHub repo
1. Siguraduhing nasa repo ang lahat ng laman ng zip: `api/`, `public/`, `package.json`, `vercel.json`, `README.md`.
2. Gawin ang folder na `Reviewer` at ilagay doon ang mga subject mo. Hindi sine-save ng Git ang walang laman na folder, kaya maglagay ng kahit isang file sa loob.
3. Dapat may branch na `main` ang repo.

### Step 2: Gumawa ng GitHub token
1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** *Only select repositories*, tapos piliin ang repo mo.
3. **Permissions → Repository permissions → Contents:** *Read and write*.
4. Pumili ng expiration, i-click ang **Generate token**, at **kopyahin agad** (isang beses lang ipinapakita).
5. Huwag itong ipo-post sa chat, sa code, o sa GitHub.

### Step 3: I-import sa Vercel
1. Pumunta sa vercel.com at mag-login gamit ang GitHub.
2. **Add New → Project** → piliin ang repo mo → **Import**.
3. **Framework Preset:** *Other*. Iwanang blangko ang Build Command at Output Directory.
4. Huwag munang i-deploy. Gawin muna ang Step 4.

### Step 4: Environment Variables
Sa Vercel, **Settings → Environment Variables**:

| Name | Value | Required |
|---|---|---|
| `GITHUB_TOKEN` | token mula sa Step 2 | oo |
| `GITHUB_OWNER` | GitHub username mo | oo |
| `GITHUB_REPO` | pangalan ng repo (hal. `Reviewer2NDYEAR`) | oo |
| `GITHUB_BRANCH` | `main` | hindi |
| `ADMIN_PASSWORD` | password para sa admin | oo |
| `SESSION_SECRET` | mahabang random string | oo |
| `CONTENT_ROOT` | folder na magiging Home. Default: `Reviewer`. Kung gusto mong ipakita ang buong repo, i-set ito nang blangko | hindi |

Para sa `SESSION_SECRET`, patakbuhin sa terminal:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 5: Deploy
I-click ang **Deploy**. Kapag natapos, buksan ang `your-project.vercel.app`.

### Step 6: I-test
1. Dapat lumabas ang mga laman ng `Reviewer` (CC4, CC3, atbp.).
2. Mag-click ng HTML reviewer. Dapat bumukas ito sa loob ng site.
3. I-click ang **🔐**, ilagay ang `ADMIN_PASSWORD`, tapos subukan ang **＋ Folder**. Dapat may bagong commit sa GitHub.
4. Mag-add ng file direkta sa GitHub. Dapat lumabas ito sa site pagkalipas ng mga 15 segundo.

---

## Paano gamitin

### Mag-add ng content sa GitHub (walang admin)
**Add file → Upload files** sa loob ng `Reviewer/...` na folder, tapos **Commit changes**.

### Admin dashboard
1. I-click ang **🔐** at ilagay ang password (valid ng 8 oras).
2. Sa loob ng folder:
   - **＋ Folder**: gumawa ng subject, semester o subfolder.
   - **＋ New HTML**: gumawa ng bagong reviewer at i-edit agad.
   - **⬆ Upload files**: mag-upload ng HTML, PDF at iba pa (hanggang mga 3 MB bawat file).
3. Sa bawat row: **✏️** para mag-rename, **🗑** para mag-delete.
4. Sa loob ng isang HTML reviewer: **✎ Edit** para baguhin ang code, tapos **Publish to GitHub**.
5. Bawat action ay isang commit sa GitHub.

### Mga link
- Folder: `/b/CC4/1ST%20SEM`
- Reviewer: `/v/CC4/1ST%20SEM/reviewers/lesson-1.html`
- Gamitin ang **🔗 Copy link** sa viewer. Gumagana ang refresh at pag-share.

### Iba pang features
Search, breadcrumbs, ★ favorites, recently opened, dark/light mode (🌓), file icons, responsive na mobile layout. Ang favorites at recents ay naka-save sa browser ng bawat user.

---

## Troubleshooting
| Problema | Dahilan / Solusyon |
|---|---|
| `GitHub 404` | Mali ang `GITHUB_OWNER`, `GITHUB_REPO` o `GITHUB_BRANCH`, o hindi kasama ang repo sa token |
| `GitHub 401/403` | Expired o mali ang token, o kulang ang *Contents: Read and write* |
| `Unauthorized` sa admin | Mali ang password, o hindi na-set ang `SESSION_SECRET`. Mag-login ulit |
| Lumalabas pa rin ang `api`, `public` | Luma ang `api/` files. I-upload ang pinakabagong bersyon at i-redeploy |
| Walang nagbago pagkatapos mag-edit ng env | Kailangan ng **Redeploy** (Deployments → ⋯ → Redeploy) |
| Blangko ang Home | Walang file sa `Reviewer` folder, o mali ang pangalan (case-sensitive) |
| Hindi agad lumalabas ang bagong file | Hintayin ang ~15 segundo at i-refresh gamit ang Ctrl+Shift+R |
| Hindi ma-upload ang malaking PDF | Lampas 3 MB. I-upload direkta sa GitHub |

## Seguridad
- Server-side lang ang GitHub token (Vercel env variables).
- Ang browser ay may hawak lang na signed admin session na nag-e-expire.
- Sandboxed ang HTML reviewers kaya hindi nila maaabot ang admin session ng site.
- Kung na-expose mo ang token kahit minsan, **i-revoke agad** sa GitHub at gumawa ng bago.

## Limitasyon
- Ang Vercel request limit ay mga 4.5 MB, kaya ang malalaking file ay idaan sa GitHub.
- Ang GitHub API ay may rate limit. Okay ito para sa karaniwang gamit dahil naka-cache ang tree nang 15 segundo.
- Tuwing may commit (kasama ang admin uploads), magde-deploy ulit ang Vercel. Normal ito.
