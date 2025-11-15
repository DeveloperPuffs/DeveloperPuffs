"use strict";

import * as Router from "./Router.js";
import * as Account from "./Account.js";

await Router.setup();
await Account.loadUser();