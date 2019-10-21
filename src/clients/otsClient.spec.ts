import { createHash, Hash } from "crypto";
import { serial, TestInterface } from "ava";
import { client as otsClient } from "./otsClient";
import { CypherNodeClient } from "../lib/types/clients";
import { CypherNodeOTSClient } from "../lib/types/ots";
interface TestContext extends CypherNodeOTSClient {
  fileHash: string;
}

const test = serial as TestInterface<TestContext>;
test.before(t => {
  t.context = {
    fileHash: createHash("sha256")
      .update(`${Date.now}:${parseInt(Math.random() * 100)}`)
      .digest("hex"),
    ...otsClient()
  };
});
test("Should be able to generate an OTS file", async t => {
  const {
    context: { stamp, fileHash }
  } = t;
  const hashRcpt = await stamp(fileHash);
  t.true(hashRcpt.hash === fileHash);
  t.false(isNaN(hashRcpt.id));
  t.is(hashRcpt.result, "success");
});
test("Should be able to Verify an OTS file hash", async t => {
  const {
    context: { verifyFileStamp, fileHash }
  } = t;
  const { method, hash, result, message } = await verifyFileStamp(fileHash);
  t.is(hash, fileHash);
  t.true(result === "pending" || result === "completed");
});
test("Should be able to get OTS stamp", async t => {
  const {
    context: { getStamp, fileHash }
  } = t;
  const poop = await getStamp(fileHash);
  t.pass(poop);
});
