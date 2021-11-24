"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const helpers_1 = require("../helpers");
const pptelement_1 = require("../models/pptelement");
const cloneDeep = require("lodash.clonedeep");
/**
 * Parse the paragraph elements
 */
class ParagraphParser {
    //Merge consecutive text content blocks together which have same hyperlinks
    //and also adjust the spacing in between the hyperlink for the edge cases
    static restructureContents(contents) {
        for (let i = 0; i < contents.length - 1; i++) {
            if (contents[i].hyperlink &&
                contents[i + 1].hyperlink &&
                contents[i].hyperlink.Uri === contents[i + 1].hyperlink.Uri) {
                if (contents[i].text[0].trimEnd().length === contents[i].text[0].length &&
                    contents[i + 1].text[0].trimStart().length === contents[i + 1].text[0].length) {
                    contents[i].text[0] += " " + contents[i + 1].text[0];
                }
                else {
                    contents[i].text[0] += contents[i + 1].text[0];
                }
                contents.splice(i + 1, 1);
                i--;
            }
        }
        return contents;
    }
    static isTitle(element) {
        return ((0, helpers_1.getValueAtPath)(element, '["p:nvSpPr"][0]["p:nvPr"][0]["p:ph"][0]["$"]["type"]') === "ctrTitle" ||
            (0, helpers_1.getValueAtPath)(element, '["p:nvSpPr"][0]["p:nvPr"][0]["p:ph"][0]["$"]["type"]') === "title");
    }
    static isList(paragraph, isListContent) {
        return (((0, helpers_1.checkPath)(paragraph, '["a:pPr"][0]["a:buAutoNum"]') ||
            (0, helpers_1.checkPath)(paragraph, '["a:pPr"][0]["a:buChar"]') ||
            isListContent) &&
            (0, helpers_1.checkPath)(paragraph, '["a:pPr"][0]["a:buNone"]') === false);
    }
    static getParagraph(paragraph, style) {
        const textElements = paragraph["a:r"];
        if (!textElements) {
            return null;
        }
        let contents = textElements.map((txtElement) => {
            const content = {
                text: txtElement["a:t"] || "",
                textCharacterProperties: this.determineTextProperties((0, helpers_1.getValueAtPath)(txtElement, '["a:rPr"][0]'), paragraph, style),
            };
            const hyperlink = _1.SlideRelationsParser.resolveParagraphHyperlink(txtElement);
            if (hyperlink) {
                content.hyperlink = hyperlink;
            }
            return content;
        });
        contents = this.restructureContents(contents);
        return {
            content: contents,
            paragraphProperties: this.determineParagraphProperties(paragraph)
        };
    }
    static getListlevel(paragraph) {
        const level = (0, helpers_1.getValueAtPath)(paragraph, '["a:pPr"][0]["$"]["lvl"]');
        return level ? parseInt(level) : 0;
    }
    static getListType(paragraph) {
        if ((0, helpers_1.checkPath)(paragraph, '["a:pPr"][0]["a:buAutoNum"]')) {
            return pptelement_1.ListType.Ordered;
        }
        return pptelement_1.ListType.UnOrdered;
    }
    //recursively iterate the list and restructure it to have a parent child relation
    static restructureList(list) {
        //if we keep finding the empty list at top level keep going deeper.
        //Note: before restructuring, list items and paragraph content didn't exist in the same object
        if (list.listItems.length === 1 && list.listItems[0].list) {
            this.restructureList(list.listItems[0].list);
        }
        for (let i = 0; i < list.listItems.length - 1; i++) {
            //if any of the element is list, keep going going deeper into the list
            if (list.listItems[i].list) {
                this.restructureList(list.listItems[i].list);
            }
            //if the next item to the content is a list, make that list child of the content
            if (list.listItems[i + 1].list) {
                list.listItems[i]["list"] = list.listItems[i + 1].list;
                list.listItems.splice(i + 1, 1);
                this.restructureList(list.listItems[i].list);
            }
        }
        return list;
    }
    static extractParagraphElements(paragraphInfo, isListContent) {
        const paragraphs = (0, helpers_1.getValueAtPath)(paragraphInfo, '["a:p"]');
        const paragraphStyle = (0, helpers_1.getValueAtPath)(paragraphInfo, '["a:lstStyle"][0]');
        if (!paragraphs || paragraphs.length === 0) {
            return null;
        }
        const allParagraphs = [];
        const stack = [];
        const paragraph = {
            list: {
                listType: pptelement_1.ListType.Ordered,
                listItems: []
            }
        };
        let currentParagraph = paragraph;
        let currentLevel = -1;
        for (const paragraphItem of paragraphs) {
            const parsedParagraph = this.getParagraph(paragraphItem, paragraphStyle);
            if (this.isList(paragraphItem, isListContent)) {
                const listLevel = this.getListlevel(paragraphItem);
                // if its the first of the list kind
                if (currentLevel === -1) {
                    while (currentLevel < listLevel - 1) {
                        const emptyParagraph = {
                            list: {
                                listType: pptelement_1.ListType.UnOrdered,
                                listItems: []
                            }
                        };
                        currentParagraph.list.listItems.push(emptyParagraph);
                        currentParagraph = emptyParagraph;
                        //pushing it in the stack to keep track of the parents
                        stack.push(emptyParagraph);
                        currentLevel++;
                    }
                    currentParagraph.list.listType = this.getListType(paragraphItem);
                    parsedParagraph && currentParagraph.list.listItems.push(parsedParagraph);
                    stack.push(currentParagraph);
                    currentLevel++;
                }
                //if the level is same keep pushing the list items in the same array
                else if (listLevel === currentLevel) {
                    parsedParagraph && currentParagraph.list.listItems.push(parsedParagraph);
                }
                else if (listLevel > currentLevel) {
                    //edge case to handle if multiple levels are jumped ahead
                    //create empty paragraphs/lists to maintain hierarchy and fill in the level gaps
                    while (currentLevel < listLevel - 1) {
                        const emptyParagraph = {
                            list: {
                                listType: pptelement_1.ListType.UnOrdered,
                                listItems: []
                            }
                        };
                        currentParagraph.list.listItems.push(emptyParagraph);
                        currentParagraph = emptyParagraph;
                        //pushing it in the stack to keep track of the parents
                        stack.push(emptyParagraph);
                        currentLevel++;
                    }
                    //if there is another hierarchy starting create a new list for it
                    const newParagraph = {
                        list: {
                            listType: this.getListType(paragraphItem),
                            // listItems: [this.getParagraph(paragraphItem)]
                            listItems: parsedParagraph ? [parsedParagraph] : []
                        }
                    };
                    currentParagraph.list.listItems.push(newParagraph);
                    currentParagraph = newParagraph;
                    //pushing it in the stack to keep track of the parents
                    stack.push(newParagraph);
                    currentLevel++;
                }
                else {
                    //if we find the list level lower than current level
                    //keep going back in stack until the same level parent is found
                    while (currentLevel > listLevel) {
                        stack.pop();
                        currentLevel--;
                    }
                    //and push the new item as a sibling
                    currentParagraph = stack[stack.length - 1];
                    parsedParagraph && currentParagraph.list.listItems.push(parsedParagraph);
                }
            }
            else {
                //if the paragraph was not a list item
                //check if we previously had the list items then push the list in paragraphs
                if (paragraph.list.listItems.length > 0) {
                    paragraph.list = this.restructureList(paragraph.list);
                    allParagraphs.push(cloneDeep(paragraph));
                    paragraph.list.listItems = [];
                    currentLevel = -1;
                }
                //normal paragraph content
                parsedParagraph && allParagraphs.push(parsedParagraph);
            }
        }
        //true if there were only list items in the text box, push them
        if (paragraph.list.listItems.length > 0) {
            paragraph.list = this.restructureList(paragraph.list);
            allParagraphs.push(paragraph);
        }
        return allParagraphs;
    }
    /**a:rPr */
    static determineTextProperties(textProperties, paragraph, style) {
        const size = (0, helpers_1.getValueAtPath)(style, '["a:lvl1pPr"][0]["a:defRPr"][0]["$"].sz') || (0, helpers_1.getValueAtPath)(paragraph, '["a:pPr"][0]["a:defRPr"][0]["$"].sz') || 1200;
        const font = (0, helpers_1.getValueAtPath)(style, '["a:lvl1pPr"][0]["a:defRPr"][0]["a:latin"][0]["$"].typeface') || (0, helpers_1.getValueAtPath)(paragraph, '["a:pPr"][0]["a:defRPr"][0]["a:latin"][0]["$"].typeface') || "Helvetica";
        const fillColor = (0, helpers_1.getValueAtPath)(style, '["a:lvl1pPr"][0]["a:defRPr"][0]["a:solidFill"][0]["a:srgbClr"][0]["$"].val') || (0, helpers_1.getValueAtPath)(paragraph, '["a:pPr"][0]["a:defRPr"][0]["a:solidFill"][0]["a:srgbClr"][0]["$"].val') || "000000";
        const defaultProperties = {
            size: parseInt(size),
            fontAttributes: [],
            font: font,
            fillColor: fillColor
        };
        if (!textProperties) {
            return defaultProperties;
        }
        return {
            size: parseInt((0, helpers_1.getValueAtPath)(textProperties, '["$"].sz') || defaultProperties.size),
            fontAttributes: this.determineFontAttributes(textProperties["$"]) || defaultProperties.fontAttributes,
            font: (0, helpers_1.getValueAtPath)(textProperties, '["a:latin"][0]["$"]["typeface"]') || defaultProperties.font,
            fillColor: _1.ColorParser.getTextColors(textProperties) || defaultProperties.fillColor
        };
    }
    /** Parse for italics, bold, underline & strike through*/
    static determineFontAttributes(attributesList) {
        const attributesArray = [];
        if (!attributesList) {
            return null;
        }
        Object.keys(attributesList).forEach((element) => {
            if (element === pptelement_1.FontAttributes.Bold && attributesList[element] == 1) {
                attributesArray.push(pptelement_1.FontAttributes.Bold);
            }
            if (element === pptelement_1.FontAttributes.Italics && attributesList[element] == 1) {
                attributesArray.push(pptelement_1.FontAttributes.Italics);
            }
            if (element === pptelement_1.FontAttributes.Underline && attributesList[element] != "none") {
                attributesArray.push(pptelement_1.FontAttributes.Underline);
            }
            if (element === pptelement_1.FontAttributes.StrikeThrough && attributesList[element] != "noStrike") {
                attributesArray.push(pptelement_1.FontAttributes.StrikeThrough);
            }
        });
        return attributesArray;
    }
    /**a:pPr */
    static determineParagraphProperties(paragraphProperties) {
        if (!paragraphProperties) {
            return null;
        }
        let alignment = pptelement_1.TextAlignment.Left;
        const alignProps = (0, helpers_1.getValueAtPath)(paragraphProperties, '["a:pPr"][0]["$"]["algn"]');
        if (alignProps) {
            switch (alignProps) {
                case "ctr":
                    alignment = pptelement_1.TextAlignment.Center;
                    break;
                case "l":
                    alignment = pptelement_1.TextAlignment.Left;
                    break;
                case "r":
                    alignment = pptelement_1.TextAlignment.Right;
                    break;
                case "j":
                    alignment = pptelement_1.TextAlignment.Justified;
                    break;
            }
        }
        const paragraphPropertiesElement = {
            alignment
        };
        return paragraphPropertiesElement;
    }
}
exports.default = ParagraphParser;
