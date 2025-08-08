import { Item, ItemInfo, UserType } from "./users";

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

export const convertItemInfoToItem = (userData: UserType, itemInfo: ItemInfo): Item => {
    return {
        _id: "",
        userId: userData.userId,
        itemId: itemInfo._id,
        level: 0,
        isInstall: false,
        info: itemInfo,
        qty: 0
    }
}
