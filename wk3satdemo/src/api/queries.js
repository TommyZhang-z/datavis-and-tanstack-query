// quries.js
import { QueryClient, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";

export const queryClient = new QueryClient();

const fetchPokemonData = async (pokemonName) => {
  const res = await fetch(`${BASE_URL}/api/v1/stats?pokemons=${pokemonName}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const usePokemonData = (pokemonName) => {
  return useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () => fetchPokemonData(pokemonName),
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: !!pokemonName,
  });
};
