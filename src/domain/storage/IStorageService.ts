
export interface IStorageService {
  getObject(key: string): Promise<string>
  putObject(key: string, filePath: string): Promise<void>
  deleteObject(key: string): Promise<void>
}
