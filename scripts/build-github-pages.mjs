import {
  cpSync,
  existsSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
if (args.length !== 1 || !['--preview', '--release'].includes(args[0])) {
  throw new Error('Usage: node scripts/build-github-pages.mjs --preview|--release');
}
const previewOnly = args.includes('--preview');
const publicRelease = args.includes('--release');

if (publicRelease && process.env.GITHUB_PAGES_RELEASE_APPROVED !== 'true') {
  throw new Error(
    'GITHUB_PAGES_RELEASE_APPROVED=true is required for --release after explicit owner approval.',
  );
}

if (publicRelease && process.env.OWNER_PUBLICATION_APPROVED !== 'true') {
  throw new Error('OWNER_PUBLICATION_APPROVED=true is required for a public GitHub Pages release.');
}

const privacyEmail = process.env.PRIVACY_EMAIL?.trim() ?? '';
if (publicRelease && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyEmail)) {
  throw new Error('A monitored PRIVACY_EMAIL is required for a public GitHub Pages release.');
}

// Keep the local Pages preview distinct from Vinext's normal Cloudflare output
// and from the explicit, owner-approved static Pages artifact.
const outputDir = path.join(root, 'dist', publicRelease ? 'github-pages-release' : 'github-pages-preview');
const requestedOrigin = process.env.GITHUB_PAGES_SITE_ORIGIN;

if (!requestedOrigin) {
  throw new Error('GITHUB_PAGES_SITE_ORIGIN is required, for example https://aidog-career.github.io.');
}

let origin;
try {
  origin = new URL(requestedOrigin);
} catch {
  throw new Error('GITHUB_PAGES_SITE_ORIGIN must be an absolute HTTPS origin, for example https://aidog-career.github.io.');
}

if (origin.protocol !== 'https:' || origin.username || origin.password || origin.port || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('GITHUB_PAGES_SITE_ORIGIN must be an HTTPS root origin without credentials, a port, path, query, or fragment. Use an <owner>.github.io root repository.');
}
if (!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?\.github\.io$/i.test(origin.hostname)) {
  throw new Error('GITHUB_PAGES_SITE_ORIGIN must use the root <owner>.github.io hostname.');
}

const stagingRoot = mkdtempSync(path.join(tmpdir(), 'aidog-github-pages-'));
const stagingOutputDir = path.join(stagingRoot, 'out');

function shouldCopy(source) {
  const relative = path.relative(root, source);
  if (!relative) return true;
  const parts = relative.split(path.sep);
  const firstSegment = parts[0];
  if (['.git', '.next', '.wrangler', 'dist', 'node_modules'].includes(firstSegment)) return false;
  if (firstSegment === 'app' && parts[1] === 'api') return false;
  // Proxy relies on a request-time runtime, which GitHub Pages does not have.
  if (relative === 'proxy.ts') return false;
  if (path.basename(source).startsWith('.env')) return false;
  return true;
}

try {
  // GitHub Pages has no request-time runtime. Both modes omit API routes and
  // the proxy. The release mode is a read-only site: waitlist collection and
  // payments stay unavailable even when the content itself is owner-approved.
  cpSync(root, stagingRoot, { recursive: true, filter: shouldCopy });
  symlinkSync(path.join(root, 'node_modules'), path.join(stagingRoot, 'node_modules'), 'junction');

  const result = spawnSync(
    process.execPath,
    [path.join('node_modules', 'next', 'dist', 'bin', 'next'), 'build', '--webpack'],
    {
      cwd: stagingRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
        GITHUB_PAGES: 'true',
        GITHUB_PAGES_SITE_ORIGIN: origin.origin,
        NEXT_PUBLIC_STATIC_HOSTING: 'true',
        SITE_ORIGIN: origin.origin,
        // Keep runtime-only collection and payments disabled on static Pages.
        AIDOG_RELEASE_BUILD: 'false',
        // A preview must never become indexable merely because the caller has
        // an approval variable in their shell. The owner-approved release may
        // be indexed when its explicit gate is supplied.
        OWNER_PUBLICATION_APPROVED: publicRelease ? 'true' : 'false',
        PRIVACY_EMAIL: publicRelease ? privacyEmail : ''
      }
    }
  );

  if (result.status !== 0) {
    throw new Error(`GitHub Pages static build exited with ${result.status ?? 'an unknown status'}.`);
  }

  if (!existsSync(path.join(stagingOutputDir, 'index.html'))) {
    throw new Error('GitHub Pages export did not produce out/index.html.');
  }

  rmSync(outputDir, { recursive: true, force: true });
  cpSync(stagingOutputDir, outputDir, { recursive: true });
  // Pages must serve static asset paths as files instead of trying Jekyll.
  writeFileSync(path.join(outputDir, '.nojekyll'), '');
} finally {
  rmSync(stagingRoot, { recursive: true, force: true });
}
