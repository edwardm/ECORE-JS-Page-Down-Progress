# ECORE JS Page Down Progress

A lightweight, vanilla JavaScript plugin that builds section navigation and a
scroll-progress indicator from your page content. It is intended for long-form
pages such as documentation and articles.

## Usage

Add `ecore-section` to each section, and `ecore-title` to the heading that
should appear in the navigation:

```html
<section class="ecore-section">
  <h2 class="ecore-title">Getting started</h2>
  <p>Your section content.</p>
</section>
```

Add the progress track once per page. The script creates its links inside the
navigation element and assigns IDs to sections that do not already have one:

```html
<aside class="ecore-progress ecore-progress-right">
  <div
    class="ecore-progress-bg"
    role="progressbar"
    aria-label="Page scroll progress"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="0"
  ></div>
  <nav aria-label="Page sections"></nav>
</aside>
```

Include `dist/css/main.css` and `dist/js/ecore-page-down-progress.js` in your
page. The CSS in this repository styles the demonstration; customize it or
provide your own styles for the same markup.

## Development

```sh
npm install
npm run build
```

Run `npm run watch` to rebuild the distribution files and serve the demo while
developing. Generated files are written to `dist/`.

## License

Available under the [MIT License](LICENSE.md).
