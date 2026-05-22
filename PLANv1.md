# 🗺️ Histórico: Tracker v1 (MVP)

Registro das funcionalidades implementadas na primeira versão do sistema.

## 🏗️ Setup Inicial & Backend (NestJS)

Foco em criar uma API funcional e integrada ao banco de dados.

- [x] **Configuração do Projeto NestJS**: Setup inicial da estrutura da API.
- [x] **Integração com Prisma ORM**: Configuração da conexão com banco PostgreSQL.
- [x] **Modelagem de Dados v1**: Criação da tabela única `Tracker` para Titles, Categorys e notas.
- [x] **Criação do CRUD**: Endpoints de `GET`, `POST`, `PATCH` e `DELETE` funcionando no backend.
- [x] **Validação com DTOs**: Implementação de `class-validator` para garantir dados íntegros.
- [x] **Configuração de CORS**: Liberação para o frontend acessar a API.

## 💻 Frontend (React + Tailwind v4)

Foco em interface funcional, tipada e com boa usabilidade.

- [x] **Setup React com TypeScript & Vite**: Configuração do ambiente de desenvolvimento.
- [x] **Estilização com Tailwind CSS v4**: Aplicação do novo reset (Preflight) e classes utilitárias.
- [x] **Componentização**: Separação da lógica visual em `TrackerForm` e `TrackerList`.
- [x] **Gerenciamento de Estado**: Uso de `useState` para formulários e listagens dinâmicas.
- [x] **Integração com Axios**: Conexão com a API para realizar todas as operações do CRUD.
- [x] **Ciclo de Vida com useEffect**: Busca automática de dados ao carregar a aplicação.

## ☁️ Deploy & Infraestrutura

Foco em colocar a aplicação em ambiente de produção real.

- [x] **Banco de Dados na Nuvem**: Migração do banco local para o Neon.tech (PostgreSQL Serverless).
- [x] **Deploy do Backend**: Hospedagem da API NestJS no Render.com.
- [x] **Deploy do Frontend**: Hospedagem da interface React na Vercel.
- [x] **Variáveis de Ambiente**: Configuração de `DATABASE_URL` e URLs de API em produção.
