import path from 'path'
import * as fs from 'fs-extra'
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release'
import yargs from 'yargs'

async function copyPackagesToBuild() {
	const buildDir = path.join(process.cwd(), 'build')
	const packagesDir = path.join(process.cwd(), 'packages')

	// Remove build directory if it exists and create it fresh
	await fs.remove(buildDir)
	await fs.ensureDir(buildDir)
	await fs.ensureDir(path.join(buildDir, 'packages'))

	// Get all package directories
	const packageDirs = await fs.readdir(packagesDir)

	// Copy each package directory
	for (const pkg of packageDirs) {
		const srcDir = path.join(packagesDir, pkg)
		const destDir = path.join(buildDir, 'packages', pkg)

		// Only copy if it's a directory
		const stats = await fs.stat(srcDir)
		if (!stats.isDirectory()) {
			continue
		}

		await fs.copy(srcDir, destDir, {
			filter: src => {
				// Skip node_modules, test files, and dist folders
				return (
					!src.includes('node_modules') &&
					!src.includes('__tests__') &&
					!src.includes('dist')
				)
			},
		})
	}
}

async function copyChangelogFiles() {
	const buildDir = path.join(process.cwd(), 'build')
	const packagesDir = path.join(process.cwd(), 'packages')
	const packageDirs = await fs.readdir(packagesDir)

	for (const pkg of packageDirs) {
		const srcChangelogPath = path.join(packagesDir, pkg, 'CHANGELOG.md')
		const destChangelogPath = path.join(
			buildDir,
			'packages',
			pkg,
			'CHANGELOG.md',
		)

		if (await fs.pathExists(srcChangelogPath)) {
			await fs.copy(srcChangelogPath, destChangelogPath)
		}
	}
}

const options = await yargs(process.argv.slice(2))
	.version(false)
	.option('firstRelease', {
		alias: 'f',
		description: 'Whether or not first release, defaults to false',
		type: 'boolean',
		default: false,
	})
	.option('dryRun', {
		alias: 'd',
		description:
			'Whether or not to perform a dry-run of the release process, defaults to true',
		type: 'boolean',
		default: false,
	})
	.option('verbose', {
		description: 'Whether or not to enable verbose logging, defaults to false',
		type: 'boolean',
		default: false,
	})
	.parseAsync()

await copyPackagesToBuild()

const { workspaceVersion, projectsVersionData, releaseGraph } =
	await releaseVersion({
		gitTag: true,
		firstRelease: options.firstRelease,
		dryRun: options.dryRun,
		verbose: options.verbose,
	})

await releaseChangelog({
	releaseGraph,
	gitTag: true,
	versionData: projectsVersionData,
	version: workspaceVersion,
	firstRelease: options.firstRelease,
	dryRun: options.dryRun,
})

await copyChangelogFiles()

const publishResult = await releasePublish({
	releaseGraph,
	firstRelease: options.firstRelease,
	dryRun: options.dryRun,
	verbose: options.verbose,
	registry: 'https://registry.npmjs.org/',
	access: 'public',
})

process.exit(
	Object.values(publishResult).every(release => release.code === 0) ? 0 : 1,
)
