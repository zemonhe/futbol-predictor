// PT-PT Strings centralizadas para a aplicação

export const PT = {
  // App
  appName: 'Futebol 1X2',
  appSubtitle: 'Previsões',
  appFullName: 'Futebol 1X2 – Previsões',

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    dados: 'Dados',
    treino: 'Treino',
    backtest: 'Backtest',
    previsoes: 'Previsões',
    sobre: 'Sobre',
  },

  // Buttons
  buttons: {
    buscarDados: 'Buscar Dados',
    treinar: 'Treinar',
    avaliar: 'Avaliar',
    backtest: 'Backtest',
    prever: 'Prever',
    exportarCSV: 'Exportar CSV',
    carregarCSV: 'Carregar CSV',
    enviarParaAPI: 'Enviar para API',
    tentarNovamente: 'Tentar novamente',
    fechar: 'Fechar',
    confirmar: 'Confirmar',
    cancelar: 'Cancelar',
    iniciarTreino: 'Iniciar treino',
    avaliarHoldout: 'Avaliar hold-out',
    executarBacktest: 'Executar Backtest',
    gerarPrevisoes: 'Gerar Previsões',
  },

  // Labels
  labels: {
    liga: 'Liga',
    epoca: 'Época',
    limite: 'Limite',
    token: 'Token',
    dataCorte: 'Data de corte',
    usarXgboost: 'Usar XGBoost',
    numSplits: 'Número de splits',
    accuracy: 'Accuracy',
    logLoss: 'Log Loss',
    brierScore: 'Brier Score',
    dataUltimoTreino: 'Data do último treino',
    equipa: 'Equipa',
    equipaCasa: 'Equipa Casa',
    equipaFora: 'Equipa Fora',
    data: 'Data',
    probabilidade: 'Probabilidade',
    previsao: 'Previsão',
    fold: 'Fold',
    treinoFim: 'Treino Fim',
    testeInicio: 'Teste Início',
    testeFim: 'Teste Fim',
  },

  // Messages
  messages: {
    sucessoFetch: 'Dados atualizados com sucesso ({{rows}} registos).',
    sucessoTreino: 'Treino concluído às {{hora}}.',
    sucessoAvaliacao: 'Avaliação concluída com sucesso.',
    sucessoBacktest: 'Backtest executado com sucesso.',
    sucessoPrevisoes: 'Previsões geradas com sucesso.',
    erroGenerico: 'Ocorreu um erro. Tenta novamente.',
    validacaoCSV: 'Colunas obrigatórias em falta: {{cols}}.',
    semDados: 'Sem dados disponíveis.',
    carregarFixtures: 'Carrega um ficheiro fixtures.csv para gerar previsões.',
    arrastaSoltaCSV: 'Arrasta e solta um ficheiro .csv aqui, ou clica para selecionar',
    formatosAceites: 'Formatos aceites: .csv',
    aProcessar: 'A processar...',
    carregando: 'A carregar...',
  },

  // Dashboard
  dashboard: {
    titulo: 'Dashboard',
    subtitulo: 'Visão geral das métricas e desempenho do modelo',
    metricasRecentes: 'Métricas Recentes',
    evolucaoMetricas: 'Evolução das Métricas',
    acoesRapidas: 'Ações Rápidas',
    semTreino: 'Ainda não foi realizado nenhum treino.',
  },

  // Dados
  dados: {
    titulo: 'Gestão de Dados',
    subtitulo: 'Carrega dados históricos de jogos para treinar o modelo',
    carregarCSV: 'Carregar CSV de jogos',
    coletarAPI: 'Coletar via API oficial',
    regrasCSV: 'O ficheiro CSV deve conter as seguintes colunas:',
    preview: 'Pré-visualização',
    registos: 'registos',
    ultimaAtualizacao: 'Última atualização',
  },

  // Treino
  treino: {
    titulo: 'Treino & Avaliação',
    subtitulo: 'Treina o modelo e avalia o seu desempenho',
    configuracao: 'Configuração',
    resultados: 'Resultados do Treino',
    avaliacao: 'Avaliação do Modelo',
    matrizConfusao: 'Matriz de Confusão',
    relatorioClassificacao: 'Relatório de Classificação',
  },

  // Backtest
  backtest: {
    titulo: 'Backtesting',
    subtitulo: 'Avalia o modelo com validação temporal por folds',
    configuracao: 'Configuração do Backtest',
    resultados: 'Resultados por Fold',
    graficos: 'Visualização das Métricas',
  },

  // Previsões
  previsoes: {
    titulo: 'Previsões',
    subtitulo: 'Gera previsões para jogos futuros',
    carregarFixtures: 'Carregar Fixtures',
    tabelaPrevisoes: 'Tabela de Previsões',
    filtros: 'Filtros',
    semPrevisoes: 'Ainda não existem previsões geradas.',
  },

  // Sobre
  sobre: {
    titulo: 'Sobre a Aplicação',
    metodologia: 'Metodologia',
    metodologiaTexto: 'Esta aplicação utiliza técnicas de machine learning para prever resultados de jogos de futebol. O modelo é treinado com dados históricos usando rolling windows com shift temporal, garantindo que não há data leakage. A calibração probabilística e validação temporal são aplicadas para garantir previsões fiáveis.',
    avisoResponsavel: 'Aviso Responsável',
    avisoResponsavelTexto: 'Esta aplicação tem fins exclusivamente educacionais e de investigação. Os resultados apresentados não constituem aconselhamento financeiro nem incentivo a apostas. O utilizador é inteiramente responsável pelo uso que faz desta informação.',
    versao: 'Versão',
    documentacao: 'Documentação',
  },

  // Prediction Classes
  predClass: {
    H: 'Casa',
    D: 'Empate',
    A: 'Fora',
  },

  // Table
  table: {
    pesquisar: 'Pesquisar...',
    semResultados: 'Sem resultados.',
    paginaAnterior: 'Página anterior',
    paginaSeguinte: 'Página seguinte',
    de: 'de',
    linhasPorPagina: 'Linhas por página',
  },
} as const;

export type PTStrings = typeof PT;
