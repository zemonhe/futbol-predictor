import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Target, Upload, Download, RefreshCw, Filter } from 'lucide-react';
import { PT } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { generatePredictions } from '@/lib/api';
import { REQUIRED_FIXTURES_COLUMNS, PredictionRow } from '@/types/api';
import { PageHeader } from '@/components/PageHeader';
import { UploadDropzone } from '@/components/UploadDropzone';
import { DataTable } from '@/components/DataTable';
import { PredictionBadge } from '@/components/PredictionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export default function PrevisoesPage() {
  const { toast } = useToast();
  const { predictions, setPredictions } = useAppStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [teamSearch, setTeamSearch] = useState('');

  const predictMutation = useMutation({
    mutationFn: generatePredictions,
    onSuccess: (data) => {
      setPredictions(data);
      toast({
        title: 'Sucesso',
        description: PT.messages.sucessoPrevisoes,
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleGeneratePredictions = () => {
    if (!selectedFile) {
      // Use mock data for demo
      predictMutation.mutate({ fixturesCsvPath: 'data/fixtures.csv' });
      return;
    }
    predictMutation.mutate({ fixturesCsvPath: selectedFile.name });
  };

  // Get unique leagues for filter
  const leagues = useMemo(() => {
    const uniqueLeagues = [...new Set(predictions.map((p) => p.league))];
    return uniqueLeagues.sort();
  }, [predictions]);

  // Filter predictions
  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      const matchesLeague = leagueFilter === 'all' || p.league === leagueFilter;
      const matchesTeam =
        !teamSearch ||
        p.home_team.toLowerCase().includes(teamSearch.toLowerCase()) ||
        p.away_team.toLowerCase().includes(teamSearch.toLowerCase());
      return matchesLeague && matchesTeam;
    });
  }, [predictions, leagueFilter, teamSearch]);

  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const ProbabilityCell = ({ prob }: { prob: number }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help tabular-nums">{formatProbability(prob)}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Valor exato: {prob.toFixed(4)}</p>
      </TooltipContent>
    </Tooltip>
  );

  const columns = [
    {
      key: 'date',
      header: PT.labels.data,
      render: (row: PredictionRow) =>
        new Date(row.date).toLocaleDateString('pt-PT'),
      sortable: true,
    },
    { key: 'league', header: PT.labels.liga, sortable: true },
    { key: 'home_team', header: PT.labels.equipaCasa, sortable: true },
    { key: 'away_team', header: PT.labels.equipaFora, sortable: true },
    {
      key: 'prob_home',
      header: 'P(H)',
      render: (row: PredictionRow) => <ProbabilityCell prob={row.prob_home} />,
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'prob_draw',
      header: 'P(D)',
      render: (row: PredictionRow) => <ProbabilityCell prob={row.prob_draw} />,
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'prob_away',
      header: 'P(A)',
      render: (row: PredictionRow) => <ProbabilityCell prob={row.prob_away} />,
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'pred_class',
      header: PT.labels.previsao,
      render: (row: PredictionRow) => <PredictionBadge predClass={row.pred_class} />,
      sortable: true,
    },
  ];

  const exportCSV = () => {
    if (filteredPredictions.length === 0) return;

    const headers = [
      'Data',
      'Liga',
      'Época',
      'Equipa Casa',
      'Equipa Fora',
      'P(H)',
      'P(D)',
      'P(A)',
      'Previsão',
    ];
    const rows = filteredPredictions.map((row) => [
      row.date,
      row.league,
      row.season,
      row.home_team,
      row.away_team,
      row.prob_home,
      row.prob_draw,
      row.prob_away,
      row.pred_class,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fixtures_predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.previsoes.titulo}
        subtitle={PT.previsoes.subtitulo}
      />

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            {PT.previsoes.carregarFixtures}
          </CardTitle>
          <CardDescription>
            Carrega um ficheiro CSV com os jogos futuros para gerar previsões.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadDropzone
            onFileSelect={handleFileSelect}
            requiredColumns={REQUIRED_FIXTURES_COLUMNS}
          />

          <Button
            onClick={handleGeneratePredictions}
            disabled={predictMutation.isPending}
            className="w-full gap-2"
          >
            {predictMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                {PT.messages.aProcessar}
              </>
            ) : (
              <>
                <Target className="h-4 w-4" />
                {PT.buttons.gerarPrevisoes}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Predictions Table */}
      {predictions.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {PT.previsoes.tabelaPrevisoes}
              </CardTitle>
              <CardDescription>
                {filteredPredictions.length} previsões
                {filteredPredictions.length !== predictions.length &&
                  ` (de ${predictions.length} total)`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              {PT.buttons.exportarCSV}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{PT.previsoes.filtros}:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="w-40">
                  <Select value={leagueFilter} onValueChange={setLeagueFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={PT.labels.liga} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as ligas</SelectItem>
                      {leagues.map((league) => (
                        <SelectItem key={league} value={league}>
                          {league}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder={PT.labels.equipa}
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>

            <DataTable
              data={filteredPredictions}
              columns={columns}
              pageSize={15}
              searchable={false}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">{PT.previsoes.semPrevisoes}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {PT.messages.carregarFixtures}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
