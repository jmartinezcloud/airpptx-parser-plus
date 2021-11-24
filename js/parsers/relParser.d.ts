import { PowerpointElement, Content } from "../models/pptelement";
/**
 * Parse everything that deals with relations such as hyperlinks and local images
 */
export default class SlideRelationsParser {
    static slideRels: any;
    /**
     *
     * @param theme Parsed XML with theme colors
     */
    static setSlideRelations(rels: any): void;
    static resolveShapeHyperlinks(element: any): PowerpointElement["links"];
    static resolveParagraphHyperlink(element: any): Content["hyperlink"];
    static getRelationDetails(relID: any): PowerpointElement["links"];
}
