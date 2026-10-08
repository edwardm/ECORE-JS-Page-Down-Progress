/* jshint esversion: 6 */

(function () {
    "use strict";

    const sectionSelector = ".ecore-section";
    const titleSelector = ".ecore-title";
    const progressSelector = ".ecore-progress";

    function initializeProgressNavigation() {
        const progress = document.querySelector(progressSelector);
        const navigation = progress && progress.querySelector("nav");
        const progressBackground =
            progress && progress.querySelector(".ecore-progress-bg");

        if (!progress || !navigation || !progressBackground) {
            return;
        }

        const sections = Array.from(document.querySelectorAll(sectionSelector));
        const navigationItems = [];
        const fragment = document.createDocumentFragment();

        sections.forEach(function (section, index) {
            const title = section.querySelector(titleSelector);
            const titleText = title ? title.textContent.trim() : "";
            const label =
                titleText ||
                section.getAttribute("aria-label") ||
                "Section " + (index + 1);

            if (!section.id || document.getElementById(section.id) !== section) {
                let id = "ecore-section-" + (index + 1);
                let suffix = 1;

                while (
                    document.getElementById(id) &&
                    document.getElementById(id) !== section
                ) {
                    suffix += 1;
                    id = "ecore-section-" + (index + 1) + "-" + suffix;
                }

                section.id = id;
            }

            section.setAttribute("data-ecore-section", "ecore-section-" + index);

            const link = document.createElement("a");
            const linkLabel = document.createElement("span");
            link.href = "#" + section.id;
            link.setAttribute("aria-label", label);
            link.setAttribute("data-ecore-section", "ecore-section-" + (index + 1));
            linkLabel.textContent = label;
            link.appendChild(linkLabel);
            fragment.appendChild(link);

            navigationItems.push({
                link: link,
                section: section
            });
        });

        navigation.textContent = "";
        navigation.appendChild(fragment);

        function getScrollRange() {
            const bodyHeight = document.body ? document.body.scrollHeight : 0;
            const pageHeight = Math.max(
                document.documentElement.scrollHeight,
                bodyHeight
            );

            return Math.max(0, pageHeight - window.innerHeight);
        }

        function updateNavigationPositions() {
            const scrollRange = getScrollRange();

            navigationItems.forEach(function (item) {
                const sectionTop =
                    item.section.getBoundingClientRect().top + window.pageYOffset;
                let position = 0;

                if (scrollRange) {
                    position = Math.min(
                        100,
                        Math.max(0, (sectionTop / scrollRange) * 100)
                    );
                }

                item.link.style.top = position + "%";
            });
        }

        function renderProgress() {
            const scrollRange = getScrollRange();
            const scrollOffset = Math.min(
                scrollRange,
                Math.max(0, window.pageYOffset || document.documentElement.scrollTop)
            );
            let progressPercent = 0;

            if (scrollRange) {
                progressPercent = (scrollOffset / scrollRange) * 100;
            }

            progressBackground.style.height = progressPercent + "%";
            progressBackground.setAttribute(
                "aria-valuenow",
                Math.round(progressPercent)
            );
        }

        let scrollFrame = 0;
        function scheduleProgressUpdate() {
            if (scrollFrame) {
                return;
            }

            scrollFrame = window.requestAnimationFrame(function () {
                scrollFrame = 0;
                renderProgress();
            });
        }

        updateNavigationPositions();
        renderProgress();

        window.addEventListener("scroll", scheduleProgressUpdate, {
            passive: true
        });
        window.addEventListener("resize", function () {
            updateNavigationPositions();
            scheduleProgressUpdate();
        });
        window.addEventListener("load", function () {
            updateNavigationPositions();
            scheduleProgressUpdate();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeProgressNavigation
        );
    } else {
        initializeProgressNavigation();
    }
})();
