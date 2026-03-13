import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getXMLJSONFormated } from "../xml-utils.js";

export const registerGroupInfoTools = (server: McpServer) => {
  
  // DVB-I Group Information Tool - Categories Query
  server.tool(
    "fetch-content-categories-for-service",
    "Retrieves available content categories (Box Sets) for a specific DVB-I service. This endpoint implements the DVB-I Group Information categories interface as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns a list of available content groupings such as genres, series collections, or thematic categories in TVA GroupInformation format.",
    {
      GroupInfoEndpoint: z.string().describe("The Group Information endpoint URL as specified in the DVB-I ServiceList. This endpoint implements the DVB-I Group Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL. The '/categories' path will be appended automatically."),
      ContentGuideServiceRef: z.string().describe("The service identifier for which content categories are requested. Must be either the UniqueIdentifier or ContentGuideServiceRef value from a DVB-I Service element in the ServiceList. This parameter corresponds to the 'sid' query parameter in the DVB-I specification."),
    },
    async ({ GroupInfoEndpoint, ContentGuideServiceRef }) => {
      const data = await getXMLJSONFormated(`${GroupInfoEndpoint}/categories?sid=${ContentGuideServiceRef}`);
      console.log(`Fetching categories info from: ${GroupInfoEndpoint}/categories?sid=${ContentGuideServiceRef}`);
      console.log(`Categories response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

   // DVB-I Group Information Tool - Group Content Query
  server.tool(
    "fetch-groups-for-category",
    "Retrieves groups belonging to a specific category for a DVB-I service. This endpoint implements the DVB-I Group Information content query interface as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns detailed content listings for the specified group in TVA format, including on-demand programs and related metadata.",
    {
      GroupInfoEndpoint: z.string().describe("The Group Information endpoint URL as specified in the DVB-I ServiceList. This endpoint implements the DVB-I Group Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      groupId: z.string().describe("The Content Reference Identifier (CRID) of the category for which category is requested. Must be a valid CRID as specified in ETSI TS 102 323, obtained from the @groupId attribute of a GroupInformation fragment in a Box Sets Categories response. This parameter corresponds to the 'groupId' query parameter in the DVB-I specification."),
      ContentGuideServiceRef: z.string().describe("The service identifier for which group content is requested. Must be either the UniqueIdentifier or ContentGuideServiceRef value from a DVB-I Service element in the ServiceList. This parameter corresponds to the 'sid' query parameter in the DVB-I specification."),
    },
    async ({ GroupInfoEndpoint, groupId, ContentGuideServiceRef }) => {
      const data = await getXMLJSONFormated(`${GroupInfoEndpoint}?groupId=${groupId}&sid=${ContentGuideServiceRef}`);
      console.log(`Fetching categories info from: ${GroupInfoEndpoint}?groupId=${groupId}&sid=${ContentGuideServiceRef}`);
      console.log(`Categories response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );

  // DVB-I Group Information Tool - Group Content Query
  server.tool(
    "fetch-programs-for-category-group",
    "Retrieves the programs belonging to a specific category group for a DVB-I service. This endpoint implements the DVB-I Group Information content query interface as defined in the DVB-I Service Discovery and Programme Metadata specification. Returns detailed content listings for the specified group in TVA format, including on-demand programs and related metadata.",
    {
      GroupInfoEndpoint: z.string().describe("The Group Information endpoint URL as specified in the DVB-I ServiceList. This endpoint implements the DVB-I Group Information interface defined in ETSI TS 103 770. Must be a valid HTTP/HTTPS URL."),
      groupId: z.string().describe("The Content Reference Identifier (CRID) of the category group for which content is requested. Must be a valid CRID as specified in ETSI TS 102 323, obtained from the @groupId attribute of a GroupInformation fragment in a Box Sets Category Group response. This parameter corresponds to the 'groupId' query parameter in the DVB-I specification."),
      ContentGuideServiceRef: z.string().describe("The service identifier for which group content is requested. Must be either the UniqueIdentifier or ContentGuideServiceRef value from a DVB-I Service element in the ServiceList. This parameter corresponds to the 'sid' query parameter in the DVB-I specification."),
    },
    async ({ GroupInfoEndpoint, groupId, ContentGuideServiceRef }) => {
      const data = await getXMLJSONFormated(`${GroupInfoEndpoint}/contents?groupId=${groupId}&sid=${ContentGuideServiceRef}`);
      console.log(`Fetching content  info from: ${GroupInfoEndpoint}/contents?groupId=${groupId}&sid=${ContentGuideServiceRef}`);
      console.log(`content  response: ${data.substring(0, 200)}...`);
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );
};
