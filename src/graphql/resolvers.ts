import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../collections/Users";
import {getPokemons,getPokemonById} from "../collections/Pokemons"
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { addPokemon} from "../collections/Pokemons";
import { OwnedPokemon, Trainer } from "../types";





export const resolvers: IResolvers = {
    Query: {
        pokemons: async (_, { page, size }) => {
            return await getPokemons(page, size);
        },
        pokemon: async (_, { id }) => {
            return await getPokemonById(id);
        },
        me: async (_, __, { user }) => {
            if(!user) return null;
            return {
                _id: user._id.toString(),
                ...user
            }
        }
    },
    Mutation: {
        startJourney: async (_, { email, password }) => {
            const userId = await createUser(email, password);
            return signToken(userId);
        },
        login: async (_, { email, password }) => {
            const user = await validateUser(email, password);
            if(!user) throw new Error("Invalid credentials");
            return signToken(user._id.toString());
        },
        createPokemon: async (_, { name, description, height, weight, types }) => {
            return await addPokemon(name, description, height, weight, types);
        },/*
        catchPokemon: async (_, { pokemonId, nickname }, { user }) => {
            if (!user) throw new Error("You must be logged in");
            const db = getDB();
            const pokemon = await db.collection("pokemones").findOne({ _id: new ObjectId(pokemonId) });

            if (!pokemon) throw new Error("Pokemon not found");

            const existingCapture = await db.collection("pokemonesConEntrenador").findOne({ pokemon: new ObjectId(pokemonId), trainerId: new ObjectId(user._id) });

            if (existingCapture) throw new Error("You already have this Pokémon");

            const newOwnedPokemon = {
                pokemon: pokemon._id,
                trainerId: new ObjectId(user._id), 
                nickname: nickname || pokemon.name,
                attack: 50, 
                defense: 50,
                speed: 50,
                special: 50,
                level: 1 
            };

            await db.collection("pokemonesConEntrenador").insertOne(newOwnedPokemon);

            await db.collection("trainers").updateOne(
                { _id: new ObjectId(user._id) },
                { $push: { pokemons: newOwnedPokemon._id } }
            );

            return {
                _id: newOwnedPokemon._id.toString(),
                pokemon: pokemon,
                nickname: newOwnedPokemon.nickname,
                level: newOwnedPokemon.level
            };
        }
    },*/
          freePokemon: async (_, { ownedPokemonId }, { user }) => {
            if (!user) throw new Error("You must be logged in");

            const db = getDB();
            const ownedPokemon = await db.collection("pokemonesConEntrenador").findOne({ _id: new ObjectId(ownedPokemonId) });

            if (!ownedPokemon) throw new Error("Owned Pokémon not found");
            if (ownedPokemon.trainerId.toString() !== user._id.toString()) {
                throw new Error("This Pokémon does not belong to you");
            }
            await db.collection("pokemonesConEntrenador").deleteOne({ _id: new ObjectId(ownedPokemonId) });

            return {
                message: "Pokémon freed successfully",
                pokemon: ownedPokemon.pokemon
            };
        }
    },
    Trainer:{
        pokemons:async (parent: Trainer) => {
            const db = getDB();
            const listaDePokemonesCapt = parent.pokemons;
            if(!listaDePokemonesCapt) return [];
            const objectIds = listaDePokemonesCapt.map((id:string) => new ObjectId(id));
            return db
                .collection("pokemonesConEntrenador")
                .find({ _id: { $in: objectIds } })
                .toArray();
        }
    },
    OwnedPokemon:{
        pokemon: async (parent: OwnedPokemon) => {
            const db = getDB();
            const pokemonId = parent.pokemon;
            if(!pokemonId) return null;
            return db
                .collection("pokemones")
                .findOne({_id: new ObjectId(pokemonId)})
        }
    }

}