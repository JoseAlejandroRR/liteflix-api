
export interface IStorageService {
  getObject(key: string): Promise<any>
  putObject(key: string, filePath: string): Promise<void>
  deleteObject(key: string): Promise<void>
}
