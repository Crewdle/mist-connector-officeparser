import { DocumentParserConnectorConstructor } from '@crewdle/web-sdk-types';
import { OfficeParserConnector } from './models/OfficeParserConnector';
import { IOfficeParserOptions } from './models/OfficeParserOptions';

export function getOfficeParserConnector(options?: IOfficeParserOptions): DocumentParserConnectorConstructor {
  if (!options) {
    return OfficeParserConnector;
  }

  return class OfficeParserConnectorWithInjectedOptions extends OfficeParserConnector {
    constructor() {
      super(options);
    }
  }
}

export { IOfficeParserOptions };
export { OfficeParserConnector };
