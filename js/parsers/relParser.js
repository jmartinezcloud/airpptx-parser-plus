"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const pptelement_1 = require("../models/pptelement");
/**
 * Parse everything that deals with relations such as hyperlinks and local images
 */
class SlideRelationsParser {
    /**
     *
     * @param theme Parsed XML with theme colors
     */
    static setSlideRelations(rels) {
        this.slideRels = rels;
    }
    static resolveShapeHyperlinks(element) {
        const relID = (0, helpers_1.getValueAtPath)(element, '["p:blipFill"][0]["a:blip"][0]["$"]["r:embed"]');
        if (!relID) {
            return null;
        }
        return this.getRelationDetails(relID);
    }
    static resolveParagraphHyperlink(element) {
        const relID = (0, helpers_1.getValueAtPath)(element, '["a:rPr"][0]["a:hlinkClick"][0]["$"]["r:id"]');
        if (!relID) {
            return null;
        }
        return this.getRelationDetails(relID);
    }
    static getRelationDetails(relID) {
        const relations = this.slideRels["Relationships"]["Relationship"];
        for (var relation of relations) {
            const relationDetails = relation["$"];
            if (relationDetails["Id"] == relID) {
                let linkType;
                if (relationDetails["TargetMode"] && relationDetails["TargetMode"] === "External") {
                    linkType = pptelement_1.LinkType.External;
                }
                else {
                    linkType = pptelement_1.LinkType.Asset;
                }
                return {
                    Type: linkType,
                    Uri: relationDetails["Target"].replace("..", "ppt") //update any relative paths
                };
            }
        }
        return null;
    }
}
exports.default = SlideRelationsParser;
