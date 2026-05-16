# Moving This Project

You can move the whole folder anywhere on your PC.

Current folder:

```txt
C:\Users\20103\Documents\Codex\2026-05-16\you-are-a-senior-saas-architect
```

After moving it, open the new folder in VS Code or a terminal and run:

```bash
npm.cmd install
npm.cmd run dev
```

Then open:

```txt
http://localhost:5173
```

## Important

The zip contains source code, config, Firebase functions, docs, and env examples. It does not include `node_modules`, because dependencies should be installed after extracting the project.

## Env Files

Create these from the examples:

```txt
.env.local
functions/.env
```

Paste your Firebase keys in `.env.local`.

Paste OpenAI, Stripe, Paymob, and Fawry keys in `functions/.env`.
