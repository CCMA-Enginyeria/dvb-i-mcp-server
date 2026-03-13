# DVB-I MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides access to DVB-I Service Discovery and Programme Metadata endpoints as defined in **ETSI TS 103 770**.

This server enables AI assistants and LLM-based applications to interact with DVB-I broadcast services, retrieve TV schedules, program information, and content metadata through a standardized MCP interface.

## Features

- **DVB-I Service Discovery**: Fetch and parse DVB-I Service Lists
- **Schedule Information**: Query current/next programs and schedule ranges
- **Program Metadata**: Retrieve detailed program information using CRIDs
- **Content Organization**: Access Box Sets, categories, and grouped content
- **Related Content**: Find related episodes and paginated content
- **MCP Protocol Support**: Full support for MCP Streamable HTTP and legacy SSE transports

## Quick Start

### Using Docker (Recommended)

```bash
# Pull and run the latest image
docker run -p 3001:3001 ghcr.io/ccma-enginyeria/dvb-i-mcp-server:latest

# Or use Docker Compose
docker compose up
```

### Using npm

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

The server will start on port `3001` by default.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | MCP Streamable HTTP endpoint (recommended) |
| `/sse` | GET | Legacy SSE transport for older MCP clients |
| `/messages` | POST | Legacy message endpoint for SSE transport |
| `/health` | GET | Health check endpoint |

## MCP Tools

The server exposes the following MCP tools for DVB-I operations:

### Service Discovery

| Tool | Description |
|------|-------------|
| `fetch-dvb-i-service-list` | Retrieves the complete DVB-I Service List |
| `get-current-datetime` | Returns server time for schedule queries |

### Schedule Information

| Tool | Description |
|------|-------------|
| `fetch-now-and-next-programs-for-channel` | Gets current and next program for a service |
| `fetch-schedule-for-date-range` | Gets schedule within a time range |

### Program Information

| Tool | Description |
|------|-------------|
| `fetch-program-detailed-information` | Retrieves detailed program metadata by CRID |
| `fetch-related-episodes-for-program` | Gets related episodes for a program |
| `fetch-paginated-content` | Handles pagination of large content sets |

### Content Organization (Box Sets)

| Tool | Description |
|------|-------------|
| `fetch-content-categories-for-service` | Gets available content categories |
| `fetch-groups-for-category` | Gets groups within a category |
| `fetch-programs-for-category-group` | Gets programs in a category group |

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |

## Usage Examples

### With MCP Inspector

1. Start the server: `npm start`
2. Open [MCP Inspector](https://inspector.modelcontextprotocol.io/)
3. Connect to `http://localhost:3001/mcp`
4. Browse and test available tools

### With Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "dvb-i": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

### Example: Fetching a Service List

Using the DVB-I Reference Service List:

```
Tool: fetch-dvb-i-service-list
Parameters:
  serviceList: "https://dvb-i-reference.dvb.org/client/backend/servicelist.php?list=example.xml"
```

### Example: Getting Current Program

```
Tool: fetch-now-and-next-programs-for-channel
Parameters:
  ScheduleInfoEndpoint: "https://example.com/schedule"
  ContentGuideServiceRef: "service_id_from_servicelist"
```

## DVB-I Specification Reference

This implementation follows the DVB-I specifications:

- **ETSI TS 103 770**: DVB-I Service Discovery and Programme Metadata
- **ETSI TS 102 323**: TV-Anytime metadata (TVA)
- **ETSI EN 102 809**: HbbTV Application Information Table (AITX)

### DVB-I Endpoints Implemented

| DVB-I Interface | Section | Implementation |
|-----------------|---------|----------------|
| Service List Discovery | 6.2 | `fetch-dvb-i-service-list` |
| Schedule Information | 6.3 | `fetch-now-and-next-programs-for-channel`, `fetch-schedule-for-date-range` |
| Program Information | 6.4 | `fetch-program-detailed-information` |
| More Episodes | 6.5 | `fetch-related-episodes-for-program`, `fetch-paginated-content` |
| Group Information | 6.7 | `fetch-content-categories-for-service`, `fetch-groups-for-category`, `fetch-programs-for-category-group` |

## Development

### Project Structure

```
dvb-i-mcp-server/
├── dvb-i/                    # DVB-I MCP tool implementations
│   ├── server.ts             # MCP server factory
│   ├── service-list-tools.ts # Service list tools
│   ├── schedule-tools.ts     # Schedule query tools
│   ├── program-detail-tools.ts
│   ├── more-episodes-tools.ts
│   ├── group-info-tools.ts   # Box Sets / categories tools
│   └── aitx-tools.ts         # Application Information Table parser
├── dvb-i-endpoints.ts        # Express router with MCP transports
├── xml-utils.ts              # XML parsing utilities
├── index.ts                  # Server entry point
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

### Building

```bash
# Compile TypeScript
npm run build

# Run compiled version
npm run serve
```

### Docker Build

```bash
# Build image locally
docker build -t dvb-i-mcp-server .

# Run container
docker run -p 3001:3001 dvb-i-mcp-server
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [DVB-I Reference Application](https://dvb-i-reference.dvb.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Acknowledgments

- [DVB Project](https://dvb.org/) for the DVB-I specification
- [Anthropic](https://anthropic.com/) for the Model Context Protocol
