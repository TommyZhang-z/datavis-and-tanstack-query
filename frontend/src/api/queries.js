// quries.js
import { QueryClient, useQuery } from "@tanstack/react-query";

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
    enabled: pokemonNames && pokemonNames.length > 0,
  });
};

const fetchCompanies = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/v1/companies");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchCompaniesEsg = async (companyNames) => {
  const query = companyNames.join(",");
  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/esg?companies=${query}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: true,
  });
};

export const useCompaniesEsg = (companyNames) => {
  return useQuery({
    queryKey: ["companiesEsg", companyNames],
    queryFn: () => fetchCompaniesEsg(companyNames),
    refetchInterval: 2000,
    staleTime: 5000,
    enabled: companyNames && companyNames.length > 0,
  });
};
