"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListType = exports.FillType = exports.LinkType = exports.SpecialityType = exports.TextAlignment = exports.FontAttributes = exports.BorderType = exports.TableDesign = void 0;
var TableDesign;
(function (TableDesign) {
    TableDesign["isHeader"] = "firstRow";
    TableDesign["bandedRows"] = "bandRow";
})(TableDesign = exports.TableDesign || (exports.TableDesign = {}));
var BorderType;
(function (BorderType) {
    BorderType["dotted"] = "dotted";
    BorderType["dashed"] = "dashed";
    BorderType["solid"] = "solid";
})(BorderType = exports.BorderType || (exports.BorderType = {}));
var FontAttributes;
(function (FontAttributes) {
    FontAttributes["Bold"] = "b";
    FontAttributes["Italics"] = "i";
    FontAttributes["Underline"] = "u";
    FontAttributes["StrikeThrough"] = "strike";
})(FontAttributes = exports.FontAttributes || (exports.FontAttributes = {}));
var TextAlignment;
(function (TextAlignment) {
    TextAlignment["Center"] = "center";
    TextAlignment["Left"] = "left";
    TextAlignment["Right"] = "right";
    TextAlignment["Justified"] = "justify";
})(TextAlignment = exports.TextAlignment || (exports.TextAlignment = {}));
var SpecialityType;
(function (SpecialityType) {
    SpecialityType["Image"] = "Image";
    SpecialityType["Table"] = "Table";
    SpecialityType["Title"] = "Title";
    SpecialityType["Paragraph"] = "Paragraph";
    SpecialityType["Audio"] = "Audio";
    SpecialityType["Video"] = "Video";
    SpecialityType["None"] = "None";
})(SpecialityType = exports.SpecialityType || (exports.SpecialityType = {}));
var LinkType;
(function (LinkType) {
    LinkType["Asset"] = "Asset";
    LinkType["External"] = "External";
})(LinkType = exports.LinkType || (exports.LinkType = {}));
var FillType;
(function (FillType) {
    FillType["Image"] = "Image";
    FillType["Solid"] = "Solid";
})(FillType = exports.FillType || (exports.FillType = {}));
var ListType;
(function (ListType) {
    ListType["Ordered"] = "Ordered";
    ListType["UnOrdered"] = "UnOrdered";
    ListType["None"] = "None";
})(ListType = exports.ListType || (exports.ListType = {}));
