import { useEffect, useState } from "react";
import { Chart, type AxisOptions } from "react-charts";
import { themeStore, type Theme } from "../lib/theme";

export interface BarDatum {
  label: string;
  value: number;
}

export function BarChart({
  data,
  title,
}: {
  data: BarDatum[];
  title?: string;
}) {
  const [theme, setTheme] = useState<Theme>(themeStore.get());
  useEffect(() => themeStore.subscribe(setTheme), []);

  const primaryAxis: AxisOptions<BarDatum> = {
    getValue: (d) => d.label,
    position: "left",
    showGrid: false,
  };

  const secondaryAxes: Array<AxisOptions<BarDatum>> = [
    {
      getValue: (d) => d.value,
      position: "bottom",
      elementType: "bar",
      min: 0,
      formatters: {
        scale: (v: number) => (Number.isInteger(v) ? String(v) : ""),
      },
    },
  ];

  const seriesColor = theme === "dark" ? "#fafafa" : "#0a0a0a";

  return (
    <div className="w-full">
      {title && <p className="text-sm font-medium text-fg mb-3">{title}</p>}
      <div className="h-65">
        <Chart
          options={{
            data: [{ label: "Votes", data }],
            primaryAxis,
            secondaryAxes,
            getSeriesStyle: () => ({
              color: seriesColor,
              opacity: 0.9,
            }),

            dark: theme === "dark",
          }}
        />
      </div>
    </div>
  );
}
