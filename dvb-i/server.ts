import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";
import { registerServiceListTools } from "./service-list-tools.js";
import { registerScheduleTools } from "./schedule-tools.js";
import { registerProgramDetailTools } from "./program-detail-tools.js";
import { registerAitxTools } from "./aitx-tools.js";
import { registerMoreEpisodesTools } from "./more-episodes-tools.js";
import { registerGroupInfoTools } from "./group-info-tools.js";

const parser = new XMLParser();

export const getServer = () => {
  const server = new McpServer({
    name: "DVB-I Service Discovery and Programme Metadata Server",
    version: "1.0.0"
  });

   // Utility tool for timestamp reference
  server.tool(
    "get-current-datetime",
    "Returns the server current time and timeZone. This utility tool provides timestamp reference for DVB-I schedule queries and time-based operations.",
    {},
    async () => {
      const currentTime = new Date().toISOString();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = JSON.stringify({currentTime, timeZone});
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

  registerServiceListTools(server);
  
  registerScheduleTools(server);

  registerProgramDetailTools(server);

  //registerAitxTools(server)

  registerMoreEpisodesTools(server);

  registerGroupInfoTools(server);

  return server;
};
