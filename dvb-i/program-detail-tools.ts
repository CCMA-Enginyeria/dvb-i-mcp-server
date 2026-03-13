import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getXMLJSONFormated } from "../xml-utils.js";

export const registerProgramDetailTools = (server: McpServer) => {
  
  // DVB-I Program Information Tool
  server.tool(
    "fetch-program-detailed-information",
    "Retrieves detailed program metadata for a specific program using its Content Reference Identifier (CRID). This endpoint implements the DVB-I Program Information interface as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns detailed program information in TVA ProgramInformation format including synopsis, credits, categories, and related content.",
    {
      ProgramInfoEndpoint: z.string().describe("The Program Information endpoint URL as specified in the DVB-I ServiceList or ScheduleEvent. This endpoint implements the DVB-I Program Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      programId: z.string().describe("The Content Reference Identifier (CRID) of the program for which detailed information is requested. Must be a valid CRID as specified in ETSI TS 102 323, typically found in the @programId attribute of a ProgramInformation element or @crid attribute of a ScheduleEvent or OnDemandProgram. This parameter corresponds to the 'pid' query parameter in the DVB-I specification.")
    },
    async ({ ProgramInfoEndpoint, programId }) => {
      const data = await getXMLJSONFormated(`${ProgramInfoEndpoint}?pid=${programId}`);
      console.log(`Fetching program info from: ${ProgramInfoEndpoint}?pid=${programId}`);
      console.log(`Program info response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );
};
