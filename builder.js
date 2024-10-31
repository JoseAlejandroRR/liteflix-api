const fs = require('fs-extra');
const archiver = require('archiver');
const { execSync } = require('child_process');
const path = require('path');

const DIST_FOLDER = path.resolve(__dirname, 'dist/');
const TEMP_FOLDER = path.resolve(__dirname, 'temp_dist');
const OUTPUT_ZIP = path.resolve(__dirname, 'dist.zip');

(async () => {
  try {

    await fs.remove(TEMP_FOLDER);
    await fs.copy(DIST_FOLDER, TEMP_FOLDER);

    await fs.copy(path.resolve(__dirname, 'package.json'), path.join(TEMP_FOLDER, 'package.json'));
    await fs.copy(path.resolve(__dirname, 'tsconfig.json'), path.join(TEMP_FOLDER, 'tsconfig.json'));
    await fs.copy(path.resolve(__dirname, './tdd-reports/'), path.join(TEMP_FOLDER, './tdd-reports/'));

    execSync('npm install --production --os=linux --cpu=x64', { cwd: TEMP_FOLDER, stdio: 'inherit' });
    //execSync('npm install --os=linux --cpu=x64 sharp', { cwd: TEMP_FOLDER, stdio: 'inherit' });
    //execSync('npm install --os=linux --cpu=x64 ', { cwd: TEMP_FOLDER, stdio: 'inherit' });

    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`ZIP generated:  (${archive.pointer()} bytes)`);
    })

    archive.on('error', (err) => {
      throw err;
    })

    archive.pipe(output);

    archive.directory(TEMP_FOLDER, false);

    await archive.finalize();

    await fs.remove(TEMP_FOLDER);

    console.log('Zip generated:', OUTPUT_ZIP);
  } catch (error) {
    console.error('[builder] Error:', error);
  }
})();
