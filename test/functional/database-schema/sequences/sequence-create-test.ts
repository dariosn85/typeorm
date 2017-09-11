import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src/connection/Connection";
import {expect} from "chai";
 
import {Person} from "./entity/Person";

describe("sequences > creating a sequence and marking the column as generated", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Person],
        enabledDrivers: ["postgres"],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("create table and check that primary key column is marked as generated", function() {

        it("should check that the primary key column is generated automatically", () => Promise.all(connections.map(async connection => {

            const queryRunner = connection.createQueryRunner();
            const tableSchema = await queryRunner.loadTableSchema("person");
            await queryRunner.release();

            expect(tableSchema!.findColumnByName("Id")!.isGenerated).to.be.true;

        })));
            
    });

});
