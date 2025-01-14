import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';
import { IOfficeParserOptions } from './OfficeParserOptions';
export declare class OfficeParserConnector implements IDocumentParserConnector {
    readonly options?: IOfficeParserOptions | undefined;
    private static queue;
    private static isProcessing;
    private rootPath;
    constructor(options?: IOfficeParserOptions | undefined);
    parse(file: IFile | File): Promise<string>;
    getSupportedFileTypes(): string[];
    supports(file: IFile | File): boolean;
    private static processQueue;
}
