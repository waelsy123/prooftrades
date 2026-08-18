import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// AES-256-GCM, format-compatible with mt5-fleet-orchestrator's crypto.ts
// (enc:<iv>:<ciphertext>:<tag>, all hex). Unlike the orchestrator, encrypt()
// FAILS CLOSED when ENCRYPTION_KEY is missing — we never store secrets in
// plaintext.

const ALGORITHM = "aes-256-gcm";
const PREFIX = "enc:";

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("ENCRYPTION_KEY (32-byte hex) is not configured");
  }
  return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("hex")}:${encrypted.toString("hex")}:${tag.toString("hex")}`;
}

export function decrypt(value: string): string {
  if (!value.startsWith(PREFIX)) return value;
  const key = getKey();
  const parts = value.slice(PREFIX.length).split(":");
  if (parts.length !== 3) return value;
  const [ivHex, ciphertextHex, tagHex] = parts;
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
