import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PT } from '@/lib/i18n';

interface MetricsChartProps {
  data: Array<{
    date: string;
    accuracy: number;
    log_loss: number;
    brier_score: number;
  }>;
  title?: string;
}

export function MetricsLineChart({ data, title }: MetricsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-PT', {
      month: 'short',
      year: '2-digit',
    }),
    accuracy: Math.round(item.accuracy * 1000) / 10,
    log_loss: Math.round(item.log_loss * 1000) / 1000,
    brier_score: Math.round(item.brier_score * 1000) / 1000,
  }));

  return (
    <Card className="chart-container border-0 shadow-md">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              name={PT.labels.accuracy}
              stroke="hsl(var(--chart-accuracy))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-accuracy))' }}
            />
            <Line
              type="monotone"
              dataKey="log_loss"
              name={PT.labels.logLoss}
              stroke="hsl(var(--chart-logloss))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-logloss))' }}
            />
            <Line
              type="monotone"
              dataKey="brier_score"
              name={PT.labels.brierScore}
              stroke="hsl(var(--chart-brier))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-brier))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface BacktestChartProps {
  data: Array<{
    fold: number;
    accuracy: number;
    log_loss: number;
    brier_score: number;
  }>;
  title?: string;
}

export function BacktestBarChart({ data, title }: BacktestChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    name: `Fold ${item.fold}`,
    accuracy: Math.round(item.accuracy * 1000) / 10,
    log_loss: Math.round(item.log_loss * 1000) / 1000,
    brier_score: Math.round(item.brier_score * 1000) / 1000,
  }));

  return (
    <Card className="chart-container border-0 shadow-md">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar
              dataKey="accuracy"
              name={PT.labels.accuracy}
              fill="hsl(var(--chart-accuracy))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="log_loss"
              name={PT.labels.logLoss}
              fill="hsl(var(--chart-logloss))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="brier_score"
              name={PT.labels.brierScore}
              fill="hsl(var(--chart-brier))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ConfusionMatrixProps {
  matrix: number[][];
  labels?: string[];
}

export function ConfusionMatrixChart({ matrix, labels = ['H', 'D', 'A'] }: ConfusionMatrixProps) {
  const maxValue = Math.max(...matrix.flat());

  return (
    <Card className="chart-container border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{PT.treino.matrizConfusao}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="Matriz de confusão">
            <thead>
              <tr>
                <th className="p-2 text-xs text-muted-foreground"></th>
                {labels.map((label) => (
                  <th key={label} className="p-2 text-center text-xs font-medium text-muted-foreground">
                    Pred. {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 text-xs font-medium text-muted-foreground">
                    Real {labels[i]}
                  </td>
                  {row.map((value, j) => {
                    const intensity = value / maxValue;
                    const isDiagonal = i === j;
                    return (
                      <td
                        key={j}
                        className="p-2 text-center"
                        style={{
                          backgroundColor: isDiagonal
                            ? `hsl(var(--emerald) / ${0.2 + intensity * 0.6})`
                            : `hsl(var(--destructive) / ${intensity * 0.4})`,
                        }}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
