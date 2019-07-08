import { serial as test } from "ava";
import * as agent from "superagent";
import { createHmac } from "crypto";
import uuid from "uuid/v4";

test.before(t => {
  const cypherGateway = "https://localhost:2009/v0/";
  const makeToken = (api_key, perm = "admin", expiryInSeconds = 3600) => {
    const permissionDict = { admin: 3, spender: 2, general: 1 };
    const id = `00${permissionDict[perm]}`;
    let exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
    let h64 = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64");
    let p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
    let msg = h64 + "." + p64;
    // TODO for browser
    //let hash = CryptoJS.HmacSHA256(`${h64}.${p64}`, api_key).toString();
    const hmac = createHmac("sha256", api_key);
    hmac.update(msg);
    let hash = hmac.digest("hex");
    return `${msg}.${hash}`;
  };
  const token = makeToken(
    "5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8"
  );
  const get = async (command, payload = null) => {
    const { body } = await agent
      .get(`${cypherGateway}${command}/${payload}`)
      .set("Authorization", `Bearer ${token}`);
    return body;
  };
  const post = async (command, payload) => {
    const { body } = await agent
      .post(`${cypherGateway}${command}`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    return body;
  };
  t.context = {
    cypherGateway,
    get,
    post,
    token,
    lightingInvoiceLabel: uuid()
  };
});

/*

OTS  test
*/

test("Should be able to generate an OTS file", async t => {
  const {
    context: { post }
  } = t;
  const fileHash = md5("#I am some hashed file");
  const poop = await post("ots_stamp", fileHash);
  console.log(poop);
});
test("Should be able to get OTS stamp", async t => {
  const {
    context: { get }
  } = t;
  const fileHash =
    "1ddfb769eb0b8876bc570e25580e6a53afcf973362ee1ee4b54a807da2e5eed7";
  const poop = await get("ots_getfile", fileHash);
  console.log(poop);
});
