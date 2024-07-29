import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';
export declare class OfficeParserConnector implements IDocumentParserConnector {
    parse(file: IFile): Promise<string>;
}
