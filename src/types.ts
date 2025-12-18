



export enum PokemonType {
    NORMAL,
    FIRE,
    WATER,
    ELECTRIC,
    GRASS,
    ICE,
    FIGHTING,
    POISON,
    GROUND,
    FLYING,
    PSYCHIC,
    BUG,
    ROCK,
    GHOST,
    DRAGON
}

export type Trainer = {
    _id: string;
    name: string;
    pokemons: string[];
}

export type Pokemon = {
    _id: string;
    name: string;
    description: string;
    height: number;
    weight: number;
    type: PokemonType[];
}

export type OwnedPokemon = {
    _id: string;
    pokemon: string;
    nickname: string;
    attack: number;
    defense: number;
    speed: number;
    special: number;
    level: number;
}