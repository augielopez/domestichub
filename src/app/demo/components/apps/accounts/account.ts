import {Entity} from "../../models/entity";

export interface Account extends Entity {
    name: string;
    url: string;
    owner: string;
}

export interface AccountDto {
    account_pk: number;
    account_name: string;
    url: string;
    owner_pk: number;
    owner_name: string;
    login_pk: number;
    username: string;
    password: string;
}


