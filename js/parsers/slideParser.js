"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const format = require("string-template");
const constants_1 = require("../utils/constants");
const helpers_1 = require("../helpers");
const _1 = require("./");
class SlideParser {
    static getSlideLayout(slideRelations, pptFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Read relationship filename of the slide (Get slideLayoutXX.xml)
            // @sldFileName: ppt/slides/slide1.xml
            // @resName: ppt/slides/_rels/slide1.xml.rels
            let relationshipArray = slideRelations["Relationships"]["Relationship"];
            let layoutFilename = "";
            if (Array.isArray(relationshipArray)) {
                for (const relationship of relationshipArray) {
                    if (relationship["$"]["Type"] === constants_1.SCHEMAS_URI.SLIDE_LAYOUT) {
                        layoutFilename = relationship["$"]["Target"].replace("../", "ppt/");
                        break;
                    }
                }
            }
            else {
                layoutFilename = relationshipArray["$"]["Target"].replace("../", "ppt/");
            }
            // Open slideLayoutXX.xml
            const slideLayoutContent = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, layoutFilename));
            // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
            // @resName: ppt/slideLayouts/slideLayout1.xml
            // @masterName: ppt/slideLayouts/_rels/slideLayout1.xml.rels
            const slideLayoutResFilename = layoutFilename.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
            const slideLayoutResContent = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, slideLayoutResFilename));
            relationshipArray = slideLayoutResContent["Relationships"]["Relationship"];
            let masterFilename = "";
            if (Array.isArray(relationshipArray)) {
                for (const relationship of relationshipArray) {
                    if (relationship["$"]["Type"] === constants_1.SCHEMAS_URI.SLIDE_MASTER) {
                        masterFilename = relationship["$"]["Target"].replace("../", "ppt/");
                        break;
                    }
                }
            }
            else {
                masterFilename = relationshipArray["$"]["Target"].replace("../", "ppt/");
            }
            // Open slideMasterXX.xml
            const slideMasterContent = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, masterFilename));
            return {
                slideLayoutTables: this.indexNodes(slideLayoutContent),
                slideMasterTables: this.indexNodes(slideMasterContent)
            };
        });
    }
    static indexNodes(content) {
        try {
            const keys = Object.keys(content);
            const spTreeNode = content[keys[0]]["p:cSld"][0]["p:spTree"][0];
            const idTable = {};
            const idxTable = {};
            const typeTable = {};
            for (const key in spTreeNode) {
                if (key !== "p:sp") {
                    continue;
                }
                var targetNode = spTreeNode[key];
                if (Array.isArray(targetNode)) {
                    for (const node of targetNode) {
                        const nvSpPrNode = node["p:nvSpPr"];
                        const id = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:cNvPr", "$", "id"]);
                        const idx = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:nvPr", "p:ph", "$", "idx"]);
                        const type = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:nvPr", "p:ph", "$", "type"]);
                        if (id !== undefined) {
                            idTable[id] = node;
                        }
                        if (idx !== undefined) {
                            idxTable[idx] = node;
                        }
                        if (type !== undefined) {
                            typeTable[type] = node;
                        }
                    }
                }
                else {
                    const nvSpPrNode = targetNode["p:nvSpPr"];
                    const id = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:cNvPr", "$", "id"]);
                    const idx = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:nvPr", "p:ph", "$", "idx"]);
                    const type = (0, helpers_1.getAttributeByPath)(nvSpPrNode, ["p:nvPr", "p:ph", "$", "type"]);
                    if (id !== undefined) {
                        idTable[id] = targetNode;
                    }
                    if (idx !== undefined) {
                        idxTable[idx] = targetNode;
                    }
                    if (type !== undefined) {
                        typeTable[type] = targetNode;
                    }
                }
            }
            return { idTable: idTable, idxTable: idxTable, typeTable: typeTable };
        }
        catch (err) {
            console.warn("Error indexing the layout nodes: ", err);
        }
    }
    static getGroupedNodes(rootGroupNode, groupCount = 0, groupedShapes = [], groupedImages = []) {
        groupCount++;
        if (rootGroupNode["p:sp"]) {
            groupedShapes.push(...rootGroupNode["p:sp"]);
        }
        if (rootGroupNode["p:pic"]) {
            groupedImages.push(...rootGroupNode["p:pic"]);
        }
        const subGroups = rootGroupNode["p:grpSp"];
        if (subGroups && Array.isArray(subGroups) && groupCount <= constants_1.GROUPS_LIMIT) {
            subGroups.forEach((subGroup) => {
                this.getGroupedNodes(subGroup, groupCount, groupedShapes, groupedImages);
            });
        }
        return { groupedShapes, groupedImages };
    }
    static getSlideElements(PPTElementParser, slideNumber, pptFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Get all of Slide Shapes and Elements
                const slideAttributes = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, format("ppt/slides/slide{0}.xml", slideNumber)));
                //Contains references to links,images, audios, videos etc on a Slide
                const slideRelations = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, format("ppt/slides/_rels/slide{0}.xml.rels", slideNumber)));
                const { slideMasterTables, slideLayoutTables } = yield this.getSlideLayout(slideRelations, pptFilePath);
                const slideData = slideAttributes["p:sld"]["p:cSld"];
                const slideShapes = (0, helpers_1.getAttributeByPath)(slideData, ["p:spTree", "p:sp"], []);
                const slideImages = (0, helpers_1.getAttributeByPath)(slideData, ["p:spTree", "p:pic"], []);
                const graphicFrames = (0, helpers_1.getAttributeByPath)(slideData, ["p:spTree", "p:graphicFrame"], []);
                const groupedContent = (0, helpers_1.getAttributeByPath)(slideData, ["p:spTree", "p:grpSp"], []);
                groupedContent.forEach((group) => {
                    const { groupedShapes, groupedImages } = this.getGroupedNodes(group);
                    slideShapes.push(...groupedShapes);
                    slideImages.push(...groupedImages);
                });
                const slideTables = _1.GraphicFrameParser.processGraphicFrameNodes(graphicFrames);
                const allSlideElements = [...slideShapes, ...slideImages, ...slideTables];
                const allParsedSlideElements = [];
                for (const slideElement of allSlideElements) {
                    const pptElement = PPTElementParser.getProcessedElement(slideElement, slideLayoutTables, slideMasterTables, slideRelations);
                    //throwout any undrenderable content
                    if (pptElement) {
                        allParsedSlideElements.push(pptElement);
                    }
                }
                return allParsedSlideElements;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SlideParser;
