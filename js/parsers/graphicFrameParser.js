"use strict";
//Graphic frame node includes tables, charts and diagrams
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const isEmpty = require("lodash.isempty");
const pptelement_1 = require("../models/pptelement");
const _1 = require("./");
const constants_1 = require("../utils/constants");
class GraphicFrameParser {
}
exports.default = GraphicFrameParser;
GraphicFrameParser.processGraphicFrameNodes = (graphicFrames) => {
    const result = [];
    for (const frame of graphicFrames) {
        const graphicTypeUri = (0, helpers_1.getAttributeByPath)([frame], ["a:graphic", "a:graphicData", "$", "uri"]);
        switch (graphicTypeUri) {
            case constants_1.SCHEMAS_URI.TABLE:
                result.push(frame);
                break;
            case constants_1.SCHEMAS_URI.CHART:
                break;
            case constants_1.SCHEMAS_URI.DIAGRAM:
                break;
            default:
        }
    }
    return result;
};
GraphicFrameParser.getTableDesigns = (table) => {
    const allDesigns = (0, helpers_1.getAttributeByPath)(table, ["a:tblPr", "$"]);
    const tableDesigns = [];
    if (!isEmpty(allDesigns)) {
        for (const supportedDesign of Object.values(pptelement_1.TableDesign)) {
            if (allDesigns[supportedDesign]) {
                tableDesigns.push(supportedDesign);
            }
        }
    }
    return tableDesigns;
};
GraphicFrameParser.extractTableElements = (frame) => {
    const rawTable = (0, helpers_1.getAttributeByPath)([frame], ["a:graphic", "a:graphicData", "a:tbl"], []);
    if (rawTable.length === 0) {
        return null;
    }
    const rawRows = rawTable[0]["a:tr"] ? rawTable[0]["a:tr"] : [];
    //TODO: column width mapping to be done here using rawTable[a:tblGrid]
    const tableRows = rawRows.map((row) => {
        let cols = row["a:tc"] ? row["a:tc"] : [];
        cols = cols.filter((col) => {
            //filtering the columns that are merge columns or merge rows. as we still get them in raw data
            if (col["$"] && (col["$"]["vMerge"] || col["$"]["hMerge"])) {
                return false;
            }
            return true;
        });
        cols = cols.map((col) => {
            const meta = {};
            if (col["$"]) {
                if (col["$"]["rowSpan"]) {
                    meta["rowSpan"] = col["$"]["rowSpan"];
                }
                if (col["$"]["gridSpan"]) {
                    meta["colSpan"] = col["$"]["gridSpan"];
                }
            }
            const paragraphInfo = (0, helpers_1.getValueAtPath)(col, '["a:txBody"][0]["a:p"]');
            let parsedParagraph = _1.ParagraphParser.extractParagraphElements(paragraphInfo, false);
            //edge case to handle the empty cell, without this check it will be sent as { paragraph: { content: [], ....}}
            //and that is considered as line break in our renderer
            if (parsedParagraph.length === 1 && isEmpty(parsedParagraph[0].content)) {
                parsedParagraph = [];
            }
            return {
                paragraph: parsedParagraph,
                meta
            };
        });
        return {
            cols: cols
        };
    });
    return {
        tableDesign: GraphicFrameParser.getTableDesigns(rawTable),
        rows: tableRows
    };
};
