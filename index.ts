import express from "express";
import cors from "cors";
import dvbiRouter from "./dvb-i-endpoints.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Mcp-Session-Id', 'Last-Event-ID', 'Accept']
}));

// Mount the DVB-I router
app.use('/', dvbiRouter);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DVB-I MCP Server listening on port ${PORT}`);
});
