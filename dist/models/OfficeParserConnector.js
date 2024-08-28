import officeParser from 'officeparser';
export class OfficeParserConnector {
    static queue = [];
    static isProcessing = false;
    async parse(file) {
        try {
            return await (new Promise((resolve, reject) => {
                OfficeParserConnector.queue.push({ file, resolve, reject });
                OfficeParserConnector.processQueue();
            }));
        }
        catch (e) {
            throw new Error(`Failed to parse the file: ${e}`);
        }
    }
    getSupportedFileTypes() {
        return [
            '.docx',
            '.pptx',
            '.xlsx',
            '.odt',
            '.odp',
            '.ods',
            '.pdf',
        ];
    }
    supports(file) {
        return this.getSupportedFileTypes().includes(`.${file.name.split('.').pop()?.toLowerCase() || ''}`);
    }
    static async processQueue() {
        if (OfficeParserConnector.isProcessing) {
            return;
        }
        OfficeParserConnector.isProcessing = true;
        while (OfficeParserConnector.queue.length > 0) {
            const { file, resolve, reject } = OfficeParserConnector.queue.shift();
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const data = await officeParser.parseOfficeAsync(buffer);
                resolve(data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (e) {
                if (e instanceof Error) {
                    reject(e);
                }
            }
        }
        OfficeParserConnector.isProcessing = false;
    }
}
