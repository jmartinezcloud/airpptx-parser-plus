import { PowerpointElement, FontAttributes, Paragraph, Content, List, ListType } from "../models/pptelement";
/**
 * Parse the paragraph elements
 */
export default class ParagraphParser {
    static restructureContents(contents: Content[]): Content[];
    static isTitle(element: any): boolean;
    static isList(paragraph: any, isListContent: any): boolean;
    static getParagraph(paragraph: any, style: any): Paragraph;
    static getListlevel(paragraph: any): number;
    static getListType(paragraph: any): ListType;
    static restructureList(list: List): List;
    static extractParagraphElements(paragraphInfo: any[], isListContent: any): PowerpointElement["paragraph"];
    /**a:rPr */
    static determineTextProperties(textProperties: any, paragraph: any, style: any): Content["textCharacterProperties"];
    /** Parse for italics, bold, underline & strike through*/
    static determineFontAttributes(attributesList: any): FontAttributes[];
    /**a:pPr */
    static determineParagraphProperties(paragraphProperties: any): Paragraph["paragraphProperties"];
}
