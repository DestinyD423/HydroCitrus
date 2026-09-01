import { PieChart, Pie, Cell } from 'recharts';

export default function Speedometer({ value = 0, maxValue = 100 }) {
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;

  const getColor = () => {
    if (percentage > 60) return '#10b981'; // Lembab
    if (percentage > 30) return '#f59e0b'; // Sedang
    return '#ef4444'; // Kering
  };

  const data = [
    { value: percentage, color: getColor() },
    { value: 100 - percentage, color: '#e5e7eb' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[280px] h-[180px]">
        <PieChart width={280} height={160}>
          <Pie
            data={data}
            cx={140}
            cy={140}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full">
          <div className="text-4xl font-bold text-gray-800">{value}%</div>
        </div>
      </div>
    </div>
  );
}