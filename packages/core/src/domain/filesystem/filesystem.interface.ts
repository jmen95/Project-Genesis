export interface FileStat {
  readonly isDirectory: boolean;
  readonly isFile: boolean;
}

export interface IFilesystem {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string): Promise<void>;
  readDir(path: string): Promise<string[]>;
  stat(path: string): Promise<FileStat>;
}
