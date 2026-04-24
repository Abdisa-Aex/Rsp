const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const ICONS_DIR = path.join(process.cwd(), 'public/icons');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Colors
const PRIMARY_COLOR = '#10b981';
const SECONDARY_COLOR = '#059669';
const DANGER_COLOR = '#ef4444';

/**
 * Ensure icons directory exists
 */
async function ensureDirectories() {
  await fs.ensureDir(ICONS_DIR);
  console.log('✓ Ensured icons directory exists');
}

/**
 * Generate main app icon for a specific size
 */
async function generateMainIcon(size) {
  const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY_COLOR}"/>
          <stop offset="100%" style="stop-color:${SECONDARY_COLOR}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.2)}" fill="url(#grad)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" 
            font-size="${Math.floor(size * 0.4)}">RH</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
  
  console.log(`  ✓ Generated icon-${size}x${size}.png`);
}

/**
 * Generate notification badge icon
 */
async function generateBadge() {
  const svgBuffer = Buffer.from(`
    <svg width="72" height="72" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="36" fill="${DANGER_COLOR}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" 
            font-size="40">!</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(ICONS_DIR, 'badge-72x72.png'));
  
  console.log('  ✓ Generated badge-72x72.png');
}

/**
 * Generate action shortcut icons (for app shortcuts menu)
 */
async function generateActionIcon(name, emoji, size = 96) {
  const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.2)}" fill="${PRIMARY_COLOR}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" 
            font-size="${Math.floor(size * 0.5)}">${emoji}</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(ICONS_DIR, `${name}.png`));
  
  console.log(`  ✓ Generated ${name}.png`);
}

/**
 * Generate favicon.ico
 */
async function generateFavicon() {
  const svgBuffer = Buffer.from(`
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="${PRIMARY_COLOR}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" 
            font-size="20">RH</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
  
  // Also create .ico format (using png as fallback, rename to .ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
  
  console.log('  ✓ Generated favicon.ico');
}

/**
 * Generate Apple Touch Icon (for iOS home screen)
 */
async function generateAppleTouchIcon() {
  const svgBuffer = Buffer.from(`
    <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" rx="36" fill="${PRIMARY_COLOR}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" 
            font-size="72">RH</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  
  console.log('  ✓ Generated apple-touch-icon.png');
}

/**
 * Generate OG Image (for social media sharing)
 */
async function generateOGImage() {
  const svgBuffer = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="${PRIMARY_COLOR}"/>
      <circle cx="600" cy="315" r="200" fill="${SECONDARY_COLOR}" opacity="0.5"/>
      <text x="600" y="280" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" 
            font-size="64">ResourceHub</text>
      <text x="600" y="360" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, Helvetica, sans-serif" 
            font-size="32">Share Resources, Build Community</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
  
  console.log('  ✓ Generated og-image.png');
}

/**
 * Generate a sample screenshot (optional)
 */
async function generateScreenshot() {
  // Create a simple screenshot placeholder
  const svgBuffer = Buffer.from(`
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#f3f4f6"/>
      <rect x="50" y="50" width="1180" height="620" rx="20" fill="white" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="100" y="100" width="400" height="300" rx="10" fill="${PRIMARY_COLOR}" opacity="0.1"/>
      <rect x="550" y="100" width="630" height="60" rx="8" fill="#e5e7eb"/>
      <rect x="550" y="180" width="630" height="30" rx="4" fill="#e5e7eb"/>
      <rect x="550" y="220" width="500" height="30" rx="4" fill="#e5e7eb"/>
      <text x="300" y="250" dominant-baseline="middle" text-anchor="middle" 
            fill="${PRIMARY_COLOR}" font-family="Arial, sans-serif" font-weight="bold" 
            font-size="32">ResourceHub</text>
      <text x="300" y="300" dominant-baseline="middle" text-anchor="middle" 
            fill="#6b7280" font-family="Arial, sans-serif" 
            font-size="18">Share resources with your community</text>
    </svg>
  `);

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'screenshot.png'));
  
  console.log('  ✓ Generated screenshot.png');
}

/**
 * Main function to generate all icons
 */
async function generateAllIcons() {
  console.log('\n🎨 Generating PWA Icons for ResourceHub...\n');
  
  const startTime = Date.now();
  
  try {
    // Ensure directories exist
    await ensureDirectories();
    
    // Generate main app icons (parallel for speed)
    console.log('\n📱 Generating app icons...');
    await Promise.all(SIZES.map(size => generateMainIcon(size)));
    
    // Generate badge icon
    console.log('\n🔔 Generating notification badge...');
    await generateBadge();
    
    // Generate action shortcut icons
    console.log('\n⚡ Generating app shortcut icons...');
    await generateActionIcon('share-icon', '📤');
    await generateActionIcon('browse-icon', '🔍');
    await generateActionIcon('messages-icon', '💬');
    
    // Generate favicon
    console.log('\n🌐 Generating favicon...');
    await generateFavicon();
    
    // Generate Apple Touch Icon
    console.log('\n🍎 Generating Apple Touch Icon...');
    await generateAppleTouchIcon();
    
    // Generate OG Image (optional)
    console.log('\n📸 Generating OG image for social media...');
    await generateOGImage();
    
    // Generate screenshot (optional)
    await generateScreenshot();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n✅ All icons generated successfully!\n');
    console.log(`📁 Location: ${ICONS_DIR}`);
    console.log(`⏱️  Time taken: ${duration} seconds`);
    console.log('\n📱 Your PWA is now ready for installation!\n');
    
  } catch (error) {
    console.error('\n❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateAllIcons();
}

module.exports = {
  generateMainIcon,
  generateBadge,
  generateActionIcon,
  generateAllIcons
};