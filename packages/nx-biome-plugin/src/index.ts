import { dirname } from 'path'
import {
	type CreateNodesContextV2,
	type CreateNodesV2,
	createNodesFromFiles,
} from '@nx/devkit'

export type MyPluginOptions = {}

export const createNodesV2: CreateNodesV2<MyPluginOptions> = [
	'**/package.json',
	async (configFiles, options, context) => {
		return await createNodesFromFiles(
			(configFile, options, context) =>
				createNodesInternal(configFile, options, context),
			configFiles,
			options,
			context,
		)
	},
]

async function createNodesInternal(
	configFilePath: string,
	options: MyPluginOptions | undefined,
	context: CreateNodesContextV2,
) {
	const root = dirname(configFilePath)

	// Project configuration to be merged into the rest of the Nx configuration
	return {
		projects: {
			[root]: {
				description: `Biome project at`,
				targets: {
					lint: {
						// Nx target syntax to execute a command. More on {projectRoot} below
						command: 'bunx @biomejs/biome lint {projectRoot}',
						cache: true,
						inputs: [
							'default',
							'^default',
							'{workspaceRoot}/biome.json',
							{
								externalDependencies: ['@biomejs/biome'],
							},
						],
					},
				},
			},
		},
	}
}
