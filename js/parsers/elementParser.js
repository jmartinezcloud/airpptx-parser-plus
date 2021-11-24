"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const pptelement_1 = require("../models/pptelement");
const _1 = require("./");
const common_1 = require("../utils/common");
const isEmpty = require("lodash.isempty");
const constants_1 = require("../utils/constants");
const ELEMENTS_ROOT_NODE = {
    [pptelement_1.SpecialityType.Paragraph]: "p:nvSpPr",
    [pptelement_1.SpecialityType.Title]: "p:nvSpPr",
    [pptelement_1.SpecialityType.Image]: "p:nvPicPr",
    [pptelement_1.SpecialityType.Table]: "p:nvGraphicFramePr"
};
/**
 * Entry point for all Parsers
 */
class PowerpointElementParser {
    isNonSupportedPlaceholder() {
        if ((0, helpers_1.checkPath)(this.element, '["p:nvSpPr"][0]["p:nvPr"][0]["p:ph"][0]["$"]["type"]')) {
            const type = (0, helpers_1.getValueAtPath)(this.element, '["p:nvSpPr"][0]["p:nvPr"][0]["p:ph"][0]["$"]["type"]');
            if (constants_1.SUPPORTED_PLACEHOLDERS.includes(type) === false) {
                return true;
            }
        }
        return false;
    }
    isPlaceholderListElement() {
        return (this.slideLayoutSpNode !== undefined &&
            (0, helpers_1.checkPath)(this.slideLayoutSpNode, '["p:txBody"][0]["a:p"][0]["a:pPr"][0]["$"]["lvl"]') &&
            (0, helpers_1.checkPath)(this.slideLayoutSpNode, '["p:txBody"][0]["a:lstStyle"][0]["a:lvl1pPr"][0]["a:buNone"]') === false);
    }
    setLayoutSpNodes(slideLayoutTables, slideMasterTables, nodeName) {
        const idx = (0, helpers_1.getValueAtPath)(this.element, `["${nodeName}"][0]["p:nvPr"][0]["p:ph"][0]["$"]["idx"]`);
        const type = (0, helpers_1.getValueAtPath)(this.element, `["${nodeName}"][0]["p:nvPr"][0]["p:ph"][0]["$"]["type"]`);
        if (type !== undefined) {
            this.slideLayoutSpNode = slideLayoutTables["typeTable"][type];
            this.slideMasterSpNode = slideMasterTables["typeTable"][type];
            return;
        }
        if (idx !== undefined) {
            this.slideLayoutSpNode = slideLayoutTables["idxTable"][idx];
            this.slideMasterSpNode = slideMasterTables["idxTable"][idx];
        }
    }
    getXfrmNodePosition(xfrmNode) {
        const position = (0, helpers_1.getValueAtPath)(xfrmNode, '["a:off"][0]["$"]');
        const offset = (0, helpers_1.getValueAtPath)(xfrmNode, '["a:ext"][0]["$"]');
        return { position, offset };
    }
    getPosition() {
        const xfrmNodePath = '["p:spPr"][0]["a:xfrm"][0]';
        const slideXfrmNode = (0, helpers_1.getValueAtPath)(this.element, xfrmNodePath);
        if (slideXfrmNode) {
            return this.getXfrmNodePosition(slideXfrmNode);
        }
        const slideLayoutXfrmNode = (0, helpers_1.getValueAtPath)(this.slideLayoutSpNode, xfrmNodePath);
        if (slideLayoutXfrmNode) {
            return this.getXfrmNodePosition(slideLayoutXfrmNode);
        }
        const slideMasterXfrmNode = (0, helpers_1.getValueAtPath)(this.slideMasterSpNode, xfrmNodePath);
        if (slideMasterXfrmNode) {
            return this.getXfrmNodePosition(slideMasterXfrmNode);
        }
        return { position: null, offset: null };
    }
    getProcessedElement(rawElement, slideLayoutTables, slideMasterTables, slideRelationships) {
        _1.SlideRelationsParser.setSlideRelations(slideRelationships);
        try {
            if (!rawElement) {
                return null;
            }
            this.element = rawElement;
            const specialityType = _1.ShapeParser.determineSpecialityType(this.element);
            //throwout unsupported content: for example charts, graphs etc
            if (specialityType === pptelement_1.SpecialityType.None) {
                return null;
            }
            const nodeName = ELEMENTS_ROOT_NODE[specialityType];
            this.setLayoutSpNodes(slideLayoutTables, slideMasterTables, nodeName);
            if (this.isNonSupportedPlaceholder()) {
                return null;
            }
            const elementName = this.element[nodeName][0]["p:cNvPr"][0]["$"]["title"] ||
                this.element[nodeName][0]["p:cNvPr"][0]["$"]["name"].replace(/\s/g, "");
            const { position, offset } = this.getPosition();
            let table = null;
            if (specialityType === pptelement_1.SpecialityType.Table) {
                table = _1.GraphicFrameParser.extractTableElements(this.element);
            }
            const elementPresetType = (0, helpers_1.getValueAtPath)(this.element, '["p:spPr"][0]["a:prstGeom"][0]["$"]["prst"]') || "none";
            const paragraphInfo = (0, helpers_1.getValueAtPath)(this.element, '["p:txBody"][0]');
            const isPlaceholderList = this.isPlaceholderListElement();
            let pptElement = {
                name: elementName,
                shapeType: _1.ShapeParser.determineShapeType(elementPresetType),
                specialityType: _1.ShapeParser.determineSpecialityType(this.element),
                elementPosition: {
                    x: position === null || position === void 0 ? void 0 : position.x,
                    y: position === null || position === void 0 ? void 0 : position.y
                },
                elementOffsetPosition: {
                    cx: offset === null || offset === void 0 ? void 0 : offset.cx,
                    cy: offset === null || offset === void 0 ? void 0 : offset.cy
                },
                table: !isEmpty(table) && !isEmpty(table.rows) ? table : null,
                paragraph: _1.ParagraphParser.extractParagraphElements(paragraphInfo, isPlaceholderList),
                shape: _1.ShapeParser.extractShapeElements(this.element),
                links: _1.SlideRelationsParser.resolveShapeHyperlinks(this.element)
            };
            //throwout paragraph elements which are empty e.g shapes with no text
            if (specialityType === pptelement_1.SpecialityType.Paragraph && isEmpty(pptElement.paragraph)) {
                return null;
            }
            pptElement = (0, common_1.cleanupJson)(pptElement);
            return pptElement;
        }
        catch (e) {
            console.warn("ERR could not parse element:", e);
            return null; //skip the element
        }
    }
}
exports.default = PowerpointElementParser;
