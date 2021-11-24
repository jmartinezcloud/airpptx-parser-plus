import { PowerpointDetails } from "./models/pptdetails";
export declare class AirParser {
    private readonly PowerpointFilePath;
    constructor(PowerpointFilePath: string);
    ParsePowerPoint(): Promise<PowerpointDetails>;
}
