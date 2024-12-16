import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';
export declare class OfficeParserConnector implements IDocumentParserConnector {
    private static queue;
    private static isProcessing;
    parse(file: IFile | File): Promise<string>;
    getSupportedFileTypes(): string[];
    supports(file: IFile | File): boolean;
    private static processQueue;
}
