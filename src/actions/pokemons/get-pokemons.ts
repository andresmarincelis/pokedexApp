/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { pokeApi } from "../../config/api/pokeApi";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mappers";

export const getPokemons = async (page: number, limit: number = 20): Promise<Pokemon[]> => {
    try {

        const offset = page * limit;
        const url = `/pokemon?offset=${offset}&limit=${limit}`;
        const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        const pokemonPromises = data.results.map((info) => {
            return pokeApi.get<PokeAPIPokemon>(info.url);
        });

        const PokeApiPokemons = await Promise.all(pokemonPromises);
        const pokemonsPromises = PokeApiPokemons.map(item =>
            PokemonMapper.pokeApiPokemonToEntity(item.data),
        );

        return await Promise.all(pokemonsPromises);

    } catch (error) {
        throw new Error("Error getting pokemons");

    }
};
