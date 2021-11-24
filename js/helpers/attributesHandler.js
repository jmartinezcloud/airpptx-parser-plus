"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeByPath = void 0;
const getAttributeByPath = (slideAttributes, pathArray, returnValue = undefined) => {
    if (pathArray.length === 0) {
        return returnValue;
    }
    if (slideAttributes === undefined) {
        return returnValue;
    }
    for (const node of pathArray) {
        if (Array.isArray(slideAttributes)) {
            slideAttributes = slideAttributes[0];
        }
        slideAttributes = slideAttributes[node];
        if (slideAttributes === undefined) {
            return returnValue;
        }
    }
    if (Array.isArray(returnValue)) {
        return Array.isArray(slideAttributes) ? slideAttributes : [];
    }
    return slideAttributes;
};
exports.getAttributeByPath = getAttributeByPath;
