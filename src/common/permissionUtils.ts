import type { Ref } from "vue";
import { universalAccess, type Access } from "@inrupt/solid-client";
// import { session } from "../common/loginState";
import { useSessionStore } from "../stores/session";
import { getDirResources } from "./resourceUtils";
import { SolidClientError } from "@inrupt/solid-client";
import type { AccessModes } from "@inrupt/solid-client/dist/acp/type/AccessModes";
import { isSame } from "./utils";

export const K_PUBLIC = 'public';

export type PermissionInfo = {
    [agent: string]: AccessModes | null
} // It is `null` if the current user does not have permission to read the ACL

type ResourcesOfPermission = {
    permission: AccessModes
    resources: string[]
}

export type PermissionByAgent = {
    [agent: string]: ResourcesOfPermission[]
}

export async function getAllPermissionForResource(resource: string): Promise<PermissionInfo> {
    const sessionStore = useSessionStore();

    const accessByAgent = await universalAccess.getAgentAccessAll(
        resource, // resource
        // { fetch: session.fetch }
        { fetch: sessionStore.session.fetch }
    );
    const accessForPublic = await universalAccess.getPublicAccess(
        resource,
        // { fetch: session.fetch }
        { fetch: sessionStore.session.fetch }
    );

    const accessObj = { [K_PUBLIC]: accessForPublic };

    return { ...accessObj, ...accessByAgent };
}

interface ProgressInfo {
    current: number,
    total: number,
}

export async function retrievePermissionByAgent(dirUrl: string, dest: PermissionByAgent, progressInfo?: ProgressInfo) {
    const dirResources = await getDirResources(dirUrl);
    if (progressInfo) {
        progressInfo.total = dirResources.length;
        progressInfo.current = 0;
    }
    for (const res of dirResources) {
        const url = res.url;
        try {
            const resComb = await getAllPermissionForResource(res.url);
            for (const [agent, resInfo] of Object.entries(resComb)) {
                if (!resInfo)
                    continue;
                if (!(agent in dest)) {
                    console.log(`${agent} is NOT in collection`)
                    const resOfPerm = {
                        permission: resInfo,
                        resources: [ url ],
                    }
                    dest[agent] = [resOfPerm];
                }  else {
                    console.log(`${agent} IS in collection`)
                    let matchFound = false;
                    dest[agent].forEach((resOfPerm) => {
                        if (isSame(resOfPerm.permission, resInfo)) {
                            console.log("Permission match found")
                            matchFound = true;
                            resOfPerm.resources = [...resOfPerm.resources, url];
                        }
                    });
                    if (!matchFound) {
                        console.log("Permission match NOT found")
                        const resOfPerm = {
                            permission: resInfo,
                            resources: [ url ],
                        }
                        dest[agent].push(resOfPerm);
                    }
                }
            }
        } catch (e) {
            if (e instanceof SolidClientError) {
                // if (e.statusCode == 404) {
                //     continue;
                // } else {
                //     throw e;
                // }
                continue;
            } else {
                throw e;
            }
        }
        if (progressInfo) {
            progressInfo.current++;
        }
    }

}