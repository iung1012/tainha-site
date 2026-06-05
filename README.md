# 🐟 Tainha do Mar — Sistema de Ingressos

Site completo de venda de ingressos para prato de tainha com painel admin e cliente.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Banco**: PostgreSQL (Railway)
- **Pagamento**: Syncpay (PIX)
- **Email**: Resend
- **Hospedagem**: Railway

## Setup rápido

### 1. Clone e configure o `.env`

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 2. Configure as variáveis obrigatórias no Railway

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | PostgreSQL do Railway (automático) |
| `JWT_SECRET` | String aleatória longa |
| `SYNCPAY_API_KEY` | Chave da API Syncpay |
| `SYNCPAY_BASE_URL` | URL base da API Syncpay |
| `SYNCPAY_WEBHOOK_SECRET` | Secret para validar webhooks |
| `RESEND_API_KEY` | Chave da API Resend |
| `EMAIL_FROM` | Ex: `Tainha do Mar <noreply@seudominio.com>` |
| `ADMIN_EMAIL` | Email do admin inicial |
| `ADMIN_PASSWORD` | Senha do admin inicial |

### 3. Deploy no Railway

1. Suba o código no GitHub
2. Crie um novo projeto no Railway
3. Conecte o repositório
4. Adicione o serviço **PostgreSQL** no Railway
5. Configure as variáveis de ambiente
6. O Railway vai rodar `npm run build` e `npm start` automaticamente

### 4. Criar admin e produtos iniciais

```bash
npm run seed
```

### 5. Configurar webhook no Syncpay

Configure a URL do webhook como:
```
https://seusite.railway.app/api/webhooks/syncpay
```

## Desenvolvimento local

```bash
# Instalar dependências
npm install --prefix server && npm install --prefix client

# Rodar (precisa do PostgreSQL local e .env configurado)
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

## Rotas

### Públicas
- `/` — Landing page com cardápio
- `/checkout` — Comprar ingresso
- `/pagamento/:id` — Status do pagamento / QR Code PIX
- `/login` — Login
- `/cadastro` — Cadastro

### Cliente (login necessário)
- `/minha-conta` — Pedidos e ingressos

### Admin
- `/admin` — Dashboard com estatísticas
- `/admin/pedidos` — Gerenciar pedidos
- `/admin/produtos` — Gerenciar produtos
- `/admin/validar` — Validar ingressos (QR Code)

## Ajustar integração Syncpay

Edite `server/src/services/payment.js` para adequar os campos às especificações reais da API da Syncpay. Os campos mais prováveis de precisar ajuste são os nomes dos campos na request body e na response.
