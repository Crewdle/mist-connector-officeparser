import { OfficeParserConnector } from './models/OfficeParserConnector';
export function getOfficeParserConnector(options) {
    if (!options) {
        return OfficeParserConnector;
    }
    return class OfficeParserConnectorWithInjectedOptions extends OfficeParserConnector {
        constructor() {
            super(options);
        }
    };
}
export { OfficeParserConnector };
