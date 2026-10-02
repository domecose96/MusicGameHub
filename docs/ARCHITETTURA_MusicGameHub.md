# MusicGameHub - Architettura del progetto

Ultimo aggiornamento: giugno 2026

## Panoramica

MusicGameHub e' un portale didattico musicale statico e interattivo pensato per la scuola media. Centralizza teoria musicale, percorsi, giochi, mappe, storia della musica, strumenti, fumetti, educazione civica, classifiche e classi/alunni.

Il progetto e' pensato per GitHub Pages: ogni pagina deve funzionare come file statico, senza build step e con path relativi corretti.

## Stack

| Area | Scelta |
|---|---|
| Frontend | HTML, CSS, JavaScript vanilla |
| Build | Nessun build step |
| Deploy | GitHub Pages |
| Auth, classi, ranked | Supabase |
| Contatti | Web3Forms |
| Statistiche | GoatCounter + API statistiche |
| Stato locale | localStorage |

## Struttura principale

```text
/
|-- index.html
|-- teoria.html
|-- teoria_avanzata.html
|-- elementi_musica.html
|-- strumenti.html
|-- formazioni.html
|-- costruisci-formazione.html
|-- mappa.html
|-- classi.html
|-- classi_invito.html
|-- classifiche-risorse.html
|-- css/
|-- js/
|-- img/
|-- audio/
|-- giochi/
|-- storia/
|-- educazione_civica/
|-- fumetti/
|-- legal/
|-- api/
|-- docs/
```

## File centrali

| File | Ruolo |
|---|---|
| `js/resources.js` | Catalogo centrale per home, mappa, giochi, percorsi e risorse |
| `js/home_portal.js` | Rendering dinamico della home |
| `js/mappa.js` | Mappa risorse generata dal catalogo |
| `js/common.js` | Helper globali `MGH.*`, navigazione, auth UI |
| `js/giochi/game_ui.js` | UI comune dei giochi |
| `js/giochi/ranked.js` | Classificata, timer, salvataggio score |
| `js/classi.js` | Dashboard docente e gestione classi |
| `js/classi_invito.js` | Accesso alunno tramite invito |
| `js/fumetti/index.js` | Catalogo fumetti e disponibilita' asset |
| `js/fumetti/reader.js` | Reader fumetti generico |

## CSS principali

| File | Uso |
|---|---|
| `css/base.css` | Stile globale: header, nav, footer, bottoni base, modali |
| `css/home_portal.css` | Home, card, statistiche, pannelli |
| `css/learn.css` | Teoria musicale e componenti didattici condivisi |
| `css/learning-ui.css` | Variabili e regole UI condivise per card, box, bordi, ombre e raggi didattici |
| `css/advanced.css` | Teoria avanzata |
| `css/elementi_musica.css` | Suono ed elementi della musica |
| `css/strumenti.css` | Strumenti, formazioni e laboratorio formazione |
| `css/storia/storia.css` | Pagine interne di storia della musica |
| `css/storia/storia_timeline.css` | Timeline interattiva della storia della musica |
| `css/mappa.css` | Mappa risorse |
| `css/giochi/*.css` | Stili specifici dei giochi quando necessari |

## UI didattica condivisa

Le pagine didattiche principali stanno convergendo verso una UI condivisa.

Regole:

- `base.css` resta globale;
- `learn.css` contiene struttura didattica, sezioni, CTA e componenti comuni;
- `learning-ui.css` centralizza il linguaggio visivo delle card e dei box;
- i CSS pagina (`advanced.css`, `elementi_musica.css`, `strumenti.css`, `storia.css`) devono aggiungere varianti specifiche, non duplicare pattern gia' presenti.

Pattern importanti:

- sezioni: `siteSection learnSection`;
- CTA tra pagine: `learnCTA` + `learningNextCard`;
- azioni quiz interne: card azione dedicata, non bottone generico;
- footer legale: presente sulle pagine didattiche normali;
- `scrollTopBtn`: presente sulle pagine lunghe.

Eccezione: `storia/storia_musica.html` e' una pagina full-screen speciale con timeline orizzontale e CSS dedicato. Non va usata come base per le pagine interne dei periodi.

## Regole sui path

Le pagine in root usano path diretti:

```html
<link rel="stylesheet" href="css/base.css">
<script src="js/common.js"></script>
```

Le pagine in sottocartella usano `../`:

```html
<link rel="stylesheet" href="../css/base.css">
<script src="../js/common.js"></script>
```

Quando si aggiunge una pagina nuova, controllare sempre:

- link CSS;
- script JS;
- immagini;
- audio;
- link verso home, mappa e altre pagine;
- `MGH.goHome()` o `MGH.goTo()` da sottocartella.

## Pagine storia

La sezione storia e' divisa in:

- `storia/storia_musica.html`: timeline interattiva full-screen;
- `storia/storia_antichita.html`, `storia/storia_medioevo.html`, `storia/storia_rinascimento.html`: pagine interne didattiche dei periodi.

Le pagine interne devono includere:

```html
<link rel="stylesheet" href="../css/base.css">
<link rel="stylesheet" href="../css/learn.css">
<link rel="stylesheet" href="../css/learning-ui.css?v=20260622-shared-learning-ui">
<link rel="stylesheet" href="../css/storia/storia.css">
```

Le pagine interne mantengono le peculiarita' storiche, ma condividono:

- card con bordi/ombre coerenti;
- CTA finale con `storyQuizActionCard` e `learningNextCard`;
- footer legale;
- scroll top.

## Catalogo risorse

`js/resources.js` e' la fonte principale per:

- card home;
- mappa;
- giochi visibili;
- giochi giocabili;
- percorsi;
- risorse in arrivo;
- tag di ricerca.

Regole:

- non duplicare manualmente la stessa risorsa in home e mappa;
- usare `comingSoon: true` per risorse visibili ma non cliccabili;
- `playable` deve escludere i giochi in arrivo;
- `homeGames` puo' includere anche giochi in arrivo;
- il Wordle deve mantenere il segnale Daily;
- Guanto di Sfida resta in arrivo finche' non viene approvato.

## Supabase

Supabase e' usato per:

- autenticazione;
- classifiche ranked;
- classi docente;
- studenti;
- inviti;
- profili e nickname classifiche.

Regole:

- non simulare classi/alunni solo in localStorage;
- le funzionalita' classi devono restare collegate a Supabase;
- il frontend puo' usare chiavi publishable, mai segreti privati;
- la service role key non deve stare nel sito statico;
- eventuali operazioni privilegiate devono passare da API/serverless.

## Fumetti

Struttura immagini:

```text
img/fumetti/<slug>/
|-- <slug>.webp
|-- <slug>_back.webp
|-- 01.webp
|-- ...
|-- 30.webp
```

Regole:

- un fumetto e' disponibile solo con 32 immagini: 30 pagine + 2 copertine;
- guest: solo Mozart, prime 3 pagine libere e quarta blurred;
- controllo accesso frontend-only per ora.

## Giochi

I giochi vivono in `giochi/` e usano logica JS dedicata piu' moduli comuni.

Regole:

- UI comune in `js/giochi/game_ui.js`;
- ranked in `js/giochi/ranked.js`;
- feedback e modalita' devono essere uniformi;
- la logica specifica resta nel JS del singolo gioco;
- non duplicare componenti comuni se esiste gia' un helper centrale.

## Verifiche prima di chiudere una modifica

Per ogni modifica HTML/CSS:

```bash
git diff --check
```

Per ogni JS toccato:

```bash
node --check js/file.js
git diff --check
```

Non committare `.DS_Store`.
