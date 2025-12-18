import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PT } from '@/lib/i18n';
import { CSVValidationResult } from '@/types/api';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onValidate?: (result: CSVValidationResult) => void;
  requiredColumns?: readonly string[];
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function UploadDropzone({
  onFileSelect,
  onValidate,
  requiredColumns = [],
  accept = '.csv',
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);

  const validateCSV = useCallback(
    async (file: File): Promise<CSVValidationResult> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter((line) => line.trim());
          const headers = lines[0]?.split(',').map((h) => h.trim().toLowerCase());

          const missingColumns = requiredColumns.filter(
            (col) => !headers?.includes(col.toLowerCase())
          );

          const preview = lines.slice(1, 51).map((line) => {
            const values = line.split(',');
            const row: Record<string, string> = {};
            headers?.forEach((header, i) => {
              row[header] = values[i]?.trim() || '';
            });
            return row;
          });

          const result: CSVValidationResult = {
            valid: missingColumns.length === 0,
            errors: missingColumns.length > 0
              ? [PT.messages.validacaoCSV.replace('{{cols}}', missingColumns.join(', '))]
              : [],
            preview,
            rowCount: lines.length - 1,
          };

          resolve(result);
        };
        reader.readAsText(file);
      });
    },
    [requiredColumns]
  );

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setError(null);
      setValidationResult(null);

      if (selectedFile.size > maxSize) {
        setError(`Ficheiro muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      if (!selectedFile.name.endsWith('.csv')) {
        setError('Por favor seleciona um ficheiro .csv');
        return;
      }

      setFile(selectedFile);

      if (requiredColumns.length > 0) {
        const result = await validateCSV(selectedFile);
        setValidationResult(result);
        onValidate?.(result);

        if (!result.valid) {
          setError(result.errors[0]);
          return;
        }
      }

      onFileSelect(selectedFile);
    },
    [maxSize, requiredColumns, validateCSV, onFileSelect, onValidate]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  return (
    <div className={className}>
      <label
        className={cn(
          'dropzone cursor-pointer',
          isDragging && 'dropzone-active',
          error && 'border-destructive',
          validationResult?.valid && 'border-emerald'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Selecionar ficheiro CSV"
        />
        
        <div className="flex flex-col items-center gap-3">
          {file ? (
            <>
              {validationResult?.valid ? (
                <CheckCircle className="h-10 w-10 text-emerald" />
              ) : error ? (
                <AlertCircle className="h-10 w-10 text-destructive" />
              ) : (
                <FileText className="h-10 w-10 text-primary" />
              )}
              <div className="text-center">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {validationResult?.rowCount
                    ? `${validationResult.rowCount} ${PT.dados.registos}`
                    : `${Math.round(file.size / 1024)} KB`}
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {PT.messages.arrastaSoltaCSV}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {PT.messages.formatosAceites}
                </p>
              </div>
            </>
          )}
        </div>
      </label>

      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
