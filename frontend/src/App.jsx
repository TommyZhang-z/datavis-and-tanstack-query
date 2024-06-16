// App.jsx
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

import {
  usePokemons,
  usePokemonStats,
  usePokemonsAndStats,
} from "./api/queries";

const SingleMode = () => {
  const pokemons = usePokemons();
  const [selectedPokemons, setSelectedCompanies] = useState([]);
  const stats = usePokemonStats(selectedPokemons);

  useEffect(() => {
    if (
      !pokemons.isLoading &&
      pokemons.data?.length > 0 &&
      selectedPokemons.length === 0
    ) {
      setSelectedCompanies([pokemons.data[0]]);
    }
  }, [pokemons.isLoading, pokemons.data, selectedPokemons]);

  const strengths = useMemo(() => {
    if (!stats.data) return [];
    const firstItem = stats.data[0];
    if (!firstItem) return [];
    return firstItem?.map((item) => ({ line1: item.strength }));
  }, [stats.data]);

  const color = useMemo(() => {
    if (selectedPokemons[0] === "皮卡丘") return "#FACC17";
    if (selectedPokemons[0] === "妙蛙种子") return "#15A44A";
    if (selectedPokemons[0] === "杰尼龟") return "#2563EB";
    return "#FACC17";
  }, [selectedPokemons]);

  if (pokemons.isLoading || stats.isLoading) return <div>Loading...</div>;
  if (pokemons.isError || stats.isError) return <div>Error loading data</div>;

  return (
    <div className="w-[620px] flex flex-col gap-5">
      <Select
        value={selectedPokemons[0]}
        onValueChange={(value) => {
          setSelectedCompanies([value]);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pokemons.data.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{selectedPokemons[0]}</CardTitle>
          <CardDescription>{selectedPokemons[0]}的战斗力曲线</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">
            <ResponsiveContainer>
              <LineChart
                data={strengths}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
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
                <Line
                  type="monotone"
                  dataKey="line1"
                  strokeWidth={2}
                  stroke={color}
                  activeDot={{
                    r: 6,
                    style: { fill: "black" },
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SingleModeV2 = () => {
  const { pokemons, stats, selectedPokemons, updatePokemons } = usePokemonsAndStats({
    nSlots: 1,
    selector: (data) => data[0].map((item) => ({ line1: item.strength }))
  });

  const color = useMemo(() => {
    if (selectedPokemons[0] === "妙蛙种子") return "#15A44A";
    if (selectedPokemons[0] === "杰尼龟") return "#2563EB";
    return "#FACC17";
  }, [selectedPokemons]);

  if (pokemons.isLoading || stats.isLoading) return <div>Loading...</div>;
  if (pokemons.isError || stats.isError) return <div>Error loading data</div>;

  return (
    <div className="w-[620px] flex flex-col gap-5">
      <Select
        value={selectedPokemons[0]}
        onValueChange={(value) => {
          updatePokemons(0, value);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pokemons.data.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{selectedPokemons[0]}</CardTitle>
          <CardDescription>{selectedPokemons[0]}的战斗力曲线</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">
            <ResponsiveContainer>
              <LineChart
                data={stats.data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
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
                <Line
                  type="monotone"
                  dataKey="line1"
                  strokeWidth={2}
                  stroke={color}
                  activeDot={{
                    r: 6,
                    style: { fill: "black" },
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ComparisonMode = () => {
  const { data, isLoading, isError } = usePokemonStats(["妙蛙种子", "杰尼龟"]);

  const merged = useMemo(() => {
    if (!data) return [];
    const [data1, data2] = data;
    const esgScore1 = data1.map((item) => ({ line1: item.strength }));
    const esgScore2 = data2.map((item) => ({ line2: item.strength }));
    return esgScore1.map((item, index) => ({
      ...item,
      ...esgScore2[index],
    }));
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="w-[620px] flex flex-col gap-5">
      <div className=" grid grid-cols-2 gap-2"></div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>妙蛙种子 vs 杰尼龟</CardTitle>
          <CardDescription>妙蛙种子和杰尼龟的战斗力曲线对比</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={merged}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                妙蛙种子
                              </span>
                              <span className="font-bold">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                杰尼龟
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
                <Line
                  type="monotone"
                  dataKey="line1"
                  stroke="#15A44A"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="line2"
                  stroke="#2563EB"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ComparisonModeV2 = () => {
  const { pokemons, stats, selectedPokemons, updatePokemons } = usePokemonsAndStats({
    nSlots: 2,
    selector: (data) => {
      if (!data) return [];
      const [data1, data2] = data;
      return data1.map((item, index) => ({
        line1: item.strength,
        line2: data2[index]?.strength,
      }));
    }
  })

  if (pokemons.isLoading || stats.isLoading) return <div>Loading...</div>;
  if (pokemons.isError || stats.isError) return <div>Error loading data</div>;

  return (
    <div className="w-[620px] flex flex-col gap-5">
      <div className=" grid grid-cols-2 gap-2">
        <Select
          value={selectedPokemons[0]}
          onValueChange={(value) => {
            // If the same pokemon is selected, swap the order
            if (value === selectedPokemons[1]) {
              updatePokemons(1, selectedPokemons[0]);
            }
            updatePokemons(0, value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pokemons.data.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedPokemons[1]}
          onValueChange={(value) => {
            // If the same pokemon is selected, swap the order
            if (value === selectedPokemons[0]) {
              updatePokemons(0, selectedPokemons[1]);
            }
            updatePokemons(1, value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pokemons.data.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{selectedPokemons[0]} vs {selectedPokemons[1]}</CardTitle>
          <CardDescription>{selectedPokemons[0]}和{selectedPokemons[1]}的战斗力曲线对比</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
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
                <Line
                  type="monotone"
                  dataKey="line1"
                  stroke="#15A44A"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="line2"
                  stroke="#2563EB"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const App = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col gap-5 bg-background">
      {/* <SingleMode /> */}
      <SingleModeV2 />
      <ComparisonModeV2 />
    </div>
  );
};

export default App;
