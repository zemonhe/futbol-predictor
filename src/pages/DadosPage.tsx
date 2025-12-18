import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Server, Download, FileText, RefreshCw } from 'lucide-react';
import { PT } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { fetchData } from '@/lib/api';
import { REQUIRED_CSV_COLUMNS, CSVValidationResult } from '@/types/api';
import { PageHeader } from '@/components/PageHeader';
import { UploadDropzone } from '@/components/UploadDropzone';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function DadosPage() {
  const { toast } = useToast();
  const { dataInfo, setDataInfo } = useAppStore();

  // CSV Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<Record<string, string>[]>([]);
  const [csvRowCount, setCsvRowCount] = useState(0);

  // API Fetch State
  const [league, setLeague] = useState('PL');
  const [season, setSeason] = useState(2024);
  const [limit, setLimit] = useState(3000);
  const [token, setToken] = useState('');

  const fetchMutation = useMutation({
    mutationFn: fetchData,
    onSuccess: (data) => {
      setDataInfo(data);
      toast({
        title: 'Sucesso',
        description: PT.messages.sucessoFetch.replace('{{rows}}', String(data.rows)),
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

  const handleValidation = (result: CSVValidationResult) => {
    if (result.valid) {
      setCsvPreview(result.preview);
      setCsvRowCount(result.rowCount);
    }
  };

  const handleCSVSubmit = () => {
    if (!selectedFile) return;
    
    fetchMutation.mutate({
      source: 'csv',
      csvUploadId: selectedFile.name,
    });
  };

  const handleAPIFetch = () => {
    fetchMutation.mutate({
      source: 'api',
      league,
      season,
      limit,
      token: token || undefined,
    });
  };

  const previewColumns = csvPreview[0]
    ? Object.keys(csvPreview[0]).map((key) => ({
        key,
        header: key,
        sortable: true,
      }))
    : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.dados.titulo}
        subtitle={PT.dados.subtitulo}
      />

      {/* Data Info Banner */}
      {dataInfo && (
        <Card className="border-emerald/30 bg-emerald/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald/10 p-2">
                <FileText className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {dataInfo.rows} {PT.dados.registos}
                </p>
                <p className="text-sm text-muted-foreground">
                  {PT.dados.ultimaAtualizacao}: {formatDate(dataInfo.updatedAt)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/${dataInfo.path}`} download>
                <Download className="mr-2 h-4 w-4" />
                {PT.buttons.exportarCSV}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CSV Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {PT.dados.carregarCSV}
            </CardTitle>
            <CardDescription>
              {PT.dados.regrasCSV}
              <code className="mt-2 block rounded bg-muted px-2 py-1 text-xs">
                {REQUIRED_CSV_COLUMNS.join(', ')}
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              onFileSelect={handleFileSelect}
              onValidate={handleValidation}
              requiredColumns={REQUIRED_CSV_COLUMNS}
            />
            
            {selectedFile && csvPreview.length > 0 && (
              <Button
                onClick={handleCSVSubmit}
                disabled={fetchMutation.isPending}
                className="w-full"
              >
                {fetchMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {PT.messages.aProcessar}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {PT.buttons.enviarParaAPI}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* API Fetch Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              {PT.dados.coletarAPI}
            </CardTitle>
            <CardDescription>
              Busca dados diretamente da API oficial de futebol.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="league">{PT.labels.liga}</Label>
                <Input
                  id="league"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  placeholder="PL, LaLiga, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">{PT.labels.epoca}</Label>
                <Input
                  id="season"
                  type="number"
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  min={2000}
                  max={2030}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="limit">{PT.labels.limite}</Label>
                <Input
                  id="limit"
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  min={100}
                  max={10000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">{PT.labels.token}</Label>
                <Input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <Button
              onClick={handleAPIFetch}
              disabled={fetchMutation.isPending}
              className="w-full"
            >
              {fetchMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {PT.messages.aProcessar}
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  {PT.buttons.buscarDados}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Preview */}
      {csvPreview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{PT.dados.preview}</CardTitle>
            <CardDescription>
              A mostrar as primeiras {Math.min(50, csvRowCount)} linhas de {csvRowCount} {PT.dados.registos}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={csvPreview}
              columns={previewColumns}
              pageSize={10}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
