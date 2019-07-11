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
      apiKey:
        // @TODO if api key not detected, should prompt user for it https://stackoverflow.com/questions/18193953/waiting-for-user-to-enter-input-in-node-js
        process.env.CYPHERNODE_API_KEY ||
        "5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8",
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
    "16d6059a20ff61245708f7878875627504de82c168c4743776d2a61ef97ba33f"
  );
  console.log(poop);
});
test("Should be able to trigger backoffice upgrade", async t => {
  const {
    context: { updateStamp, fileHash }
  } = t;
  const poop = await updateStamp();
  console.log(poop);
});
