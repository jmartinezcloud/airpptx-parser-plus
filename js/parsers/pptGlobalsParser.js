"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const helpers_1 = require("../helpers");
class PptGlobalsParser {
    static getSlidesLength(pptFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slideShowGlobals = yield helpers_1.FileHandler.parseContentFromFile((0, path_1.join)(pptFilePath, "ppt/presentation.xml"));
                return (0, helpers_1.getAttributeByPath)(slideShowGlobals, ["p:presentation", "p:sldIdLst", "p:sldId"], []).length;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PptGlobalsParser;
