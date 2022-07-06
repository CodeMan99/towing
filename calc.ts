import { readFile } from "fs";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

export type WeighRecord = {
    date: Date;
    steer: number;
    drive: number;
    trailer: number;
    combined: number;
};

export type TowVehicleRating = {
    uvw: number;
    gvwr: number;
    gawr: {
        front: number;
        rear: number;
    };
    gcwr: number;
    tow: number;
    payload: number;
    maxHitch: number;
};

export type WeighRecordWarning = {
    category: Exclude<keyof WeighRecord, "date"> | "gvwr";
    actual: number;
    recommended: number;
};

export function getWeighRecordTable(fileText: string): string { return ""; }
export function parseWeighRecordTable(table: string): WeighRecord[] { return []; }
export function getTowVehicleRatingTable(fileText: string): string { return ""; }
export function parseTowVehicleRatingTable(table: string): TowVehicleRating[] { return []; }
export function towVehicleWeight(weigh: WeighRecord): number { return 0; }
export function warnings(vehicle: TowVehicleRating, weigh: WeighRecord): WeighRecordWarning[] { return []; }
export function warningText(warning: WeighRecordWarning): string { return ""; }

async function main(): Promise<void> {
    const towingLog = await readFileAsync("./towing.log", "utf8");

    console.log(towingLog);
}

if (require.main === module) {
    void main().catch(err => {
        process.exitCode = 1;
        console.error(err);
    });
}
