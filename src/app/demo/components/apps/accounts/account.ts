import {Entity} from "../../models/entity";

export interface Account extends Entity {
    name: string;
    url: string;
    ownerpk: number;
    loginpk: number;
}
