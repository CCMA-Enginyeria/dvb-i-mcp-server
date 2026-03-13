import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getXMLJSONFormated } from "../xml-utils.js";

export const registerServiceListTools = (server: McpServer) => {
    // DVB-I Service List Tool
    server.tool(
        "fetch-dvb-i-service-list",
        "Retrieves the complete DVB-I Service List containing all available services and their metadata endpoints. This tool implements the DVB-I Service Discovery interface as defined in ETSI TS 103 770. The Service List contains service definitions including content guide references, delivery parameters, and metadata endpoint URLs for Schedule Information, Program Information, Group Information, and More Episodes endpoints.",
        {
            serviceList: z.string().describe("The URL of the DVB-I service list")
        },
        async ({ serviceList }) => {
            const data = await getXMLJSONFormated(serviceList);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
};
