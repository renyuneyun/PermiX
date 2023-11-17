import { getUserInfo as getUserInfo0 } from '@renyuneyun/solid-helper';

export interface UserInfoStruct {
    loaded: boolean;
    avatar?: string;
    name?: string;
}

export async function getUserInfo(webid: string, userInfo: UserInfoStruct) {
    userInfo.loaded = false;
    const info = await getUserInfo0(webid);
    userInfo.avatar = info.avatar;
    userInfo.name = info.name;
    userInfo.loaded = true;
}