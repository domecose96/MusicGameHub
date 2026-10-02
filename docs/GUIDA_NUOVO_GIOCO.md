# MusicGameHub - Guida per creare o centralizzare un gioco

Questa guida serve per mantenere i giochi coerenti tra loro.

## File minimi

Per un nuovo gioco creare:

```text
giochi/nome-gioco.html
css/nome-gioco.css
js/nome-gioco.js
```

Se il gioco puo' usare solo CSS comune, evitare CSS dedicato.

## Struttura pagina gioco

Ogni gioco dovrebbe avere:

1. header con home/back coerente;
2. schermata selezione modalita';
3. modalita' allenamento;
4. modalita' classificata se prevista;
5. box bianco centrale di gioco;
6. domanda fuori dal box, quando il pattern degli altri giochi lo richiede;
7. pulsanti comuni centralizzati;
8. feedback corretto/sbagliato coerente;
9. eventuale pulsante `?` con regole specifiche del gioco;
10. ranked solo se il gioco e' pronto.

## Centralizzazione

Usare i moduli comuni quando possibile:

| Modulo | Uso |
|---|---|
| `js/giochi/game_ui.js` | schermata modalita', pulsanti, feedback, UI comune |
| `js/giochi/ranked.js` | classificata, timer, salvataggio punteggio |

La logica specifica deve restare nel JS del gioco:

- generazione domande;
- regole musicali;
- validazione risposta;
- audio specifico;
- SVG specifici.

## Modalita'

### Allenamento

In allenamento:

- non serve timer generale;
- mostrare progressione se utile, per esempio `1/10`;
- evitare score se non serve didatticamente;
- permettere retry senza salvare ranked.

### Classificata

In classificata:

- usare ranked centralizzato;
- il tempo deve essere coerente con il tipo di gioco;
- se non esiste tempo di risposta, usare punteggio basato su precisione o correttezza;
- salvare solo risultati validi;
- non mostrare elementi inutili come livello/score se il gioco non li usa.

## Feedback

La forma del feedback deve essere uniforme:

- corretto: feedback verde;
- sbagliato: feedback rosso;
- frase breve e specifica;
- se il gioco richiede indicazione temporale o posizione, il feedback deve apparire nel punto corretto.

La frase puo' essere specifica del gioco, ma la forma visuale deve restare coerente.

## Bottoni

Usare bottoni comuni quando possibile:

- `Verifica`;
- `Riprova`;
- `Nuovo ritmo`;
- `Play/Pausa`;
- `Batti`;
- `Indietro`;
- `?` regole.

Regole:

- non duplicare bottoni se il gioco ha gia' comandi centralizzati;
- non aggiungere comandi non necessari;
- icone centrate;
- testo breve;
- nessuno scroll dentro il box di gioco se evitabile.

## Box di gioco

Il box principale deve:

- essere bianco o coerente con i giochi centralizzati;
- contenere solo l'esperienza principale;
- non avere contenuti che escono in classificata;
- mantenere dimensioni stabili;
- essere responsive;
- non avere scroll interno salvo casi inevitabili.

## Regole `?`

Il pulsante regole deve:

- spiegare solo cio' che serve per giocare;
- non avere scroll su desktop;
- non essere troppo sintetico;
- essere specifico del gioco;
- usare testi brevi e didattici.

## Ranked e Pro

Regole:

- `Ranked` solo se la modalita' classificata e' completa;
- `Pro` solo se sblocca una vera estensione di difficolta' o contenuto;
- il badge Pro deve usare lo stesso stile dei giochi gia' approvati;
- eventuali effetti Pro comuni vanno centralizzati, non ricreati gioco per gioco.

## Integrazione home/mappa

Quando si aggiunge un gioco:

1. aggiungere o aggiornare la risorsa in `js/resources.js`;
2. controllare `homeGames`;
3. controllare `playable`;
4. decidere se `comingSoon`;
5. aggiungere badge `daily`, `ranked`, `pro` se previsti;
6. controllare home e mappa.

## Collegamento da pagine didattiche

Se il gioco viene lanciato da una pagina didattica, usare il box gioco comune invece di creare un nuovo stile locale:

```html
<div class="learnGameBox">
  <p>Descrizione breve del gioco.</p>
  <button class="menuButton gameLaunchButton" onclick="MGH.goTo('giochi/nome-gioco.html')">
    <span aria-hidden="true">🎮</span>
    <span>Nome gioco</span>
    <span class="learnGameBadge">Ranked</span>
  </button>
</div>
```

Regole:

- il box resta nella sezione didattica, non nel CTA finale tra pagine;
- il CTA finale usa `learnCTA` e `learningNextCard`;
- un quiz interno alla pagina non e' un gioco: usare una card azione dedicata, come `storyQuizActionCard` o `instrumentQuizActionCard`;
- non duplicare bottoni con colori e dimensioni diverse.

## Giochi in arrivo

Se un gioco non e' pronto:

```js
comingSoon: true
```

Regole:

- puo' essere visibile;
- non deve essere cliccabile da home/mappa;
- non deve entrare in `playable`;
- non va pubblicato come pronto finche' non viene approvato.

## Audio

Regole:

- per giochi ritmici usare Web Audio API quando possibile;
- suoni fissi e coerenti per metronomo, esecuzione PC e tap utente;
- sincronizzazione visuale/audio controllata;
- spazio e touch devono funzionare dove richiesto;
- non usare file esterni se il gioco puo' generare il suono.

## SVG e notazione

Se il gioco usa notazione:

- usare SVG quando serve precisione;
- mantenere simboli coerenti;
- non usare immagini per note se il gioco deve generarle dinamicamente;
- posizionare feedback nel punto reale dell'azione dell'utente.

## Checklist nuovo gioco

Prima di considerare finito un gioco:

- UI modalita' centralizzata;
- box gioco coerente;
- feedback coerente;
- regole `?` corrette;
- allenamento funzionante;
- classificata funzionante se prevista;
- ranked salva correttamente se previsto;
- responsive ok;
- home/mappa aggiornate;
- `node --check js/nome-gioco.js`;
- `git diff --check`.
