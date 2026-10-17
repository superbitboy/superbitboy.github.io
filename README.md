# Super Bit Boy

The public Super Bit Boy audio catalog at https://superbitboy.github.io/.

This is a buildless, responsive GitHub Pages website. `index.html` holds the eight-pack catalog; `styles.css` contains the layout; `script.js` handles filters and accessible pack dialogs. Images are optimized copies of the supplied brand and pack artwork. Original artwork is unchanged.

## Local preview

Run `python3 -m http.server 4173` in this folder and open http://localhost:4173.

## Product listing URLs

Update the `productLinks` object at the top of `script.js` with the actual Unity Asset Store, Fab, and itch.io product URLs for each pack. Entries set to `null` use the matching storefront homepage with a “Visit store” label. Direct product URLs use “View listing.” The storefront cards in `index.html` also open each store homepage.

The previous site did not contain its referenced audio preview files. This version does not show broken players. Add licensed, approved audio preview files before adding playback controls.

## Publishing

GitHub Pages publishes the root of the `main` branch. No package installation, external fonts, analytics, or build step is required.

## Contact form

`contact.html` posts to FormSubmit for delivery to `superbitboy85@gmail.com`. `contact.js` sends the visitor email as both `email` and `_replyto` so Reply in Gmail addresses the visitor. The native HTML POST is the fallback if JavaScript is unavailable. The provider requires one-time recipient activation.

`contact.js` redirects to `thanks.html` only after the provider confirms success. Network, activation, and provider errors preserve the message and offer a direct email link. No email credentials or API keys are stored in this repository. The form includes a honeypot; the HTML fallback retains the provider’s default CAPTCHA.
