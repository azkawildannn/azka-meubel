import { chromium } from 'playwright';
import { createWriteStream, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = join(__dirname, 'artifacts', 'visual-audit');
const SCREENSHOTS_DIR = join(OUTPUT_DIR, 'screenshots');
const REFERENCES_DIR = join(OUTPUT_DIR, 'references');

const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 }
};

const PUBLIC_PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'products', path: '/products' },
  { name: 'contact', path: '/contact' }
];

const ADMIN_PAGES = [
  { name: 'admin-login', path: '/admin/login' },
  { name: 'admin-dashboard', path: '/admin', requiresAuth: true },
  { name: 'admin-products', path: '/admin/products', requiresAuth: true },
  { name: 'admin-products-new', path: '/admin/products/new', requiresAuth: true }
];

const issues = [];

function logIssue(severity, page, viewport, description) {
  issues.push({ severity, page, viewport, description });
  console.log(`[${severity}] ${page} (${viewport}): ${description}`);
}

async function captureScreenshot(page, name, viewport) {
  const viewportDir = join(SCREENSHOTS_DIR, viewport);
  const filename = join(viewportDir, `${name}.png`);
  
  await page.screenshot({ 
    path: filename, 
    fullPage: true 
  });
  
  console.log(`✓ Captured: ${name}-${viewport}.png`);
  return filename;
}

async function checkLayoutIssues(page, pageName, viewport) {
  const checks = await page.evaluate(() => {
    const results = {
      horizontalOverflow: false,
      failedImages: [],
      distortedImages: [],
      consoleErrors: [],
      dimensions: {}
    };

    // Check horizontal overflow
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;
    if (bodyWidth > viewportWidth + 1) {
      results.horizontalOverflow = true;
    }

    // Check images
    const images = document.querySelectorAll('img');
    images.forEach((img, idx) => {
      if (!img.complete || img.naturalWidth === 0) {
        results.failedImages.push({
          src: img.src,
          alt: img.alt || 'no-alt'
        });
      }
      
      // Check aspect ratio distortion
      if (img.complete && img.naturalWidth > 0) {
        const naturalRatio = img.naturalWidth / img.naturalHeight;
        const displayRatio = img.offsetWidth / img.offsetHeight;
        const distortion = Math.abs(naturalRatio - displayRatio) / naturalRatio;
        
        if (distortion > 0.1) { // More than 10% distortion
          results.distortedImages.push({
            src: img.src,
            naturalRatio: naturalRatio.toFixed(2),
            displayRatio: displayRatio.toFixed(2)
          });
        }
      }
    });

    // Get key element dimensions
    const selectors = [
      'header',
      'footer',
      '.hero',
      'section',
      '.product-card',
      'button',
      'form'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const first = elements[0];
        const rect = first.getBoundingClientRect();
        results.dimensions[selector] = {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        };
      }
    });

    return results;
  });

  // Report issues
  if (checks.horizontalOverflow) {
    logIssue('P1', pageName, viewport, 'Horizontal overflow detected');
  }

  if (checks.failedImages.length > 0) {
    logIssue('P1', pageName, viewport, `Failed to load ${checks.failedImages.length} image(s): ${checks.failedImages.map(i => i.src).join(', ')}`);
  }

  if (checks.distortedImages.length > 0) {
    logIssue('P2', pageName, viewport, `${checks.distortedImages.length} distorted image(s) detected`);
  }

  return checks;
}

async function auditPage(browser, pageDef, viewport, viewportName) {
  const context = await browser.newContext({
    viewport: viewport,
    deviceScaleFactor: 1
  });
  
  const page = await context.newPage();
  
  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Collect failed requests
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  try {
    const url = `${BASE_URL}${pageDef.path}`;
    console.log(`\nAuditing: ${pageDef.name} (${viewportName})`);
    console.log(`URL: ${url}`);
    
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    if (!response || response.status() >= 400) {
      logIssue('P0', pageDef.name, viewportName, `Page failed to load: HTTP ${response?.status()}`);
      await context.close();
      return null;
    }

    // Wait a bit for any animations
    await page.waitForTimeout(1000);

    // Capture screenshot
    await captureScreenshot(page, pageDef.name, viewportName);

    // Check layout issues
    const checks = await checkLayoutIssues(page, pageDef.name, viewportName);

    // Report console errors
    if (consoleErrors.length > 0) {
      logIssue('P2', pageDef.name, viewportName, `Console errors: ${consoleErrors.join('; ')}`);
    }

    // Report failed requests
    if (failedRequests.length > 0) {
      logIssue('P1', pageDef.name, viewportName, `Failed requests: ${failedRequests.map(r => `${r.url} (${r.status})`).join(', ')}`);
    }

    await context.close();
    return checks;
    
  } catch (error) {
    logIssue('P0', pageDef.name, viewportName, `Error: ${error.message}`);
    await context.close();
    return null;
  }
}

async function getProductSlug(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle', timeout: 10000 });
    
    const slug = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/products/"]');
      if (link) {
        const href = link.getAttribute('href');
        const match = href.match(/\/products\/([^/?]+)/);
        return match ? match[1] : null;
      }
      return null;
    });
    
    await context.close();
    return slug;
  } catch (error) {
    console.log('Could not fetch product slug:', error.message);
    await context.close();
    return null;
  }
}

async function getProductId(browser, storageState) {
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'networkidle', timeout: 10000 });
    
    const productId = await page.evaluate(() => {
      const editLink = document.querySelector('a[href*="/admin/products/"][href*="/edit"]');
      if (editLink) {
        const href = editLink.getAttribute('href');
        const match = href.match(/\/admin\/products\/([^/]+)\/edit/);
        return match ? match[1] : null;
      }
      return null;
    });
    
    await context.close();
    return productId;
  } catch (error) {
    console.log('Could not fetch product ID:', error.message);
    await context.close();
    return null;
  }
}

async function copyReferenceImages() {
  console.log('\n📁 Copying reference screenshots...');
  
  const references = [
    { src: 'design-web/home_azka_meubel/screen.png', dest: 'home-reference.png' },
    { src: 'design-web/about_azka_meubel/screen.png', dest: 'about-reference.png' },
    { src: 'design-web/products_azka_meubel/screen.png', dest: 'products-reference.png' },
    { src: 'design-web/product_detail_kanso_chair_azka_meubel/screen.png', dest: 'product-detail-reference.png' },
    { src: 'design-web/contact_azka_meubel/screen.png', dest: 'contact-reference.png' }
  ];

  for (const ref of references) {
    const srcPath = join(__dirname, ref.src);
    const destPath = join(REFERENCES_DIR, ref.dest);
    
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✓ Copied: ${ref.dest}`);
    } else {
      console.log(`✗ Not found: ${ref.src}`);
    }
  }
}

async function generateReport() {
  console.log('\n📝 Generating report...');
  
  const reportPath = join(OUTPUT_DIR, 'visual-audit-report.md');
  
  let report = `# Visual Audit Report - AZKA MEUBEL
Generated: ${new Date().toLocaleString('id-ID')}

## Overview

This automated visual audit was conducted to identify layout, spacing, responsive, and visual consistency issues across the AZKA MEUBEL website.

## Test Configuration

- **Viewports Tested:**
  - Desktop: 1440 × 1000
  - Tablet: 768 × 1024
  - Mobile: 390 × 844

- **Browser:** Chromium (Playwright)
- **Base URL:** ${BASE_URL}

## Pages Audited

### Public Pages
`;

  PUBLIC_PAGES.forEach(page => {
    report += `- ${page.name} (${page.path})\n`;
  });

  report += `\n### Admin Pages\n`;
  
  ADMIN_PAGES.forEach(page => {
    report += `- ${page.name} (${page.path})${page.requiresAuth ? ' [requires auth]' : ''}\n`;
  });

  report += `\n## Issues Found\n\n`;

  if (issues.length === 0) {
    report += `✅ No automated issues detected.\n\n`;
  } else {
    // Group by severity
    const p0Issues = issues.filter(i => i.severity === 'P0');
    const p1Issues = issues.filter(i => i.severity === 'P1');
    const p2Issues = issues.filter(i => i.severity === 'P2');
    const p3Issues = issues.filter(i => i.severity === 'P3');

    if (p0Issues.length > 0) {
      report += `### P0 - Critical (${p0Issues.length})\n\n`;
      p0Issues.forEach(issue => {
        report += `- **${issue.page}** (${issue.viewport}): ${issue.description}\n`;
      });
      report += `\n`;
    }

    if (p1Issues.length > 0) {
      report += `### P1 - High Priority (${p1Issues.length})\n\n`;
      p1Issues.forEach(issue => {
        report += `- **${issue.page}** (${issue.viewport}): ${issue.description}\n`;
      });
      report += `\n`;
    }

    if (p2Issues.length > 0) {
      report += `### P2 - Medium Priority (${p2Issues.length})\n\n`;
      p2Issues.forEach(issue => {
        report += `- **${issue.page}** (${issue.viewport}): ${issue.description}\n`;
      });
      report += `\n`;
    }

    if (p3Issues.length > 0) {
      report += `### P3 - Low Priority (${p3Issues.length})\n\n`;
      p3Issues.forEach(issue => {
        report += `- **${issue.page}** (${issue.viewport}): ${issue.description}\n`;
      });
      report += `\n`;
    }
  }

  report += `## Reference Comparison

Reference screenshots from \`design-web/\` folder have been copied to \`references/\` for comparison.

Compare the actual screenshots with references to identify:
- Spacing inconsistencies (padding, margin, gap)
- Typography differences (size, weight, line-height)
- Alignment issues
- Image aspect ratio problems
- Responsive layout deviations
- Component positioning

## Recommendations

1. Review all P0 and P1 issues immediately
2. Compare screenshots side-by-side with reference designs
3. Use browser DevTools to measure exact spacing values
4. Test on real devices for mobile/tablet validation
5. Document all visual changes before implementing fixes

## Next Steps

1. Prioritize issues based on severity and visual impact
2. Create detailed fix list with specific measurements
3. Implement fixes page by page
4. Re-run audit after fixes to validate improvements

---

**Files Generated:**
- Screenshots: \`screenshots/[viewport]/[page].png\`
- References: \`references/[page]-reference.png\`
- Contact sheets: \`contact-sheet-[viewport].png\` (if generated)
- This report: \`visual-audit-report.md\`
`;

  const fs = await import('fs');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`✓ Report saved: ${reportPath}`);
}

async function main() {
  console.log('🚀 Starting AZKA MEUBEL Visual Audit...\n');
  
  // Copy reference images first
  await copyReferenceImages();

  const browser = await chromium.launch({ 
    headless: false // Set to true for CI/CD
  });

  console.log('\n📸 Capturing screenshots for public pages...\n');

  // Audit public pages
  for (const pageDef of PUBLIC_PAGES) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      await auditPage(browser, pageDef, viewport, viewportName);
    }
  }

  // Try to get product slug
  console.log('\n🔍 Looking for product detail page...');
  const productSlug = await getProductSlug(browser);
  
  if (productSlug) {
    console.log(`✓ Found product: ${productSlug}`);
    const productPage = { 
      name: `product-detail-${productSlug}`, 
      path: `/products/${productSlug}` 
    };
    
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      await auditPage(browser, productPage, viewport, viewportName);
    }
  } else {
    console.log('✗ No products found in database');
    logIssue('P0', 'product-detail', 'all', 'No products available to audit product detail page');
  }

  // Admin pages - check if we need manual login
  console.log('\n🔐 Admin pages require authentication.');
  console.log('Opening login page for manual authentication...\n');
  
  const loginContext = await browser.newContext({
    viewport: VIEWPORTS.desktop
  });
  const loginPage = await loginContext.newPage();
  
  try {
    await loginPage.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' });
    console.log('⏳ Please log in manually in the browser window...');
    console.log('   Waiting 60 seconds for authentication...\n');
    
    // Wait for navigation to /admin (successful login)
    await loginPage.waitForURL(/\/admin(?:\/|$)/, { timeout: 60000 });
    
    console.log('✓ Authentication successful!\n');
    
    // Save auth state
    const storageState = await loginContext.storageState();
    await loginContext.close();
    
    // Audit admin pages
    console.log('📸 Capturing screenshots for admin pages...\n');
    
    for (const pageDef of ADMIN_PAGES) {
      if (pageDef.requiresAuth) {
        for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
          const context = await browser.newContext({
            viewport: viewport,
            storageState: storageState
          });
          
          const page = await context.newPage();
          const url = `${BASE_URL}${pageDef.path}`;
          
          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(1000);
            await captureScreenshot(page, pageDef.name, viewportName);
            await checkLayoutIssues(page, pageDef.name, viewportName);
          } catch (error) {
            logIssue('P0', pageDef.name, viewportName, `Error: ${error.message}`);
          }
          
          await context.close();
        }
      }
    }
    
    // Try to get product edit page
    console.log('\n🔍 Looking for product edit page...');
    const productId = await getProductId(browser, storageState);
    
    if (productId) {
      console.log(`✓ Found product ID: ${productId}`);
      const editPage = { 
        name: `admin-products-edit-${productId}`, 
        path: `/admin/products/${productId}/edit`,
        requiresAuth: true
      };
      
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        const context = await browser.newContext({
          viewport: viewport,
          storageState: storageState
        });
        
        const page = await context.newPage();
        
        try {
          await page.goto(`${BASE_URL}${editPage.path}`, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(1000);
          await captureScreenshot(page, editPage.name, viewportName);
          await checkLayoutIssues(page, editPage.name, viewportName);
        } catch (error) {
          logIssue('P0', editPage.name, viewportName, `Error: ${error.message}`);
        }
        
        await context.close();
      }
    } else {
      console.log('✗ Could not find product edit page');
    }
    
  } catch (error) {
    console.log(`✗ Authentication timeout or failed: ${error.message}`);
    console.log('   Skipping admin pages...\n');
    await loginContext.close();
  }

  await browser.close();
  
  // Generate report
  await generateReport();
  
  console.log('\n✅ Visual audit complete!');
  console.log(`📁 Results saved in: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review visual-audit-report.md');
  console.log('2. Compare screenshots with references');
  console.log('3. Create contact sheets (if needed)');
  console.log('4. Package results into visual-audit.zip');
}

main().catch(console.error);
