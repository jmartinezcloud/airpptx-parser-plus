/**
 * The model for a parsed Powerpoint Element which the parsers generate
 */
export interface PowerpointElement {
    name: string;
    shapeType: string;
    specialityType: SpecialityType;
    elementPosition: {
        x: number;
        y: number;
    };
    elementOffsetPosition: {
        cx: number;
        cy: number;
    };
    paragraph?: Array<Paragraph>;
    shape?: {
        border?: {
            thickness: number;
            color: string;
            type: BorderType;
            radius?: number;
        };
        fill: {
            fillType: FillType;
            fillColor: string;
        };
        opacity: number;
    };
    table?: {
        tableDesign?: TableDesign[];
        rows: [
            cols: []
        ];
    };
    fontStyle?: {
        font: string;
        fontSize: number;
        fontColor: string;
    };
    links?: {
        Type: LinkType;
        Uri: string;
    };
    raw?: any;
}
export declare enum TableDesign {
    isHeader = "firstRow",
    bandedRows = "bandRow"
}
export interface Paragraph {
    content?: Array<Content>;
    paragraphProperties?: {
        alignment: TextAlignment;
    };
    list?: List;
}
export interface List {
    listType: ListType;
    listItems: Array<Paragraph>;
}
export interface Content {
    text: string[];
    textCharacterProperties: {
        fontAttributes: FontAttributes[];
        font: string;
        size: number;
        fillColor: string;
    };
    hyperlink?: {
        Type: LinkType;
        Uri: string;
    };
}
export declare enum BorderType {
    dotted = "dotted",
    dashed = "dashed",
    solid = "solid"
}
export declare enum FontAttributes {
    Bold = "b",
    Italics = "i",
    Underline = "u",
    StrikeThrough = "strike"
}
export declare enum TextAlignment {
    Center = "center",
    Left = "left",
    Right = "right",
    Justified = "justify"
}
export declare enum SpecialityType {
    Image = "Image",
    Table = "Table",
    Title = "Title",
    Paragraph = "Paragraph",
    Audio = "Audio",
    Video = "Video",
    None = "None"
}
export declare enum LinkType {
    Asset = "Asset",
    External = "External"
}
export declare enum FillType {
    Image = "Image",
    Solid = "Solid"
}
export declare enum ListType {
    Ordered = "Ordered",
    UnOrdered = "UnOrdered",
    None = "None"
}
