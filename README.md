# Open Spending

Bekijk en vergelijk de huishoudboekjes van lokale overheden

## Developers

Open Spending is gebouwd met [Svelte Kit](https://kit.svelte.dev/). De onderstaande informatie (in het Engels) helpt je op weg om als developer mee te bouwen aan Open Spending:

Wanneer je dit project hebt ge-cloned/ge-forkt installeer je de dependencies met `npm install` (or `pnpm install` or `yarn`), en kun je een onwikkel-omgeving starten:


```bash
  npm i
  npm run dev

  or 
  npm run dev -- --open
```

### Building

Om een productieomgeving van deze App te maken, type je het volgende commando:

```bash
npm run build
```

Je kunt een preview van de productieomgeving starten met `npm run preview`.

#### Production procedure
- op Neon:
  - `cd /home/projects/openspending/production/openspending-frontend`
  - `git checkout main && git pull`
  - `sudo docker compose up --build -d`

## Tests
To run the tests in the `./tests` folder:
```bash
npx vitest
```
To run a single test e.g. `npx vitest tests/src/routes/gegevens-detaildata.test.ts`

There are 2 types of tests:
  - component tests (e.g. `authorization.test.ts`). These use mocking of requests and don't require the `api` to be up and running.
  - more complicated route tests (e.g. `gegevens.test.ts`). Since these tests only read data and do not change it, it was chosen
for simplicity to run the tests against the `api running in test mode`. See the `Tests` section in the `README` for `openspending-api`.
The `frontend` must be running in `dev` mode when running these tests.
