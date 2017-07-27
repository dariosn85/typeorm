import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "./entity/Post";

describe.only("github issues > #463 saving empty string array", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not return array with single empty string if empty array was saved", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.id = 1;
        post.names = [];
        await connection.getRepository(Post).persist(post);
        const loadedPost = await connection.getRepository(Post).findOneById(1);
        console.log(loadedPost);
        loadedPost!.names.length.should.be.eql(0);
    })));

});