import * as fs from 'fs';
import officeParser from 'officeparser';
export class OfficeParserConnector {
    options;
    static queue = [];
    static isProcessing = false;
    rootPath;
    constructor(options) {
        this.options = options;
        const baseFolder = options?.baseFolder ?? '.';
        this.rootPath = `${baseFolder}/officeParserTemp`;
        if (!fs.existsSync(this.rootPath)) {
            fs.mkdirSync(this.rootPath);
        }
    }
    async parse(file) {
        try {
            return await (new Promise((resolve, reject) => {
                OfficeParserConnector.queue.push({ file, resolve, reject });
                OfficeParserConnector.processQueue(this.rootPath);
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
    static async processQueue(rootPath) {
        if (OfficeParserConnector.isProcessing) {
            return;
        }
        OfficeParserConnector.isProcessing = true;
        while (OfficeParserConnector.queue.length > 0) {
            const { file, resolve, reject } = OfficeParserConnector.queue.shift();
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const data = await officeParser.parseOfficeAsync(buffer, {
                    tempFilesLocation: rootPath,
                });
                resolve(data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (e) {
                console.error('Error parsing the file', e);
                reject(e);
            }
        }
        OfficeParserConnector.isProcessing = false;
    }
}
