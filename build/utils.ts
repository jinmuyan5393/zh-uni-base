import fs from "fs";
import path from "path";
interface packageConfig {
  folder: string;
  callback: (size: string) => void;
}
export function getPackageSize(config: packageConfig) {
  let totalSize = 0;
  const { folder, callback } = config;
  function readDir(dirPath: string) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        readDir(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }

  readDir(folder);
  const size = (totalSize / (1024 * 1024)).toFixed(2);
  callback(`${size}MB`); // Convert size to MB
}
