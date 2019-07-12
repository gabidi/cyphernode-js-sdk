// import { serial, TestInterface } from "ava";
import { serial as test } from "ava";
import _client from "./cypherNodeClient";
import { ClientAuth } from "./types/clients";
import { createHmac } from "crypto";
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
test("Cyphernodeclient should generate a valid auth hash", async t => {
  const apiKey = "somekey";
  const userType = 3;
  const { makeToken, token: clientToken } = _client({
    apiKey,
    userType
  });
  const token = await makeToken();
  t.is(token.length, 142);
  const [h64, p64, generatedHash] = token.split(".");
  // Test generated hash vs reference
  const hmac = createHmac("sha256", <BinaryType>apiKey);
  hmac.update(`${h64}.${p64}`);
  const trueHash = hmac.digest("hex");
  t.true(generatedHash === trueHash);
});
