# ECORE-JS-Page-Down-Progress

## Summary

This vanilla JS plug-in shows a navigation element that also acts as a progression bar as you scroll through the page. The UI consists of two main items: The navigation, which contains marker links to different parts of the page, and the progression bar, which grows as you scroll through the page. This UI plugin can be helpful for lengthy pages that contain many sections of content, such as those found in documentation websites.

The nav element has two flavors of styling: attached to the top of the page, or fixed to the right of the windows, although applying proper styling techniques can override these settings to come up with more innovative ways of presentation.

## What's so special?

The navigation and progress elements will automatically build itself out. Meaning the user just needs to define the "sections" via the unique class selector, and the JS will detect these objects, calculate measurements, build DOM elements and construct the UI on it's own.

And of course, the user can style the look and placement of the bar as needed. These can be a helpful tool for documentation websites, or any pages containing many chapters/sections.

## Getting Started

```
$ git clone https://github.com/edwardm/ECORE-JS-Page-Down-Progress.git
```

```npm
$ npm install
```

## Notes

-   TO-DO: Bug when window resizes, on of the anchors loses offset positioning
-   TO-DO: This plug-in can show the navigation progress bar in either horizontal or vertical format.
-   TO-DO: Better tooltip support for the navigation links, may incorporate Boostrap tooltip with Popper JS for viewport edge detection and placement

## License

The code is available under the [MIT License](LICENSE.md).
