import * as fs from 'fs';

import officeParser from 'officeparser';

import { IFile, IDocumentParserConnector } from '@crewdle/web-sdk-types';
import { IOfficeParserOptions } from './OfficeParserOptions';

interface IParserQueue {
  file: IFile | File;
  resolve: (data: string) => void;
  reject: (error: Error) => void;
}

export class OfficeParserConnector implements IDocumentParserConnector{
  private static queue: IParserQueue[] = [];
  private static isProcessing = false;
  private rootPath: string;

  constructor(
    readonly options?: IOfficeParserOptions,
  ) {
    const baseFolder = options?.baseFolder ?? '.';
    this.rootPath = `${baseFolder}/officeParserTemp`;

    if (!fs.existsSync(this.rootPath)) {
      fs.mkdirSync(this.rootPath);
    }
  }

  public async parse(file: IFile | File): Promise<string> {
    try {
      return await (new Promise<string>((resolve, reject) => {
        OfficeParserConnector.queue.push({ file, resolve, reject });
        OfficeParserConnector.processQueue(this.rootPath);
      }));
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

  supports(file: IFile | File): boolean {
    return this.getSupportedFileTypes().includes(`.${file.name.split('.').pop()?.toLowerCase() || ''}`);
  }

  private static async processQueue(rootPath: string): Promise<void> {
    if (OfficeParserConnector.isProcessing) {
      return;
    }

    OfficeParserConnector.isProcessing = true;

    while (OfficeParserConnector.queue.length > 0) {
      const { file, resolve, reject } = OfficeParserConnector.queue.shift() as IParserQueue;
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await officeParser.parseOfficeAsync(buffer, {
          tempFilesLocation: rootPath,
        });
        resolve(data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e: any) {
        console.error('Error parsing the file', e);
        reject(e);
      }
    }

    OfficeParserConnector.isProcessing = false;
  }
}
