import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { COLLECTION_TRAINERS } from "../utils";
import { ObjectId } from "mongodb";





export const createUser = async (email: string, password: string) => {
    const db = getDB();
    const toEncriptao = await bcrypt.hash(password, 10);

    const result = await db.collection(COLLECTION_TRAINERS).insertOne({
        email,
        password: toEncriptao,
        pokemons: []
    });

    return result.insertedId.toString();
};

export const validateUser = async (email: string, password: string) => {
    const db = getDB();
    const user = await db.collection(COLLECTION_TRAINERS).findOne({email});
    if( !user ) return null;

    const laPassEsLaMismaMismita = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMismaMismita) return null;

    return user;
};

export const findUserById = async (id: string) => {
    const db = getDB();
    return await db.collection(COLLECTION_TRAINERS).findOne({_id: new ObjectId(id)})
}