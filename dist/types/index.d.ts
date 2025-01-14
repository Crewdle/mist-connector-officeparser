import { DocumentParserConnectorConstructor } from '@crewdle/web-sdk-types';
import { OfficeParserConnector } from './models/OfficeParserConnector';
import { IOfficeParserOptions } from './models/OfficeParserOptions';
export declare function getOfficeParserConnector(options?: IOfficeParserOptions): DocumentParserConnectorConstructor;
export { IOfficeParserOptions };
export { OfficeParserConnector };
