/* jshint esversion: 6 */

let viewportHeight;
let viewportWidth;
let ecoreProgressBarHeight;
let ecoreSectionsCount;
let ecoreSectionClass = ".ecore-section";
let ecoreTitleClass = ".ecore-title";
let ecoreProgressClass = ".ecore-progress";

// check for dimensions and placements
function ecoreDetections() {
    // detect viewport dimensions
    viewportHeight = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );
    viewportWidth = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    console.log(
        "viewportHeight: " +
            viewportHeight +
            ", viewportWidth: " +
            viewportWidth
    );

    // detect progress bar height, if vertical
    ecoreProgressBarHeight = document.querySelector(".ecore-progress")
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

    // build the nav
    const sectionArray = document.querySelectorAll(".ecore-section");
    for (const [i, el] of sectionArray.entries()) {
        console.log(i, el);

        let navAnchor = document
            .querySelector(ecoreProgressClass)
            .append(document.createElement("a"));
        // console.log(navAnchor);

        // navAnchor.setAttribute("data-target", "ecore-section-" + i);

        // document
        //     // .querySelector(
        //     //     ecoreProgressClass + " > a:nth-child(" + (i + 1) + ")"
        //     // )
        //     .querySelector(ecoreProgressClass)
        //     .setAttribute("data-target", "ecore-section-" + i);
    }
}
ecoreDetections();

// recalculation needed for the progress bar UI
window.addEventListener("resize", function () {
    ecoreDetections();
});

// function ecoreProgressNav()
// - detect sections
// - count sections
// - append index -count to each class
// - build out anchor html
// --- data-target="ecore-section-0"
// --- title="GRAB HTML FROM TITLE CLASS"
// --- aria-label="GRAB HTML FROM TITLE CLASS"

// declare vars

// iterate through sections
// - get count
// - get title
// - build nav child nodes

// set nav action items
// - on click, go to section
// - on hover, show title

// toggle tooltip
// - on hover, show tooltip/pseudo element
// - should show title value
