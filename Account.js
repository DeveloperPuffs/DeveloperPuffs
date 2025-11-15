"use strict";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as Router from "./Router.js";
import { DOM } from "./Elements.js"

const supabaseUrl = "https://sawnjidfgqwlcmbmvtpw.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhd25qaWRmZ3F3bGNtYm12dHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODQyMzQsImV4cCI6MjA3ODQ2MDIzNH0.BnK1nTWOIHXaMB1vXI3hgx8kCW_xrTnnsbz1Mqrd6ag"
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;
function updateUserState(user = null) {
        currentUser = user;

        if (currentUser === null) {
                alert("You are now signed out");
                return;
        }

        alert(`You are signed in as \"${currentUser}\"`);
}

export async function loadUser() {
        const userQuery = await supabase.auth.getUser();
        if (userQuery.error !== null) {
                alert(`Authentication error ${userQuery.error.status}: ${userQuery.error.message}`);
                updateUserState();
                return;
        }

        updateUserState(userQuery.data);
}

function displaySection(section) {
        DOM.page.account.details.section.hidden = true;
        DOM.page.account.signIn.section.hidden = true;
        DOM.page.account.signUp.section.hidden = true;
        section.hidden = false;
};

Router.registerPageCallback(Router.pagePaths.account, () => {
        DOM.page.account.details.signOutButton.addEventListener("click", async () => {
                await supabase.auth.signOut();
                updateUserState();

                Router.loadPage(Router.pagePaths.home);
        });

        DOM.page.account.signIn.signInButton.addEventListener("click", async () => {
                const signInRequest = await supabase.auth.signInWithPassword({
                        email: DOM.page.account.signIn.emailInput.value,
                        password: DOM.page.account.signIn.passwordInput.value
                });

                if (signInRequest.error !== null) {
                        alert(`Authentication error ${signInRequest.error.status}: ${signInRequest.error.message}`);
                        return;
                }

                updateUserState(signInRequest.data);
        });

        DOM.page.account.signIn.signUpLink.addEventListener("click", () => {
                displaySection(DOM.page.account.signUp.section);
        });

        DOM.page.account.signUp.signUpButton.addEventListener("click", async () => {
                console.log("signup button clicked");

                const signUpRequest = await supabase.auth.signUp({
                        email: DOM.page.account.signUp.emailInput.value,
                        password: DOM.page.account.signUp.passwordInput.value
                });

                if (signUpRequest.error !== null) {
                        alert(`Authentication error ${signUpRequest.error.status}: ${signUpRequest.error.message}`);
                        return;
                }

                updateUserState(signUpRequest.data);
        });

        if (currentUser === null) {
                displaySection(DOM.page.account.signIn.section);
                return;
        }

        displaySection(DOM.page.account.details.section);
});