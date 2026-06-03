# Barbearia-projeto-iema

Sistema de agendamento para barbearia (PWA). A aplicação é dividida em uma **API REST** (backend) e uma **interface web** (frontend) que se comunicam por requisições HTTP no padrão JSON (requisição → resposta).

## Arquitetura e tecnologias

- **Backend:** Node.js + Express 5 e MongoDB (Mongoose), em camadas (rotas → controllers → services → models).
- **Autenticação:** JWT com controle de acesso por papel (`cliente`, `funcionario`, `admin`).
- **Padrão de comunicação:** respostas JSON padronizadas no formato `{ success, message, data }`, com tratamento de erros centralizado.
- **Frontend:** React + Vite (SPA/PWA) consumindo a API — carregamento rápido e navegação fluida.
- **Recursos:** catálogo de serviços e barbeiros, agendamento com verificação de disponibilidade, área do funcionário, painel administrativo (CRUD + relatórios), notificações e recuperação de senha.

---

IEMA PLENO Bacelar Portela
Atividade de PWA
Professor: William Marinho
Turma: 302
Alunos: João Gabriel Rocha, João Guilherme Sousa, Isaque Fonseca, Anne Beatriz, Rhasta Ferreira, Thanielly Beatriz

## Partes do Trabalho

- **Arquitetura:** João Gabriel Rocha e Anne Beatriz
- **Dev:** João Guilherme Sousa e Thanielly Beatriz
- **UX/UI:** Isaque Fonseca e Rhasta Ferreira
