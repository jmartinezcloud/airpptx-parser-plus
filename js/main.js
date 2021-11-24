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
exports.AirParser = void 0;
const parsers_1 = require("./parsers");
class AirParser {
    constructor(PowerpointFilePath) {
        this.PowerpointFilePath = PowerpointFilePath;
    }
    ParsePowerPoint() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const pptElementParser = new parsers_1.PowerpointElementParser();
                    const slidesLength = yield parsers_1.PptGlobalsParser.getSlidesLength(this.PowerpointFilePath);
                    const allSlides = [];
                    for (let i = 1; i <= slidesLength; i++) {
                        allSlides.push(parsers_1.SlideParser.getSlideElements(pptElementParser, i, this.PowerpointFilePath));
                    }
                    Promise.allSettled(allSlides).then((result) => {
                        const pptElements = result.map((slideElements) => {
                            if (slideElements.status === "fulfilled") {
                                return slideElements.value;
                            }
                            return [];
                        });
                        resolve({
                            powerPointElements: pptElements,
                            inputPath: this.PowerpointFilePath,
                            slidesLength
                        });
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.AirParser = AirParser;
