// Prepare a local mp4 original for R2 without re-encoding.
//
// ComfyUI video outputs can embed the workflow in container metadata. The public copy keeps the video
// and audio streams bit-for-bit (`-c copy`) and drops all metadata, chapters, and other streams, with
// the moov atom moved to the front (`+faststart`) so playback can start before the whole file loads.
// A poster frame (first frame) is encoded as a full-size WebP like any other image.
//
// Requires ffmpeg and ffprobe on PATH (`sudo apt install ffmpeg`).

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { encodeFullWebp } from "./media-image.mjs";

export class MediaVideoError extends Error {}

// Codecs every target browser can play from an mp4 container.
const VIDEO_CODECS = new Set(["h264"]);
const AUDIO_CODECS = new Set(["aac", "mp3", "opus"]);
// Container/stream tags that ffmpeg writes structurally and that carry no user data.
const ALLOWED_FORMAT_TAGS = new Set(["major_brand", "minor_version", "compatible_brands"]);
const ALLOWED_STREAM_TAGS = new Set(["language", "handler_name", "vendor_id"]);

function run(command, args, { binary = false } = {}) {
  const result = spawnSync(command, args, { encoding: binary ? null : "utf8", maxBuffer: 1024 * 1024 * 1024 });
  if (result.error?.code === "ENOENT") {
    throw new MediaVideoError(`${command} が見つかりません。動画を扱うには ffmpeg をインストールしてください（sudo apt install ffmpeg）`);
  }
  if (result.status !== 0) {
    const stderr = binary ? result.stderr?.toString() : result.stderr;
    throw new MediaVideoError(`${command} が失敗しました: ${String(stderr || "").trim().split("\n").slice(-3).join(" / ")}`);
  }
  return result.stdout;
}

export function hasFfmpeg() {
  return ["ffmpeg", "ffprobe"].every((command) => spawnSync(command, ["-version"]).status === 0);
}

export function probe(file) {
  return JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file]));
}

function assertPlayable(info) {
  if (!String(info.format?.format_name || "").includes("mp4")) {
    throw new MediaVideoError(`mp4 コンテナではありません（${info.format?.format_name}）`);
  }
  const video = info.streams.filter((stream) => stream.codec_type === "video");
  const audio = info.streams.filter((stream) => stream.codec_type === "audio");
  if (video.length !== 1) throw new MediaVideoError(`映像ストリームが ${video.length} 本あります（1 本だけ対応）`);
  if (!VIDEO_CODECS.has(video[0].codec_name)) {
    throw new MediaVideoError(`映像コーデック ${video[0].codec_name} はブラウザで再生できない可能性があります（H.264 に変換してください）`);
  }
  for (const stream of audio) {
    if (!AUDIO_CODECS.has(stream.codec_name)) {
      throw new MediaVideoError(`音声コーデック ${stream.codec_name} は未対応です（AAC / MP3 / Opus）`);
    }
  }
  return video[0];
}

function assertNoMetadata(info) {
  const extraFormatTags = Object.keys(info.format?.tags || {}).filter((tag) => !ALLOWED_FORMAT_TAGS.has(tag));
  const extraStreamTags = info.streams.flatMap((stream) => Object.keys(stream.tags || {}).filter((tag) => !ALLOWED_STREAM_TAGS.has(tag)));
  const extra = [...new Set([...extraFormatTags, ...extraStreamTags])];
  if (extra.length) throw new MediaVideoError(`動画の出力に metadata が残っています（${extra.join(", ")}）`);
  if ((info.chapters || []).length) throw new MediaVideoError("動画の出力にチャプターが残っています");
  const otherStreams = info.streams.filter((stream) => !["video", "audio"].includes(stream.codec_type));
  if (otherStreams.length) throw new MediaVideoError("動画の出力に映像・音声以外のストリームが残っています");
}

/**
 * @param {string} file Local mp4 original.
 * @returns {Promise<{ data: Buffer, width: number, height: number, type: "video/mp4",
 *   poster: { data: Buffer, width: number, height: number, type: "image/webp" } }>}
 */
export async function prepareVideo(file) {
  const sourceInfo = probe(file);
  const sourceVideo = assertPlayable(sourceInfo);

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "media-video-"));
  const output = path.join(workDir, "public.mp4");
  try {
    run("ffmpeg", [
      "-v", "error", "-y", "-i", file,
      "-map", "0:v:0", "-map", "0:a?",
      "-map_metadata", "-1", "-map_chapters", "-1",
      "-c", "copy",
      "-movflags", "+faststart",
      "-fflags", "+bitexact", "-flags:v", "+bitexact", "-flags:a", "+bitexact",
      output
    ]);
    const outputInfo = probe(output);
    assertPlayable(outputInfo);
    assertNoMetadata(outputInfo);
    const data = fs.readFileSync(output);

    // Rotation metadata is dropped with the rest, so use the coded size as displayed size.
    const posterPng = run("ffmpeg", ["-v", "error", "-i", output, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], { binary: true });
    const poster = await encodeFullWebp(posterPng);

    return { data, width: sourceVideo.width, height: sourceVideo.height, type: "video/mp4", poster };
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}
