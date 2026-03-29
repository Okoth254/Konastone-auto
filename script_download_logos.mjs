import https from 'https';
import fs from 'fs';
import path from 'path';

// WorldVectorLogo URLs for car brand logos (verified SVG endpoints)
const brandLogos = {
  'toyota': 'https://cdn.worldvectorlogo.com/logos/toyota-1.svg',
  'mercedes-benz': 'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg',
  'bmw': 'https://cdn.worldvectorlogo.com/logos/bmw-1.svg',
  'audi': 'https://cdn.worldvectorlogo.com/logos/audi-11.svg',
  'porsche': 'https://cdn.worldvectorlogo.com/logos/porsche-1.svg',
  'nissan': 'https://cdn.worldvectorlogo.com/logos/nissan-6.svg',
  'mazda': 'https://cdn.worldvectorlogo.com/logos/mazda.svg',
  'subaru': 'https://cdn.worldvectorlogo.com/logos/subaru.svg',
  'honda': 'https://cdn.worldvectorlogo.com/logos/honda.svg',
  'land-rover': 'https://cdn.worldvectorlogo.com/logos/land-rover.svg',
  'volvo': 'https://cdn.worldvectorlogo.com/logos/volvo-1.svg',
  'lexus': 'https://cdn.worldvectorlogo.com/logos/lexus.svg',
  'lamborghini': 'https://cdn.worldvectorlogo.com/logos/lamborghini.svg',
  'mitsubishi': 'https://cdn.worldvectorlogo.com/logos/mitsubishi.svg',
  'suzuki': 'https://cdn.worldvectorlogo.com/logos/suzuki.svg',
  'ford': 'https://cdn.worldvectorlogo.com/logos/ford-1.svg',
  'daihatsu': 'https://cdn.worldvectorlogo.com/logos/daihatsu.svg',
  'volkswagen': 'https://cdn.worldvectorlogo.com/logos/volkswagen-1.svg',
  'range-rover': 'https://cdn.worldvectorlogo.com/logos/range-rover-1.svg',
};

const outputDir = './public/images/brands';

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);
    
    const options = {
      headers: {
        'User-Agent': 'KonastoneBot/1.0 (https://konastoneautos.co.ke; eugene@konastoneautos.co.ke)'
      }
    };
    
    https.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, options, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading brand logos from Wikimedia...\n');
  
  for (const [brand, url] of Object.entries(brandLogos)) {
    try {
      await downloadFile(url, `${brand}.svg`);
    } catch (error) {
      console.error(`✗ Failed to download ${brand}: ${error.message}`);
    }
  }
  
  console.log('\nDone! All logos saved to public/images/brands/');
}

downloadAll();