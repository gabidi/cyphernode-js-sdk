import { createHash, Hash } from "crypto";
import { serial, TestInterface } from "ava";
import { client as otsClient } from "./otsClient";
import { CypherNodeClient } from "./lib/types/clients";
import { CypherNodeOTSClient } from "./lib/types/ots";
interface TestContext extends CypherNodeOTSClient {
  fileHash: Hash;
}

const test = serial as TestInterface<TestContext>;
test.before(t => {
  t.context = {
    fileHash: createHash("sha256")
      .update(`${Date.now}:${parseInt(Math.random() * 100)}`)
      .digest("hex"),
    ...otsClient({
      apiKey: process.env.CYPHERNODE_API_KEY,
      userType: 3
    })
  };
});
/**
/*

OTS  test
*/

test.skip("Should be able to generate an OTS file", async t => {
  const {
    context: { stamp, fileHash }
  } = t;
  const hashRcpt = await stamp(fileHash);
  t.true(hashRcpt.hash === fileHash);
  t.false(isNaN(hashRcpt.id));
  t.is(hashRcpt.result, "success");
});
test("Should be able to get OTS stamp", async t => {
  const {
    context: { getStamp, fileHash }
  } = t;
  const poop = await getStamp(
    "7a96ac47d6a7ac28175a10e822d14def6e8958ae5680de32fbf08083648f831e"
  );
  console.log(poop);
});
