# Pocketwise: sample FinTech website (ISA-III)

Theme: Personal Finance Management. Pages: Home, About Us, Features (with EMI and savings calculators), Contact.

## Files
- Website pages and assets are at the repository root: `index.html`, `about.html`, `services.html`, `contact.html`, `style.css`, and `script.js`.
- `.github/workflows/deploy-pages.yml` deploys the website to GitHub Pages.

Open `index.html` in a browser to preview.

## Read-only account connection and balance demos
The home page includes a simulated account-linking flow and a sample balance that is hidden until the user chooses to reveal it. On the calculator page, both calculator cards show the same masked demo account balance; the calculators do not change it. Users can edit the sample balance separately. These are demo values only: the prototype does not contact financial institutions, collect bank credentials, or persist connected accounts. A production integration requires a secure, authorized open-banking provider and an appropriately configured backend.

## Enable the Tidio chatbot
The shared `script.js` loader adds the Tidio widget to every page using the public install key. Do not put a private API key in frontend code. Never enter bank passwords or other sensitive financial information in chat.

## Publish with GitHub Pages
The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. It publishes the static site whenever changes are pushed to `main`.

1. Keep the website files and `.github/workflows/deploy-pages.yml` at the repository root.
2. In the repository, open **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for **Deploy static site to GitHub Pages** to finish successfully. Later pushes to `main` deploy automatically.
4. Open the URL shown in **Settings > Pages**. For this repository, it should be `https://nigelnolan123456-art.github.io/FintechISA3/`.

GitHub Pages serves `index.html` at the site root, so all relative page and asset links work without a build step.

## Things to change before submitting
- Team names and roles in `about.html`
- Contact details in `contact.html` (currently dummy)
- Optional: rename "Pocketwise" and recolour by editing the `:root` variables at the top of `style.css`

## Report checklist (from the ISA-III brief)
- Title of concept: Personal Finance Management (Pocketwise)
- Website structure and mock-up: a page map (Home, About Us, Features, Contact) plus a Canva or Figma mock-up
- Website link: your GitHub Pages URL
- Screenshots of web pages: one per page
- Deadline: 3 October 2026
