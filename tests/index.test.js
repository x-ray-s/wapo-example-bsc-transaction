import { test, expect, describe, vi, assert } from "vitest";
import { app } from "../server/app";
import dotenv from "dotenv";

dotenv.config();
vi.stubEnv("SECRET_KEY", process.env.SECRET_KEY);

describe("Test server request", () => {
  test("/info api", async () => {
    const res = await app.request("/?info=1");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty("address");
    expect(data.address).toEqual("0xB3ceFF779F883c2B30E45f065fd6b5dB4a90c7a5");
  });

  test("/whitelist api", async () => {
    const res = await app.request("/?whitelist=1");
    const data = await res.json();
    expect(res.status).toBe(200);
    assert.isTrue(Array.isArray(data));
    assert.include(data, "0x6572005F94AfbbeE1EdF2D5143C8514459C8760D");
    assert.notInclude(data, "0xB3ceFF779F883c2B30E45f065fd6b5dB4a90c7a5");
  });

  test("/check api", async () => {
    const res = await app.request("/", {
      method: "POST",
      body: JSON.stringify({
        address: "0x6572005F94AfbbeE1EdF2D5143C8514459C8760D",
      }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
