import assert from 'node:assert/strict';
import path from 'node:path';
import {
  getReleaseBuildPublicDirFromInputs,
  RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY,
} from '../lib/release-build-public-dir.ts';
import { RELEASE_BUILD_ENVIRONMENT_KEY } from '../lib/release-runtime-scope.ts';

const projectRoot = path.resolve(process.cwd(), 'release-public-dir-contract-project');
const stagedDirectory = path.join(projectRoot, '.release-static-assets', 'scoped-release');
const outsideDirectory = path.resolve(projectRoot, '..', 'outside-release-public-dir');

function isDirectory(pathname) {
  return pathname === stagedDirectory;
}

assert.equal(
  getReleaseBuildPublicDirFromInputs({}, projectRoot, isDirectory),
  null,
  'ordinary local review must retain Vite’s default public directory',
);

assert.throws(
  () => getReleaseBuildPublicDirFromInputs({ [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true' }, projectRoot, isDirectory),
  new RegExp(RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY),
);
assert.throws(
  () => getReleaseBuildPublicDirFromInputs({
    [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true',
    [RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY]: '.release-static-assets/scoped-release',
  }, projectRoot, isDirectory),
  /absolute directory path/,
);
assert.throws(
  () => getReleaseBuildPublicDirFromInputs({
    [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true',
    [RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY]: outsideDirectory,
  }, projectRoot, isDirectory),
  /inside the project root/,
);
assert.throws(
  () => getReleaseBuildPublicDirFromInputs({
    [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true',
    [RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY]: path.join(projectRoot, '.release-static-assets', 'missing'),
  }, projectRoot, isDirectory),
  /existing staged directory/,
);
assert.equal(
  getReleaseBuildPublicDirFromInputs({
    [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true',
    [RELEASE_PUBLIC_DIR_ENVIRONMENT_KEY]: stagedDirectory,
  }, projectRoot, isDirectory),
  stagedDirectory,
);

console.log('Validated that a scoped release can use only an explicit curated public directory, while local review keeps the normal public directory.');
