"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const pptelement_1 = require("../models/pptelement");
/**
 * Parses XML that deals with lines for shapes
 */
class LineParser {
    static extractLineElements(element) {
        if (!element["p:spPr"]) {
            return null;
        }
        let shapeProperties = element["p:spPr"][0];
        if (!shapeProperties["a:ln"] || shapeProperties["a:ln"][0]["a:noFill"]) {
            return null;
        }
        let lineElement = {
            color: this.getLineColor(shapeProperties),
            thickness: this.getLineWeight(shapeProperties),
            type: this.determineBorderType(shapeProperties)
        };
        return lineElement;
    }
    static determineBorderType(shapeProperties) {
        let lineProperties = shapeProperties["a:ln"][0];
        if (lineProperties["a:noFill"]) {
            return null;
        }
        let dashType = (0, helpers_1.getValueAtPath)(lineProperties, '["a:prstDash"][0]["$"]["val"]') || "default";
        switch (dashType) {
            case "solid":
                return pptelement_1.BorderType.solid;
            case "dot":
                return pptelement_1.BorderType.dotted;
            case "dash":
                return pptelement_1.BorderType.dashed;
            default:
                return pptelement_1.BorderType.solid;
        }
    }
    static getLineWeight(shapeProperties) {
        let lineProperties = shapeProperties["a:ln"][0];
        if (lineProperties["a:noFill"]) {
            return null;
        }
        return (0, helpers_1.getValueAtPath)(lineProperties, '["$"]["w"]') || 1000;
    }
    static getLineColor(shapeProperties) {
        let lineProperties = shapeProperties["a:ln"][0];
        //spPR[NOFILL] return null
        if (lineProperties["a:noFill"]) {
            return null;
        }
        return ((0, helpers_1.getValueAtPath)(lineProperties, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
            // ColorParser.getThemeColor(getValueAtPath(lineProperties, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
            "000000");
    }
}
exports.default = LineParser;
