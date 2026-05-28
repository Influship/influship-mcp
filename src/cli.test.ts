import { describe, expect, it } from 'vitest';
import { buildMcpRemoteArgs } from './cli.js';

describe('buildMcpRemoteArgs', () => {
  it('bridges stdio clients to the hosted Influship MCP server with the API key header', () => {
    expect(
      buildMcpRemoteArgs(
        {
          INFLUSHIP_API_KEY: 'infl_test_123',
        },
        []
      )
    ).toEqual(['https://mcp.influship.com/mcp', '--header', 'X-API-Key:infl_test_123']);
  });

  it('allows overriding the remote MCP URL for development and forwards extra mcp-remote args', () => {
    expect(
      buildMcpRemoteArgs(
        {
          INFLUSHIP_API_KEY: 'infl_test_123',
          INFLUSHIP_MCP_URL: 'http://localhost:8080/mcp',
        },
        ['--debug']
      )
    ).toEqual(['http://localhost:8080/mcp', '--header', 'X-API-Key:infl_test_123', '--debug']);
  });

  it('rejects empty or missing API keys before starting mcp-remote', () => {
    expect(() => buildMcpRemoteArgs({}, [])).toThrow(
      'Set INFLUSHIP_API_KEY before running @influship/mcp.'
    );
    expect(() => buildMcpRemoteArgs({ INFLUSHIP_API_KEY: '   ' }, [])).toThrow(
      'Set INFLUSHIP_API_KEY before running @influship/mcp.'
    );
  });
});
