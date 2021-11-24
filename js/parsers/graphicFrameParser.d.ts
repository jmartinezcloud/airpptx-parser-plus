export default class GraphicFrameParser {
    static processGraphicFrameNodes: (graphicFrames: any) => any[];
    static getTableDesigns: (table: any[]) => string[];
    static extractTableElements: (frame: any) => {
        tableDesign: string[];
        rows: any;
    };
}
