import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { parseXMLToJSON } from "../xml-utils.js";
import { readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

export const registerAitxTools = (server: McpServer) => {
    
    // DVB-I Application Information Table (AITX) Parser Tool
    server.tool(
        "parse-dvb-i-aitx-application-information",
        "Parses and extracts application information from a DVB-I Application Information Table XML (AITX) file. This tool processes AITX files as defined in ETSI EN 102 809 for HbbTV applications and DVB-I client applications. Returns structured application metadata including domain names, application identifiers, transport protocols, and application descriptors.",
        {
            url: z.string().describe("The URL of the AITX file to parse. Must be a valid HTTP/HTTPS URL pointing to an XML file containing DVB Application Information Table data as defined in ETSI EN 102 809. The AITX format describes HbbTV and DVB-I applications available for a service.")
        },
        async ({ url }) => {
            try {
                const aitxData = await parseXMLToJSON(url);
                return {
                    content: [{ type: "text", text: JSON.stringify(extractAitxInfo(aitxData), null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error parsing AITX from URL: ${error.message}` }]
                };
            }
        }
    );
};

// Helper function to extract general AITX information
function extractAitxInfo(aitxData: any) {
    const serviceDiscovery = aitxData['mhp:ServiceDiscovery'] || aitxData.ServiceDiscovery;
    const applicationDiscovery = serviceDiscovery?.['mhp:ApplicationDiscovery'] || serviceDiscovery?.ApplicationDiscovery;
    
    return {
        domainName: applicationDiscovery?.['@_DomainName'] || applicationDiscovery?.DomainName,
        applicationCount: getApplicationCount(applicationDiscovery),
        applications: extractApplications(aitxData)
    };
}

// Helper function to extract applications list
function extractApplications(aitxData: any) {
    const serviceDiscovery = aitxData['mhp:ServiceDiscovery'] || aitxData.ServiceDiscovery;
    const applicationDiscovery = serviceDiscovery?.['mhp:ApplicationDiscovery'] || serviceDiscovery?.ApplicationDiscovery;
    const applicationList = applicationDiscovery?.['mhp:ApplicationList'] || applicationDiscovery?.ApplicationList;
    const applications = applicationList?.['mhp:Application'] || applicationList?.Application;

    if (!applications) return [];

    const appArray = Array.isArray(applications) ? applications : [applications];
    
    return appArray.map(app => ({
        name: app['mhp:appName']?.['#text'] || app['mhp:appName'] || app.appName?.['#text'] || app.appName,
        language: app['mhp:appName']?.['@_Language'] || app.appName?.['@_Language'],
        organizationId: app['mhp:applicationIdentifier']?.['mhp:orgId'] || app.applicationIdentifier?.orgId,
        applicationId: app['mhp:applicationIdentifier']?.['mhp:appId'] || app.applicationIdentifier?.appId,
        type: app['mhp:applicationDescriptor']?.['mhp:type']?.['mhp:OtherApp'] || 
              app.applicationDescriptor?.type?.OtherApp,
        controlCode: app['mhp:applicationDescriptor']?.['mhp:controlCode'] || 
                     app.applicationDescriptor?.controlCode,
        visibility: app['mhp:applicationDescriptor']?.['mhp:visibility'] || 
                    app.applicationDescriptor?.visibility,
        serviceBound: app['mhp:applicationDescriptor']?.['mhp:serviceBound'] || 
                      app.applicationDescriptor?.serviceBound,
        priority: app['mhp:applicationDescriptor']?.['mhp:priority'] || 
                  app.applicationDescriptor?.priority,
        version: app['mhp:applicationDescriptor']?.['mhp:version'] || 
                 app.applicationDescriptor?.version,
        urlBase: app['mhp:applicationTransport']?.['mhp:URLBase'] || 
                 app.applicationTransport?.URLBase,
        location: app['mhp:applicationLocation'] || app.applicationLocation
    }));
}

// Helper function to get application count
function getApplicationCount(applicationDiscovery: any) {
    const applicationList = applicationDiscovery?.['mhp:ApplicationList'] || applicationDiscovery?.ApplicationList;
    const applications = applicationList?.['mhp:Application'] || applicationList?.Application;
    
    if (!applications) return 0;
    return Array.isArray(applications) ? applications.length : 1;
}
