// import { serial, TestInterface } from "ava";
import { serial as test } from "ava";
import { crypto } from "./cryptoUtil";
import { ClientAuth } from "./types/clients";
import { createHmac } from "crypto";
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
test("hmacSHA256Hex should generate a hash identifcal to reference fn", async t => {
  const { hmacSHA256Hex } = crypto();
  const text = "Text to hash";
  const key = "SomeKey";
  const hmac = createHmac("sha256", key);
  hmac.update(text);
  const trueHash = hmac.digest("hex");
  const token = await hmacSHA256Hex(text, key);
  t.true(token === trueHash);
});

test("Cyphernodeclient should generate a valid auth hash", async t => {
  const apiKey = "somekey";
  const userType = 3;
  const { makeToken } = crypto();
  const token = await makeToken(apiKey, userType);
  t.is(token.length, 142);
  const [h64, p64, generatedHash] = token.split(".");
  // Test generated hash vs reference
  const hmac = createHmac("sha256", <BinaryType>apiKey);
  hmac.update(`${h64}.${p64}`);
  const trueHash = hmac.digest("hex");
  t.true(generatedHash === trueHash);
});
