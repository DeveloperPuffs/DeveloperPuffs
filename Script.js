"use strict";

import * as Router from "./Router.js";
import * as Backend from "./Backend.js";
import * as Account from "./Account.js";
import { DOM } from "./Elements.js";

await Router.setup();

DOM.void.retryButton.addEventListener("click", async () => {
        await Router.loadPath();
});

Account.setup();

Backend.registerCallback(event => {
        if (event === Backend.Event.PROFILE_LOADED) {
                // Set profile picture icon
                return;
        }

        if (event === Backend.Event.SIGNED_OUT) {
                // Set profile picture icon
                return;
        }
});

await Backend.loadAccount();