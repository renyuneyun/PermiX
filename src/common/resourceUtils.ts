import {
  getSolidDataset,
  getThingAll,
  getThing,
  getContentType,
  toRdfJsDataset,
  type ThingPersisted,
} from "@inrupt/solid-client";
import type { SolidDataset, Thing } from "@inrupt/solid-client";
// import { session } from "../common/loginState";
import { useSessionStore } from "../stores/session";

const P_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const P_CONTAINS = "http://www.w3.org/ns/ldp#contains";
const T_RESOURCE = "http://www.w3.org/ns/ldp#Resource";
const T_CONTAINER = "http://www.w3.org/ns/ldp#Container";

export enum ResourceType {
  Dir,
  File,
}

export class DirResource {
  type: ResourceType;
  url: string;

  static fromThing(thing: Thing): DirResource {
    if (thing.predicates[P_TYPE]!.namedNodes!.includes(T_CONTAINER)) {
      return new DirResource(thing.url, ResourceType.Dir);
    } else {
      return new DirResource(thing.url, ResourceType.File);
    }
  }

  constructor(url: string, type: ResourceType) {
    this.url = url;
    this.type = type;
  }
}

export function getThingsOf(dataset: SolidDataset, type?: string): Thing[] {
  // const rdfJsDataset = toRdfJsDataset(dataset);

  const things = getThingAll(dataset);
  const targetThings = things.filter((thing) => {
    return type ? thing.predicates[P_TYPE]?.namedNodes?.includes(type) : true;
  });
  return targetThings;
}

export async function getDirResources(dirUrl: string): Promise<DirResource[]> {
  const sessionStore = useSessionStore();

  const dataset = await getSolidDataset(
    dirUrl,
    // { fetch: session.fetch }  // fetch function from authenticated session
    { fetch: sessionStore.session.fetch }, // fetch function from authenticated session
  );

  const dirThing: ThingPersisted | null = getThing(dataset, dirUrl);
  if (!dirThing) {
    throw new Error("Unable to retrieve resource");
  }
  return (
    dirThing.predicates[P_CONTAINS]?.namedNodes
      ?.map((thingUrl) => {
        return getThing(dataset, thingUrl)!;
      })
      .map(DirResource.fromThing) || []
  );
}
