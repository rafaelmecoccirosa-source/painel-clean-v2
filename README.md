# PainelClean — Plataforma

Marketplace de limpeza profissional de placas solares. Conecta clientes com técnicos certificados.

## Stack

- **Next.js 14** com App Router
- **TypeScript**
- **Tailwind CSS** com design system próprio
- **Supabase** (Auth + PostgreSQL + RLS)

## Cores

| Token | Hex | Uso |
|---|---|---|
| `brand-dark` | `#1B3A2D` | Header, textos |
| `brand-green` | `#3DC45A` | CTAs, destaques |
| `brand-bg` | `#F4F8F2` | Background da página |

## Estrutura de rotas

```
/                       → Landing page pública
/login                  → Autenticação
/cadastro               → Registro (cliente ou técnico)

/cliente                → Home do cliente (pedidos, stats)
/cliente/solicitar      → Formulário de nova solicitação
/cliente/historico      → Histórico de serviços

/tecnico                → Dashboard do técnico
/tecnico/servicos       → Pedidos disponíveis na região
/tecnico/agenda         → Serviços agendados

/admin                  → Painel administrativo
/admin/usuarios         → Gestão de usuários
/admin/relatorios       → Métricas da plataforma
```

## Configuração

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.local.example .env.local
   ```

3. Crie um projeto no [Supabase](https://supabase.com) e preencha `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Execute o schema SQL em **Supabase → SQL Editor**:
   ```
   supabase/schema.sql
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Próximos passos (MVP)

- [ ] Integrar autenticação Supabase nos Server Components
- [ ] Criar fluxo de solicitação com Server Actions
- [ ] Implementar sistema de orçamentos (técnico → cliente)
- [ ] Notificações em tempo real com Supabase Realtime
- [ ] Upload de fotos antes/depois (Supabase Storage)
- [ ] Avaliações pós-serviço
