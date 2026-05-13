import { useEffect, useState } from "react";
import { Chart, type AxisOptions } from "react-charts";
import { themeStore, type Theme } from "../lib/theme";

export interface BarDatum {
  label: string;
  value: number;
}

/**
 * Horizontal bar chart used on the analytics page to show per-option counts.
 * Wraps TanStack's <Chart> with sensible defaults and theme reactivity.
 */
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

  // Force a fresh render when theme changes so chart picks up new colors.
  const seriesColor = theme === "dark" ? "#fafafa" : "#0a0a0a";

  return (
    <div className="w-full">
      {title && <p className="text-sm font-medium text-fg mb-3">{title}</p>}
      <div className="h-[260px]">
        <Chart
          options={{
            data: [{ label: "Votes", data }],
            primaryAxis,
            secondaryAxes,
            getSeriesStyle: () => ({
              color: seriesColor,
              opacity: 0.9,
            }),
            // Match dark background better
            dark: theme === "dark",
          }}
        />
      </div>
    </div>
  );
}
