import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePokemonData, usePokemonsData, usePokemonList } from "./api/queries";

export const BASE_URL = "http://127.0.0.1:8000";

function SingleMode() {
  const pokemons = ["妙蛙种子", "杰尼龟", "皮卡丘"];
  const [selectedPokemon, setSelectedPokemon] = useState("杰尼龟");
  const { data, isLoading, error } = usePokemonData(selectedPokemon);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <select
        value={selectedPokemon}
        onChange={(e) => setSelectedPokemon(e.target.value)}
        className="p-2 border-2 border-slate-500 rounded-md"
      >
        {pokemons.map((pokemon) => (
          <option key={pokemon} value={pokemon}>
            {pokemon}
          </option>
        ))}
      </select>
      <div className="p-4 border-2 border-slate-500 rounded-md">
        <div>
          <h1 className="text-2xl font-bold">{selectedPokemon}</h1>
          <p className=" text-gray-400">{selectedPokemon}的战力曲线</p>
        </div>
        <div className="w-[680px] h-[300px]">
          <ResponsiveContainer>
            <LineChart
              data={data[0]}
              margin={{ top: 5, left: 10, right: 10, bottom: 10 }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="strength"
                stroke="#15A44A"
                activeDot={{ r: 8, fill: "black" }}
              />
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-foreground">
                              战斗力
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ComparisonMode() {
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const pokemons = usePokemonList();

  useEffect(() => {
    if (
      !pokemons.isLoading &&
      pokemons.data?.length > 0 &&
      selectedPokemons.length === 0
    ) {
      setSelectedPokemons(pokemons.data.slice(0, 2));
    }
  }, [pokemons.isLoading, pokemons.data, selectedPokemons]);

  const stats = usePokemonsData(selectedPokemons);

  if (stats.isLoading || pokemons.isLoading || !stats.data)
    return <div>Loading...</div>;
  if (stats.isError || pokemons.isError) return <div>Error...</div>;

  const [data1, data2] = stats.data;
  const merged = data1.map((item, index) => ({
    line1: item.strength,
    line2: data2[index].strength,
  }));

  return (
    <div>
      <div className="grid grid-cols-2 mb-2 gap-2">
        <select
          value={selectedPokemons[0]}
          onChange={(e) =>
            setSelectedPokemons((prev) => {
              const newPokemons = [...prev];
              if (e.target.value === selectedPokemons[1]) {
                newPokemons[1] = newPokemons[0];
              }
              newPokemons[0] = e.target.value;
              return newPokemons;
            })
          }
          className="p-2 border-2 border-slate-500 rounded-md"
        >
          {pokemons.data.map((pokemon) => (
            <option
              key={pokemon}
              value={pokemon}
              // disabled={pokemon === selectedPokemons[1]}
            >
              {pokemon}
            </option>
          ))}
        </select>
        <select
          value={selectedPokemons[1]}
          onChange={(e) =>
            setSelectedPokemons((prev) => {
              const newPokemons = [...prev];
              if (e.target.value === selectedPokemons[0]) {
                newPokemons[0] = newPokemons[1];
              }
              newPokemons[1] = e.target.value;
              return newPokemons;
            })
          }
          className="p-2 border-2 border-slate-500 rounded-md"
        >
          {pokemons.data.map((pokemon) => (
            <option
              key={pokemon}
              value={pokemon}
              // disabled={pokemon === selectedPokemons[0]}
            >
              {pokemon}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 border-2 border-slate-500 rounded-md">
        <div>
          <h1 className="text-2xl font-bold">
            {selectedPokemons[0]} vs {selectedPokemons[1]}
          </h1>
          <p className=" text-gray-400">
            {selectedPokemons[0]}对比{selectedPokemons[1]}的战力曲线
          </p>
        </div>
        <div className="w-[680px] h-[300px]">
          <ResponsiveContainer>
            <LineChart
              data={merged}
              margin={{ top: 5, left: 10, right: 10, bottom: 10 }}
            >
              <Line
                type="monotone"
                name={selectedPokemons[0]}
                strokeWidth={2}
                dataKey="line1"
                stroke="#3581B8"
              />
              <Line
                type="monotone"
                name={selectedPokemons[1]}
                strokeWidth={2}
                dataKey="line2"
                stroke="#FCB07E"
              />
              <Legend />
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {selectedPokemons[0]}
                            </span>
                            <span className="font-bold">
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {selectedPokemons[1]}
                            </span>
                            <span className="font-bold">
                              {payload[1].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      {/* <SingleMode /> */}
      <ComparisonMode />
    </div>
  );
}

export default App;
