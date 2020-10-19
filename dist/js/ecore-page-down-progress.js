/*! project-name v0.0.1 | (c) 2020 YOUR NAME | MIT License | http://link-to-your-git-repo.com */
let viewportHeight;
let viewportWidth;
let ecoreSectionClass = ".ecore-section";
let ecoreTitleClass = ".ecore-title";
let ecoreProgressBarHeight;
let ecoreSectionsCount;

// check for dimensions and placements
function ecoreDetections() {
    viewportHeight = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );
    viewportWidth = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    ecoreProgressBarHeight = document.querySelector(".ecore-progress")
        .offsetHeight;
    console.log(
        "viewportHeight: " +
            viewportHeight +
            ", viewportWidth: " +
            viewportWidth
    );
    console.log("ecoreProgressBarHeight: " + ecoreProgressBarHeight);
    ecoreSectionsCount = document.querySelectorAll(".ecore-section").length;
    console.log("ecoreSectionsCount: " + ecoreSectionsCount);
    document
        .querySelectorAll(ecoreSectionClass)
        .forEach((ecoreSection, index) => {
            ecoreSection.classList.add("ecore-section-" + index);
        });

    // build the nav
}
ecoreDetections();

window.addEventListener("resize", (function () {
    ecoreDetections();
}));

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
