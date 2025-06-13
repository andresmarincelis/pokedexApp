/* eslint-disable prettier/prettier */
import { pokeApi } from '../../config/api/pokeApi';
import { Pokemon } from '../../domain/entities/pokemon';
import { PokeAPIPokemon } from '../../infrastructure/interfaces/pokeapi.interfaces';
import { PokemonMapper } from '../../infrastructure/mappers/pokemon.mappers';

export const getPokemonById = async (id: number): Promise<Pokemon> => {

    try {

        const { data } = await pokeApi.get<PokeAPIPokemon>(`/pokemon/${id}`);

        const pokemon = await PokemonMapper.pokeApiPokemonToEntity(data);

        return pokemon;

    } catch (error) {
        throw new Error(`No se pudo encontrar el pokemon con el id: ${id}`);

    }
};
