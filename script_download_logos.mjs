import https from 'https';
import fs from 'fs';
import path from 'path';

// Official car brand SVG logos from reliable sources
// Primary: Simple Icons CDN (reliable, always available)
// Fallback: Wikipedia/Wikimedia Commons
const brandLogos = {
  'toyota': 'https://cdn.simpleicons.org/toyota/000000',
  'mercedes-benz': 'https://cdn.simpleicons.org/mercedes/000000',
  'bmw': 'https://cdn.simpleicons.org/bmw/000000',
  'audi': 'https://cdn.simpleicons.org/audi/000000',
  'porsche': 'https://cdn.simpleicons.org/porsche/000000',
  'nissan': 'https://cdn.simpleicons.org/nissan/000000',
  'mazda': 'https://cdn.simpleicons.org/mazda/000000',
  'subaru': 'https://cdn.simpleicons.org/subaru/000000',
  'honda': 'https://cdn.simpleicons.org/honda/000000',
  'land-rover': 'https://cdn.simpleicons.org/landrover/000000',
  'volvo': 'https://cdn.simpleicons.org/volvo/000000',
  'lexus': 'https://cdn.simpleicons.org/lexus/000000',
  'lamborghini': 'https://cdn.simpleicons.org/lamborghini/000000',
  'mitsubishi': 'https://cdn.simpleicons.org/mitsubishi/000000',
  'suzuki': 'https://cdn.simpleicons.org/suzuki/000000',
  'ford': 'https://cdn.simpleicons.org/ford/000000',
  'daihatsu': 'https://cdn.simpleicons.org/daihatsu/000000',
  'volkswagen': 'https://cdn.simpleicons.org/volkswagen/000000',
  'range-rover': 'https://cdn.simpleicons.org/rangerover/000000',
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    
    https.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
        https.get(response.headers.location, options, (redirectResponse) => {
          if (redirectResponse.statusCode !== 200) {
            reject(new Error(`Redirect failed with status ${redirectResponse.statusCode}`));
            return;
          }
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed with status ${response.statusCode}`));
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

// Helper function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadAll() {
  console.log('Downloading official car brand logos from Wikipedia/Wikimedia...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  const entries = Object.entries(brandLogos);
  for (let i = 0; i < entries.length; i++) {
    const [brand, url] = entries[i];
    try {
      await downloadFile(url, `${brand}.svg`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to download ${brand}: ${error.message}`);
      failCount++;
    }
    
    // Add delay between requests to avoid rate limiting (except for last item)
    if (i < entries.length - 1) {
      await delay(1500); // 1.5 second delay
    }
  }
  
  console.log(`\nDone! Downloaded ${successCount}/${Object.keys(brandLogos).length} logos to public/images/brands/`);
  if (failCount > 0) {
    console.log(`Failed: ${failCount} logos`);
  }
}

downloadAll();