console.log('ecore-page-down-progress file loaded');

// heck for dimensions and placements
const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

// declare vars
// to-do, re-evaluate on window resize
let ecoreProgressBarHeight = document.querySelector(".ecore-progress").offsetHeight;
console.log(ecoreProgressBarHeight);

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