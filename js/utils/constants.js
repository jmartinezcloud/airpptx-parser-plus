"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUPS_LIMIT = exports.SUPPORTED_PLACEHOLDERS = exports.SCHEMAS_URI = void 0;
exports.SCHEMAS_URI = {
    TABLE: "http://schemas.openxmlformats.org/drawingml/2006/table",
    CHART: "http://schemas.openxmlformats.org/drawingml/2006/chart",
    DIAGRAM: "http://schemas.openxmlformats.org/drawingml/2006/diagram",
    SLIDE_LAYOUT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout",
    SLIDE_MASTER: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster"
};
exports.SUPPORTED_PLACEHOLDERS = ["body", "ctrTitle", "pic", "subTitle", "tbl", "title"];
exports.GROUPS_LIMIT = 20;
