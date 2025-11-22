import { getRandomItem } from '@nx-acme/util'

export function animal(): string {
	return 'animal1'
}

export interface Animal {
	name: string
	sound: string
}

const animals: Animal[] = [
	{ name: 'cow', sound: 'moo' },
	{ name: 'dog', sound: 'woof' },
	{ name: 'pig', sound: 'oink' },
]

export function getRandomAnimal(): Animal {
	return getRandomItem(animals)
}
