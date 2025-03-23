
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export type ChartType = 'area' | 'bar' | 'pie';

interface AnalyticsChartProps {
  type: ChartType;
  data: any[];
  height?: number;
  colors?: string[];
  dataKeys?: string[];
  labels?: string[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  data,
  height = 300,
  colors = ['#549a7f', '#77b59c', '#a5d1be'],
  dataKeys = ['value'],
  labels = ['Value']
}) => {
  const defaultColors = ['#549a7f', '#77b59c', '#a5d1be', '#cde7db'];
  const chartColors = colors.length ? colors : defaultColors;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect px-3 py-2 rounded shadow-sm border border-white/20">
          <p className="text-xs font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {labels[index] || entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {dataKeys.map((key, i) => (
                  <linearGradient key={i} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              {dataKeys.map((key, i) => (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={key}
                  name={labels[i] || key}
                  stroke={chartColors[i % chartColors.length]}
                  fillOpacity={1}
                  fill={`url(#color-${key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              {dataKeys.map((key, i) => (
                <Bar
                  key={i}
                  dataKey={key}
                  name={labels[i] || key}
                  fill={chartColors[i % chartColors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={dataKeys[0]}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
