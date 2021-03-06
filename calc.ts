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

export function towVehicleWeight(weigh: WeighRecord): number {
    return weigh.steer + weigh.drive;
}

export function* warnings(vehicle: TowVehicleRating, weigh: WeighRecord): Generator<WeighRecordWarning> {
    type Category = WeighRecordWarning['category'];
    const frontAxle: Category = "steer";
    const rearAxle: Category = "drive";
    const trailerAxle: Category = "trailer";
    const combined: Category = "combined";
    const towVehicle: Category = "gvwr";

    if (vehicle.gawr.front < weigh.steer) {
        yield { category: frontAxle, actual: weigh.steer, recommended: vehicle.gawr.front };
    }

    if (vehicle.gawr.rear < weigh.drive) {
        yield { category: rearAxle, actual: weigh.drive, recommended: vehicle.gawr.rear };
    }

    if (vehicle.gcwr < weigh.combined) {
        yield { category: combined, actual: weigh.combined, recommended: vehicle.gcwr };
    }

    const actualVehicleWeight = towVehicleWeight(weigh);
    if (vehicle.gvwr < actualVehicleWeight) {
        yield { category: towVehicle, actual: actualVehicleWeight, recommended: vehicle.gvwr };
    }
}

export function warningText(warning: WeighRecordWarning): string {
    const { category, actual, recommended } = warning;

    return `Warning: Weight of ${actual} is higher than the ${recommended} ${category}`;
}

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
