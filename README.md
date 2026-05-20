# sanity-poc

A minimal website starter that reads content from [Sanity.io](https://www.sanity.io/).

## What was added

- `index.html` – website shell
- `styles.css` – basic styling
- `app.js` – fetches and renders posts from Sanity Content Lake using GROQ

## Run locally

No build step is required.

1. Open `/home/runner/work/sanity-poc/sanity-poc/index.html` in a browser.
2. Update the `projectId` and `dataset` values in `/home/runner/work/sanity-poc/sanity-poc/app.js`.
3. Make sure the dataset is public (or adjust the fetch logic to use an authenticated backend proxy).

## Notes

- This starter queries: `*[_type == "post"] | order(_createdAt desc)[0...6]`
- It gracefully handles missing config, empty datasets, and request errors.
