import path from 'node:path';

// Keep this literal local to the build-config boundary. This file is also
// loaded directly by a Node contract script, where TypeScript's normal Vite
// extension resolution is unavailable.
export const RELEASE_BUILD_ENVIRONMENT_KEY = 'AIDOG_RELEASE_BUILD' as const;
export const RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY = 'AIDOG_RELEASE_PUBLIC_DIR' as const;

type RuntimeEnvironment = Readonly<Record<string, string | undefined>>;
type DirectoryInspector = (pathname: string) => boolean;

/**
 * A scoped release has to point Vite at a curated directory, not the broad
 * `public/` working tree. This helper is pure apart from the injected
 * directory check so the Vite boundary can be exercised without a build.
 *
 * Normal local review deliberately returns null and keeps Vite's ordinary
 * public directory. A release build is fail-closed if the staged directory is
 * absent, relative, outside this checkout, or not a real directory.
 */
export function getReleaseBuildPublicDirFromInputs(
  environment: RuntimeEnvironment,
  projectRoot: string,
  isDirectory: DirectoryInspector,
): string | null {
  if (environment[RELEASE_BUILD_ENVIRONMENT_KEY] !== 'true') return null;

  const configured = environment[RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY];
  if (!configured || configured !== configured.trim()) {
    throw new Error(`${RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY} must name a curated release static-assets directory when ${RELEASE_BUILD_ENVIRONMENT_KEY}=true.`);
  }
  if (!path.isAbsolute(configured)) {
    throw new Error(`${RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY} must be an absolute directory path.`);
  }

  const resolvedRoot = path.resolve(projectRoot);
  const resolvedDirectory = path.resolve(configured);
  const relative = path.relative(resolvedRoot, resolvedDirectory);
  if (!relative || path.isAbsolute(relative) || relative.split(path.sep).includes('..')) {
    throw new Error(`${RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY} must resolve inside the project root.`);
  }
  if (!isDirectory(resolvedDirectory)) {
    throw new Error(`${RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY} must name an existing staged directory: ${resolvedDirectory}`);
  }

  return resolvedDirectory;
}
