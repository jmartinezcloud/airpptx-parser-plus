"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const _1 = require("./");
const pptelement_1 = require("../models/pptelement");
const isEmpty = require("lodash.isempty");
/**
 * Parse the color of elements
 */
class ColorParser {
    /**
     *
     * @param theme Parsed XML with theme colors
     */
    static setSlideShowTheme(theme) {
        this.slideShowTheme = theme;
    }
    static getShapeFill(element) {
        //spPR takes precdence
        if (isEmpty(element["p:spPr"])) {
            return null;
        }
        const shapeProperties = element["p:spPr"][0];
        const fillType = {
            fillType: pptelement_1.FillType.Solid,
            fillColor: "00FFFFF"
        };
        //spPR[NOFILL] return null
        if (shapeProperties["a:noFill"]) {
            return fillType;
        }
        //Shape fill is an image
        if (shapeProperties["a:blipFill"]) {
            const relId = shapeProperties["a:blipFill"][0]["a:blip"][0]["$"]["r:embed"];
            fillType.fillType = pptelement_1.FillType.Image;
            fillType.fillColor = _1.SlideRelationsParser.getRelationDetails(relId).Uri || "NONE";
            return fillType;
        }
        if (shapeProperties["a:solidFill"]) {
            //determine if it is theme or solid fill
            const solidColor = (0, helpers_1.getValueAtPath)(shapeProperties, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
                // this.getThemeColor(getValueAtPath(shapeProperties, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
                "FFFFFF";
            fillType.fillColor = solidColor;
            return fillType;
        }
        //look at p:style for shape default theme values
        // const shapeStyle = getValueAtPath(element, '["p:style"][0]');
        // fillType.fillColor = this.getThemeColor(getValueAtPath(shapeStyle, '["a:fillRef"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) || "FFFFFF";
        fillType.fillColor = "FFFFFF";
        return fillType;
    }
    static getOpacity(element) {
        //spPR takes precdence
        if (isEmpty(element["p:spPr"])) {
            return null;
        }
        const shapeProperties = element["p:spPr"][0];
        if (shapeProperties["a:solidFill"]) {
            //determine if it is theme or solid fill
            if ((0, helpers_1.checkPath)(shapeProperties, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["a:alpha"][0]["$"]["val"]')) {
                return shapeProperties["a:solidFill"]["0"]["a:srgbClr"]["0"]["a:alpha"][0]["$"]["val"];
            }
            if ((0, helpers_1.checkPath)(shapeProperties, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["a:alpha"][0]["$"]["val"]')) {
                return shapeProperties["a:solidFill"]["0"]["a:schemeClr"]["0"]["a:alpha"][0]["$"]["val"];
            }
        }
        //spPR[NOFILL] return null
        if (shapeProperties["a:noFill"]) {
            return 0;
        }
        return 1;
    }
    static getTextColors(textElement) {
        if ("a:solidFill" in textElement) {
            return ((0, helpers_1.getValueAtPath)(textElement, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
                //commenting this as text colors are not required in our case
                // this.getThemeColor(checkPath(textElement, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
                "000000");
        }
        return "000000";
    }
    static getThemeColor(themeClr) {
        if (!themeClr) {
            return null;
        }
        const colors = this.slideShowTheme["a:theme"]["a:themeElements"][0]["a:clrScheme"][0];
        const targetTheme = "a:" + themeClr;
        if (targetTheme in colors) {
            return colors[targetTheme][0]["a:srgbClr"][0]["$"]["val"];
        }
        return null;
    }
    static determineShapeOpacity(element) { }
}
exports.default = ColorParser;
