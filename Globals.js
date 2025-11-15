"use strict";

export function deepFreeze(object, frozen = new Set()) {
        if (frozen.has(object)) {
                return;
        }

        frozen.add(Object.freeze(object));
        for (const value in Object.values(object)) {
                deepFreeze(value, frozen);
        }
}