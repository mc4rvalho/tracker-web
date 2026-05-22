# 🗺️ Planejamento: Tracker v2.0

## 🗄️ Sprint 1: O Novo Alicerce (Prisma & Banco de Dados) -> (Domingo)

Foco em evoluir a estrutura de dados para suportar as novas Categorys e métricas de consumo.

- [x] **Refatoração do `schema.prisma`**: Criar User e Role e uma estrutura flexível que acomode Movie, Series, Game e Book.
- [x] **Adição de campos de métricas**: Inserir `horasJogadas`, `paginasLidas`, `totalPaginas`, `episodiosAssistidos` e `totalEpisodios`.
- [x] **Implementação de Enums de Status**: Criar os estados de Progress (`WISHLIST`, `IN_PROGRESS`, `FINISHED`).
- [x] **Tags e Temporalidade**: Adicionar suporte a gêneros/tags (Array de strings) e o campo `finishedAt`.

## ⚙️ Sprint 2: O Motor de Busca e Persistência (APIs Externas + Prisma)

Transformar o Back-end num integrador de dados dinâmico e construir a base de persistência (CRUD).

- [x] **Limpeza Arquitetural**: Deletar a antiga pasta `tracker`.
- [x] **Integrações (TMDB, RAWG, OpenLibrary)**: Criar os módulos/serviços isolados de busca.
- [x] **Criação dos Domínios**: Gerar os Resources definitivos (`movies`, `series`, `books`, `games`).
- [x] **A Grande Conexão**: Injetar cada serviço externo em seu respectivo domínio para as rotas de busca.
- [x] **Segurança de Entrada (DTOs)**: Configurar o `class-validator` nos Data Transfer Objects para proteger as rotas de criação e atualização de todos os domínios.
- [x] **Integração Prisma (CRUD)**: Implementar os métodos de criar, ler, atualizar e deletar usando o `this.prisma` nos services de todas as models.
- [x] **Regras de Negócio**: Lógica de preenchimento automático (ex: data de `finishedAt` preenchida ao mudar status para `FINISHED`).

## 🧠 Sprint 3: O Cérebro Matemático (Dashboard & Analytics)

Implementação da inteligência de agregação de dados no servidor.

- [x] **Criação do DashboardModule**: Estruturação de um módulo, controller e service independentes.
- [x] **Criação da Rota `/dashboard`**: Endpoints dedicados para fornecer dados consolidados ao Front-end.
- [x] **Lógica de Agregação (Totais)**: Somatório de Hours Played (Games), Read Pages (Books) e Watched Episodes (Series).
- [ ] **Lógica de Avaliação (Médias)**: Cálculo da média geral de notas usando `.reduce()` para descobrir o desempenho por Category.
- [x] **Filtros e Contagem**: Contagem exata de itens agrupados por status (`WISHLIST`, `IN_PROGRESS`, `FINISHED`).
- [x] **Ranqueamento de Tags**: Algoritmo para ranquear os gêneros favoritos com base na repetição de tags.
- [x] **Histórico de Atividade**: Busca dos últimos itens interagidos para a seção "Continuar de onde parou".
- [x] **Documentação Interativa (Swagger)**: Configuração do `@nestjs/swagger` no `main.ts` e adição dos decoradores (Decorators) nos Controllers para documentar todas as rotas e DTOs criados até agora.

## 🎨 Sprint 4: O Espetáculo Visual (React + Tailwind)

_Onde a lógica do servidor ganha vida e interatividade._

- [x] **Dark/Light Mode**: Implementação de tema dinâmico (Tailwind `dark:` classes). Vamos configurar uma paleta noturna elegante, puxando para tons de um Tokyo Night ou One Dark Pro, para deixar a interface super imersiva e agradável.
- [x] **Camada de Serviços (API Connection)**: Configurar as chamadas HTTP (usando `fetch` ou Axios) no React para bater nos nossos endpoints `/dashboard/*` recém-criados e guardar os dados no estado da aplicação.
- [x] **Dashboard UI (Totais)**: Criação dos Cards numéricos no topo da tela consumindo os totais de páginas, horas e episódios, e um gráfico de pizza/donut simples para a distribuição de status (`IN_PROGRESS`, `FINISHED`, etc).
- [x] **Componentes de Progress**: Barras visuais e circulares para exibir a relação "atual vs total" dentro dos cards individuais de Books, Games e Seriess.
- [x] **Seção de Atividades Recentes**: Um componente de Timeline ou Lista Vertical para exibir o array de `/recent`, criando um ícone ou cor diferente dinamicamente dependendo do `type` (`GAME`, `BOOK`, `MOVIE`, `SERIES`).
- [x] **Dashboard UI (Analytics)**: Uma seção dedicada aos "Insights", exibindo a sua Média Geral (`averageGrade`) com algumas estrelas animadas e um gráfico ou pódio em lista para exibir o seu array `topGenres`.
- [x] **Tratamento de UX (Loading & Empty States)**: Criar Skeleton Loaders (aquelas barras cinzas piscando) enquanto o React espera a API devolver os dados, e telas de "Você ainda não tem itens recentes" para quando os arrays vierem vazios.

## 🔐 Sprint 5: Sistema de Autenticação (Auth & JWT)

Foco em proteger a aplicação, garantindo que cada usuário só veja os seus próprios dados.

- [x] **Segurança de Senhas**: Instalar o `bcrypt` para criptografar as senhas antes de Save Tracker.
- [x] **Módulo de Auth (NestJS)**: Criar as rotas de Registro e Login gerando um token JWT (JSON Web Token).
- [x] **Proteção de Rotas (Guards)**: Bloquear o acesso aos endpoints do Tracker para quem não enviar um Token válido.
- [x] **Telas de Acesso (React)**: Desenvolver as páginas de Login e Cadastro no Front-end.
- [x] **Integração do Token**: Configurar o Axios para enviar o JWT no "Header" de todas as requisições.
- [x] **Integração com APIs Externas (Busca)**: Conectar o front-end às rotas de busca do back-end para auto-preencher o formulário com capas e dados oficiais (TMDB, RAWG, Open Library).

## 🎨 Sprint 6: UI/UX Polish (Lifting Visual)

Foco total na experiência do usuário, design system e refatoração visual com Tailwind CSS v4 para deixar a aplicação com cara de produto premium.

- [x] **Design System & Tipografia**: Padronizar paleta de cores, fontes e espaçamentos diretamente no CSS global (`index.css`) utilizando a diretiva `@theme`.
  - [x] Definir paleta de cores primárias e secundárias via variáveis CSS.
  - [x] Padronizar fontes e importá-las (Google Fonts, etc) no `@theme`.
  - [x] Configurar espaçamentos customizados nativos.

- [x] **Refatoração de Layouts**: Ajustar alinhamentos, paddings e responsividade (Mobile First) de todas as telas (Cards, Formulários e Dashboard).
  - [x] Revisar alinhamentos e paddings globais.
  - [x] Ajustar responsividade da página de Dashboard (Gráficos e Cards).
  - [x] Ajustar responsividade das listas e formulários.

- [x] **Empty States & Assets Ilustrativos**: Adicionar SVGs ou imagens amigáveis para os estados vazios (ex: ilustrações quando não houver trackers salvos).
  - [x] Selecionar/Baixar SVGs ou ilustrações para listas vazias.
  - [x] Criar componente visual para quando não houver trackers salvos na Home/Dashboard.
  - [x] Criar componente visual para buscas sem resultados.

- [x] **Microinterações e Animações**: Adicionar efeitos de `hover`, transições suaves (`transition-all`), e _toasts/snackbars_ para feedback de sucesso ou erro nas ações do usuário.
  - [x] Adicionar efeitos de hover e transition-all nos botões e cards.
  - [x] Instalar e configurar biblioteca de Toasts (ex: Sonner ou React Hot Toast).
  - [x] Disparar Toasts de sucesso ao criar/Edit itens e de erro ao falhar requisições.

- [x] **Revisão do Dark Mode**: Garantir que o contraste das cores no tema escuro atenda às normas de acessibilidade (WCAG).
  - [x] Testar contraste das cores de texto contra fundos escuros (normas WCAG).
  - [x] Ajustar tons de cinza/preto para evitar cansaço visual.
  - [x] Garantir que bordas e sombras funcionem bem no tema escuro.
