"use strict";

import * as Backend from "./Backend.js";
import * as Router from "./Router.js";
import { DOM } from "./Elements.js";

function displaySection(section) {
        DOM.page.account.profile.section.hidden = true;
        DOM.page.account.profileSetup.section.hidden = true;
        DOM.page.account.profileError.section.hidden = true;
        DOM.page.account.signIn.section.hidden = true;
        DOM.page.account.signUp.section.hidden = true;
        section.hidden = false;
};

function populateProfileDetails() {
        const account = Backend.getCurrentAccount();
        // get profile too

        DOM.page.account.profile.usernameField.textContent = account.user_metadata.username || "[No Username]";
        DOM.page.account.profile.emailField.textContent = account.email;
        DOM.page.account.profile.emailStatusField.textContent = account.email_confirmed_at ? "Verified" : "Pending";
        DOM.page.account.profile.memberSinceField.textContent = new Date(account.created_at).toLocaleString();
        DOM.page.account.profile.lastLoginField.textContent = new Date(account.last_sign_in_at).toLocaleString();
}

async function backendEventCallback(event) {
        if (event === Backend.Event.SIGNED_IN) {
                const profile = Backend.getAccountProfile();
                if (profile === null) {
                        displaySection(DOM.page.account.profileSetup.section);
                        return;
                }

                if (profile === Backend.PROFILE_LOAD_ERROR) {
                        displaySection(DOM.page.account.profileError.section);
                        return;
                }

                displaySection(DOM.page.account.details.section);
                populateProfileDetails();
                return;
        }

        if (event === Backend.Event.SIGNED_OUT) {
                await Router.loadPage(Router.pages.home);
                alert("You are now signed out.");
                return;
        }
}

function setupPageElements() {
        DOM.page.account.profileError.retryLoadButton.addEventListener("click", async () => {
                // TODO: Retry
        });

        DOM.page.account.details.signOutButton.addEventListener("click", async () => {
                await Backend.signOut();
        });

        DOM.page.account.signIn.signInButton.addEventListener("click", async () => {
                const email = DOM.page.account.signIn.emailInput.value;
                const password = DOM.page.account.signIn.passwordInput.value;
                if (!(await Backend.signIn(email, password))) {
                        // Show a messsage saying that the sign in failed 
                }
        });

        DOM.page.account.signIn.signUpLink.addEventListener("click", () => {
                displaySection(DOM.page.account.signUp.section);
        });

        DOM.page.account.signUp.signUpButton.addEventListener("click", async () => {
                const email = DOM.page.account.signUp.emailInput.value;
                const password = DOM.page.account.signUp.passwordInput.value;
                if (!(await Backend.signUp(email, password))) {
                        // Show a message saying that the sign up failed
                }
        });

        DOM.page.account.signUp.signInLink.addEventListener("click", () => {
                displaySection(DOM.page.account.signIn.section);
        });
}

export function setup() {
        /*
        Backend.onAuthenticationStateChange(async (account, profile) => {
                if (!accountPageActive) {
                        return;
                }

                if (account === null) {
                        await Router.loadPage(Router.pages.home);
                        alert("You are now signed out.");
                        return;
                }

                if (profile === null) {
                        displaySection(DOM.page.account.profileSetup.section);
                        return;
                }

                if (profile === Backend.PROFILE_LOAD_ERROR) {
                        displaySection(DOM.page.account.profileError.section);
                        return;
                }

                displaySection(DOM.page.account.profile.section);
                populateProfileDetails(account, profile);
        });
        */

        Router.onPageLoad(page => {
                if (page !== Router.pages.account) {
                        Backend.removeCallback(backendEventCallback);
                        return;
                }

                Backend.registerCallback(backendEventCallback);

                setupPageElements();

                const account = Backend.getCurrentAccount();
                if (account === null) {
                        displaySection(DOM.page.account.signIn.section);
                        return;
                }

                const profile = Backend.getAccountProfile();
                if (profile === null) {
                        displaySection(DOM.page.account.profileSetup.section);
                        return;
                }

                if (profile === Backend.PROFILE_LOAD_ERROR) {
                        displaySection(DOM.page.account.profileError.section);
                        return;
                }

                displaySection(DOM.page.account.details.section);
                populateProfileDetails();
        });
}