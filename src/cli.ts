#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_MCP_URL = 'https://mcp.influship.com/mcp';
const API_KEY_ERROR = 'Set INFLUSHIP_API_KEY before running @influship/mcp.';

type CliEnvironment = Record<string, string | undefined>;

export function buildMcpRemoteArgs(
  env: CliEnvironment,
  passthroughArgs: readonly string[]
): string[] {
  const apiKey = env.INFLUSHIP_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(API_KEY_ERROR);
  }

  const remoteUrl = env.INFLUSHIP_MCP_URL?.trim() || DEFAULT_MCP_URL;
  return [remoteUrl, '--header', `X-API-Key:${apiKey}`, ...passthroughArgs];
}

export function runCli(argv = process.argv.slice(2), env: CliEnvironment = process.env): void {
  let args: string[];
  try {
    args = buildMcpRemoteArgs(env, argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
    return;
  }

  const child = spawn(process.execPath, [resolveMcpRemoteBin(), ...args], {
    env: process.env,
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exitCode = code ?? 1;
  });

  child.on('error', (error) => {
    console.error(`Failed to start mcp-remote: ${error.message}`);
    process.exitCode = 1;
  });
}

function resolveMcpRemoteBin(): string {
  const require = createRequire(import.meta.url);
  const packageJsonPath = require.resolve('mcp-remote/package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    bin?: Record<string, string>;
  };
  const binPath = packageJson.bin?.['mcp-remote'];
  if (!binPath) {
    throw new Error('mcp-remote package is missing its mcp-remote binary.');
  }
  return join(dirname(packageJsonPath), binPath);
}

export function isCliEntrypoint(moduleUrl: string, argvPath: string | undefined): boolean {
  if (!argvPath) {
    return false;
  }

  return normalizePath(fileURLToPath(moduleUrl)) === normalizePath(argvPath);
}

function normalizePath(path: string): string {
  const resolvedPath = resolve(path);

  try {
    return realpathSync.native(resolvedPath);
  } catch {
    return resolvedPath;
  }
}

if (isCliEntrypoint(import.meta.url, process.argv[1])) {
  runCli();
}
