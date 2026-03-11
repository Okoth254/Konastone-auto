import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const brands = {
  'toyota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/1024px-Toyota.svg.png',
  'mercedes-benz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mercedes-Benz_Star_2022.svg/1024px-Mercedes-Benz_Star_2022.svg.png',
  'bmw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/BMW_logo_%28gray%29.svg/1024px-BMW_logo_%28gray%29.svg.png',
  'porsche': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Porsche_logo.svg/800px-Porsche_logo.svg.png',
  'nissan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.png/1024px-Nissan_logo.png',
  'audi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/1024px-Audi-Logo_2016.svg.png',
  'mazda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mazda_logo_with_emblem.svg/1024px-Mazda_logo_with_emblem.svg.png',
  'subaru': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Subaru_logo.svg/1200px-Subaru_logo.svg.png',
  'honda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/1024px-Honda_Logo.svg.png',
  'land rover': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Land_Rover_logo.svg/1024px-Land_Rover_logo.svg.png',
  'volvo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Volvo_logo_2021.svg/1200px-Volvo_logo_2021.svg.png',
};

const targetDir = path.join(process.cwd(), 'public', 'images', 'brands');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = url.startsWith('https') ? https.get : http.get;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    };
    get(url, options, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Follow redirect
          download(response.headers.location, dest).then(resolve).catch(reject);
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
  for (const [brand, url] of Object.entries(brands)) {
    const safeBrand = brand.replace(/\s+/g, '-');
    const dest = path.join(targetDir, `${safeBrand}.png`);
    console.log(`Downloading ${brand} logo...`);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${brand} logo.`);
    } catch (err) {
      console.error(`Error downloading ${brand}:`, err.message);
    }
  }
}

run();
