import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';
export declare class OfficeParserConnector implements IDocumentParserConnector {
    private static queue;
    private static isProcessing;
    parse(file: IFile): Promise<string>;
    getSupportedFileTypes(): string[];
    supports(file: IFile): boolean;
    private static processQueue;
}
