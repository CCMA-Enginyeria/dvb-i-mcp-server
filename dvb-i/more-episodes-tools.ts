import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getXMLJSONFormated } from "../xml-utils.js";

export const registerMoreEpisodesTools = (server: McpServer) => {
  
  // DVB-I More Episodes Tool
  server.tool(
    "fetch-related-episodes-for-program",
    "Retrieves additional episodes or related content for a specific program using its Content Reference Identifier (CRID). This endpoint implements the DVB-I More Episodes interface as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns related content in TVA format, typically including series episodes, seasons, or thematically related programs.",
    {
      MoreEpisodesEndpoint: z.string().describe("The More Episodes endpoint URL as specified in the DVB-I ServiceList or obtained from a ProgramInformation response. This endpoint implements the DVB-I More Episodes interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      programId: z.string().describe("The Content Reference Identifier (CRID) of the program for which related episodes are requested. Must be a valid CRID as specified in ETSI TS 102 323, typically found in the @programId attribute of a ProgramInformation element or @crid attribute of a ScheduleEvent or OnDemandProgram. This parameter corresponds to the 'pid' query parameter in the DVB-I specification.")
    },
    async ({ MoreEpisodesEndpoint, programId }) => {
      const data = await getXMLJSONFormated(`${MoreEpisodesEndpoint}?pid=${programId}`);
      console.log(`Fetching program info from: ${MoreEpisodesEndpoint}?pid=${programId}`);
      console.log(`Program info response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

   // DVB-I Paginated Content Tool
  server.tool(
    "fetch-paginated-content",
    "Retrieves paginated content from a DVB-I metadata endpoint. This tool handles pagination of large content sets as defined by the DVB-I Service Discovery and Programme Metadata specification, using the 'urn:fvc:metadata:cs:HowRelatedCS:2015-12:pagination' relationship. Returns additional content pages in TVA format when the initial response contains pagination references.",
    {
      mediaUri: z.string().describe("The Media URI for the paginated content resource. Must be a valid HTTP or HTTPS URL as specified in a HowRelated element with href='urn:fvc:metadata:cs:HowRelatedCS:2015-12:pagination'. This URI points to the next page of content in a paginated response from DVB-I metadata endpoints.")
    },
    async ({ mediaUri }) => {
      const data = await getXMLJSONFormated(mediaUri);
      console.log(`Fetching more episodes from: ${mediaUri}`);
      console.log(`Program info response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );
};
