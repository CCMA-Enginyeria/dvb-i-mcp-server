import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Request, Response } from "express";
import { getServer as getDVBIServer } from "./dvb-i/server.js";

const dvbiRouter = express.Router();

const transports = {
  streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>
};

// Legacy SSE endpoint for older clients
dvbiRouter.get('/sse', async (req, res) => {
  // Create SSE transport for legacy clients
  const transport = new SSEServerTransport('/messages', res);
  transports.sse[transport.sessionId] = transport;

  const server = getDVBIServer();
  res.on("close", () => {
    delete transports.sse[transport.sessionId];
  });

  await server.connect(transport);
});

// Legacy message endpoint for older clients
dvbiRouter.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.sse[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

dvbiRouter.post('/mcp', async (req: Request, res: Response) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.

  try {
    const server = getDVBIServer();
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on('close', () => {
      console.log('DVB-I Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling DVB-I MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

dvbiRouter.get('/mcp', async (req: Request, res: Response) => {
  console.log('Received GET DVB-I MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

// Health check endpoint
dvbiRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const status = {
      status: 'ok',
      service: 'DVB-I MCP Server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(status);
  } catch (error) {
    console.error('DVB-I Health check failed:', error);
    res.status(500).json({
      status: 'error',
      service: 'DVB-I MCP Server',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

dvbiRouter.delete('/mcp', async (req: Request, res: Response) => {
  console.log('Received DELETE DVB-I MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

export default dvbiRouter;
