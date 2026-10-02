(function () {
  "use strict";

  const QUESTION_COUNT = 5;

  const QUIZ_BANKS = {
    historyAntiquity: {
      title: "Quiz: L'Antichita",
      intro: "Metti alla prova le tue conoscenze sulla musica nell'Antichita.",
      questions: [
        {
          prompt: "Quali strumenti erano diffusi in Mesopotamia?",
          options: ["Arpa, cetra e percussioni", "Pianoforte e violino", "Sassofono e batteria"],
          answer: 0,
          explanation: "Arpa, cetra e percussioni erano presenti nelle civilta mesopotamiche."
        },
        {
          prompt: "Che cos'era lo shofar?",
          options: ["Un tamburo romano", "Un corno rituale degli antichi Ebrei", "Una danza greca"],
          answer: 1,
          explanation: "Lo shofar e un corno rituale legato alla tradizione ebraica."
        },
        {
          prompt: "In Grecia la musica era collegata soprattutto a...",
          options: ["Poesia, danza e teatro", "Solo alla guerra", "Solo alla musica elettronica"],
          answer: 0,
          explanation: "Nella Grecia antica musica, poesia, danza e teatro erano strettamente collegati."
        },
        {
          prompt: "Quale strumento romano era a percussione?",
          options: ["Tympanum", "Flauto traverso moderno", "Pianoforte"],
          answer: 0,
          explanation: "Il tympanum era uno strumento a percussione usato nel mondo romano."
        },
        {
          prompt: "Quale funzione aveva spesso la musica nell'Antichita?",
          options: ["Religiosa e sociale", "Solo pubblicitaria", "Nessuna funzione"],
          answer: 0,
          explanation: "La musica accompagnava riti, cerimonie, teatro e momenti sociali."
        },
        {
          prompt: "Nell'antico Egitto la musica accompagnava spesso...",
          options: ["Riti, feste e cerimonie", "Solo partite sportive", "Solo lezioni di matematica"],
          answer: 0,
          explanation: "In Egitto la musica aveva ruoli rituali, celebrativi e sociali."
        },
        {
          prompt: "La lira era particolarmente importante nella cultura...",
          options: ["Greca", "Barocca", "Jazzistica"],
          answer: 0,
          explanation: "La lira era uno strumento simbolico della cultura musicale greca."
        },
        {
          prompt: "Nella tragedia greca la musica serviva anche a...",
          options: ["Sostenere il coro e l'azione scenica", "Coprire sempre le parole", "Sostituire il testo scritto"],
          answer: 0,
          explanation: "Il coro e la musica aiutavano a dare forma al racconto teatrale."
        },
        {
          prompt: "Gli strumenti a fiato antichi erano spesso usati per...",
          options: ["Cerimonie, segnali e accompagnamento", "Registrare audio digitale", "Accordare il pianoforte"],
          answer: 0,
          explanation: "Fiati e corni potevano avere funzioni rituali, militari e sociali."
        },
        {
          prompt: "Il legame tra musica e religione nell'Antichita era...",
          options: ["Molto forte", "Completamente assente", "Limitato alla musica pop"],
          answer: 0,
          explanation: "La musica aveva spesso un ruolo sacro e cerimoniale."
        },
        {
          prompt: "Quale civilta usava musica in banchetti, riti e vita di corte?",
          options: ["Egizi e Mesopotamici", "Solo compositori romantici", "Solo orchestre sinfoniche moderne"],
          answer: 0,
          explanation: "Le civilta antiche usavano musica in molti momenti pubblici e privati."
        },
        {
          prompt: "Nel mondo antico la musica era spesso trasmessa...",
          options: ["Per tradizione orale", "Solo con file MP3", "Solo con spartiti stampati"],
          answer: 0,
          explanation: "Prima della stampa e della notazione moderna la trasmissione orale era fondamentale."
        },
        {
          prompt: "Uno strumento a corde antico poteva essere...",
          options: ["La cetra", "Il sintetizzatore", "Il sassofono"],
          answer: 0,
          explanation: "La cetra era uno strumento a corde noto nel mondo antico."
        },
        {
          prompt: "A Roma la musica poteva accompagnare...",
          options: ["Spettacoli, cerimonie e vita pubblica", "Solo concerti rock", "Solo film muti"],
          answer: 0,
          explanation: "Nel mondo romano la musica aveva funzioni pubbliche, teatrali e rituali."
        },
        {
          prompt: "Studiare la musica antica aiuta a capire...",
          options: ["La vita sociale e religiosa dei popoli", "Solo la tecnologia moderna", "Solo le classifiche musicali"],
          answer: 0,
          explanation: "La musica racconta usi, valori e funzioni delle civilta antiche."
        },
        {
          prompt: "In molte civilta antiche i musicisti erano presenti...",
          options: ["In cortei, templi e feste", "Solo negli studi di registrazione", "Solo nelle orchestre sinfoniche"],
          answer: 0,
          explanation: "La musica era parte di cerimonie pubbliche, riti e occasioni festive."
        },
        {
          prompt: "L'aulos era uno strumento antico della famiglia...",
          options: ["Dei fiati", "Delle tastiere", "Degli elettrofoni"],
          answer: 0,
          explanation: "L'aulos era uno strumento a fiato usato nel mondo greco."
        },
        {
          prompt: "Nei miti greci la musica e spesso collegata a...",
          options: ["Divinita e potere educativo", "Calcio moderno", "Cinema sonoro"],
          answer: 0,
          explanation: "Figure come Apollo e le Muse mostrano il valore simbolico della musica."
        },
        {
          prompt: "Per conoscere la musica antica gli studiosi usano anche...",
          options: ["Fonti iconografiche e reperti", "Solo classifiche streaming", "Solo spartiti stampati moderni"],
          answer: 0,
          explanation: "Immagini, oggetti e testi antichi aiutano a ricostruire gli strumenti e gli usi musicali."
        },
        {
          prompt: "Nel mondo antico ritmo e percussioni potevano servire a...",
          options: ["Accompagnare danza e riti", "Spegnere il suono", "Sostituire ogni canto"],
          answer: 0,
          explanation: "Percussioni e ritmo accompagnavano movimenti, celebrazioni e cerimonie."
        }
      ]
    },
    historyMiddleAges: {
      title: "Quiz: Medioevo musicale",
      intro: "Metti alla prova le tue conoscenze sul Medioevo musicale.",
      questions: [
        {
          prompt: "Chi e tradizionalmente collegato al canto gregoriano?",
          options: ["Papa Gregorio Magno", "Giuseppe Verdi", "Ludwig van Beethoven"],
          answer: 0,
          explanation: "Papa Gregorio Magno e legato alla tradizione del canto gregoriano."
        },
        {
          prompt: "Che cosa perfeziono Guido d'Arezzo?",
          options: ["La notazione musicale", "La chitarra elettrica", "Il melodramma romantico"],
          answer: 0,
          explanation: "Guido d'Arezzo contribui allo sviluppo della notazione e dei nomi delle note."
        },
        {
          prompt: "Quali sono due grandi ambiti della musica medievale?",
          options: ["Sacra e profana", "Jazz e rock", "Elettronica e rap"],
          answer: 0,
          explanation: "Nel Medioevo si distinguono spesso musica sacra e musica profana."
        },
        {
          prompt: "Che cosa cantavano spesso trovatori e trovieri?",
          options: ["Amor cortese e temi cavallereschi", "Solo inni nazionali", "Solo pubblicita"],
          answer: 0,
          explanation: "Trovatori e trovieri cantavano temi amorosi, cortesi e narrativi."
        },
        {
          prompt: "Il canto gregoriano e soprattutto...",
          options: ["Monodico e senza accompagnamento", "Polifonico con batteria", "Solo strumentale"],
          answer: 0,
          explanation: "Il canto gregoriano e una melodia a una voce, normalmente senza strumenti."
        },
        {
          prompt: "La musica sacra medievale era legata soprattutto a...",
          options: ["Liturgia e preghiera", "Discoteche", "Cinema"],
          answer: 0,
          explanation: "La musica sacra accompagnava la liturgia e la vita religiosa."
        },
        {
          prompt: "La nascita della polifonia significa...",
          options: ["Piu linee melodiche insieme", "Una sola nota fissa", "Assenza di voce"],
          answer: 0,
          explanation: "La polifonia combina piu linee melodiche indipendenti."
        },
        {
          prompt: "L'Ars Nova riguarda...",
          options: ["Nuove forme e ritmi nel Trecento", "La musica antica egizia", "Il jazz del Novecento"],
          answer: 0,
          explanation: "L'Ars Nova porto innovazioni ritmiche e compositive nel XIV secolo."
        },
        {
          prompt: "Un centro importante per la polifonia medievale fu...",
          options: ["Notre-Dame di Parigi", "La Scala di Milano nell'Ottocento", "Hollywood"],
          answer: 0,
          explanation: "La scuola di Notre-Dame fu importante per lo sviluppo della polifonia."
        },
        {
          prompt: "La musica profana medievale era spesso eseguita da...",
          options: ["Trovatori, trovieri e giullari", "Solo monaci in coro", "Solo DJ"],
          answer: 0,
          explanation: "La musica profana circolava anche nelle corti e tra cantori itineranti."
        },
        {
          prompt: "Il latino era molto usato nella musica...",
          options: ["Sacra", "Rock", "Elettronica"],
          answer: 0,
          explanation: "Il latino era la lingua principale della liturgia occidentale."
        },
        {
          prompt: "La notazione medievale serviva a...",
          options: ["Ricordare e trasmettere i canti", "Registrare video", "Amplificare gli strumenti"],
          answer: 0,
          explanation: "La notazione aiuto a fissare e tramandare repertori musicali."
        },
        {
          prompt: "Una caratteristica del canto gregoriano e...",
          options: ["Testo religioso in latino", "Assolo di batteria", "Accordi di chitarra elettrica"],
          answer: 0,
          explanation: "Il canto gregoriano e legato al testo liturgico latino."
        },
        {
          prompt: "Nel Medioevo gli strumenti potevano accompagnare soprattutto...",
          options: ["Danza e musica profana", "Solo il canto gregoriano ufficiale", "Solo opere liriche"],
          answer: 0,
          explanation: "Gli strumenti erano frequenti in contesti profani, festivi e di danza."
        },
        {
          prompt: "Studiare il Medioevo musicale aiuta a capire...",
          options: ["Le radici della scrittura musicale europea", "Solo la musica pop attuale", "Solo il funzionamento degli amplificatori"],
          answer: 0,
          explanation: "Nel Medioevo si sviluppano basi importanti della notazione e della polifonia."
        },
        {
          prompt: "I neumi erano...",
          options: ["Segni antichi per indicare l'andamento della melodia", "Strumenti a percussione", "Danza di corte"],
          answer: 0,
          explanation: "I neumi sono segni di notazione usati prima della notazione moderna."
        },
        {
          prompt: "Il monastero nel Medioevo era spesso...",
          options: ["Un centro di conservazione e trasmissione dei canti", "Una sala da concerto rock", "Una fabbrica di pianoforti"],
          answer: 0,
          explanation: "Nei monasteri si copiavano, studiavano e tramandavano molti canti liturgici."
        },
        {
          prompt: "Una melodia monodica significa...",
          options: ["Una sola linea melodica", "Tre orchestre insieme", "Solo percussioni senza note"],
          answer: 0,
          explanation: "Monodia vuol dire una linea melodica principale."
        },
        {
          prompt: "La lingua volgare nella musica medievale compare spesso nella musica...",
          options: ["Profana", "Solo gregoriana", "Solo strumentale elettronica"],
          answer: 0,
          explanation: "Molti canti profani usavano lingue volgari, non solo il latino."
        },
        {
          prompt: "Francesco Landini e legato soprattutto...",
          options: ["All'Ars Nova italiana", "Alla musica barocca", "Alla musica romantica"],
          answer: 0,
          explanation: "Landini e una figura importante del Trecento e dell'Ars Nova italiana."
        }
      ]
    },
    historyRenaissance: {
      title: "Quiz: Rinascimento musicale",
      intro: "Metti alla prova le tue conoscenze sulla musica rinascimentale.",
      questions: [
        {
          prompt: "A quale scuola e legato Giovanni Pierluigi da Palestrina?",
          options: ["Scuola romana", "Scuola jazz", "Scuola viennese classica"],
          answer: 0,
          explanation: "Palestrina e il massimo rappresentante della scuola romana."
        },
        {
          prompt: "La scuola franco-fiamminga indica...",
          options: ["Compositori e tecniche dell'area franco-fiamminga", "Una danza spagnola", "Una scuola per strumenti elettrici"],
          answer: 0,
          explanation: "La scuola franco-fiamminga fu centrale nella polifonia rinascimentale."
        },
        {
          prompt: "Il madrigale e soprattutto...",
          options: ["Una forma vocale profana", "Un canto gregoriano", "Una sinfonia romantica"],
          answer: 0,
          explanation: "Il madrigale e una forma vocale profana molto importante nel Rinascimento."
        },
        {
          prompt: "Il Concilio di Trento chiese alla musica sacra di...",
          options: ["Rendere comprensibile il testo", "Eliminare ogni voce", "Usare solo strumenti elettronici"],
          answer: 0,
          explanation: "La comprensibilita del testo fu un tema importante nella musica sacra."
        },
        {
          prompt: "Chi sviluppo lo stile concertato nella scuola veneziana?",
          options: ["Giovanni Gabrieli", "Antonio Vivaldi", "Franz Schubert"],
          answer: 0,
          explanation: "Giovanni Gabrieli fu centrale per lo stile policorale veneziano."
        },
        {
          prompt: "La polifonia rinascimentale usa...",
          options: ["Piu voci intrecciate", "Una sola nota sempre uguale", "Solo percussioni"],
          answer: 0,
          explanation: "La polifonia rinascimentale intreccia piu linee vocali."
        },
        {
          prompt: "La stampa musicale favori...",
          options: ["Diffusione delle composizioni", "Scomparsa della musica", "Nascita del cinema"],
          answer: 0,
          explanation: "La stampa aiuto a diffondere repertori e partiture."
        },
        {
          prompt: "La musica rinascimentale cerca spesso...",
          options: ["Equilibrio e chiarezza", "Solo rumore casuale", "Volume sempre massimo"],
          answer: 0,
          explanation: "Equilibrio, proporzione e chiarezza sono idee importanti del periodo."
        },
        {
          prompt: "Il liuto era...",
          options: ["Uno strumento a corde", "Un tamburo africano", "Un sintetizzatore"],
          answer: 0,
          explanation: "Il liuto era uno strumento a corde molto diffuso nel Rinascimento."
        },
        {
          prompt: "La musica profana rinascimentale poteva essere legata a...",
          options: ["Corti, poesia e vita sociale", "Solo liturgia", "Solo pubblicita radiofonica"],
          answer: 0,
          explanation: "La musica profana viveva nelle corti e nella cultura letteraria."
        },
        {
          prompt: "La scuola veneziana sfrutto spesso...",
          options: ["Cori contrapposti nello spazio", "Solo un flauto solista", "Solo basi registrate"],
          answer: 0,
          explanation: "A Venezia ebbe rilievo l'uso spaziale di cori e gruppi sonori."
        },
        {
          prompt: "Il Rinascimento valorizza molto il rapporto tra musica e...",
          options: ["Testo poetico", "Rumore meccanico", "Silenzio obbligatorio"],
          answer: 0,
          explanation: "Nel madrigale il rapporto tra parola e musica diventa molto espressivo."
        },
        {
          prompt: "Un autore importante della musica sacra rinascimentale e...",
          options: ["Palestrina", "Mozart", "Chopin"],
          answer: 0,
          explanation: "Palestrina e una figura fondamentale della polifonia sacra rinascimentale."
        },
        {
          prompt: "La musica rinascimentale e spesso eseguita...",
          options: ["A cappella o con strumenti", "Solo con computer", "Solo con orchestra romantica"],
          answer: 0,
          explanation: "Il repertorio poteva essere vocale a cappella o accompagnato da strumenti."
        },
        {
          prompt: "Studiare il Rinascimento musicale aiuta a capire...",
          options: ["La maturazione della polifonia europea", "Solo la nascita del rap", "Solo gli effetti digitali"],
          answer: 0,
          explanation: "Nel Rinascimento la polifonia raggiunge grande equilibrio e complessita."
        },
        {
          prompt: "Nel Rinascimento il compositore cerca spesso di far capire...",
          options: ["Il significato del testo", "Solo il volume massimo", "Solo la velocita"],
          answer: 0,
          explanation: "Il rapporto tra parola e musica diventa centrale, soprattutto nel madrigale."
        },
        {
          prompt: "La messa e il mottetto sono generi soprattutto...",
          options: ["Sacri", "Da discoteca", "Cinematografici"],
          answer: 0,
          explanation: "Messa e mottetto appartengono al repertorio sacro rinascimentale."
        },
        {
          prompt: "Orlando di Lasso e ricordato come...",
          options: ["Un importante compositore rinascimentale", "Un inventore del pianoforte", "Un direttore jazz"],
          answer: 0,
          explanation: "Orlando di Lasso fu uno dei grandi maestri della polifonia europea."
        },
        {
          prompt: "La frottola e legata alla musica...",
          options: ["Profana italiana", "Liturgica medievale", "Elettronica"],
          answer: 0,
          explanation: "La frottola e una forma profana italiana precedente e vicina al mondo del madrigale."
        },
        {
          prompt: "La Cappella Sistina e collegata alla tradizione...",
          options: ["Della musica sacra romana", "Delle bande jazz", "Dell'opera verista"],
          answer: 0,
          explanation: "La Cappella Sistina fu un centro importante della musica sacra a Roma."
        }
      ]
    },
    historyBaroque: {
      title: "Quiz: Il Barocco",
      intro: "Metti alla prova le tue conoscenze sulla musica barocca.",
      questions: [
        { prompt: "Quale elemento sostiene spesso l'armonia barocca?", options: ["Il basso continuo", "Il bordone elettronico", "La sola percussione"], answer: 0, explanation: "Il basso continuo fornisce la base armonica a gran parte della musica barocca." },
        { prompt: "Qual e la funzione principale del recitativo nell'opera?", options: ["Far avanzare l'azione", "Presentare una danza", "Chiudere sempre lo spettacolo"], answer: 0, explanation: "Il recitativo segue il ritmo della parola e porta avanti il racconto." },
        { prompt: "In quale citta apri nel 1637 un importante teatro d'opera pubblico?", options: ["Venezia", "Vienna", "Parigi"], answer: 0, explanation: "Venezia fu decisiva per il passaggio dell'opera dalla corte al teatro pubblico." },
        { prompt: "Chi compose L'Orfeo?", options: ["Claudio Monteverdi", "Antonio Vivaldi", "Johann Sebastian Bach"], answer: 0, explanation: "Monteverdi compose L'Orfeo, rappresentato a Mantova nel 1607." },
        { prompt: "Nel concerto grosso dialogano...", options: ["Un piccolo gruppo e l'orchestra", "Due cori senza strumenti", "Un cantante e il pubblico"], answer: 0, explanation: "Il concertino, cioe il piccolo gruppo, si alterna con il ripieno orchestrale." },
        { prompt: "A quale compositore sono legate Le quattro stagioni?", options: ["Antonio Vivaldi", "Jean-Baptiste Lully", "Giovanni Battista Pergolesi"], answer: 0, explanation: "Le quattro stagioni sono quattro celebri concerti di Vivaldi." },
        { prompt: "Quale compositore rese sonata e concerto grosso modelli europei?", options: ["Arcangelo Corelli", "Claudio Monteverdi", "Giovanni Battista Pergolesi"], answer: 0, explanation: "Corelli fu un punto di riferimento per la scrittura degli archi, la sonata e il concerto grosso." },
        { prompt: "Che cosa caratterizza una fuga?", options: ["Un tema imitato da piu voci", "Una sola nota ripetuta", "Una successione casuale di rumori"], answer: 0, explanation: "Nella fuga il soggetto entra in voci diverse e genera un intreccio contrappuntistico." },
        { prompt: "Quale strumento pizzica le corde tramite una tastiera?", options: ["Clavicembalo", "Organo", "Violino"], answer: 0, explanation: "Nel clavicembalo piccoli plettri pizzicano le corde quando si premono i tasti." },
        { prompt: "Quale genere racconta spesso una vicenda sacra senza scene e costumi?", options: ["Oratorio", "Opera buffa", "Suite"], answer: 0, explanation: "L'oratorio e un grande racconto musicale eseguito senza apparato scenico." },
        { prompt: "Chi lavoro alla corte di Luigi XIV?", options: ["Jean-Baptiste Lully", "Claudio Monteverdi", "Antonio Vivaldi"], answer: 0, explanation: "Lully fu la figura musicale centrale della corte del Re Sole." },
        { prompt: "Quale coppia descrive bene l'estetica barocca?", options: ["Contrasto e meraviglia", "Immobilita e uniformita", "Silenzio e assenza di ritmo"], answer: 0, explanation: "Contrasto, movimento, decorazione e meraviglia sono tratti tipici del Barocco." },
        { prompt: "La serva padrona di Pergolesi e un esempio di...", options: ["Opera buffa", "Passione", "Concerto grosso"], answer: 0, explanation: "La serva padrona e uno dei titoli simbolo dell'opera buffa settecentesca." },
        { prompt: "Quale famiglia costituisce la base dell'orchestra barocca?", options: ["Gli archi", "I sassofoni", "Le tastiere elettroniche"], answer: 0, explanation: "Violini, viole, violoncelli e contrabbassi formano il nucleo dell'orchestra barocca." },
        { prompt: "A quale compositore e legato il culmine del contrappunto barocco?", options: ["Johann Sebastian Bach", "Giuseppe Verdi", "Claude Debussy"], answer: 0, explanation: "Bach porto fuga e contrappunto a una sintesi di eccezionale complessita." },
        { prompt: "Che cosa fa un'aria nell'opera?", options: ["Esprime un sentimento del personaggio", "Cambia la scenografia", "Sostituisce tutti gli strumenti"], answer: 0, explanation: "L'aria sospende l'azione e mette al centro l'emozione del personaggio." },
        { prompt: "Chi finanziava spesso musicisti e spettacoli nelle corti barocche?", options: ["Principi e sovrani", "Solo il pubblico dei concerti rock", "Le case discografiche"], answer: 0, explanation: "Il mecenatismo di principi e sovrani sosteneva cappelle, orchestre e spettacoli di corte." }
      ]
    },
    instruments: {
      title: "Quiz: famiglie degli strumenti",
      intro: "Metti alla prova la classificazione degli strumenti.",
      questions: [
        {
          prompt: "In quale famiglia vibra una colonna d'aria?",
          options: ["Strumenti a fiato", "Percussioni", "Elettrofoni", "Cordofoni"],
          answer: 0,
          explanation: "Negli strumenti a fiato il suono nasce dalla vibrazione dell'aria."
        },
        {
          prompt: "Quale strumento e a corde percosse?",
          options: ["Arpa", "Pianoforte", "Tromba", "Organo"],
          answer: 1,
          explanation: "Nel pianoforte i martelletti percuotono le corde."
        },
        {
          prompt: "Quale strumento si suona senza toccarlo?",
          options: ["Theremin", "Tamburo", "Clarinetto", "Pianoforte"],
          answer: 0,
          explanation: "Il theremin si controlla con il movimento delle mani nello spazio."
        },
        {
          prompt: "Il violino appartiene alla famiglia...",
          options: ["Corde", "Fiati", "Percussioni", "Elettrofoni"],
          answer: 0,
          explanation: "Il violino produce suono grazie alla vibrazione delle corde."
        },
        {
          prompt: "Il timpano e uno strumento...",
          options: ["A percussione", "Ad arco", "A tastiera", "A fiato"],
          answer: 0,
          explanation: "Il timpano e una percussione a suono determinato."
        },
        {
          prompt: "Il clarinetto appartiene agli...",
          options: ["Aerofoni", "Cordofoni", "Idiofoni", "Membranofoni"],
          answer: 0,
          explanation: "Il clarinetto e un aerofono: vibra una colonna d'aria."
        },
        {
          prompt: "La chitarra produce suono grazie a...",
          options: ["Corde pizzicate", "Una colonna d'aria", "Una membrana percossa", "Circuiti elettronici"],
          answer: 0,
          explanation: "La chitarra e un cordofono a corde pizzicate."
        },
        {
          prompt: "Il tamburo produce il suono tramite...",
          options: ["Una membrana che vibra", "Una tastiera elettronica", "Una corda sfregata", "Una colonna d'aria"],
          answer: 0,
          explanation: "Nel tamburo vibra una membrana percossa."
        },
        {
          prompt: "Il sintetizzatore e un esempio di...",
          options: ["Elettrofono", "Legno antico", "Arco a corde", "Membranofono"],
          answer: 0,
          explanation: "Il sintetizzatore genera o modifica il suono elettronicamente."
        },
        {
          prompt: "Il flauto traverso appartiene alla famiglia...",
          options: ["Fiati", "Percussioni", "Corde", "Tastiere"],
          answer: 0,
          explanation: "Il flauto e uno strumento a fiato."
        },
        {
          prompt: "Quale strumento usa normalmente un arco?",
          options: ["Violoncello", "Tromba", "Xilofono", "Pianoforte"],
          answer: 0,
          explanation: "Il violoncello e uno strumento ad arco."
        },
        {
          prompt: "Lo xilofono e classificato tra...",
          options: ["Percussioni", "Fiati", "Elettrofoni", "Corde"],
          answer: 0,
          explanation: "Lo xilofono e una percussione a barre intonate."
        },
        {
          prompt: "La tromba produce suono grazie a...",
          options: ["Vibrazione delle labbra e aria", "Corde sfregate", "Membrana percossa", "Tasti e martelletti"],
          answer: 0,
          explanation: "Negli ottoni le labbra del musicista mettono in vibrazione l'aria."
        },
        {
          prompt: "L'organo a canne e legato soprattutto alla famiglia...",
          options: ["Fiati a tastiera", "Percussioni", "Corde pizzicate", "Elettrofoni"],
          answer: 0,
          explanation: "Nell'organo il suono nasce dall'aria che passa nelle canne."
        },
        {
          prompt: "Per classificare uno strumento guardiamo soprattutto...",
          options: ["Che cosa vibra", "Il colore della custodia", "La grandezza della stanza", "La marca dello strumento"],
          answer: 0,
          explanation: "La classificazione parte dal corpo vibrante che produce il suono."
        },
        {
          prompt: "L'oboe appartiene alla famiglia...",
          options: ["Dei legni", "Degli ottoni", "Delle percussioni", "Degli elettrofoni"],
          answer: 0,
          explanation: "L'oboe e un legno ad ancia doppia."
        },
        {
          prompt: "Il corno francese appartiene agli...",
          options: ["Ottoni", "Archi", "Elettrofoni", "Legni"],
          answer: 0,
          explanation: "Il corno e uno strumento a fiato della famiglia degli ottoni."
        },
        {
          prompt: "La viola e simile al violino ma...",
          options: ["Ha registro piu grave", "E uno strumento a fiato", "Non ha corde", "Ha registro piu acuto"],
          answer: 0,
          explanation: "La viola appartiene agli archi e suona piu grave del violino."
        },
        {
          prompt: "I piatti orchestrali sono...",
          options: ["Percussioni", "Corde", "Legni", "Ottoni"],
          answer: 0,
          explanation: "I piatti sono strumenti a percussione."
        },
        {
          prompt: "La fisarmonica produce suono grazie a...",
          options: ["Ance messe in vibrazione dall'aria", "Corde sfregate", "Una membrana percossa", "Tasti elettronici"],
          answer: 0,
          explanation: "Nella fisarmonica l'aria mette in vibrazione le ance."
        },
        {
          prompt: "Quale tipo di ancia usa l'oboe?",
          options: ["Ancia doppia", "Ancia semplice", "Nessuna ancia", "Ancia libera"],
          answer: 0,
          explanation: "L'oboe produce il suono con una sottile ancia doppia."
        },
        {
          prompt: "Quale tipo di ancia usa il clarinetto?",
          options: ["Ancia doppia", "Ancia semplice", "Ancia libera", "Nessuna ancia"],
          answer: 1,
          explanation: "Nel clarinetto vibra una sola ancia fissata al bocchino."
        },
        {
          prompt: "Perche il sassofono viene studiato tra i legni?",
          options: ["Usa un'ancia semplice", "Ha sempre il corpo in legno", "Non usa aria", "Usa un'ancia doppia"],
          answer: 0,
          explanation: "Anche se e costruito in metallo, il sassofono usa un'ancia semplice come il clarinetto."
        },
        {
          prompt: "Nel trombone l'altezza dei suoni cambia soprattutto con...",
          options: ["I tasti", "La coulisse", "Le corde", "I pistoni"],
          answer: 1,
          explanation: "La coulisse allunga o accorcia il tubo e modifica l'altezza del suono."
        },
        {
          prompt: "Il corno francese appartiene alla sezione...",
          options: ["Degli archi", "Delle percussioni", "Degli ottoni", "Dei legni"],
          answer: 2,
          explanation: "Il corno e un ottone dal lungo tubo avvolto e dal timbro morbido."
        },
        {
          prompt: "Qual e normalmente lo strumento piu grave degli ottoni?",
          options: ["Tromba", "Tuba", "Corno", "Trombone"],
          answer: 1,
          explanation: "La tuba sostiene il registro piu grave della famiglia degli ottoni."
        },
        {
          prompt: "Quale strumento produce i suoni piu acuti della famiglia del flauto?",
          options: ["Ottavino", "Fagotto", "Clarinetto basso", "Flauto basso"],
          answer: 0,
          explanation: "L'ottavino e piccolo, ma raggiunge il registro piu acuto dell'orchestra."
        },
        {
          prompt: "Quale strumento e un legno grave ad ancia doppia?",
          options: ["Sassofono", "Fagotto", "Flauto", "Oboe"],
          answer: 1,
          explanation: "Il fagotto usa un'ancia doppia e copre il registro grave dei legni."
        },
        {
          prompt: "Come vengono messe in vibrazione le corde dell'arpa?",
          options: ["Con martelletti", "Con un arco", "Pizzicandole con le dita", "Soffiando"],
          answer: 2,
          explanation: "L'arpista pizzica direttamente le corde con le dita."
        },
        {
          prompt: "Nel clavicembalo le corde vengono...",
          options: ["Percosse", "Pizzicate", "Soffiate", "Sfregate con un arco"],
          answer: 1,
          explanation: "Nel clavicembalo piccoli plettri pizzicano le corde quando si premono i tasti."
        },
        {
          prompt: "Nel pianoforte il tasto aziona...",
          options: ["Un martelletto", "Un mantice", "Una valvola ad aria", "Un plettro"],
          answer: 0,
          explanation: "Premendo un tasto, un martelletto rivestito colpisce le corde."
        },
        {
          prompt: "Quale parte della fisarmonica spinge l'aria attraverso le ance?",
          options: ["La coulisse", "La pedaliera", "Il mantice", "I tasti"],
          answer: 2,
          explanation: "Aprendo e chiudendo il mantice si crea il flusso d'aria che fa vibrare le ance."
        },
        {
          prompt: "A cosa serve il pedale dei timpani?",
          options: ["A cambiare la tensione della membrana", "A muovere le bacchette", "Ad amplificare elettricamente il suono", "A spegnere i risonatori"],
          answer: 0,
          explanation: "Il pedale tende o allenta la membrana e permette di cambiare nota."
        },
        {
          prompt: "Di quale materiale sono normalmente le barre dello xilofono?",
          options: ["Vetro", "Legno", "Carta", "Metallo"],
          answer: 1,
          explanation: "Lo xilofono tradizionale usa barre di legno intonate."
        },
        {
          prompt: "Di quale materiale sono le barre del vibrafono?",
          options: ["Legno", "Pelle", "Metallo", "Vetro"],
          answer: 2,
          explanation: "Il vibrafono usa barre metalliche abbinate a tubi risonatori."
        },
        {
          prompt: "Il gong produce il suono facendo vibrare...",
          options: ["Un grande disco metallico", "Una corda", "Una colonna d'acqua", "Una membrana"],
          answer: 0,
          explanation: "Il gong e un idiofono: vibra direttamente il suo corpo metallico."
        },
        {
          prompt: "Come si suonano normalmente le castagnette?",
          options: ["Soffiando", "Con un arco", "Percuotendo tra loro due valve", "Pizzicandole"],
          answer: 2,
          explanation: "Le due valve di legno vengono battute rapidamente una contro l'altra."
        },
        {
          prompt: "Le maracas producono il suono quando vengono...",
          options: ["Pizzicate", "Scosse", "Sfregate con un arco", "Percosse con bacchette"],
          answer: 1,
          explanation: "Scuotendole, i piccoli elementi interni urtano contro l'involucro."
        },
        {
          prompt: "Con che cosa si colpisce normalmente il triangolo?",
          options: ["Una bacchetta metallica", "Un martelletto di pianoforte", "Un archetto", "Una bacchetta di legno"],
          answer: 0,
          explanation: "Il triangolo viene percosso con una sottile bacchetta di metallo."
        },
        {
          prompt: "Nei piatti orchestrali a vibrare sono...",
          options: ["Le corde", "Le membrane", "Le lastre metalliche", "Le colonne d'aria"],
          answer: 2,
          explanation: "Il suono nasce dalla vibrazione dei due dischi metallici."
        },
        {
          prompt: "Qual e lo strumento piu acuto del quartetto d'archi?",
          options: ["Violino", "Viola", "Violoncello", "Contrabbasso"],
          answer: 0,
          explanation: "Nel quartetto d'archi il violino occupa il registro piu acuto."
        },
        {
          prompt: "Rispetto al violino, la viola ha generalmente un suono...",
          options: ["Piu acuto", "Piu grave", "Sempre elettronico", "Identico in altezza"],
          answer: 1,
          explanation: "La viola e leggermente piu grande e ha un registro piu grave del violino."
        },
        {
          prompt: "Quale strumento ad arco usa normalmente un puntale appoggiato a terra?",
          options: ["Violino", "Viola", "Violoncello", "Mandolino"],
          answer: 2,
          explanation: "Il violoncello viene sostenuto da un puntale che poggia sul pavimento."
        },
        {
          prompt: "Qual e lo strumento piu grande e grave della sezione degli archi?",
          options: ["Contrabbasso", "Violino", "Viola", "Violoncello"],
          answer: 0,
          explanation: "Il contrabbasso e lo strumento ad arco di dimensioni maggiori e dal registro piu grave."
        },
        {
          prompt: "Il mandolino viene suonato soprattutto con...",
          options: ["Un bocchino", "Un plettro", "Una bacchetta", "Un arco"],
          answer: 1,
          explanation: "Le corde del mandolino vengono pizzicate rapidamente con un plettro."
        },
        {
          prompt: "Nella cornamusa la sacca serve a...",
          options: ["Accordare le corde", "Percuotere una membrana", "Conservare e distribuire l'aria", "Regolare la lunghezza del tubo"],
          answer: 2,
          explanation: "La sacca funziona come una riserva d'aria e mantiene il suono continuo."
        },
        {
          prompt: "Nell'organo a canne il suono nasce quando...",
          options: ["L'aria attraversa le canne", "Un arco sfrega le corde", "Si scuote una membrana", "I martelletti colpiscono le corde"],
          answer: 0,
          explanation: "L'aria inviata nelle canne mette in vibrazione la colonna d'aria al loro interno."
        },
        {
          prompt: "Nella chitarra elettrica i pickup servono a...",
          options: ["Soffiare aria nelle corde", "Trasformare le vibrazioni in un segnale elettrico", "Tendere una membrana", "Far scorrere l'arco"],
          answer: 1,
          explanation: "I pickup rilevano la vibrazione delle corde e la convertono in un segnale elettrico."
        },
        {
          prompt: "Come si controlla l'altezza nel theremin?",
          options: ["Premendo i tasti", "Usando una coulisse", "Muovendo le mani vicino alle antenne", "Pizzicando le corde"],
          answer: 2,
          explanation: "Il theremin si suona senza contatto, variando la posizione delle mani nello spazio."
        },
        {
          prompt: "Il sintetizzatore crea il suono principalmente tramite...",
          options: ["Circuiti elettronici o sistemi digitali", "Una membrana naturale", "Una colonna d'aria in una canna", "Corde sfregate"],
          answer: 0,
          explanation: "Il sintetizzatore genera e modifica segnali sonori elettronici o digitali."
        }
      ]
    }
  };

  const instances = new Map();
  const recentQuestionByBank = new Map();

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getInstance(target) {
    const id = typeof target === "string" ? target : target?.id;
    return instances.get(id);
  }

  function render(instance) {
    const bank = QUIZ_BANKS[instance.bankId];
    if (!bank) return;

    const questions = shuffle(bank.questions)
      .slice(0, instance.count)
      .map((question) => ({
        ...question,
        renderedOptions: shuffle(question.options.map((option, index) => ({
          text: option,
          correct: index === question.answer
        })))
      }));
    instance.questions = questions;
    instance.result.style.display = "none";
    instance.result.textContent = "";
    instance.result.className = "quizResult";

    if (instance.title) instance.title.textContent = bank.title;
    if (instance.intro) instance.intro.textContent = bank.intro;

    instance.container.innerHTML = questions.map((question, questionIndex) => {
      const name = `${instance.id}-q${questionIndex + 1}`;
      return `
        <div class="quizQuestion" data-question-index="${questionIndex}">
          <h4>${questionIndex + 1}. ${escapeHtml(question.prompt)}</h4>
          <div class="quizOptions">
            ${question.renderedOptions.map((option, optionIndex) => `
              <label>
                <input type="radio" name="${name}" value="${optionIndex}">
                <span class="optionText">${String.fromCharCode(65 + optionIndex)}) ${escapeHtml(option.text)}</span>
              </label>
            `).join("")}
          </div>
          <p class="quizAnswer" hidden>Risposta corretta: ${escapeHtml(question.renderedOptions.find((option) => option.correct).text)}. ${escapeHtml(question.explanation)}</p>
        </div>
      `;
    }).join("");
  }

  function check(target) {
    const instance = getInstance(target);
    if (!instance) return;

    const questionElements = [...instance.container.querySelectorAll(".quizQuestion")];
    const unanswered = questionElements.some((question) => !question.querySelector("input:checked"));
    if (unanswered) {
      instance.result.textContent = "Rispondi a tutte le domande prima di controllare.";
      instance.result.className = "quizResult incorrect";
      instance.result.style.display = "block";
      return;
    }

    let score = 0;
    questionElements.forEach((questionElement) => {
      const index = Number(questionElement.dataset.questionIndex);
      const question = instance.questions[index];
      const selected = questionElement.querySelector("input:checked");
      const selectedValue = Number(selected.value);
      const selectedOption = question.renderedOptions[selectedValue];

      questionElement.querySelectorAll(".quizOptions label").forEach((label) => {
        const input = label.querySelector("input");
        const value = Number(input.value);
        const option = question.renderedOptions[value];
        label.classList.remove("selected", "correct", "wrong");
        if (option.correct) label.classList.add("correct");
        if (input.checked && !option.correct) label.classList.add("wrong");
      });

      questionElement.querySelector(".quizAnswer").hidden = false;
      if (selectedOption.correct) score += 1;
    });

    const total = instance.questions.length;
    const percentage = Math.round((score / total) * 100);
    const perfect = score === total;
    instance.result.innerHTML = perfect
      ? `Perfetto: <strong>${score}/${total}</strong>. Ottimo lavoro.`
      : `Hai totalizzato <strong>${score}/${total}</strong> (${percentage}%). Riprova con un nuovo giro di domande.`;
    instance.result.className = `quizResult ${perfect || percentage >= 60 ? "correct" : "incorrect"}`;
    instance.result.style.display = "block";
  }

  function reset(target) {
    const instance = getInstance(target);
    if (instance) render(instance);
  }

  function drawQuestion(bankId) {
    const bank = QUIZ_BANKS[bankId];
    if (!bank?.questions?.length) return null;

    const previousIndex = recentQuestionByBank.get(bankId);
    const candidates = bank.questions
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => bank.questions.length === 1 || index !== previousIndex);
    const selected = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
    if (!selected) return null;

    recentQuestionByBank.set(bankId, selected.index);
    const { question, index } = selected;
    return {
      prompt: question.prompt,
      options: shuffle(question.options),
      answer: question.options[question.answer],
      explanation: question.explanation,
      key: `${bankId}:${index}`
    };
  }

  function init(container) {
    const modal = container.closest(".modal");
    if (!modal?.id) return;

    const bankId = container.dataset.quizBank;
    if (!QUIZ_BANKS[bankId]) return;

    const instance = {
      id: modal.id,
      modal,
      container,
      bankId,
      count: Math.min(Number(container.dataset.quizCount) || QUESTION_COUNT, QUIZ_BANKS[bankId].questions.length),
      title: modal.querySelector(".modalHeader h2"),
      intro: modal.querySelector(".quizIntro"),
      result: modal.querySelector(".quizResult")
    };

    instances.set(modal.id, instance);
    container.addEventListener("change", (event) => {
      const input = event.target.closest("input[type='radio']");
      if (!input) return;
      const question = input.closest(".quizQuestion");
      question.querySelectorAll(".quizOptions label").forEach((label) => {
        label.classList.remove("selected", "correct", "wrong");
      });
      input.closest("label").classList.add("selected");
      const answer = question.querySelector(".quizAnswer");
      if (answer) answer.hidden = true;
      instance.result.style.display = "none";
    });

    render(instance);
  }

  function initAll() {
    document.querySelectorAll("[data-learning-quiz]").forEach(init);
  }

  window.MGH = window.MGH || {};
  window.MGH.learningQuiz = {
    initAll,
    check,
    reset,
    drawQuestion
  };

  document.addEventListener("DOMContentLoaded", initAll);
})();
