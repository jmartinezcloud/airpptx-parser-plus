"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeParser = exports.SlideRelationsParser = exports.SlideParser = exports.ParagraphParser = exports.LineParser = exports.PptGlobalsParser = exports.GraphicFrameParser = exports.PowerpointElementParser = exports.ColorParser = void 0;
const colorParser_1 = require("./colorParser");
exports.ColorParser = colorParser_1.default;
const elementParser_1 = require("./elementParser");
exports.PowerpointElementParser = elementParser_1.default;
const graphicFrameParser_1 = require("./graphicFrameParser");
exports.GraphicFrameParser = graphicFrameParser_1.default;
const pptGlobalsParser_1 = require("./pptGlobalsParser");
exports.PptGlobalsParser = pptGlobalsParser_1.default;
const lineParser_1 = require("./lineParser");
exports.LineParser = lineParser_1.default;
const paragraphParser_1 = require("./paragraphParser");
exports.ParagraphParser = paragraphParser_1.default;
const slideParser_1 = require("./slideParser");
exports.SlideParser = slideParser_1.default;
const relParser_1 = require("./relParser");
exports.SlideRelationsParser = relParser_1.default;
const shapeParser_1 = require("./shapeParser");
exports.ShapeParser = shapeParser_1.default;
