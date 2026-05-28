# Influship MCP

AI-native creator discovery for influencer marketing workflows. Influship gives
ChatGPT, Claude, Cursor, Codex, VS Code, and other MCP-compatible agents typed
tools for creator search, lookalikes, profile lookup, post lookup, and Instagram
post transcript analysis.

<!-- mcp-name: io.github.influship/influship-mcp -->

## What Agents Can Do

- Search for creators by audience, niche, location, platform, and campaign-fit
  criteria.
- Find creator lookalikes from known winners or competitor talent lists.
- Resolve creator profiles and social handles across Instagram, TikTok, and
  YouTube-oriented workflows.
- Pull creator records, posts, and Instagram transcript data into briefs,
  prospecting lists, market maps, and outreach research.

## Remote Server

Use the hosted Streamable HTTP server when your MCP client supports remote MCP:

```bash
claude mcp add influship --transport http https://mcp.influship.com/mcp --header "X-API-Key: YOUR_KEY"
```

## NPX / Stdio

Use the npm package for clients that only support stdio:

```bash
INFLUSHIP_API_KEY=YOUR_KEY npx -y @influship/mcp
```

The package is a small stdio bridge to the hosted Influship MCP server. It keeps
the data, auth, billing, and rate limits on the same production API surface as
the remote server.

For local development or staging:

```bash
INFLUSHIP_API_KEY=YOUR_KEY INFLUSHIP_MCP_URL=http://localhost:8080/mcp npx -y @influship/mcp
```

## Client Config

```json
{
  "mcpServers": {
    "influship": {
      "command": "npx",
      "args": ["-y", "@influship/mcp"],
      "env": {
        "INFLUSHIP_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

## Tools

- `search_creators`
- `autocomplete_creators`
- `find_lookalike_creators`
- `match_creators`
- `get_creator`
- `get_profile`
- `lookup_profiles`
- `get_posts`
- Instagram post and transcript tools when enabled on the hosted MCP server

## Links

- Docs: https://docs.influship.com/guides/mcp-server
- API keys: https://developers.influship.com
- Hosted MCP endpoint: https://mcp.influship.com/mcp

## Publishing

The official MCP Registry metadata lives in `server.json` and advertises both
the hosted Streamable HTTP server and the npm stdio package.

```bash
pnpm install
pnpm test
pnpm build
npm publish --access public
```

After npm publish, submit `server.json` with the official MCP Registry publisher
and use this repository URL for directory submissions.
