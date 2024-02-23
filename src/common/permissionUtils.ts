import type { Ref } from "vue";
import { universalAccess, type Access } from "@inrupt/solid-client";
// import { session } from "../common/loginState";
import { useSessionStore } from "../stores/session";
import { getDirResources, ResourceType } from "./resourceUtils";
import { SolidClientError } from "@inrupt/solid-client";
import type { AccessModes } from "@inrupt/solid-client";
import { isSame } from "./utils";

export const K_PUBLIC = "public";

export type PermissionInfo = {
  [agent: string]: AccessModes | null;
}; // It is `null` if the current user does not have permission to read the ACL

type ResourcesOfPermission = {
  permission: AccessModes;
  resources: string[];
};

export type PermissionByAgent = {
  [agent: string]: ResourcesOfPermission[];
};

export async function getAllPermissionForResource(
  resource: string,
): Promise<PermissionInfo> {
  const sessionStore = useSessionStore();

  const accessByAgent = await universalAccess.getAgentAccessAll(
    resource, // resource
    // { fetch: session.fetch }
    { fetch: sessionStore.session.fetch },
  );
  const accessForPublic = await universalAccess.getPublicAccess(
    resource,
    // { fetch: session.fetch }
    { fetch: sessionStore.session.fetch },
  );

  const accessObj = { [K_PUBLIC]: accessForPublic };

  return { ...accessObj, ...accessByAgent };
}

async function setPermissionSingle(
  resource: string,
  agent: string,
  permission: AccessModes,
  options: object,
): Promise<AccessModes | null> {
  if (agent == K_PUBLIC) {
    return await universalAccess.setPublicAccess(resource, permission, options);
  } else {
    return await universalAccess.setAgentAccess(
      resource,
      agent,
      permission,
      options,
    );
  }
}

export async function setPermission(
  resource: string | string[],
  agent: string,
  permission: AccessModes,
  options?: object,
) {
  const myOptions = options
    ? options
    : { fetch: useSessionStore().session.fetch };

  if (Array.isArray(resource)) {
    return Promise.all(
      resource.map((res) =>
        setPermissionSingle(res, agent, permission, myOptions),
      ),
    );
  } else {
    return await setPermissionSingle(resource, agent, permission, myOptions);
  }
}

interface ProgressInfo {
  current: number;
  total: number;
}

export async function retrievePermissionByAgent(
  dirUrl: string,
  dest: PermissionByAgent,
  progressInfo?: ProgressInfo,
  recursionDepth?: number,
) {
  /**
   * BFS
   */
  const pendingRes = [[dirUrl], []];
  let i = -1;
  while (pendingRes[0].length || pendingRes[1].length) {
    i++;
    for (const workingResUrl of pendingRes[i % 2]) {
      const dirResources = await getDirResources(workingResUrl);
      if (progressInfo) {
        progressInfo.total += dirResources.length;
      }
      for (const res of dirResources) {
        const url = res.url;
        if (res.type == ResourceType.Dir) {
          if (recursionDepth != undefined) {
            if (recursionDepth == 0 || i + 1 < recursionDepth) {
              pendingRes[(i + 1) % 2].push(url);
            }
          }
        }
        try {
          const resComb = await getAllPermissionForResource(res.url);
          for (const [agent, resInfo] of Object.entries(resComb)) {
            if (!resInfo) continue;
            if (!(agent in dest)) {
              const resOfPerm = {
                permission: resInfo,
                resources: [url],
              };
              dest[agent] = [resOfPerm];
            } else {
              let matchFound = false;
              dest[agent].forEach((resOfPerm) => {
                if (isSame(resOfPerm.permission, resInfo)) {
                  matchFound = true;
                  resOfPerm.resources = [...resOfPerm.resources, url];
                }
              });
              if (!matchFound) {
                const resOfPerm = {
                  permission: resInfo,
                  resources: [url],
                };
                dest[agent].push(resOfPerm);
              }
            }
          }
        } catch (e) {
          if (e instanceof SolidClientError) {
            // if (e.statusCode == 404) {
            // } else {
            //     throw e;
            // }
          } else {
            throw e;
          }
        }
        if (progressInfo) {
          progressInfo.current++;
        }
      }
    }
    pendingRes[i % 2].length = 0;
  }
}
