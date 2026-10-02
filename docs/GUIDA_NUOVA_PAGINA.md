# MusicGameHub - Guida per creare una nuova pagina

Questa guida serve per mantenere coerenti le nuove pagine del sito.

## Prima decisione: che tipo di pagina e'?

| Tipo pagina | Base consigliata |
|---|---|
| Teoria base | `teoria.html` + `css/learn.css` |
| Teoria avanzata | `teoria_avanzata.html` + `css/advanced.css` |
| Suono / laboratorio | `elementi_musica.html` + `css/elementi_musica.css` |
| Strumenti / formazioni | `strumenti.html`, `formazioni.html`, `costruisci-formazione.html` + `css/strumenti.css` |
| Storia | `storia/storia_musica.html` per timeline, pagine interne in `storia/` + `css/storia/storia.css` |
| Educazione civica | pagine in `educazione_civica/` |
| Gioco | vedere `docs/GUIDA_NUOVO_GIOCO.md` |

## CSS da includere

Le pagine didattiche devono usare il CSS condiviso quando possibile.

Pagine in root:

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/learn.css">
<link rel="stylesheet" href="css/learning-ui.css?v=20260622-shared-learning-ui">
<link rel="stylesheet" href="css/nome-pagina.css">
```

Pagine in sottocartella:

```html
<link rel="stylesheet" href="../css/base.css">
<link rel="stylesheet" href="../css/learn.css">
<link rel="stylesheet" href="../css/learning-ui.css?v=20260622-shared-learning-ui">
<link rel="stylesheet" href="../css/storia/storia.css">
```

Regole:

- `base.css` gestisce header, footer, nav, modali e componenti globali;
- `learn.css` gestisce sezioni didattiche, CTA, bottoni didattici e molte classi comuni;
- `learning-ui.css` centralizza card, box, bordi, ombre e raggi condivisi;
- il CSS specifico della pagina deve aggiungere solo varianti necessarie, non duplicare componenti comuni.

## Struttura standard

Una pagina didattica dovrebbe avere:

1. header con home button e titolo pagina;
2. nav interna con bottoni sezione;
3. contenitore principale;
4. eventuale hero solo se utile;
5. sezioni `siteSection learnSection`;
6. card o box coerenti;
7. CTA finale verso pagina precedente/successiva;
8. footer legale;
9. `scrollTopBtn`;
10. `js/common.js`.

## Header e nav

Regole:

- usare lo stesso header delle pagine della stessa famiglia;
- non inserire nella nav link che spezzano il percorso principale se sono gia' presenti nei bottoni finali;
- la nav interna deve portare alle sezioni della pagina, non diventare una mappa generale.

Esempio:

```html
<nav id="siteNav" class="theoryNav">
  <button class="navBtn" onclick="MGH.scrollToSection('sezione')">Titolo</button>
</nav>
```

## Sezioni

Usare sempre:

```html
<section id="nome-sezione" class="siteSection learnSection">
  <h2 class="sectionTitle">Titolo</h2>
  <p class="sectionIntro">Introduzione breve.</p>
</section>
```

## Sottotitoli

Per sottosezioni importanti usare lo stile comune:

```html
<h3 class="subSectionTitle">Titolo sottosezione</h3>
```

Questo deve restare coerente con titoli come `Chiave di Sol`, `Chiave di Fa`, `Tonalita' maggiori`, `Indicazioni di tempo`.

## Card, box e contenuti

### Card

Usare card piccole quando gli elementi sono confrontabili:

- figure musicali;
- tipi di accordo;
- tipi di cadenza;
- forme musicali;
- strumenti;
- concetti brevi.

Le nuove card devono partire dagli stili condivisi quando possibile:

- `learningNextCard` per card di navigazione tra pagine;
- `didacticBox` per note didattiche;
- `advancedBox` per sintesi strutturate;
- card specifiche della pagina solo quando servono contenuti peculiari.

Regole UI:

- evitare card annidate dentro altre card;
- non creare un nuovo stile se esiste gia' un pattern simile;
- mantenere dimensioni stabili tra elementi dello stesso gruppo;
- preferire griglie ordinate: 4 in linea quando ci stanno, altrimenti 2x2 o righe centrate;
- non usare colori neri puri per elementi decorativi quando la pagina usa una palette dedicata.

### didacticBox

Usare `didacticBox` per:

- consigli del docente;
- trucchi mnemonici;
- "ricorda";
- pratica guidata;
- note di attenzione;
- ascolto consigliato.

Esempio:

```html
<div class="didacticBox">
  <h4>Ricorda</h4>
  <p>Testo didattico.</p>
</div>
```

### advancedBox

Usare `advancedBox` per:

- tabelle;
- classificazioni;
- confronti;
- sintesi teoriche;
- progressioni;
- riepiloghi strutturati.

Non usarlo per consigli operativi: in quel caso usare `didacticBox`.

## Giochi dentro pagine didattiche

Usare il box gioco gia' presente nel sito:

```html
<div class="learnGameBox">
  <p>Descrizione breve.</p>
  <button class="menuButton gameLaunchButton" onclick="MGH.goTo('giochi/nome.html')">
    <span aria-hidden="true">🎮</span>
    <span>Nome gioco</span>
    <span class="learnGameBadge">Ranked</span>
  </button>
</div>
```

Regole:

- se il gioco ha classificata, mostrare `Ranked`;
- se il gioco ha Pro, mostrare anche il badge previsto;
- non inventare stili diversi pagina per pagina.

## CTA finale tra pagine

Usare lo stesso stile delle pagine teoria/strumenti:

```html
<nav class="learnCTA theoryPageCTA" aria-label="Continua il percorso">
  <a class="learningNextCard" href="pagina.html">
    <span>Etichetta breve</span>
    <strong>Nome pagina</strong>
    <p>Descrizione breve del passaggio.</p>
  </a>
  <a class="learningNextCard" href="altra-pagina.html">
    <span>Etichetta breve</span>
    <strong>Altra pagina</strong>
    <p>Descrizione breve del passaggio.</p>
  </a>
</nav>
```

Regole attuali:

- `elementi_musica.html` porta a `Teoria musicale`;
- `teoria.html` porta a `Suono` e `Teoria avanzata`;
- `teoria_avanzata.html` porta a `Teoria musicale`;
- `strumenti.html` usa una card quiz e una card verso `formazioni.html`;
- `formazioni.html` e `costruisci-formazione.html` usano CTA coerenti con il percorso strumenti/formazioni;
- le pagine interne di storia usano una card quiz e una card verso `storia_musica.html`;
- non usare parole come "Vai" o "Torna";
- non usare frecce nei testi dei bottoni.

### CTA con quiz

Quando una pagina ha un quiz interno, il quiz non va presentato come pagina normale.
Usare una card azione dedicata, affiancata alle card di navigazione.

Esempio storia:

```html
<nav class="learnCTA storyLearnCTA" aria-label="Continua il percorso di storia">
  <button class="storyQuizActionCard" type="button" onclick="openQuizModal()">
    <span>Verifica rapida</span>
    <strong>Quiz periodo</strong>
    <p>Ripassa i concetti principali della pagina.</p>
  </button>
  <a class="learningNextCard" href="storia_musica.html">
    <span>Linea del tempo</span>
    <strong>Timeline storia</strong>
    <p>Torna alla panoramica dei periodi musicali.</p>
  </a>
</nav>
```

Esempio strumenti:

```html
<button class="instrumentQuizActionCard" type="button" onclick="openInstrumentQuiz()">
  <span>Verifica rapida</span>
  <strong>Quiz strumenti</strong>
  <p>Apri un controllo veloce sulle famiglie strumentali.</p>
</button>
```

## Pagine di storia

La sezione Storia ha due tipi di pagina.

### Timeline storia

`storia/storia_musica.html` e' una pagina speciale:

- usa `css/storia/storia_timeline.css`;
- non usa `learning-ui.css`;
- non deve avere footer legale se il layout e' full-screen;
- mantiene la timeline orizzontale con frecce laterali e indicatori sotto il box;
- le card della timeline hanno stile dedicato e hover direzionale.

Non usare la timeline come modello per le pagine interne.

### Pagine interne dei periodi

Pagine come `storia_antichita.html`, `storia_medioevo.html`, `storia_rinascimento.html` devono:

- usare `base.css`, `learn.css`, `learning-ui.css` e `css/storia/storia.css`;
- mantenere header/nav esistenti della sezione;
- usare `siteSection learnSection`;
- lasciare eventuali peculiarita' storiche nelle card, ma con bordi, ombre e CTA coerenti;
- includere footer legale e `scrollTopBtn`;
- usare CTA finale con `storyQuizActionCard` + `learningNextCard`.

## Immagini

Regole:

- salvare in `img/`;
- usare nomi descrittivi in minuscolo con trattini o snake_case;
- preferire `.webp` quando possibile;
- rimuovere versioni PNG duplicate se non servono;
- non lasciare asset in `Downloads`.

## Audio

Regole:

- salvare in `audio/` o sottocartella coerente;
- usare `<audio controls preload="none">` per ascolti didattici;
- usare Web Audio API per giochi/laboratori quando serve suono generato;
- non usare file esterni se il gioco deve funzionare offline/statico.

## Checklist nuova pagina

Prima di considerare finita una nuova pagina:

- titolo coerente;
- header coerente;
- nav interna coerente;
- sezioni con `siteSection learnSection`;
- card e box coerenti;
- CTA finale presente se fa parte di un percorso;
- footer legale presente, salvo pagine full-screen speciali;
- path corretti da root o sottocartella;
- responsive controllato;
- niente testo che esce dai bottoni/card;
- se si tocca JS: `node --check js/file.js`;
- `git diff --check` ok.
