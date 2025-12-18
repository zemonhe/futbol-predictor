import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Brain, Play, CheckCircle, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { PT } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { trainModel, evaluateModel } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { MetricCard } from '@/components/MetricCard';
import { ConfusionMatrixChart } from '@/components/Charts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function TreinoPage() {
  const { toast } = useToast();
  const { lastTraining, lastEvaluation, setLastTraining, setLastEvaluation } = useAppStore();

  const [cutoffDate, setCutoffDate] = useState<Date | undefined>();
  const [useXgb, setUseXgb] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const trainMutation = useMutation({
    mutationFn: trainModel,
    onSuccess: (data) => {
      setLastTraining(data);
      const hora = new Date(data.trainedAt).toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
      });
      toast({
        title: 'Sucesso',
        description: PT.messages.sucessoTreino.replace('{{hora}}', hora),
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

  const evaluateMutation = useMutation({
    mutationFn: evaluateModel,
    onSuccess: (data) => {
      setLastEvaluation(data);
      toast({
        title: 'Sucesso',
        description: PT.messages.sucessoAvaliacao,
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

  const handleTrain = () => {
    trainMutation.mutate({
      cutoff: cutoffDate ? format(cutoffDate, 'yyyy-MM-dd') : null,
      useXgb,
    });
  };

  const handleEvaluate = () => {
    evaluateMutation.mutate({
      cutoff: cutoffDate ? format(cutoffDate, 'yyyy-MM-dd') : null,
    });
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatDecimal = (value: number) => value.toFixed(3);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.treino.titulo}
        subtitle={PT.treino.subtitulo}
      />

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{PT.treino.configuracao}</CardTitle>
          <CardDescription>
            Define os parâmetros para o treino do modelo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>{PT.labels.dataCorte}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !cutoffDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {cutoffDate ? (
                      format(cutoffDate, 'PPP', { locale: pt })
                    ) : (
                      'Seleciona uma data'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={cutoffDate}
                    onSelect={setCutoffDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Data limite para dados de treino (opcional)
              </p>
            </div>

            {/* XGBoost Toggle */}
            <div className="space-y-2">
              <Label>{PT.labels.usarXgboost}</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="use-xgb"
                  checked={useXgb}
                  onCheckedChange={setUseXgb}
                />
                <Label htmlFor="use-xgb" className="cursor-pointer">
                  {useXgb ? 'Ativado' : 'Desativado'}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Usar XGBoost em vez do modelo padrão
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleTrain}
              disabled={trainMutation.isPending}
              className="gap-2"
            >
              {trainMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {PT.messages.aProcessar}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {PT.buttons.iniciarTreino}
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleEvaluate}
              disabled={evaluateMutation.isPending}
              className="gap-2"
            >
              {evaluateMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {PT.messages.aProcessar}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {PT.buttons.avaliarHoldout}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Results */}
      {lastTraining && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {PT.treino.resultados}
            </CardTitle>
            <CardDescription>
              Treino concluído às {new Date(lastTraining.trainedAt).toLocaleString('pt-PT')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                title={PT.labels.accuracy}
                value={formatPercent(lastTraining.accuracy)}
                variant="emerald"
              />
              <MetricCard
                title={PT.labels.logLoss}
                value={formatDecimal(lastTraining.log_loss)}
                variant="coral"
              />
              <MetricCard
                title={PT.labels.brierScore}
                value={formatDecimal(lastTraining.brier_score)}
                variant="primary"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Results */}
      {lastEvaluation && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>{PT.treino.avaliacao}</CardTitle>
              <CardDescription>
                Métricas do conjunto de validação (hold-out)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  title={PT.labels.accuracy}
                  value={formatPercent(lastEvaluation.accuracy)}
                  variant="emerald"
                />
                <MetricCard
                  title={PT.labels.logLoss}
                  value={formatDecimal(lastEvaluation.log_loss)}
                  variant="coral"
                />
                <MetricCard
                  title={PT.labels.brierScore}
                  value={formatDecimal(lastEvaluation.brier_score)}
                  variant="primary"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowReportModal(true)}
                className="w-full"
              >
                Ver {PT.treino.relatorioClassificacao}
              </Button>
            </CardContent>
          </Card>

          {/* Confusion Matrix */}
          <ConfusionMatrixChart matrix={lastEvaluation.confusion_matrix} />
        </div>
      )}

      {/* Classification Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{PT.treino.relatorioClassificacao}</DialogTitle>
            <DialogDescription>
              Métricas detalhadas por classe de previsão
            </DialogDescription>
          </DialogHeader>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            {lastEvaluation?.classification_report}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
