import { PowerpointElementParser } from "./";
export default class SlideParser {
    static getSlideLayout(slideRelations: any, pptFilePath: any): Promise<{
        slideLayoutTables: {
            idTable: {};
            idxTable: {};
            typeTable: {};
        };
        slideMasterTables: {
            idTable: {};
            idxTable: {};
            typeTable: {};
        };
    }>;
    static indexNodes(content: any): {
        idTable: {};
        idxTable: {};
        typeTable: {};
    };
    static getGroupedNodes(rootGroupNode: any, groupCount?: number, groupedShapes?: any[], groupedImages?: any[]): {
        groupedShapes: any[];
        groupedImages: any[];
    };
    static getSlideElements(PPTElementParser: PowerpointElementParser, slideNumber: any, pptFilePath: string): Promise<any[]>;
}
