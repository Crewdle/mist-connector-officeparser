import officeParser from 'officeparser';

import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';

export class OfficeParserConnector implements IDocumentParserConnector{
  public async parse(file: IFile): Promise<string> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await officeParser.parseOfficeAsync(buffer);
      return data;
    } catch (e) {
      throw new Error(`Failed to parse the file: ${e}`);
    }
  }
}
