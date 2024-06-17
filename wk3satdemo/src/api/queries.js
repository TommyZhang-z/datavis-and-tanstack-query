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

const fetchPokemonsData = async (pokemonNames) => {
  const res = await fetch(
    `${BASE_URL}/api/v1/stats?pokemons=${pokemonNames.join(",")}`
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const usePokemonsData = (pokemonNames) => {
  return useQuery({
    queryKey: ["pokemons", pokemonNames],
    queryFn: () => fetchPokemonsData(pokemonNames),
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: !!pokemonNames.length,
  });
};

const fetchPokemonList = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/pokemons`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const usePokemonList = () => {
  return useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemonList,
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: true,
  });
};
