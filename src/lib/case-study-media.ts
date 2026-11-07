import { cacheLife } from "next/cache";
import fs from "node:fs";
import path from "node:path";

const IMAGE_KEYS = ["dashboard", "chat", "workflow"] as const;
const EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;
const FALLBACK_DIMENSIONS = { width: 1600, height: 900 };

export type CaseStudyImageKey = (typeof IMAGE_KEYS)[number];

export type CaseStudyImage = {
  src: string;
  width: number;
  height: number;
};

type ImageDimensions = {
  width: number;
  height: number;
};

function isImageKey(key: string): key is CaseStudyImageKey {
  return (IMAGE_KEYS as readonly string[]).includes(key);
}

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 24) {
    return null;
  }

  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const hasPngSignature = signature.every((byte, index) => buffer[index] === byte);

  if (!hasPngSignature) {
    return null;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  return width > 0 && height > 0 ? { width, height } : null;
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];

    if (marker === 0xff) {
      offset += 1;
      continue;
    }

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }

    const length = buffer.readUInt16BE(offset + 2);

    if (length < 2) {
      return null;
    }

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      if (offset + 9 > buffer.length) {
        return null;
      }

      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);

      return width > 0 && height > 0 ? { width, height } : null;
    }

    offset += 2 + length;
  }

  return null;
}

function readWebpDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 30) {
    return null;
  }

  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);

  if (riff !== "RIFF" || webp !== "WEBP") {
    return null;
  }

  const chunk = buffer.toString("ascii", 12, 16);

  if (chunk === "VP8 ") {
    if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) {
      return null;
    }

    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;

    return width > 0 && height > 0 ? { width, height } : null;
  }

  if (chunk === "VP8L") {
    if (buffer[20] !== 0x2f) {
      return null;
    }

    const b0 = buffer[21];
    const b1 = buffer[22];
    const b2 = buffer[23];
    const b3 = buffer[24];

    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));

    return { width, height };
  }

  if (chunk === "VP8X") {
    const width = buffer.readUIntLE(24, 3) + 1;
    const height = buffer.readUIntLE(27, 3) + 1;

    return { width, height };
  }

  return null;
}

function readImageDimensions(filePath: string): ImageDimensions {
  try {
    const buffer = fs.readFileSync(filePath);

    return (
      readPngDimensions(buffer) ??
      readJpegDimensions(buffer) ??
      readWebpDimensions(buffer) ??
      FALLBACK_DIMENSIONS
    );
  } catch {
    return FALLBACK_DIMENSIONS;
  }
}

export async function findCaseStudyImage(
  slug: string,
  key: string,
): Promise<CaseStudyImage | null> {
  "use cache";
  cacheLife("days");

  if (!isImageKey(key) || !/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const directory = path.join(process.cwd(), "public", "case-studies", slug);

  for (const extension of EXTENSIONS) {
    const filePath = path.join(directory, `${key}.${extension}`);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const { width, height } = readImageDimensions(filePath);

    return {
      src: `/case-studies/${slug}/${key}.${extension}`,
      width,
      height,
    };
  }

  return null;
}
