import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { BarChart3, Play, RefreshCw, Download } from 'lucide-react';
import { PT } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { runBacktest } from '@/lib/api';
import { BacktestRow } from '@/types/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { BacktestBarChart } from '@/components/Charts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function BacktestPage() {
  const { toast } = useToast();
  const { lastBacktest, setLastBacktest } = useAppStore();

  const [splits, setSplits] = useState(5);
  const [useXgb, setUseXgb] = useState(false);

  const backtestMutation = useMutation({
    mutationFn: runBacktest,
    onSuccess: (data) => {
      setLastBacktest(data);
      toast({
        title: 'Sucesso',
        description: PT.messages.sucessoBacktest,
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: PT.messages.erroGenerico,
        variant: 'destructive',
      });
    },
  });

  const handleBacktest = () => {
    backtestMutation.mutate({ splits, useXgb });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatDecimal = (value: number) => value.toFixed(3);

  const columns = [
    { key: 'fold', header: PT.labels.fold, sortable: true },
    {
      key: 'train_end',
      header: PT.labels.treinoFim,
      render: (row: BacktestRow) => formatDate(row.train_end),
      sortable: true,
    },
    {
      key: 'test_start',
      header: PT.labels.testeInicio,
      render: (row: BacktestRow) => formatDate(row.test_start),
    },
    {
      key: 'test_end',
      header: PT.labels.testeFim,
      render: (row: BacktestRow) => formatDate(row.test_end),
    },
    {
      key: 'accuracy',
      header: PT.labels.accuracy,
      render: (row: BacktestRow) => (
        <span className="font-medium text-emerald">{formatPercent(row.accuracy)}</span>
      ),
      sortable: true,
    },
    {
      key: 'log_loss',
      header: PT.labels.logLoss,
      render: (row: BacktestRow) => (
        <span className="font-medium text-coral">{formatDecimal(row.log_loss)}</span>
      ),
      sortable: true,
    },
    {
      key: 'brier_score',
      header: PT.labels.brierScore,
      render: (row: BacktestRow) => (
        <span className="font-medium text-primary">{formatDecimal(row.brier_score)}</span>
      ),
      sortable: true,
    },
  ];

  const exportCSV = () => {
    if (!lastBacktest) return;
    
    const headers = ['Fold', 'Train End', 'Test Start', 'Test End', 'Accuracy', 'Log Loss', 'Brier Score'];
    const rows = lastBacktest.map((row) => [
      row.fold,
      row.train_end,
      row.test_start,
      row.test_end,
      row.accuracy,
      row.log_loss,
      row.brier_score,
    ]);
    
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backtest_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.backtest.titulo}
        subtitle={PT.backtest.subtitulo}
      />

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{PT.backtest.configuracao}</CardTitle>
          <CardDescription>
            Define o número de folds para validação cruzada temporal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="splits">{PT.labels.numSplits}</Label>
              <Input
                id="splits"
                type="number"
                value={splits}
                onChange={(e) => setSplits(Math.max(2, Math.min(10, Number(e.target.value))))}
                min={2}
                max={10}
              />
              <p className="text-xs text-muted-foreground">
                Número de divisões temporais (2-10)
              </p>
            </div>

            <div className="space-y-2">
              <Label>{PT.labels.usarXgboost}</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="use-xgb-backtest"
                  checked={useXgb}
                  onCheckedChange={setUseXgb}
                />
                <Label htmlFor="use-xgb-backtest" className="cursor-pointer">
                  {useXgb ? 'Ativado' : 'Desativado'}
                </Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleBacktest}
            disabled={backtestMutation.isPending}
            className="gap-2"
          >
            {backtestMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                {PT.messages.aProcessar}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {PT.buttons.executarBacktest}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {lastBacktest && lastBacktest.length > 0 && (
        <>
          {/* Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {PT.backtest.resultados}
                </CardTitle>
                <CardDescription>
                  {lastBacktest.length} folds de validação temporal
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" />
                {PT.buttons.exportarCSV}
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={lastBacktest}
                columns={columns}
                pageSize={10}
                searchable={false}
              />
            </CardContent>
          </Card>

          {/* Chart */}
          <BacktestBarChart
            data={lastBacktest}
            title={PT.backtest.graficos}
          />
        </>
      )}
    </div>
  );
}
