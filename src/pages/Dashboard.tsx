import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Brain, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Clock,
  Activity,
  Percent
} from 'lucide-react';
import { PT } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { getMetricsHistory } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { MetricCard } from '@/components/MetricCard';
import { MetricsLineChart } from '@/components/Charts';
import { MetricCardSkeleton, ChartSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { lastTraining } = useAppStore();

  const { data: metricsHistory, isLoading } = useQuery({
    queryKey: ['metricsHistory'],
    queryFn: getMetricsHistory,
  });

  const quickActions = [
    { label: PT.buttons.buscarDados, icon: Database, path: '/dados', variant: 'outline' as const },
    { label: PT.buttons.treinar, icon: Brain, path: '/treino', variant: 'default' as const },
    { label: PT.buttons.avaliar, icon: Activity, path: '/treino', variant: 'outline' as const },
    { label: PT.buttons.backtest, icon: BarChart3, path: '/backtest', variant: 'outline' as const },
    { label: PT.buttons.prever, icon: Target, path: '/previsoes', variant: 'secondary' as const },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatDecimal = (value: number) => value.toFixed(3);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.dashboard.titulo}
        subtitle={PT.dashboard.subtitulo}
      />

      {/* Quick Actions */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {PT.dashboard.acoesRapidas}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant={action.variant}
                  size="sm"
                  onClick={() => navigate(action.path)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {PT.dashboard.metricasRecentes}
        </h2>
        
        {lastTraining ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title={PT.labels.accuracy}
              value={formatPercent(lastTraining.accuracy)}
              icon={Percent}
              variant="emerald"
              subtitle="do modelo atual"
            />
            <MetricCard
              title={PT.labels.logLoss}
              value={formatDecimal(lastTraining.log_loss)}
              icon={TrendingUp}
              variant="coral"
              subtitle="calibração probabilística"
            />
            <MetricCard
              title={PT.labels.brierScore}
              value={formatDecimal(lastTraining.brier_score)}
              icon={Activity}
              variant="primary"
              subtitle="score de precisão"
            />
            <MetricCard
              title={PT.labels.dataUltimoTreino}
              value={formatDate(lastTraining.trainedAt)}
              icon={Clock}
              subtitle={`Cutoff: ${lastTraining.cutoff}`}
            />
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Brain className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">{PT.dashboard.semTreino}</p>
              <Button
                variant="default"
                className="mt-4"
                onClick={() => navigate('/treino')}
              >
                <Brain className="mr-2 h-4 w-4" />
                {PT.buttons.treinar}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Metrics Evolution Chart */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {PT.dashboard.evolucaoMetricas}
        </h2>
        
        {isLoading ? (
          <ChartSkeleton />
        ) : metricsHistory ? (
          <MetricsLineChart 
            data={metricsHistory} 
            title={PT.dashboard.evolucaoMetricas}
          />
        ) : null}
      </div>
    </div>
  );
}
