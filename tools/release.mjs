// Independent releases for css, angular, react, icons and vue (config: "release" in nx.json).
//
//   node tools/release.mjs [--projects=css,angular] [--specifier=minor|0.1.0]
//                          [--dry-run] [--first-release] [--verbose]
//
// Without --specifier, each package's bump comes from the conventional commits that
// touch it. The first release needs one (e.g. --first-release --specifier=0.1.0):
// with no tags yet, Nx reads commits after the root commit, so the squashed
// initial commit alone counts as "no changes".
//
// Order: version -> npm publish -> changelog, commit, tags, push, GitHub releases.
// Publishing comes before any git write, so a failed publish leaves no pushed tag
// or GitHub release behind.
//
// Real releases are off until RELEASE_ENABLED=true is set (locally, or as a repo
// variable for .github/workflows/release.yml). Dry runs always work.
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) =>
  args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ||
  undefined;
const specifier = option('specifier');
const projects = option('projects')
  ?.split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const dryRun = flag('dry-run');
const firstRelease = flag('first-release');
const verbose = flag('verbose');

if (firstRelease && !specifier) {
  console.error('--first-release requires --specifier=<version-or-bump>.');
  process.exit(1);
}

if (!dryRun && process.env.RELEASE_ENABLED !== 'true') {
  console.error(
    'Releases are off. Run with --dry-run, or set RELEASE_ENABLED=true to version and publish to npm.',
  );
  process.exit(1);
}

const { projectsVersionData, releaseGraph } = await releaseVersion({
  projects,
  specifier,
  dryRun,
  firstRelease,
  verbose,
  gitCommit: false,
  gitTag: false,
  stageChanges: true,
});

const released = Object.entries(projectsVersionData).filter(
  ([, data]) => data.newVersion !== null,
);
if (released.length === 0) {
  console.log('Nothing to release: no package has releasable commits.');
  process.exit(0);
}

const published = await releasePublish({
  projects,
  dryRun,
  firstRelease,
  verbose,
  versionData: projectsVersionData,
  releaseGraph,
});
const failed = Object.entries(published).filter(([, r]) => r.code !== 0);
if (failed.length) {
  console.error(
    `Publish failed for ${failed.map(([name]) => name).join(', ')}. Nothing was committed, tagged or pushed.`,
  );
  process.exit(1);
}

await releaseChangelog({
  projects,
  dryRun,
  firstRelease,
  verbose,
  versionData: projectsVersionData,
  releaseGraph,
  gitCommit: true,
  gitTag: true,
  gitPush: true,
  stageChanges: true,
});

console.log(
  `${dryRun ? 'Dry run: would release' : 'Released'} ${released
    .map(([name, d]) => `${name}@${d.newVersion}`)
    .join(', ')}`,
);
