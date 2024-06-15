import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePokemonData } from "./api/queries";

export const BASE_URL = "http://127.0.0.1:8000";

function App() {
  const { data, isLoading, error } = usePokemonData("妙蛙种子");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="p-4 border-2 border-slate-500 rounded-md">
        <div>
          <h1 className="text-2xl font-bold">妙蛙种子</h1>
          <p className=" text-gray-400">妙蛙种子的战力曲线</p>
        </div>
        <div className="w-[680px] h-[300px]">
          <ResponsiveContainer>
            <LineChart data={data[0]} margin={{ top: 5, left: 10, right: 10 }}>
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

export default App;
