# Super Bit Boy

The public Super Bit Boy audio catalog at https://superbitboy.github.io/.

This is a buildless, responsive GitHub Pages website. `index.html` holds the eight-pack catalog; `styles.css` contains the layout; `script.js` handles filters and accessible pack dialogs. Images are optimized copies of the supplied brand and pack artwork. Original artwork is unchanged.

## Local preview

Run `python3 -m http.server 4173` in this folder and open http://localhost:4173.

## Launching product listings

Update the `productLinks` object at the top of `script.js` with the actual Unity Asset Store, Fab, and itch.io product URLs for each pack. Leave unpublished URLs as `null`; they appear as “Coming soon” without dead links. Update the storefront section and FAQ in `index.html` when listings launch.

The previous site did not contain its referenced audio preview files. This version does not show broken players. Add licensed, approved audio preview files before adding playback controls.

## Publishing

GitHub Pages publishes the root of the `main` branch. No package installation, external fonts, analytics, or build step is required.
