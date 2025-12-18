import { Info, ExternalLink, AlertTriangle, Code } from 'lucide-react';
import { PT } from '@/lib/i18n';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function SobrePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={PT.sobre.titulo}
        subtitle="Informação sobre a aplicação e metodologia utilizada"
      />

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            {PT.sobre.metodologia}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {PT.sobre.metodologiaTexto}
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="font-semibold text-foreground">Rolling Windows</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Janelas temporais deslizantes que simulam condições reais de previsão.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="font-semibold text-foreground">Calibração Probabilística</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajuste das probabilidades para refletir frequências reais observadas.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="font-semibold text-foreground">Validação Temporal</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Treino sempre anterior ao teste, evitando data leakage.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Métricas Utilizadas</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Accuracy:</strong> Percentagem de previsões corretas
              </li>
              <li>
                <strong>Log Loss:</strong> Penaliza previsões confiantes mas erradas
              </li>
              <li>
                <strong>Brier Score:</strong> Mede a precisão das probabilidades (menor é melhor)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Responsible Warning */}
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg">{PT.sobre.avisoResponsavel}</AlertTitle>
        <AlertDescription className="mt-2 text-foreground/80">
          {PT.sobre.avisoResponsavelTexto}
        </AlertDescription>
      </Alert>

      {/* Version & Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Informação Técnica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{PT.sobre.versao}</p>
              <p className="font-mono font-semibold text-foreground">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frontend</p>
              <p className="font-mono font-semibold text-foreground">React + TypeScript</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">UI Framework</p>
              <p className="font-mono font-semibold text-foreground">Tailwind CSS + shadcn/ui</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 font-semibold text-foreground">{PT.sobre.documentacao}</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://docs.lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Documentação Lovable
              </a>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                React Docs
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Tailwind CSS
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {PT.appFullName}. Todos os direitos reservados.
      </p>
    </div>
  );
}
