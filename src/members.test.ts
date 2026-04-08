import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync, spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PORT = 34567;
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function req(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ status: number; body: unknown }> {
  const headers = new Headers(init.headers);
  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }
  return fetch(`${BASE}${path}`, { ...init, headers }).then(async (r) => {
    const text = await r.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    return { status: r.status, body };
  });
}

describe("members API", () => {
  let child: ReturnType<typeof spawn>;

  before(async () => {
    process.env.PORT = String(PORT);
    process.env.DATABASE_URL = "file:./test-members.db";
    process.env.JWT_SECRET = "test-secret-for-integration-tests";

    execSync("npx prisma migrate deploy", {
      cwd: ROOT,
      env: { ...process.env },
      stdio: "inherit",
    });

    child = spawn(
      process.execPath,
      ["--import", "tsx", "src/index.ts"],
      {
        cwd: ROOT,
        env: { ...process.env },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    for (let i = 0; i < 50; i++) {
      try {
        const r = await fetch(`${BASE}/health`);
        if (r.ok) return;
      } catch {
        /* server not up yet */
      }
      await delay(100);
    }
    throw new Error("server did not start");
  });

  after(() => {
    child.kill("SIGTERM");
  });

  it("requires auth for members routes", async () => {
    const { status } = await req("/api/members");
    assert.equal(status, 401);
  });

  it("lists only own members", async () => {
    const a = await req("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@test.local", password: "secret12345" }),
    });
    assert.equal(a.status, 201);
    const tokenA = (a.body as { token: string }).token;

    const b = await req("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "b@test.local", password: "secret12345" }),
    });
    assert.equal(b.status, 201);
    const tokenB = (b.body as { token: string }).token;

    const create = await req("/api/members", {
      method: "POST",
      token: tokenA,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Jane", relation: "spouse" }),
    });
    assert.equal(create.status, 201);

    const listA = await req("/api/members", { token: tokenA });
    assert.equal(listA.status, 200);
    const membersA = listA.body as { name: string }[];
    assert.equal(membersA.length, 1);
    assert.equal(membersA[0].name, "Jane");

    const listB = await req("/api/members", { token: tokenB });
    assert.equal(listB.status, 200);
    assert.equal((listB.body as unknown[]).length, 0);
  });

  it("deletes only own member", async () => {
    const reg = await req("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "c@test.local", password: "secret12345" }),
    });
    const token = (reg.body as { token: string }).token;

    const created = await req("/api/members", {
      method: "POST",
      token: token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Kid", relation: "child" }),
    });
    const id = (created.body as { id: string }).id;

    const other = await req("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "d@test.local", password: "secret12345" }),
    });
    const tokenOther = (other.body as { token: string }).token;

    const cross = await req(`/api/members/${id}`, { method: "DELETE", token: tokenOther });
    assert.equal(cross.status, 404);

    const del = await req(`/api/members/${id}`, { method: "DELETE", token });
    assert.equal(del.status, 204);
  });
});
