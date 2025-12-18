import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../collections/Users";
import { signToken } from "../auth";
import { User } from "../types";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";





export const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if(!user) return null;
            return {
                _id: user._id.toString(),
                ...user
            }
        }
    },
    Mutation: {
        register: async (_, { email, password }) => {
            const userId = await createUser(email, password);
            return signToken(userId);
        },
        login: async (_, { email, password }) => {
            const user = await validateUser(email, password);
            if(!user) throw new Error("Invalid credentials");
            return signToken(user._id.toString());
        }
    },
}