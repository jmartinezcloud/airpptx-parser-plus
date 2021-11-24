"use strict";
/**
 *
 * Important function that allows for undefined objects that maybe nested deeper and missing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPath = exports.getValueAtPath = void 0;
const get = require("lodash.get");
const has = require("lodash.has");
function getValueAtPath(obj, path) {
    return get(obj, path);
}
exports.getValueAtPath = getValueAtPath;
function checkPath(obj, path) {
    return has(obj, path);
}
exports.checkPath = checkPath;
