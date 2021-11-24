"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const _1 = require("./");
const pptelement_1 = require("../models/pptelement");
/**
 * Parse the shape types and etc.
 */
class ShapeParser {
    static determineShapeType(prst) {
        //return the preset ppt shape type
        return prst;
    }
    static determineSpecialityType(element) {
        if (element["p:nvPicPr"]) {
            return pptelement_1.SpecialityType.Image;
        }
        if (_1.ParagraphParser.isTitle(element)) {
            return pptelement_1.SpecialityType.Title;
        }
        if ((0, helpers_1.checkPath)(element, '["p:txBody"][0]["a:p"]')) {
            return pptelement_1.SpecialityType.Paragraph;
        }
        if ((0, helpers_1.checkPath)(element, '["a:graphic"][0]["a:graphicData"][0]["a:tbl"]')) {
            return pptelement_1.SpecialityType.Table;
        }
        return pptelement_1.SpecialityType.None;
    }
    static extractShapeElements(element) {
        return {
            fill: _1.ColorParser.getShapeFill(element),
            border: _1.LineParser.extractLineElements(element),
            opacity: _1.ColorParser.getOpacity(element)
        };
    }
}
exports.default = ShapeParser;
