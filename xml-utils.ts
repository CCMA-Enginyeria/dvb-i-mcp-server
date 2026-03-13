import { XMLParser } from "fast-xml-parser";
import axios from "axios";

const options = {
    ignoreAttributes : false,
    attributeNamePrefix : "@",
    alwaysCreateTextNode: false
};

const parser = new XMLParser(options);

// Create axios instance
const api = axios.create({
    timeout: 30000,
});

export const getXMLJSONFormated = async (url: string): Promise<string> => {
    console.log('url', url);
    const response = await api.get(url);
    let parsedData = parser.parse(response.data);
    return JSON.stringify(parsedData);
};

export const parseXMLToJSON = async (url: string): Promise<any> => {
    console.log('url', url);
    const response = await api.get(url);
    return parser.parse(response.data);
};
