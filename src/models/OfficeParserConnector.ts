import officeParser from 'officeparser';

import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';

interface IParserQueue {
  file: IFile;
  resolve: (data: string) => void;
  reject: (error: Error) => void;
}

export class OfficeParserConnector implements IDocumentParserConnector{
  private static queue: IParserQueue[] = [];
  private static isProcessing = false;

  public async parse(file: IFile): Promise<string> {
    try {
      return new Promise<string>((resolve, reject) => {
        OfficeParserConnector.queue.push({ file, resolve, reject });
        OfficeParserConnector.processQueue();
      });
    } catch (e) {
      throw new Error(`Failed to parse the file: ${e}`);
    }
  }

  getSupportedFileTypes(): string[] {
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

  supports(file: IFile): boolean {
    return this.getSupportedFileTypes().includes(`.${file.name.split('.').pop() || ''}`);
  }

  private static async processQueue(): Promise<void> {
    if (OfficeParserConnector.isProcessing) {
      return;
    }

    OfficeParserConnector.isProcessing = true;

    while (OfficeParserConnector.queue.length > 0) {
      const { file, resolve, reject } = OfficeParserConnector.queue.shift() as IParserQueue;
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await officeParser.parseOfficeAsync(buffer);
        resolve(data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        if (e instanceof Error) {
          reject(e);
        }
      }
    }

    OfficeParserConnector.isProcessing = false;
  }
}
