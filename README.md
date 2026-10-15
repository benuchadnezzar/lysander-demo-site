# lysander — tracking playground

A lightweight, public, static website for developing and testing **lysander**, an open-source configuration-as-code and CI/CD tool for Google Tag Manager (GTM) and Google Analytics 4 (GA4).

It has **no framework, dependencies, build step, backend, form submissions, or real signups**. The interactions only push synthetic events to `window.dataLayer`.

## Publish on GitHub Pages (free)

1. Create a **public** GitHub repository named `lysander-demo-site`.
2. Upload **the contents of this folder** into the repository root (not the folder itself). Keep `index.html`, `config.js`, `styles.css`, and `app.js` at the top level.
3. In the repository, go to **Settings → Pages**.
4. Choose **Deploy from a branch**, select **main**, choose **/(root)**, and click **Save**.
5. Once deployment finishes, the site will be at `https://YOUR_USERNAME.github.io/lysander-demo-site/`.

The generated GitHub Pages URL is the URL to use when creating a **GA4 Web data stream**. You do not need to own a custom domain.

## Connect Google Tag Manager

1. Create a personal test GTM account and a **Web** container at https://tagmanager.google.com/.
2. Copy the `GTM-...` **container ID** (not the `G-...` GA4 measurement ID).
3. Edit `config.js`:

   ```js
   window.LYSANDER_CONFIG = {
     gtmId: "GTM-ABCDEFGH",
   };
   ```

4. Commit the change to `main` and let GitHub Pages redeploy.
5. Open the site. The status area should show your GTM container ID and **loader configured** (this does not verify Google has received anything).
6. Use **Preview** inside GTM to connect **Tag Assistant** to the live site. Check that `select_content`, `generate_lead`, and `sign_up` appear as data layer events after interaction.

The site uses the JavaScript part of GTM's normal bootstrap and intentionally omits the `<noscript>` iframe because all demo interactions require JavaScript. For a production website, use Google's complete recommended installation snippet and consent configuration.

## Connect GA4 *through GTM*

1. Create a personal GA4 account and property at https://analytics.google.com/.
2. Under **Admin → Data streams**, create a **Web** data stream using your GitHub Pages URL.
3. Copy its **measurement ID** (`G-...`).
4. In GTM, add a **Google tag** with that GA4 ID and an **Initialization – All Pages** trigger. Use GTM Preview to confirm it fires, then verify page views in GA4 Realtime or DebugView.
5. To send custom events, create GTM **Custom Event** triggers with the exact names below, and matching **Google Analytics: GA4 Event** tags. Add **Data Layer Variables** for any event parameters that you want GA4 to receive.
6. Test in GTM Preview and GA4 DebugView, then publish the GTM container when satisfied.

**Important:** Putting an event in `dataLayer` does *not* automatically forward it to GA4. You must explicitly create GTM tags and triggers. Do **not** paste an additional GA4 Google tag snippet into the website, or you could double-count page views.

## Event contract (v0)

| UI action | dataLayer event | Data layer parameters |
|---|---|---|
| Click a feature | `select_content` | `content_type = feature`, `item_id = tag_management \| event_contracts \| deployment` |
| Submit synthetic interest form | `generate_lead` | `form_id = lysander_demo_lead`, `interest_area = analytics_automation \| data_quality \| attribution` |
| Simulate signup | `sign_up` | `method = demo_button` |

Only controlled option values are sent to the data layer. No names, emails, credentials, or other personal information are captured.

The page's built-in event console logs only interactions in this browser tab. Clearing it does not undo dataLayer pushes or events already sent through GTM.

## Local preview

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Automated browser checks (future)

Test the `dataLayer` directly with Playwright before GTM is connected, then test requests sent to GA4 on a staging deployment. The event contracts above make useful fixtures for the future lysander project's integration tests.

## Privacy and public-repository warning

This site is only a development sandbox. Public GitHub Pages sites are visible to anyone. Tracking IDs are public identifiers, but **never commit OAuth tokens, service-account keys, API secrets, personal data, or other credentials**. Before using GA4 in a real production website, implement the consent/privacy setup required for your visitors and jurisdictions.
