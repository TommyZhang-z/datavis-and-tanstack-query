// quries.js
import { useState, useEffect } from "react";
import { QueryClient, useQuery, useQueries } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const fetchPokemons = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/v1/pokemons");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchPokemonStats = async (pokemonNames) => {
  const query = pokemonNames.join(",");
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/stats?pokemons=${query}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const usePokemonsAndStats = ({ nSlots, selector }) => {
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const pokemons = useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: true,
  });

  useEffect(() => {
    if (
      !pokemons.isLoading &&
      pokemons.data?.length > 0 &&
      selectedPokemons.length === 0
    ) {
      setSelectedPokemons(pokemons.data.slice(0, nSlots));
    }
  }, [pokemons.isLoading, pokemons.data, selectedPokemons]);

  const stats = useQuery({
    queryKey: ["pokemonStats", selectedPokemons],
    queryFn: () => fetchPokemonStats(selectedPokemons),
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: !!selectedPokemons && selectedPokemons.length > 0,
    select: selector,
  });

  const updatePokemons = (index, pokemon) => {
    setSelectedPokemons((prev) => {
      const newPokemons = [...prev];
      newPokemons[index] = pokemon;
      return newPokemons;
    });
  };

  return { pokemons, stats, selectedPokemons, updatePokemons };
}

export const usePokemons = () => {
  return useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: true,
  });
};

export const usePokemonStats = (pokemonNames) => {
  return useQuery({
    queryKey: ["pokemonStats", pokemonNames],
    queryFn: () => fetchPokemonStats(pokemonNames),
    refetchInterval: 2000,
    staleTime: 5000,
  });
};
