import { Activity, Cpu, Zap } from 'lucide-react';

export function StatsFooter() {
  const stats = [
    {
      icon: Activity,
      label: 'Active Sessions',
      value: '1.2M',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Cpu,
      label: 'Processing Power',
      value: '99.8%',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Zap,
      label: 'Response Time',
      value: '0.3s',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="border-t border-gray-800/50 bg-[#0a1628]/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
