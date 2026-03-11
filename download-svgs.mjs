import fs from 'fs';
import path from 'path';
import https from 'https';

const brands = {
  'toyota': 'toyota',
  'mercedes-benz': 'mercedes',
  'bmw': 'bmw',
  'porsche': 'porsche',
  'nissan': 'nissan',
  'audi': 'audi',
  'mazda': 'mazda',
  'subaru': 'subaru',
  'honda': 'honda',
  'land rover': 'landrover',
  'volvo': 'volvo',
};

const targetDir = path.join(process.cwd(), 'public', 'images', 'brands');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(brandKey, dest) {
  return new Promise((resolve, reject) => {
    const url = `https://cdn.simpleicons.org/${brandKey}/white`;
    const file = fs.createWriteStream(dest);
    
    const options = {
      headers: {
        'User-Agent': 'Node.js Script'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          https.get(response.headers.location, options, (res) => {
              res.pipe(file);
              file.on('finish', () => file.close(resolve));
          }).on('error', reject);
          return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const [brand, key] of Object.entries(brands)) {
    const dest = path.join(targetDir, `${brand}.svg`);
    console.log(`Downloading ${brand} logo from simpleicons...`);
    try {
      await download(key, dest);
      console.log(`Successfully downloaded ${brand} logo.`);
    } catch (err) {
      console.error(`Error downloading ${brand}:`, err.message);
    }
  }
}

run();
