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

// check for dimensions and placements
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

    // detect vertical scrolling progress
    window.addEventListener(
        "scroll",
        (function () {
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
        }),
        false
    );

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
            // ecoreSection.classList.add("ecore-section-" + index);
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
        ecoreNavTarget = document.querySelector(ecoreProgressClass + " > nav");
        ecoreNavTarget.append(document.createElement("a"));

        // get the section title
        let sectionTitle = el.querySelector(ecoreTitleClass).innerHTML;

        // get the section y offset
        ecoreSectionOffsetTop = el.offsetTop;
        console.log(
            "data-ecore-section-" +
                [i + 1] +
                " top offset: " +
                ecoreSectionOffsetTop
        );

        // nav anchor setting attributes and inline css
        document
            .querySelectorAll(
                ".ecore-progress > nav > a:nth-child(" + [i + 1] + ")"
            )
            .forEach((ecoreProgressAnchor) => {
                ecoreProgressAnchor.setAttribute(
                    "data-ecore-section",
                    "ecore-section-" + [i + 1]
                );
                ecoreProgressAnchor.setAttribute(
                    "aria-label",
                    sectionTitle
                    // "ecore-section-" + [i + 1] // TO-DO set actual title
                );
                ecoreProgressAnchor.setAttribute(
                    "data-offset",
                    ecoreSectionOffsetTop
                );
                ecoreProgressAnchor.innerHTML =
                    "<span>" + sectionTitle + "</span>";
                ecoreProgressAnchor.style.top =
                    ecoreSectionOffsetTop / windowHeight / Math.pow(10, -2) +
                    "%"; // Math.pow to move the decimal point
                ecoreProgressAnchor.addEventListener("click", (e) => {
                    console.log(
                        ecoreProgressAnchor.getAttribute("data-ecore-section"),
                        ecoreProgressAnchor.getAttribute("data-offset")
                    );
                    window.scrollTo({
                        top:
                            ecoreProgressAnchor.getAttribute("data-offset") -
                            150,
                        behavior: "smooth",
                    });
                });
            });
    }
}
ecoreProgressNav();

// recalculation needed for the progress bar UI
// specifically viewport and document dimensions
// as well as inline styling for the nav
window.addEventListener("resize", (function () {
    // ecoreNavTarget = document.querySelectorAll(
    //     ecoreProgressClass + " > nav > a"
    // );
    // ecoreNavTarget.parentNode.removeChild(ecoreNavTarget);
    ecoreProgressNav();
}));
