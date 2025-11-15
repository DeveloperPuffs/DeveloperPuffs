"use strict";

import { deepFreeze } from "./Globals.js";
import { DOM } from "./Elements.js";

function displayError(path, details = null) {
        DOM.void.pathField.textContent = path;
        DOM.void.detailsField.textContent = details ?? "Unknown error.";
}

function displaySection(section) {
        DOM.home.section.hidden = true;
        DOM.page.section.hidden = true;
        DOM.void.section.hidden = true;
        section.hidden = false;
};

export const pagePaths = {
        home: "/",
        account: "/account",
        sokobee: "/sokobee"
};

deepFreeze(pagePaths);

const pageFiles = {
        [pagePaths.account]: "Account.html",
        [pagePaths.sokobee]: "Sokobee.html"
};

deepFreeze(pageFiles);

const pageCallbacks = {};

export function registerPageCallback(path, callback) {
        if (pageCallbacks[path] === undefined) {
                pageCallbacks[path] = [];
        }

        pageCallbacks[path].push(callback);
}

export function removePageCallback(callback) {
        for (const [path, callbacks] in Object.entries(pageCallbacks)) {
                pageCallbacks[path] = callbacks.filter(pageCallback => pageCallback !== callback);
        }
}

export async function loadPage(path = window.location.pathname) {
        // The path is "/Index.html" when running locally (during development) but I also need to
        // include "/" since static servers treat "/Index.html" as the default page (or "/") in a
        // directory.
        if (path === "/" || path.endsWith("/Index.html")) {
                displaySection(DOM.home.section);
                return;
        }

        const pageFile = pageFiles[path];
        if (pageFile === undefined) {
                displaySection(DOM.void.section);
                displayError(path, "Path is not recognized or does not correspond to any existing page.");
                return;
        }

        try {
                const response = await fetch(pageFile);
                if (response.ok === false) {
                        displaySection(DOM.void.section);
                        displayError(path, `${response.status} ${response.statusText}`);
                        return;
                }

                displaySection(DOM.page.section);
                DOM.page.section.innerHTML = await response.text();
        } catch (error) {
                displaySection(DOM.void.section);
                displayError(path, `Navigation error: ${error}`);
                return;
        }

        const callbacks = pageCallbacks[path];
        if (callbacks !== undefined) {
                for (const callback of callbacks) {
                        callback();
                }
        }
}

export async function setup() {
        // When a navigation link is clicked, the behavior is overriden to correctly use the browser's
        // history API to change the page.
        document.addEventListener("click", async event => {
                const link = event.target.closest("[data-navigation-link]");
                if (link === null) {
                        return;
                }

                event.preventDefault();

                const path = link.getAttribute("href");
                history.pushState({}, "", path);
                await loadPage(path);
        });

        // Update the state of the page for when the forward or back buttons are pressed.
        window.addEventListener("popstate", async () => {
                await loadPage(window.location.pathname);
        });

        // The 404 fallback script adds a query parameter before redirecting to this page to keep track of
        // the current page (when reloading on github pages). If the paramter contains a value, this will
        // set the state correctly with the history API.
        const searchParameters = new URLSearchParams(window.location.search);
        if (searchParameters.has("redirect")) {
                const redirectPath = searchParameters.get("redirect");
                history.replaceState({}, "", redirectPath);
        }

        // Load the home page initially to finish setting up
        await loadPage();
}