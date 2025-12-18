import { gql } from "apollo-server";



export const typeDefs = gql`

    enum PokemonType {
        NORMAL
        FIRE
        WATER
        ELECTRIC
        GRASS
        ICE
        FIGHTING
        POISON
        GROUND
        FLYING
        PSYCHIC
        BUG
        ROCK
        GHOST
        DRAGON
    }

    type Pokemon {
        _id: ID!
        name: String!
        description: String!
        height: Float!
        weight: Float!
        types: [PokemonType!]!
    }

    type OwnedPokemon {
        _id: ID!
        pokemon: Pokemon!
        nickname: String
        attack: Int!
        defense: Int!
        speed: Int!
        special: Int!
        level: Int!
    }

    type Trainer {
        _id: ID!
        name: String!
        pokemons: [OwnedPokemon]!
    }

    type Query {
        me: Trainer
        pokemon(id:ID!):Pokemon
        pokemons(page:Int,size:Int):[Pokemon]!
    }

    type Mutation {
        startJourney(name: String!, password: String!):String!
        login(email: String!, password: String!): String!
        createPokemon(
            name: String!,
            description: String!,
            height: Float!,
            weight: Float!,
            types: [PokemonType!]!
        ):Pokemon!
        catchPokemon(pokemonId: ID!, nickname: String):OwnedPokemon!
        freePokemon(ownedPokemonId: ID!): Trainer
    }
`