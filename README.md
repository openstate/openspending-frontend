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
- maak nieuwe versie met `npm version <patch|minor|major>`
- push tag: `git push origin --tags`
- op Neon:
  - `cd /home/projects/openspending/production/openspending-frontend`
  - `git checkout main && git pull && git pull --tags && git checkout <tag>`
  - `sudo docker compose down`
  - `sudo docker compose up --build -d`

## Tests
Some tests have been added to the `./tests` folder. To run them:
```bash
npx vitest
```
