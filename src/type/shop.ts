import { ItemInfo } from "./users";

export interface ItemShop {
    _id: string;
    price: number;
    isSale: boolean;
    itemId: string;
    maxInStorage: number;
    unit: "coin" | "daimond";
    itemInfo: ItemInfo;
}

export interface GetItemShopResponse {
    data: ItemShop[];
}
