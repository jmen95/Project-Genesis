import { constants } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

import { FilesystemError } from '../../domain/errors/genesis-error.js';
import type { IFilesystem } from '../../domain/filesystem/filesystem.interface.js';

export class NodeFilesystem implements IFilesystem {
  async read(path: string): Promise<string> {
    try {
      return await readFile(path, 'utf8');
    } catch (error) {
      throw new FilesystemError(`Failed to read file: ${path}`, error as Error);
    }
  }

  async write(path: string, content: string): Promise<void> {
    try {
      await writeFile(path, content, 'utf8');
    } catch (error) {
      throw new FilesystemError(`Failed to write file: ${path}`, error as Error);
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async mkdir(path: string): Promise<void> {
    try {
      await mkdir(path, { recursive: true });
    } catch (error) {
      throw new FilesystemError(`Failed to create directory: ${path}`, error as Error);
    }
  }
}
