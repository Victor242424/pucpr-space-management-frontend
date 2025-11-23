# Sistema de Gestão de Espaços PUCPR - Frontend

Uma aplicação web moderna baseada em Angular para gerenciar espaços educacionais, controle de acesso de estudantes e rastreamento de ocupação.

## 🚀 Funcionalidades

- **Autenticação de Usuário**: Sistema seguro de login/registro com tokens JWT
- **Controle de Acesso Baseado em Funções**: Dashboards separados para administradores e estudantes
- **Gestão de Espaços**: Criar, atualizar e monitorar espaços educacionais (salas de aula, laboratórios, salas de estudo)
- **Controle de Acesso**: Registrar horários de entrada/saída dos estudantes em diferentes espaços
- **Rastreamento de Ocupação em Tempo Real**: Monitorar a ocupação atual e disponibilidade dos espaços
- **Relatórios e Análises**: Visualizar estatísticas detalhadas de ocupação e histórico de acesso
- **Gestão de Estudantes**: Painel administrativo para gerenciar contas de estudantes
- **Design Responsivo**: Interface amigável para dispositivos móveis construída com Tailwind CSS

## 🛠️ Stack Tecnológico

- **Framework**: Angular 21.0.0
- **Linguagem**: TypeScript 5.9.2
- **Estilização**: Tailwind CSS 2.2.19
- **Cliente HTTP**: Angular HttpClient com interceptador JWT
- **Formulários**: Reactive Forms
- **Roteamento**: Angular Router com guards
- **Testes**: Vitest 4.0.8
- **Gerenciador de Pacotes**: npm 10.9.3

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm (v10.9.3 ou superior)
- API Backend em execução em `http://localhost:8081`

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositório>
cd pucpr-space-management-ui
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o endpoint da API (se for diferente do padrão):
   - Atualize a `API_URL` nos arquivos de serviço localizados em `src/app/services/`
   - Padrão: `http://localhost:8081/api`

## 🏃 Executando a Aplicação

### Servidor de Desenvolvimento

```bash
npm start
# ou
ng serve
```

Navegue para `http://localhost:4200/`. A aplicação recarregará automaticamente quando você fizer alterações nos arquivos fonte.

### Build de Produção

```bash
npm run build
```

Os artefatos de build serão armazenados no diretório `dist/`.

### Executando Testes

```bash
npm test
```

Execute testes unitários usando Vitest.

## 🐳 Implantação com Docker

### Construir e Executar com Docker

1. Construa a imagem Docker:
```bash
docker build -t pucpr-space-ui .
```

2. Execute o container:
```bash
docker run -p 4200:80 pucpr-space-ui
```

### Usando Docker Compose

A aplicação está configurada para executar na rede Docker `space-network`:

```bash
docker-compose up -d
```

Isso irá:
- Construir a aplicação Angular
- Servi-la através do Nginx
- Expor a porta 4200
- Conectar-se à rede `space-network`

**Nota**: Certifique-se de que a rede `space-network` existe antes de executar:
```bash
docker network create space-network
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes de UI
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── dashboard/       # Dashboard do administrador
│   │   ├── dashboard-student/  # Dashboard do estudante
│   │   ├── spaces/          # Gestão de espaços
│   │   ├── students/        # Gestão de estudantes
│   │   ├── access-control/  # Controle de entrada/saída
│   │   ├── access-records/  # Histórico de acesso
│   │   └── reports/         # Análises e relatórios
│   ├── guards/              # Guards de rota
│   │   ├── auth.guard.ts    # Guard de autenticação
│   │   └── admin.guard.ts   # Guard de autorização de administrador
│   ├── interceptors/        # Interceptadores HTTP
│   │   └── auth.interceptor.ts  # Interceptador de token JWT
│   ├── models/              # Interfaces TypeScript
│   ├── services/            # Serviços de API
│   │   ├── auth.service.ts
│   │   ├── space.service.ts
│   │   ├── student.service.ts
│   │   ├── access-record.service.ts
│   │   └── report.service.ts
│   ├── app.routes.ts        # Rotas da aplicação
│   └── app.config.ts        # Configuração da aplicação
├── styles.scss              # Estilos globais
└── index.html               # Arquivo HTML principal
```

## 🔐 Funções de Usuário

### Administrador
- Acesso total a todas as funcionalidades
- Gerenciar espaços e estudantes
- Visualizar todos os relatórios e análises
- Registrar entrada/saída para qualquer estudante

### Estudante
- Visualizar dashboard pessoal
- Registrar própria entrada/saída
- Visualizar espaços disponíveis

## 🎨 Componentes de UI

A aplicação utiliza um sistema de design personalizado construído com Tailwind CSS:

- **Botões**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- **Formulários**: `.input`, `.label`, `.input-error`
- **Cartões**: `.card`
- **Distintivos**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`
- **Tabelas**: `.table`, `.table-container`

## 🔌 Integração com API

O frontend integra-se com os seguintes endpoints da API:

- **Autenticação**: `/api/auth/login`, `/api/auth/register`
- **Espaços**: `/api/spaces`
- **Estudantes**: `/api/students`
- **Registros de Acesso**: `/api/access`
- **Relatórios**: `/api/reports/occupancy`

Todas as requisições à API incluem o token de autenticação JWT no cabeçalho Authorization.

## 🧪 Testes

O projeto utiliza Vitest para testes unitários com a seguinte configuração:

- Arquivos de teste: `*.spec.ts`
- Provedor de cobertura: v8
- Ambiente: jsdom
- Utilitários de teste globais disponíveis

Execute testes com cobertura:
```bash
npm test -- --coverage
```

## 🚢 Implantação em Produção

### Configuração Nginx

O `nginx.conf` incluído fornece:
- Suporte a roteamento SPA (redireciona para index.html)
- Compressão Gzip
- Servimento de arquivos estáticos

### Variáveis de Ambiente

Para produção, atualize as URLs da API nos arquivos de serviço ou use configurações específicas por ambiente.

## 📝 Estilo de Código

O projeto segue estas convenções:

- **EditorConfig**: Estilos de codificação consistentes (2 espaços, UTF-8, LF)
- **TypeScript**: Modo estrito ativado
- **Prettier**: Formatação de código (aspas simples, largura de linha de 100 caracteres)

## 📄 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.