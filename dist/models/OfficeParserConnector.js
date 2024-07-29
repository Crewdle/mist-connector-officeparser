import officeParser from 'officeparser';
export class OfficeParserConnector {
    async parse(file) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const data = await officeParser.parseOfficeAsync(buffer);
            return data;
        }
        catch (e) {
            throw new Error(`Failed to parse the file: ${e}`);
        }
    }
}
