import {randomBytes} from "node:crypto";

export const generateCodes = (length: number = 6): string => {
    return randomBytes(length).toString('hex').toUpperCase();
};