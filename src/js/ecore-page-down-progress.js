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

    // nav anchor building
    const sectionArray = document.querySelectorAll(".ecore-section");
    for (const [i, el] of sectionArray.entries()) {
        console.log(i, el);

        let navTarget = document.querySelector(ecoreProgressClass);
        let navAnchor = navTarget.append(document.createElement("a"));
    }

    // nav anchor attribute setting
    document
        .querySelectorAll(ecoreProgressClass + " > a")
        .forEach((ecoreProgressAnchor, index) => {
            // ecoreSection.classList.add("ecore-section-" + index);
            ecoreProgressAnchor.setAttribute(
                "data-ecore-section",
                "ecore-section-" + index
            );
            ecoreProgressAnchor.setAttribute(
                "aria-label",
                "ecore-section-" + index
            );
            ecoreProgressAnchor.innerHTML =
                "<span>ecore-section-" + index + "</span>"; // TO-DO dynamically fill this value from title
            ecoreProgressAnchor.style.top = "100px"; // TO-DO dynamically fill this value
        });
}
ecoreDetections();

// recalculation needed for the progress bar UI
window.addEventListener("resize", function () {
    ecoreDetections();
});

// NOTES ===================================

// function ecoreProgressNav()
// - detect sections
// - count sections
// - append index -count to each class
// - build out anchor html
// --- data-target="ecore-section-0"
// --- title="GRAB HTML FROM TITLE CLASS"
// --- aria-label="GRAB HTML FROM TITLE CLASS"

// =========================================

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
