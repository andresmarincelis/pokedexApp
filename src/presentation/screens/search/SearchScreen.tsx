/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */

import { FlatList, View } from 'react-native';
import { globalTheme } from '../../../config/theme/global-theme';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { getPokemonNamesWithId, getPokemonsByIds } from '../../../actions/pokemons';
import { useMemo, useState } from 'react';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export const SearchIcon = () => <Icon name="search-outline" size={20} />;

export const SearchScreen = () => {

  const [term, setTerm] = useState('');

  const debouncedValue = useDebouncedValue(term);

  const { isLoading, data: pokemonNameList = [] } = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  });

  //ToDo: aplicar debounce
  const pokemonNameIdList = useMemo(() => {
    //Es un número
    if (!isNaN(Number(debouncedValue))) {
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(debouncedValue));
      return pokemon ? [pokemon] : [];
    }

    if (debouncedValue.length === 0) { return []; }
    if (debouncedValue.length < 3) { return []; }

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debouncedValue.toLocaleLowerCase()),
    );

  }, [debouncedValue, pokemonNameList]);

  const { isLoading: isLoadingPokemons, data: pokemons = [] } = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () => getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });


  if (isLoading) {
    return (<FullScreenLoader />);
  }


  return (
    <View style={[globalTheme.globalMargin, { paddingTop: 10 }]}>
      <TextInput
        placeholder="Buscar Pokémon"
        mode="flat"
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
        right={<TextInput.Icon icon={() => <SearchIcon />} />}
      />
      {isLoadingPokemons && <ActivityIndicator style={{ paddingTop: 20 }} />}

      {/* <Text>{JSON.stringify(pokemonNameIdList, null, 2)}</Text> */}

      <FlatList
        style={{ marginTop: 20 }}
        data={pokemons}
        keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 150 }} />}
      />
    </View>
  );
};
