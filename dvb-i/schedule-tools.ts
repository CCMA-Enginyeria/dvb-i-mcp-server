import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getXMLJSONFormated } from "../xml-utils.js";

export const registerScheduleTools = (server: McpServer) => {
  // DVB-I Schedule Information Tool - Now/Next Query
  server.tool(
    "fetch-now-and-next-programs-for-channel",
    "Retrieves the current and next scheduled program information for a specific DVB-I service. This endpoint implements the DVB-I Schedule Information query with the 'now_next=true' parameter as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns schedule events in TVA ProgramLocationTable format containing current and following program details.",
    {
      ScheduleInfoEndpoint: z.string().describe("The Schedule Information endpoint URL as specified in the DVB-I ServiceList. This endpoint implements the DVB-I Schedule Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      ContentGuideServiceRef: z.string().describe("The service identifier for which schedule information is requested. Must be either the UniqueIdentifier or ContentGuideServiceRef value from a DVB-I Service element in the ServiceList. This parameter corresponds to the 'sid' query parameter in the DVB-I specification."),
    },
    async ({ ScheduleInfoEndpoint, ContentGuideServiceRef }) => {
      const data = await getXMLJSONFormated(`${ScheduleInfoEndpoint}?sid=${ContentGuideServiceRef}&now_next=true`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

  // DVB-I Schedule Information Tool - Date Range Query
  server.tool(
    "fetch-schedule-for-date-range",
    "Retrieves scheduled program information for a specific DVB-I service within a defined time period. This endpoint implements the DVB-I Schedule Information query with start and end time parameters as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns schedule events in TVA ProgramLocationTable format for the specified time range.",
    {
      ScheduleInfoEndpoint: z.string().describe("The Schedule Information endpoint URL as specified in the DVB-I ServiceList. This endpoint implements the DVB-I Schedule Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      ContentGuideServiceRef: z.string().describe("The service identifier for which schedule information is requested. Must be either the UniqueIdentifier or ContentGuideServiceRef value from a DVB-I Service element in the ServiceList. This parameter corresponds to the 'sid' query parameter in the DVB-I specification."),
      start: z.string().describe("Start time for the schedule query in ISO 8601 format (e.g., '2024-01-15T10:00:00Z') or as a JavaScript Date string. Will be converted to Unix timestamp (seconds since epoch) for the DVB-I endpoint 'start' parameter."),
      end: z.string().describe("End time for the schedule query in ISO 8601 format (e.g., '2024-01-15T18:00:00Z') or as a JavaScript Date string. Will be converted to Unix timestamp (seconds since epoch) for the DVB-I endpoint 'end' parameter.")
    },
    async ({ ScheduleInfoEndpoint, ContentGuideServiceRef, start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);
      
      const data = await getXMLJSONFormated(`${ScheduleInfoEndpoint}?sid=${ContentGuideServiceRef}&start=${startTimestamp}&end=${endTimestamp}`);
      console.log('url', `${ScheduleInfoEndpoint}?sid=${ContentGuideServiceRef}&start=${startTimestamp}&end=${endTimestamp}`);
      console.log(`Schedule response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

};
