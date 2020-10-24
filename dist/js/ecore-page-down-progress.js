/*! project-name v0.0.1 | (c) 2020 YOUR NAME | MIT License | http://link-to-your-git-repo.com */
/* jshint esversion: 6 */

let viewportWidth;
let viewportHeight;
let windowHeight;
let windowScrollOffset;
let ecoreProgressBarHeight;
let ecoreSectionsCount;
let ecoreSectionOffsetTop;
let ecoreSectionClass = ".ecore-section";
let ecoreTitleClass = ".ecore-title";
let ecoreProgressClass = ".ecore-progress";
let ecoreProgressBarBg;
let ecoreNavTarget;
let ecoreSectionTitle;

document.addEventListener("DOMContentLoaded", (function () {
    // the main function
    // check for dimensions, placements and scroll listener
    // build out the UI
    function ecoreProgressNav() {
        // detect viewport dimensions
        viewportHeight = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );
        windowHeight = Math.max(document.documentElement.scrollHeight);
        viewportWidth = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
        console.log(
            "viewportHeight: " +
                viewportHeight +
                ", windowHeight: " +
                windowHeight +
                ", viewportWidth: " +
                viewportWidth
        );

        // detect scrolling for the ecoreProgressBar() function
        window.addEventListener("scroll", (function () {
            ecoreProgressBar();
        }));

        // detect progress bar height, if vertical
        ecoreProgressBarHeight = document.querySelector(ecoreProgressClass)
            .offsetHeight;
        console.log("ecoreProgressBarHeight: " + ecoreProgressBarHeight);

        // detect sections count
        ecoreSectionsCount = document.querySelectorAll(".ecore-section").length;
        console.log("ecoreSectionsCount: " + ecoreSectionsCount);

        // apply section indexes
        document
            .querySelectorAll(ecoreSectionClass)
            .forEach((ecoreSection, index) => {
                ecoreSection.setAttribute(
                    "data-ecore-section",
                    "ecore-section-" + index
                );
            });

        // nav anchor building
        const sectionArray = document.querySelectorAll(".ecore-section");
        for (const [i, el] of sectionArray.entries()) {
            // console.log(i, el);

            // build the anchor
            ecoreNavTarget = document.querySelector(
                ecoreProgressClass + " > nav"
            );
            ecoreNavTarget.append(document.createElement("a"));

            // get the section title
            ecoreSectionTitle = el.querySelector(ecoreTitleClass).innerHTML;

            // get the section y offset
            ecoreSectionOffsetTop = el.offsetTop;
            console.log(
                "data-ecore-section-" +
                    [i + 1] +
                    " top offset: " +
                    ecoreSectionOffsetTop
            );

            // call the build nav function, passing index and selector
            // apply anchor attributes and inline css
            ecoreBuildNav(
                i,
                document.querySelectorAll(
                    ".ecore-progress > nav > a:nth-child(" + [i + 1] + ")"
                )
            );
        }
    }
    ecoreProgressNav();

    // apply progress bar bg, on it's own since it
    // needs to be called on resize and scroll events
    function ecoreProgressBar() {
        windowScrollOffset =
            window.pageYOffset ||
            (
                document.documentElement ||
                document.body.parentNode ||
                document.body
            ).scrollTop;
        // console.log("windowScrollOffset: " + windowScrollOffset);

        ecoreProgressBarBg = document.querySelector(".ecore-progress-bg");
        ecoreProgressBarBg.style.height =
            windowScrollOffset / windowHeight / Math.pow(10, -2) + 4 + "%";
    }
    ecoreProgressBar();

    // build the nav, pass index and target element
    function ecoreBuildNav(i, el) {
        el.forEach((ecoreProgressAnchor) => {
            ecoreProgressAnchor.setAttribute(
                "data-ecore-section",
                "ecore-section-" + [i + 1]
            );
            ecoreProgressAnchor.setAttribute(
                "aria-label",
                ecoreSectionTitle
                // "ecore-section-" + [i + 1] // TO-DO set actual title
            );
            ecoreProgressAnchor.setAttribute(
                "data-offset",
                ecoreSectionOffsetTop
            );
            ecoreProgressAnchor.innerHTML =
                "<span>" + ecoreSectionTitle + "</span>";
            ecoreProgressAnchor.style.top =
                ecoreSectionOffsetTop / windowHeight / Math.pow(10, -2) + "%"; // Math.pow to move the decimal point
            ecoreProgressAnchor.addEventListener("click", (e) => {
                console.log(
                    ecoreProgressAnchor.getAttribute("data-ecore-section"),
                    ecoreProgressAnchor.getAttribute("data-offset")
                );
                window.scrollTo({
                    top: ecoreProgressAnchor.getAttribute("data-offset") - 150,
                    behavior: "smooth",
                });
            });
        });
    }

    // recalculation needed for the progress bar UI
    window.addEventListener("resize", (function () {
        ecoreProgressNav();
        ecoreProgressBar();
    }));
}));
