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
Some tests have been added to the `./tests` folder. To run them:
```bash
npx vitest
```

There are 2 types of tests:
- component tests (e.g. `authorization.test.ts`). These use mocking of requests and don't require the `API` to be up and running.
- more complicated route tests (e.g. `gegevens.test.ts`). Since these tests only read data and do not change it, it was chosen
for simplicity to run the tests against the `API running in development` (`npm run dev`). The tests assume that certain data
is present. The script `setup_content_for_tests` in `openspending-api` can be used to check the presence of the required data.
