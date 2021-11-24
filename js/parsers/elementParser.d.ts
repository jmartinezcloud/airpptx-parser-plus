import { PowerpointElement } from "../models/pptelement";
/**
 * Entry point for all Parsers
 */
declare class PowerpointElementParser {
    private element;
    private slideLayoutSpNode;
    private slideMasterSpNode;
    isNonSupportedPlaceholder(): boolean;
    isPlaceholderListElement(): boolean;
    setLayoutSpNodes(slideLayoutTables: any, slideMasterTables: any, nodeName: any): void;
    getXfrmNodePosition(xfrmNode: any): {
        position: {
            x: number;
            y: number;
        };
        offset: {
            cx: number;
            cy: number;
        };
    };
    getPosition(): {
        position: {
            x: number;
            y: number;
        };
        offset: {
            cx: number;
            cy: number;
        };
    };
    getProcessedElement(rawElement: any, slideLayoutTables: any, slideMasterTables: any, slideRelationships: any): PowerpointElement;
}
export default PowerpointElementParser;
