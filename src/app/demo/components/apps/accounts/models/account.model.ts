import {Entity} from "../../../models/entity";
import {VwRecon} from "../../bills/models/bill";

export interface AccountModel extends Entity {
    name: string;
    url: string;
    owner: string;
}

export interface Account extends Entity {
    name: string;          // Name of the account
    url: string | null;    // URL of the account, can be null
    ownerPk: number;       // Foreign key to the owner
    loginPk: number;       // Foreign key to the login
}

export interface VwAccount {
    accountpk: number;       // Primary key of the account
    accountName: string;     // Name of the account
    url: string | null;      // URL associated with the account, can be null
    ownerPk: number;         // Foreign key to the owner
    ownerName: string;       // Name of the owner
    loginPk: number;         // Foreign key to the login
    username: string;        // Username for the account login
    password: string;        // Password for the account login
    isBill: boolean;         // Whether a bill is associated with the account
    hasActiveBill: boolean   // Whether the bill is active
    recon: VwRecon[];        // Bill History
}


