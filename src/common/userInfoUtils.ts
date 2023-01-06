import { QueryEngine } from '@comunica/query-sparql'
import { FOAF, VCARD } from '@inrupt/vocab-common-rdf'

const queryEngine = new QueryEngine();

export interface UserInfoStruct {
    loaded: boolean;
    avatar?: string;
    name?: string;
}

export async function getUserInfo(webid: string, userInfo: UserInfoStruct) {
    userInfo.loaded = false;
    queryEngine.queryBindings(`
        SELECT ?name ?photo {
            ?s a <${FOAF.Person}>.
            OPTIONAL {
                ?s <${VCARD.hasPhoto}> ?photo
            }
            OPTIONAL {
                ?s <${VCARD.fn}> ?name 
            }
        } LIMIT 1
    `, {
      sources: [webid],
    }).then(function (bindingsStream) {
        bindingsStream.on('data', function (data) {
            userInfo.avatar = data.get('photo')?.id;
            userInfo.name = data.get('name')?.value;
            userInfo.loaded = true;
        });
    });
}