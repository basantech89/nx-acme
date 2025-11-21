import { getRandomAnimal } from '@nx-acme/animal'
import { formatMessage } from '@nx-acme/util'

export function zoo(): string {
	const result = getRandomAnimal()
	const message = `${result.name} says ${result.sound}!`
	return formatMessage('ZOO', message)
}
