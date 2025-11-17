"use strict";

import { deepFreeze } from "./Globals.js";

const missingElements = new Set();

function findElement(selector) {
        const element = document.querySelector(selector);
        if (element === null) {
                if (missingElements.has(selector)) {
                        return;
                }

                console.error(`Element not found: ${selector}`);
                missingElements.add(selector);
        }

        return element;
}

// This turns each property with a selector string into a getter function for dynamically
// get the element when the property is accessed. A functions is needed to support nested
// objects.
function applyElementGetters(object) {
        for (const [key, value] of Object.entries(object)) {
                if (typeof value === "string") {
                        Object.defineProperty(object, key, {
                                get() {
                                        return findElement(value);
                                }
                        });

                        continue;
                } 

                if (typeof value === "object" && value !== null) {
                        applyElementGetters(value);
                        continue;
                }
        }
}

export const DOM = {
        header: {
                profileIcon: "#profile-icon",
                defaultIcon: "#default-icon"
        },
        home: {
                section: "#home-section",
        },
        void: {
                section: "#void-section",
                pathField: "#void-path-field",
                detailsField: "#void-details-field",
                retryButton: "#void-retry-button"
        },
        page: {
                section: "#page-section",
                account: {
                        profile: {
                                section: "#profile-section",
                                profilePicture: "#profile-picture",
                                usernameField: "#username-field",
                                emailField: "#email-field",
                                emailStatusField: "#email-status-field",
                                memberSinceField: "#member-since-field",
                                lastLoginField: "#last-login-field",
                                signOutButton: "#sign-out-button"
                        },
                        profileSetup: {
                                section: "#profile-setup-section",
                                usernameInput: "#username-input",
                                createProfileButton: "#create-profile-button"
                        },
                        profileError: {
                                section: "#profile-error-section",
                                retryLoadButton: "retry-load-button"
                        },
                        signIn: {
                                section: "#sign-in-section",
                                emailInput: "#sign-in-email-input",
                                passwordInput: "#sign-in-password-input",
                                signInButton: "#sign-in-button",
                                signUpLink: "#sign-up-link"
                        },
                        signUp: {
                                section: "#sign-up-section",
                                emailInput: "#sign-up-email-input",
                                passwordInput: "#sign-up-password-input",
                                signUpButton: "#sign-up-button",
                                signInLink: "#sign-in-link"
                        }
                }
        }
};

applyElementGetters(DOM);
deepFreeze(DOM);