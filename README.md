# Garry n8n Decision Action

<p align="center">
  <strong>Decision-to-Action Automation System</strong><br/>
  Convert human decisions into safe, auditable, step-by-step actions using n8n workflows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/typescript-5.9-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-7-purple?logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/tailwind-4-blue?logo=tailwindcss" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

<p align="center">
  <a href="https://girijashankarj.github.io/garry-n8n-decision-action/"><strong>Live Demo</strong></a>
</p>

---

## Overview

**Garry n8n Decision Action** is a Decision-to-Action Automation System that converts human decisions (text-based) into safe, auditable, step-by-step actions using n8n workflows.

### Core Concept

The system converts **HUMAN DECISIONS** (text-based) into **SAFE, AUDITABLE, STEP-BY-STEP ACTIONS** using n8n workflows.

**Key Principles:**

- Never blindly execute high-risk actions
- Always validate intent and risk
- Require approval where needed
- Log everything

This is **NOT** a chatbot.
This is **NOT** auto-execution AI.
This is **DECISION GOVERNED AUTOMATION**.

---

## Features

### Core Workflows

| Workflow                        | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Decision Intake**             | Trigger nodes, input normalization, metadata enrichment                |
| **Decision Analysis**           | Extract decision type, impact level, urgency, reversibility            |
| **Action Extraction**           | Identify explicit and implied actions, reject vague actions            |
| **Risk & Guardrail Evaluation** | Evaluate environment risk, time risk, blast radius                     |
| **Human-in-the-Loop Approval**  | Notify approvers, present summary, capture approval/rejection          |
| **Action Execution**            | Execute approved, validated actions (idempotent, logged, reversible)   |
| **Audit & Traceability**        | Log input, actions, risk evaluation, approval history, execution steps |

### Security & Governance

- No direct production changes without approval
- No credentials in workflow nodes
- Environment-based permissions
- Read-only defaults
- Explicit allow-list for actions
- Fail closed, not open

---

## Quick Start

**Prerequisites**: Node.js >= 20.19 (recommended: v24.13.0), npm >= 10

```bash
# Clone the repo
git clone https://github.com/girijashankarj/garry-n8n-decision-action.git
cd garry-n8n-decision-action

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## Tech Stack

- **TypeScript 5.8** — Type safety
- **React 19** — UI framework
- **Vite 7** — Build tool
- **Tailwind CSS v4** — Styling
- **shadcn/ui** — UI components
- **Redux Toolkit** — State management
- **Jest + Testing Library** — Testing
- **ESLint 9 + Prettier** — Code quality
- **n8n** — Workflow automation

---

## Project Structure

```
src/
├── common/          # Constants, messages, interfaces
├── components/      # React components
├── hooks/           # Custom React hooks
├── lib/             # Core business logic
│   ├── engine/      # Decision processing engines
│   ├── n8n/         # n8n integration
│   └── data/         # Static lookup tables
├── store/           # Redux Toolkit store
├── types/           # TypeScript types
└── utils/           # Utility functions
```

---

## Development

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Fix ESLint errors
- `npm run format` — Format code with Prettier
- `npm run format:check` — Check code formatting
- `npm test` — Run tests with coverage
- `npm run test:coverage` — Run tests with coverage report

### Code Quality

- **Type checking**: `tsc -b`
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier
- **Testing**: Jest + Testing Library (80% coverage minimum)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

See `.env.example` for available configuration options.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

---

## License

MIT License — see LICENSE file for details.

---

## Related Projects

- [Garry Clear Prompt](https://github.com/girijashankarj/garry-clear-prompt) — Prompt quality and efficiency tool

---

## Status

🚧 **In Development** — This project is currently under active development based on the meta prompt specification.
