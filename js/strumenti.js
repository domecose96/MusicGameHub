/* ==================== STRUMENTI MUSICALI JS ==================== */

const instrumentInfo = {
  gong: {
    title: "Gong",
    emoji: "🟤",
    image: "img/strumenti/gong.webp",
    blueImage: "img/strumenti/gong_blueprint.webp",
    audio: "audio/strumenti/gong.mp3",
    text: "Il gong è un disco metallico sospeso che viene percosso con una mazza. Produce un suono ampio, risonante e solenne, spesso usato per effetti suggestivi.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: profondo e risonante", "Materiale: metallo"]
  },

  "tam-tam": {
    title: "Tam-tam",
    emoji: "🟤",
    image: "img/strumenti/tam_tam.webp",
    blueImage: "img/strumenti/tam_tam_blueprint.webp",
    audio: "audio/strumenti/tam_tam.mp3",
    text: "Il tam-tam è simile al gong, ma generalmente ha un suono più cupo, misterioso e indeterminato. In orchestra viene usato per creare atmosfere drammatiche.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: indeterminato", "Effetto: misterioso e solenne"]
  },

  piatti: {
    title: "Piatti",
    emoji: "🥏",
    image: "img/strumenti/piatti.webp",
    blueImage: "img/strumenti/piatti_blueprint.webp",
    audio: "audio/strumenti/piatti.mp3",
    text: "Sono dischi metallici percossi tra loro o con bacchette. Hanno un timbro brillante e penetrante, utile per accenti, crescendo ed effetti improvvisi.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: brillante", "Materiale: metallo"]
  },

  "piatto-sospeso": {
    title: "Piatto sospeso",
    emoji: "🥏",
    image: "img/strumenti/piatto_sospeso.webp",
    blueImage: "img/strumenti/piatto_sospeso_blueprint.webp",
    audio: "audio/strumenti/piatto_sospeso.mp3",
    text: "Il piatto sospeso è un piatto singolo montato su un supporto. Si suona con bacchette, mazze morbide o spazzole e può produrre colpi secchi, rulli e crescendo molto espressivi.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: brillante", "Uso: accenti e crescendo"]
  },

  triangolo: {
    title: "Triangolo",
    emoji: "△",
    image: "img/strumenti/triangolo.webp",
    blueImage: "img/strumenti/triangolo_blueprint.webp",
    audio: "audio/strumenti/triangolo.mp3",
    text: "È una barretta metallica piegata a forma di triangolo e percossa con una bacchetta. Produce un suono limpido, argentino e molto riconoscibile.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: chiaro e argentato", "Altezza: indeterminata"]
  },

  "campane-tubolari": {
    title: "Campane tubolari",
    emoji: "🔔",
    image: "img/strumenti/campane_tubolari.webp",
    blueImage: "img/strumenti/campane_tubolari_blueprint.webp",
    audio: "audio/strumenti/campane_tubolari.mp3",
    text: "Le campane tubolari sono tubi metallici intonati, sospesi verticalmente e percossi con un martello. Imitano il suono delle campane e sono usate spesso per effetti solenni.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono intonato", "Materiale: metallo", "Suono: solenne"]
  },

  castagnette: {
    title: "Castagnette",
    emoji: "👏",
    image: "img/strumenti/castagnette.webp",
    blueImage: "img/strumenti/castagnette_blueprint.webp",
    audio: "audio/strumenti/castagnette.mp3",
    text: "Piccole percussioni in legno formate da due elementi concavi battuti tra loro. Sono legate alla danza e alla musica popolare.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: secco e ritmico", "Contesto: danza"]
  },

  woodblock: {
    title: "Woodblock",
    emoji: "🪵",
    image: "img/strumenti/woodblock.webp",
    blueImage: "img/strumenti/woodblock_blueprint.webp",
    audio: "audio/strumenti/woodblock.mp3",
    text: "Il woodblock è un blocco di legno scavato che viene percosso con una bacchetta. Produce un suono breve, asciutto e molto netto.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono in legno", "Suono: secco", "Funzione: ritmo"]
  },

  "temple-block": {
    title: "Temple block",
    emoji: "🪵",
    image: "img/strumenti/temple_block.webp",
    blueImage: "img/strumenti/temple_block_blueprint.webp",
    audio: "audio/strumenti/temple_block.mp3",
    text: "I temple block sono blocchi di legno cavi, spesso usati in serie con altezze diverse. Hanno un timbro secco, rotondo e molto caratteristico.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono in legno", "Suono: secco e cavo", "Uso: effetti ritmici"]
  },

  raganella: {
    title: "Raganella",
    emoji: "⚙️",
    image: "img/strumenti/raganella.webp",
    blueImage: "img/strumenti/raganella_blueprint.webp",
    audio: "audio/strumenti/raganella.mp3",
    text: "La raganella è uno strumento a raschiamento: una linguetta o una ruota dentata produce un suono crepitante e ripetuto.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono raschiato", "Suono: crepitante", "Movimento: rotazione o raschiamento"]
  },

  frusta: {
    title: "Frusta",
    emoji: "👏",
    image: "img/strumenti/frusta.webp",
    blueImage: "img/strumenti/frusta_blueprint.webp",
    audio: "audio/strumenti/frusta.mp3",
    text: "La frusta, o slapstick, è formata da due tavolette di legno che si battono tra loro. Produce un colpo secco e improvviso, simile a uno schiocco.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono", "Suono: colpo secco", "Effetto: schiocco"]
  },

  maracas: {
    title: "Maracas",
    emoji: "🪇",
    image: "img/strumenti/maracas.webp",
    blueImage: "img/strumenti/maracas_blueprint.webp",
    audio: "audio/strumenti/maracas.mp3",
    text: "Le maracas sono percussioni a scuotimento: all'interno contengono piccoli semi o granelli che producono un suono frusciante e ritmico.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono scosso", "Suono: frusciante", "Uso: ritmo e accompagnamento"]
  },

  xilofono: {
    title: "Xilofono",
    emoji: "🎼",
    image: "img/strumenti/xilofono.webp",
    blueImage: "img/strumenti/xilofono_blueprint.webp",
    audio: "audio/strumenti/xilofono.mp3",
    text: "È formato da barre di legno intonate, disposte come i tasti del pianoforte. Si suona con mazzuoli e produce note precise dal timbro secco e brillante.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono intonato", "Materiale: legno", "Suono: secco e preciso"]
  },

  vibrafono: {
    title: "Vibrafono",
    emoji: "✨",
    image: "img/strumenti/vibrafono.webp",
    blueImage: "img/strumenti/vibrafono_blueprint.webp",
    audio: "audio/strumenti/vibrafono.mp3",
    text: "Ha barre metalliche intonate e risonatori. Il suo timbro è luminoso e può essere prolungato con il pedale, creando un effetto vibrante.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono intonato", "Materiale: metallo", "Uso: jazz e orchestra"]
  },

  glockenspiel: {
    title: "Glockenspiel",
    emoji: "✨",
    image: "img/strumenti/glockenspiel.webp",
    blueImage: "img/strumenti/glockenspiel_blueprint.webp",
    audio: "audio/strumenti/glockenspiel.mp3",
    text: "Il glockenspiel ha piccole lamine metalliche intonate. Produce un suono molto chiaro, brillante e acuto.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono intonato", "Materiale: metallo", "Registro: acuto"]
  },

  marimba: {
    title: "Marimba",
    emoji: "🎼",
    image: "img/strumenti/marimba.webp",
    blueImage: "img/strumenti/marimba_blueprint.webp",
    audio: "audio/strumenti/marimba.mp3",
    text: "La marimba è formata da barre di legno intonate e risonatori. Ha un timbro più caldo, morbido e profondo rispetto allo xilofono.",
    meta: ["Famiglia: percussioni", "Tipo: idiofono intonato", "Materiale: legno", "Suono: caldo"]
  },

  grancassa: {
    title: "Grancassa",
    emoji: "🥁",
    image: "img/strumenti/grancassa.webp",
    blueImage: "img/strumenti/grancassa_blueprint.webp",
    audio: "audio/strumenti/grancassa.mp3",
    text: "La grancassa è un grande tamburo dal suono grave e potente. In orchestra sostiene accenti, colpi drammatici e momenti di forte energia.",
    meta: ["Famiglia: percussioni", "Tipo: membranofono", "Registro: grave", "Suono: potente"]
  },

  "tamburo-a-sonagli": {
    title: "Tamburo a sonagli",
    emoji: "🥁",
    image: "img/strumenti/tamburo_a_sonagli.webp",
    blueImage: "img/strumenti/tamburo_a_sonagli_blueprint.webp",
    audio: "audio/strumenti/tamburo_a_sonagli.mp3",
    text: "Il tamburo a sonagli, simile al tamburello, unisce una membrana a piccoli sonagli metallici. Può essere percosso o scosso.",
    meta: ["Famiglia: percussioni", "Tipo: membranofono con sonagli", "Suono: ritmico e brillante", "Azione: percosso o scosso"]
  },

  timpani: {
    title: "Timpani",
    emoji: "🥁",
    image: "img/strumenti/timpani.webp",
    blueImage: "img/strumenti/timpani_blueprint.webp",
    audio: "audio/strumenti/timpani.mp3",
    text: "Grandi tamburi a caldaia con membrana tesa. A differenza di molti tamburi, possono produrre altezze precise e sono molto importanti in orchestra.",
    meta: ["Famiglia: percussioni", "Tipo: membranofono intonato", "Suono: grave e solenne", "Uso: orchestra"]
  },

  tamburo: {
    title: "Tamburo",
    emoji: "🥁",
    image: "img/strumenti/tamburo.webp",
    blueImage: "img/strumenti/tamburo_blueprint.webp",
    audio: "audio/strumenti/tamburo.mp3",
    text: "Strumento con un fusto e una o due membrane tese. Può avere forme diverse, come rullante, grancassa e tamburello. La sua funzione principale è ritmica.",
    meta: ["Famiglia: percussioni", "Tipo: membranofono", "Funzione: ritmo", "Varianti: rullante, grancassa, tamburello"]
  },

  batteria: {
    title: "Batteria",
    emoji: "🥁",
    image: "img/strumenti/batteria.webp",
    blueImage: "img/strumenti/batteria_blueprint.webp",
    audio: "audio/strumenti/batteria.mp3",
    text: "È un insieme di tamburi e piatti suonati da una sola persona con bacchette e pedali. È fondamentale in rock, pop, jazz e molti generi moderni.",
    meta: ["Famiglia: percussioni", "Tipo: set strumentale", "Componenti: tamburi e piatti", "Uso: musica moderna"]
  },

  flauto: {
    title: "Flauto",
    emoji: "🪈",
    image: "img/strumenti/flauto.webp",
    blueImage: "img/strumenti/flauto_blueprint.webp",
    audio: "audio/strumenti/flauto.mp3",
    text: "Nel flauto il suono nasce quando l'aria colpisce uno spigolo. Può essere dolce, traverso o ottavino. È agile, leggero e adatto a melodie rapide.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: naturale", "Timbro: chiaro e luminoso"]
  },

  "flauto-dolce": {
    title: "Flauto dolce",
    emoji: "🪈",
    image: "img/strumenti/flauto_dolce.webp",
    blueImage: "img/strumenti/flauto_dolce_blueprint.webp",
    audio: "audio/strumenti/flauto_dolce.mp3",
    text: "Il flauto dolce è un aerofono a becco. È molto usato nella didattica musicale e ha un timbro chiaro, semplice e diretto.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: a becco", "Uso: didattica"]
  },

  ottavino: {
    title: "Ottavino",
    emoji: "🪈",
    image: "img/strumenti/ottavino.webp",
    blueImage: "img/strumenti/ottavino_blueprint.webp",
    audio: "audio/strumenti/ottavino.mp3",
    text: "L'ottavino è un piccolo flauto traverso dal registro molto acuto. In orchestra rende il suono brillante, penetrante e spesso molto riconoscibile.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: naturale", "Registro: molto acuto"]
  },

  oboe: {
    title: "Oboe",
    emoji: "🎼",
    image: "img/strumenti/oboe.webp",
    blueImage: "img/strumenti/oboe_blueprint.webp",
    audio: "audio/strumenti/oboe.mp3",
    text: "Usa un'ancia doppia. Ha un timbro penetrante, nasale ed espressivo. Il corno inglese è uno strumento affine dal suono più grave e morbido.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia doppia", "Timbro: penetrante"]
  },

  "corno-inglese": {
    title: "Corno inglese",
    emoji: "🎼",
    image: "img/strumenti/corno_inglese.webp",
    blueImage: "img/strumenti/corno_inglese_blueprint.webp",
    audio: "audio/strumenti/corno_inglese.mp3",
    text: "Il corno inglese è affine all'oboe, ma suona più grave e ha un timbro più morbido, malinconico e avvolgente.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia doppia", "Timbro: morbido"]
  },

  clarinetto: {
    title: "Clarinetto",
    emoji: "🎶",
    image: "img/strumenti/clarinetto.webp",
    blueImage: "img/strumenti/clarinetto_blueprint.webp",
    audio: "audio/strumenti/clarinetto.mp3",
    text: "Usa un'ancia semplice fissata al bocchino. Può avere un suono morbido e scuro nel registro grave e brillante negli acuti.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia semplice", "Timbro: versatile"]
  },

  sassofono: {
    title: "Sassofono",
    emoji: "🎷",
    image: "img/strumenti/sassofono.webp",
    blueImage: "img/strumenti/sassofono_blueprint.webp",
    audio: "audio/strumenti/sassofono.mp3",
    text: "Pur essendo spesso di metallo, appartiene ai legni perché usa un'ancia semplice. Ha un timbro caldo, robusto e molto usato nel jazz.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia semplice", "Uso: jazz e bande"]
  },

  fagotto: {
    title: "Fagotto",
    emoji: "🎼",
    image: "img/strumenti/fagotto.webp",
    blueImage: "img/strumenti/fagotto_blueprint.webp",
    audio: "audio/strumenti/fagotto.mp3",
    text: "Strumento grave dei legni ad ancia doppia. Il timbro è scuro, morbido e talvolta ironico. Il controfagotto è la sua versione ancora più grave.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia doppia", "Registro: grave"]
  },

  controfagotto: {
    title: "Controfagotto",
    emoji: "🎼",
    image: "img/strumenti/fagotto.webp",
    blueImage: "img/strumenti/fagotto_blueprint.webp",
    audio: "audio/strumenti/controfagotto.mp3",
    text: "Il controfagotto è la versione più grave del fagotto. Ha un timbro molto profondo, scuro e spesso usato per rinforzare il registro basso dell'orchestra.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: legni", "Imboccatura: ancia doppia", "Registro: molto grave"]
  },

  tromba: {
    title: "Tromba",
    emoji: "🎺",
    image: "img/strumenti/tromba.webp",
    blueImage: "img/strumenti/tromba_blueprint.webp",
    audio: "audio/strumenti/tromba.mp3",
    text: "È un ottone dal suono chiaro, squillante e potente. L'esecutore produce il suono facendo vibrare le labbra nel bocchino.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: ottoni", "Timbro: brillante", "Uso: segnali, orchestra, jazz"]
  },

  trombone: {
    title: "Trombone",
    emoji: "🎺",
    image: "img/strumenti/trombone.webp",
    blueImage: "img/strumenti/trombone_blueprint.webp",
    audio: "audio/strumenti/trombone.mp3",
    text: "È un ottone dotato di coulisse, cioè un tubo scorrevole che permette di cambiare l'altezza dei suoni. Ha un timbro potente e scuro.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: ottoni", "Particolarità: coulisse", "Timbro: potente"]
  },

  corno: {
    title: "Corno",
    emoji: "📯",
    image: "img/strumenti/corno.webp",
    blueImage: "img/strumenti/corno_blueprint.webp",
    audio: "audio/strumenti/corno.mp3",
    text: "Ha un lungo tubo arrotolato e un timbro caldo, nobile e avvolgente. In orchestra viene spesso usato per atmosfere solenni o pastorali.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: ottoni", "Timbro: morbido e nobile", "Uso: orchestra"]
  },

  bassotuba: {
    title: "Bassotuba",
    emoji: "🎺",
    image: "img/strumenti/bassotuba.webp",
    blueImage: "img/strumenti/bassotuba_blueprint.webp",
    audio: "audio/strumenti/bassotuba.mp3",
    text: "La bassotuba è lo strumento più grave della famiglia degli ottoni. Ha un suono profondo, pieno e sostiene la base sonora dell'orchestra o della banda.",
    meta: ["Famiglia: aerofoni", "Sottogruppo: ottoni", "Registro: molto grave", "Funzione: basso degli ottoni"]
  },

  organo: {
    title: "Organo",
    emoji: "⛪",
    image: "img/strumenti/organo.webp",
    blueImage: "img/strumenti/organo_blueprint.webp",
    audio: "audio/strumenti/organo.mp3",
    text: "Produce il suono grazie all'aria che attraversa canne di diversa lunghezza. Può avere moltissimi timbri e nella storia è legato soprattutto alla chiesa.",
    meta: ["Famiglia: aerofoni", "Tipo: a mantice / canne", "Timbro: molto variabile", "Forme: positivo, portativo, da chiesa"]
  },

  fisarmonica: {
    title: "Fisarmonica",
    emoji: "🪗",
    image: "img/strumenti/fisarmonica.webp",
    blueImage: "img/strumenti/fisarmonica_blueprint.webp",
    audio: "audio/strumenti/fisarmonica.mp3",
    text: "Il mantice spinge aria su piccole ance metalliche. È molto diffusa nella musica popolare e può accompagnare melodie e armonie.",
    meta: ["Famiglia: aerofoni", "Tipo: a mantice", "Timbro: intenso", "Uso: musica popolare"]
  },

  cornamusa: {
    title: "Cornamusa",
    emoji: "🎵",
    image: "img/strumenti/cornamusa.webp",
    blueImage: "img/strumenti/cornamusa_blueprint.webp",
    audio: "audio/strumenti/cornamusa.mp3",
    text: "Strumento a sacca: l'aria viene accumulata e poi inviata alle canne sonore. È presente in molte tradizioni popolari europee.",
    meta: ["Famiglia: aerofoni", "Tipo: a sacca", "Timbro: continuo", "Contesto: musica tradizionale"]
  },

  violino: {
    title: "Violino",
    emoji: "🎻",
    image: "img/strumenti/violino.webp",
    blueImage: "img/strumenti/violino_blueprint.webp",
    audio: "audio/strumenti/violino.mp3",
    text: "È il più acuto della famiglia degli archi. Si suona con l'archetto o pizzicando le corde e può essere brillante, dolce o virtuosistico.",
    meta: ["Famiglia: cordofoni", "Tipo: corde strofinate", "Registro: acuto", "Uso: orchestra e solista"]
  },

  viola: {
    title: "Viola",
    emoji: "🎻",
    image: "img/strumenti/viola.webp",
    blueImage: "img/strumenti/viola_blueprint.webp",
    audio: "audio/strumenti/viola.mp3",
    text: "È simile al violino ma leggermente più grande. Il suo timbro è più caldo, vellutato e centrale.",
    meta: ["Famiglia: cordofoni", "Tipo: corde strofinate", "Registro: medio", "Timbro: caldo"]
  },

  violoncello: {
    title: "Violoncello",
    emoji: "🎻",
    image: "img/strumenti/violoncello.webp",
    blueImage: "img/strumenti/violoncello_blueprint.webp",
    audio: "audio/strumenti/violoncello.mp3",
    text: "Si suona da seduti, appoggiato a terra tramite un puntale. Ha un timbro profondo e cantabile, spesso paragonato alla voce umana.",
    meta: ["Famiglia: cordofoni", "Tipo: corde strofinate", "Registro: grave", "Timbro: cantabile"]
  },

  contrabbasso: {
    title: "Contrabbasso",
    emoji: "🎻",
    image: "img/strumenti/contrabbasso.webp",
    blueImage: "img/strumenti/contrabbasso_blueprint.webp",
    audio: "audio/strumenti/contrabbasso.mp3",
    text: "È il più grave degli archi. Sostiene la base armonica e ritmica dell'orchestra e può essere suonato anche pizzicando le corde.",
    meta: ["Famiglia: cordofoni", "Tipo: corde strofinate o pizzicate", "Registro: molto grave", "Funzione: basso"]
  },

  arpa: {
    title: "Arpa",
    emoji: "🎼",
    image: "img/strumenti/arpa.webp",
    blueImage: "img/strumenti/arpa_blueprint.webp",
    audio: "audio/strumenti/arpa.mp3",
    text: "Grande strumento a corde pizzicate. Il suono è cristallino e sognante. I pedali permettono di modificare l'altezza delle corde.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Timbro: cristallino", "Particolarità: pedali"]
  },

  chitarra: {
    title: "Chitarra",
    emoji: "🎸",
    image: "img/strumenti/chitarra.webp",
    blueImage: "img/strumenti/chitarra_blueprint.webp",
    audio: "audio/strumenti/chitarra.mp3",
    text: "Strumento a sei corde pizzicate con dita o plettro. È usata nella musica classica, popolare, pop, rock e in moltissimi altri generi.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Corde: generalmente sei", "Uso: molto diffuso"]
  },

  liuto: {
    title: "Liuto",
    emoji: "🪕",
    image: "img/strumenti/liuto.webp",
    blueImage: "img/strumenti/liuto_blueprint.webp",
    audio: "audio/strumenti/liuto.mp3",
    text: "Strumento antico con cassa a forma di pera e corde pizzicate. È di origine orientale e fu molto importante nella musica medievale e rinascimentale.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Periodo: Medioevo e Rinascimento", "Origine: orientale"]
  },

  mandolino: {
    title: "Mandolino",
    emoji: "🪕",
    image: "img/strumenti/mandolino.webp",
    blueImage: "img/strumenti/mandolino_blueprint.webp",
    audio: "audio/strumenti/mandolino.mp3",
    text: "Il mandolino è uno strumento a corde pizzicate, nato in Italia. Ha una cassa piccola e un timbro brillante e cristallino.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Origine: italiana", "Timbro: brillante"]
  },

  lira: {
    title: "Lira",
    emoji: "🎼",
    image: "img/strumenti/lira.webp",
    blueImage: "img/strumenti/lira_blueprint.webp",
    audio: "audio/strumenti/lira.mp3",
    text: "Strumento a corde molto antico, associato alla poesia, al canto narrativo e alla cultura classica. Nel Medioevo sopravvive in diverse forme.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Origine: antica", "Contesto: poesia e canto"]
  },

  viella: {
    title: "Viella",
    emoji: "🎻",
    image: "img/strumenti/viella.webp",
    blueImage: "img/strumenti/viella_blueprint.webp",
    audio: "audio/strumenti/viella.mp3",
    text: "Strumento medievale ad arco, considerato un antenato degli strumenti moderni a corde strofinate. Era usato da musicisti itineranti e nelle corti.",
    meta: ["Famiglia: cordofoni", "Tipo: corde strofinate", "Periodo: Medioevo", "Ruolo: antenato degli archi"]
  },

  clavicembalo: {
    title: "Clavicembalo",
    emoji: "🎹",
    image: "img/strumenti/clavicembalo.webp",
    blueImage: "img/strumenti/clavicembalo_blueprint.webp",
    audio: "audio/strumenti/clavicembalo.mp3",
    text: "Strumento a tastiera in cui piccoli plettri pizzicano le corde quando si premono i tasti. Il timbro è chiaro, metallico e tipico della musica barocca.",
    meta: ["Famiglia: cordofoni", "Tipo: corde pizzicate", "Meccanismo: tastiera", "Timbro: chiaro e metallico"]
  },

  pianoforte: {
    title: "Pianoforte",
    emoji: "🎹",
    image: "img/strumenti/pianoforte.webp",
    blueImage: "img/strumenti/pianoforte_blueprint.webp",
    audio: "audio/strumenti/pianoforte.mp3",
    text: "Strumento a tastiera in cui martelletti colpiscono le corde. Il nome deriva dalla possibilità di suonare piano e forte variando il tocco.",
    meta: ["Famiglia: cordofoni", "Tipo: corde percosse", "Meccanismo: martelletti", "Dinamica: molto ampia"]
  },

  "chitarra-elettrica": {
    title: "Chitarra elettrica",
    emoji: "🎸",
    image: "img/strumenti/chitarra_elettrica.webp",
    blueImage: "img/strumenti/chitarra_elettrica_blueprint.webp",
    audio: "audio/strumenti/chitarra_elettrica.mp3",
    text: "I pickup trasformano la vibrazione delle corde in segnale elettrico, poi amplificato. È uno strumento fondamentale nel rock, pop, blues e jazz.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettromeccanico", "Suono: amplificato", "Uso: musica moderna"]
  },

  "basso-elettrico": {
    title: "Basso elettrico",
    emoji: "🎸",
    image: "img/strumenti/basso_elettrico.webp",
    blueImage: "img/strumenti/basso_elettrico_blueprint.webp",
    audio: "audio/strumenti/basso_elettrico.mp3",
    text: "Produce note gravi e sostiene ritmo e armonia nelle band. Anche qui la vibrazione delle corde viene trasformata in segnale elettrico.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettromeccanico", "Registro: grave", "Funzione: base ritmica e armonica"]
  },

  "organo-hammond": {
    title: "Organo Hammond",
    emoji: "🎹",
    image: "img/strumenti/organo_hammond.webp",
    blueImage: "img/strumenti/organo_hammond_blueprint.webp",
    audio: "audio/strumenti/organo_hammond.mp3",
    text: "Strumento elettromeccanico dal timbro caldo e riconoscibile, molto usato in jazz, gospel, blues e rock.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettromeccanico", "Periodo: Novecento", "Uso: jazz, gospel e rock"]
  },

  theremin: {
    title: "Theremin",
    emoji: "🛸",
    image: "img/strumenti/theremin.webp",
    blueImage: "img/strumenti/theremin_blueprint.webp",
    audio: "audio/strumenti/theremin.mp3",
    text: "Si suona senza toccarlo: le mani modificano un campo elettromagnetico vicino a due antenne. Produce suoni fluttuanti e misteriosi.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettronico", "Particolarità: senza contatto", "Suono: fluttuante"]
  },

  "onde-martenot": {
    title: "Onde Martenot",
    emoji: "〰️",
    image: "img/strumenti/onde_martenot.webp",
    blueImage: "img/strumenti/onde_martenot_blueprint.webp",
    audio: "audio/strumenti/onde_martenot.mp3",
    text: "Le onde Martenot sono uno strumento elettronico del Novecento. Producono un suono continuo, espressivo e misterioso, simile per certi aspetti al theremin.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettronico", "Periodo: Novecento", "Suono: continuo e misterioso"]
  },

  sintetizzatore: {
    title: "Sintetizzatore",
    emoji: "🎛️",
    image: "img/strumenti/sintetizzatore.webp",
    blueImage: "img/strumenti/sintetizzatore_blueprint.webp",
    audio: "audio/strumenti/sintetizzatore.mp3",
    text: "Genera suoni tramite circuiti o software. Può imitare strumenti reali oppure creare timbri completamente nuovi.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettronico", "Funzione: creare e modificare suoni", "Uso: musica elettronica e pop"]
  },

  campionatore: {
    title: "Campionatore",
    emoji: "🎚️",
    image: "img/strumenti/campionatore.webp",
    blueImage: "img/strumenti/campionatore_blueprint.webp",
    audio: "audio/strumenti/campionatore.mp3",
    text: "Il campionatore registra o importa suoni e li riproduce tramite una tastiera, pad o software. È molto usato nella musica elettronica e nella produzione moderna.",
    meta: ["Famiglia: elettrofoni", "Tipo: elettronico", "Funzione: riprodurre campioni sonori", "Uso: produzione musicale"]
  }
};

const instrumentDescriptions = {
  gong: "Il gong è un grande disco sospeso che viene messo in vibrazione con una mazza. Le sue origini sono documentate in diverse culture dell'Asia orientale e sud-orientale. Nella musica viene usato per segnare momenti solenni, creare atmosfere ampie e sostenere effetti teatrali. La sua risonanza continua a espandersi dopo il colpo.",
  "tam-tam": "Il tam-tam è un disco sospeso simile al gong, generalmente privo di altezza definita. Si diffuse in Europa attraverso il contatto con strumenti asiatici, soprattutto tra Settecento e Ottocento. In orchestra viene impiegato per passaggi drammatici, sospesi o cerimoniali. La caratteristica distintiva è la lunga vibrazione che cresce e si dissolve lentamente.",
  piatti: "I piatti sono due dischi concavi che possono essere battuti insieme o suonati singolarmente. Strumenti simili sono documentati fin dall'antichità nel Mediterraneo e in Asia. In orchestra e nelle bande servono per accenti, culminazioni e passaggi ritmici. La loro efficacia dipende dal gesto del musicista e dal modo in cui lascia vibrare il metallo.",
  "piatto-sospeso": "Il piatto sospeso è un singolo disco montato su un supporto e suonato con bacchette, mazze o spazzole. Deriva dall'uso orchestrale moderno dei piatti, sviluppato soprattutto tra Ottocento e Novecento. Serve per accenti, rulli e crescendi controllati. Rispetto ai piatti a coppia permette una maggiore varietà di attacchi e sfumature.",
  triangolo: "Il triangolo è una barretta piegata a forma triangolare e percossa con una piccola bacchetta. Strumenti metallici affini sono presenti nella musica europea già dal Medioevo. In orchestra viene usato per colorare ritmi, danze e passaggi leggeri. La sua particolarità è la sospensione libera, che permette alla vibrazione di restare chiara.",
  "campane-tubolari": "Le campane tubolari sono una serie di tubi sospesi, colpiti con un martello controllato. Furono sviluppate in ambito occidentale per imitare le campane quando non era possibile usarle in teatro o in orchestra. Servono in brani solenni, descrittivi o cerimoniali. Ogni tubo corrisponde a una nota precisa.",
  castagnette: "Le castagnette sono formate da due piccole valve tenute in mano e battute tra loro. Sono associate soprattutto alla tradizione spagnola e alla danza, pur avendo strumenti affini in diverse culture mediterranee. Nella musica colta e popolare sottolineano ritmi di danza. La loro caratteristica è il movimento rapido e articolato delle dita.",
  woodblock: "Il woodblock è un blocco cavo percosso con una bacchetta. Strumenti di legno simili sono diffusi in varie tradizioni asiatiche e occidentali. Nella musica d'insieme viene usato per scandire ritmi netti, segnali o effetti descrittivi. La cavità interna aiuta a rendere il colpo più presente e riconoscibile.",
  "temple-block": "Il temple block è un blocco cavo, spesso usato in serie di diverse dimensioni. Si collega a strumenti lignei presenti in contesti rituali dell'Asia orientale, poi adottati anche nella musica orchestrale occidentale. Viene impiegato per figure ritmiche vivaci e passaggi descrittivi. La forma cava produce attacchi brevi e ben separati.",
  raganella: "La raganella è uno strumento azionato da una ruota dentata o da una linguetta che vibra per sfregamento. Strumenti simili sono documentati nella tradizione popolare europea. Viene usata in contesti rituali, popolari o teatrali e, in orchestra, per effetti particolari. La sua particolarità è il suono continuo ottenuto da un gesto ripetuto.",
  frusta: "La frusta, o slapstick, è composta da due tavolette unite che vengono battute rapidamente. Entrò nell'orchestra moderna come strumento d'effetto tra Ottocento e Novecento. Viene usata per imitare schiocchi, colpi improvvisi o accenti teatrali. Il suo tratto distintivo è l'attacco secco e immediatamente riconoscibile.",
  maracas: "Le maracas sono piccoli recipienti con elementi interni che producono il suono quando vengono scossi. Sono ampiamente associate alle tradizioni musicali dell'America Latina e dei Caraibi. Accompagnano danze, canti e brani ritmici, spesso in coppia. La loro resa dipende dal movimento della mano, che può creare pulsazioni regolari o accenti.",
  xilofono: "Lo xilofono è formato da barre disposte in ordine di altezza e percosse con mazzuoli. Strumenti a barre sono documentati in diverse aree dell'Africa e dell'Asia; la versione orchestrale europea si affermò nell'Ottocento. Viene usato per melodie rapide, effetti brillanti e passaggi virtuosistici. La disposizione delle barre facilita la lettura musicale.",
  vibrafono: "Il vibrafono presenta barre intonate, risonatori e un pedale che controlla la durata della vibrazione. Fu sviluppato negli Stati Uniti all'inizio del Novecento. È molto presente nel jazz e nella musica contemporanea, dove può sostenere melodie e armonie. La caratteristica distintiva è il vibrato ottenuto tramite un sistema meccanico nei risonatori.",
  glockenspiel: "Il glockenspiel è costituito da piccole barre intonate suonate con bacchette leggere. Si sviluppò in Europa a partire da strumenti a campanelli, poi sostituiti progressivamente da barre metalliche. In orchestra raddoppia melodie, illumina passaggi acuti e crea effetti fiabeschi. La tastiera compatta permette linee chiare e precise.",
  marimba: "La marimba è formata da barre intonate con risonatori posti sotto ciascuna barra. Strumenti affini sono documentati in Africa e in America centrale; la marimba moderna si consolidò tra Otto e Novecento. È usata in musica solistica, d'insieme e contemporanea. La sua estensione consente melodie, accordi e accompagnamenti complessi.",
  grancassa: "La grancassa è un grande tamburo azionato con una o due mazze. Strumenti di grandi dimensioni sono presenti in molte tradizioni militari e cerimoniali; l'orchestra europea li adottò stabilmente tra Settecento e Ottocento. Serve per rinforzare accenti, marce e momenti di forte energia. Il gesto può essere secco o molto risonante.",
  "tamburo-a-sonagli": "Il tamburo a sonagli unisce una cornice con piccoli dischi mobili e, spesso, una membrana. Strumenti affini sono documentati fin dall'antichità nel Mediterraneo e nel Vicino Oriente. Accompagna danze, canti popolari e brani orchestrali di carattere ritmico. Può essere percosso, scosso o fatto vibrare con movimenti rapidi.",
  timpani: "I timpani sono grandi tamburi a caldaia con una membrana regolabile. Si svilupparono in Europa a partire da strumenti militari legati alla cavalleria e entrarono stabilmente in orchestra tra Seicento e Settecento. Sostengono armonia, ritmo e momenti solenni. La possibilità di accordarli li distingue da molti altri tamburi.",
  tamburo: "Il tamburo è formato da un fusto e da una o più membrane tese. Strumenti di questo tipo sono presenti in moltissime culture fin dall'antichità. Nella musica viene usato per accompagnare marce, danze, cerimonie e brani d'insieme. La tecnica può variare molto, dal colpo semplice al rullo controllato.",
  batteria: "La batteria è un insieme di tamburi, piatti e pedali organizzati per essere suonati da un solo musicista. Si sviluppò negli Stati Uniti tra fine Ottocento e inizio Novecento, soprattutto nei contesti jazz e popolari. Sostiene il ritmo in molti generi moderni. La coordinazione tra mani e piedi è la sua caratteristica principale.",
  flauto: "Il flauto traverso moderno è un tubo con fori e chiavi, suonato soffiando lateralmente. Strumenti a flauto sono antichissimi, mentre il modello orchestrale attuale si sviluppò in Europa nell'Ottocento. È usato per melodie agili, passaggi cantabili e colori leggeri. La produzione del suono dipende dal controllo del soffio sul bordo.",
  "flauto-dolce": "Il flauto dolce è un tubo con imboccatura a becco e fori diteggiati. Fu molto diffuso in Europa tra Medioevo, Rinascimento e Barocco, poi tornò importante nella didattica musicale del Novecento. Viene usato per melodie semplici, musica antica e attività scolastiche. L'imboccatura guida l'aria in modo diretto.",
  ottavino: "L'ottavino è un piccolo flauto traverso dalla costruzione compatta. Si affermò nell'orchestra europea tra Settecento e Ottocento, anche grazie alla musica militare. Viene usato per rinforzare linee acute, effetti brillanti e passaggi energici. La sua particolarità è suonare un'ottava sopra rispetto alla scrittura abituale.",
  oboe: "L'oboe è uno strumento con corpo stretto, chiavi e una piccola ancia doppia. Deriva dalla famiglia degli strumenti ad ancia sviluppati in Europa, in particolare dalla ciaramella, e si stabilizzò nel periodo barocco. In orchestra espone melodie espressive e spesso dà il riferimento per l'accordatura. Richiede grande controllo del fiato.",
  "corno-inglese": "Il corno inglese è simile all'oboe ma più lungo, con campana a bulbo e ancia doppia. Si sviluppò in Europa nel Settecento all'interno della famiglia degli oboi. Viene usato per melodie cantabili, spesso in momenti lirici o malinconici. La forma e la taglia gli danno un registro più grave dell'oboe.",
  clarinetto: "Il clarinetto ha un corpo cilindrico, chiavi e un bocchino con ancia semplice. Fu perfezionato in Europa all'inizio del Settecento a partire da strumenti come lo chalumeau. È usato in orchestra, banda, jazz e musica da camera. La sua caratteristica è l'ampia estensione, con registri molto differenziati.",
  sassofono: "Il sassofono ha un corpo conico, chiavi e un bocchino con ancia semplice. Fu inventato da Adolphe Sax in Belgio e brevettato a Parigi nel 1846. È usato in banda, jazz, musica leggera e repertorio contemporaneo. Pur essendo spesso metallico, la tecnica di emissione lo collega agli strumenti ad ancia.",
  fagotto: "Il fagotto è uno strumento lungo ripiegato su se stesso, con chiavi e ancia doppia. Si sviluppò in Europa tra Cinquecento e Seicento a partire da strumenti bassi ad ancia. In orchestra sostiene linee gravi, melodie espressive e parti comiche o solenni. Il tubo ripiegato rende gestibile una grande lunghezza sonora.",
  controfagotto: "Il controfagotto è una versione più grande e più grave del fagotto, con tubo ripiegato e ancia doppia. Si sviluppò progressivamente in Europa per ampliare il registro basso dell'orchestra. Viene impiegato per rinforzare bassi, atmosfere scure e passaggi solenni. La sua costruzione compatta permette di controllare un tubo molto lungo.",
  tromba: "La tromba è formata da un tubo ripiegato, un bocchino e pistoni o valvole. Strumenti naturali simili sono antichi, ma la tromba moderna si affermò nell'Ottocento con l'introduzione delle valvole. È usata in orchestra, banda, jazz e musica popolare. La sua caratteristica è la grande precisione negli attacchi.",
  trombone: "Il trombone è riconoscibile per la coulisse, che modifica la lunghezza del tubo. Strumenti affini, chiamati sackbut, erano già usati in Europa nel Rinascimento. In orchestra, banda e jazz sostiene armonie, bassi e linee cantabili. La coulisse permette passaggi continui tra le altezze, impossibili con molti strumenti a valvole.",
  corno: "Il corno moderno ha un lungo tubo avvolto, bocchino e valvole. Deriva dai corni da caccia europei e si trasformò in strumento orchestrale tra Settecento e Ottocento. Viene usato per melodie ampie, richiami e sostegno armonico. La mano nella campana contribuisce al controllo dell'intonazione e del colore.",
  bassotuba: "La bassotuba è uno strumento di grandi dimensioni con tubo ampio, bocchino e valvole. Fu sviluppata nell'Ottocento per fornire un basso stabile alle formazioni di ottoni. È usata in orchestra, banda e ensemble. La sua funzione principale è sostenere la parte grave, ma può anche eseguire passaggi melodici.",
  organo: "L'organo è formato da tastiere, pedaliera e canne alimentate da aria. Strumenti ad organo sono documentati già nell'antichità, mentre l'organo liturgico europeo si sviluppò nel Medioevo e nel Rinascimento. È usato in chiesa, concerto e accompagnamento. La varietà dei registri permette di combinare molti colori sonori.",
  fisarmonica: "La fisarmonica ha tastiere o bottoni e un mantice che spinge l'aria attraverso ance libere. Si sviluppò in Europa nell'Ottocento, dopo la diffusione di strumenti ad ancia libera. È usata in musica popolare, danza, repertorio colto e contemporaneo. Il mantice permette di controllare fraseggio e intensità.",
  cornamusa: "La cornamusa usa una sacca d'aria, canne sonore e uno o più bordoni continui. Strumenti a sacca sono documentati in varie aree europee e mediterranee fin dall'antichità. È impiegata in tradizioni popolari, cerimonie e repertori regionali. La sua caratteristica è il suono continuo prodotto dalla riserva d'aria nella sacca.",
  violino: "Il violino è formato da cassa armonica, manico, quattro corde e archetto. Nacque in Italia nel XVI secolo e divenne centrale nella musica europea. È usato come solista, in orchestra e nella musica da camera. La sua costruzione permette grande agilità, cantabilità e precisione nell'articolazione.",
  viola: "La viola è simile al violino ma leggermente più grande e con registro più grave. Si sviluppò nella stessa area italiana della famiglia degli archi tra Cinquecento e Seicento. In orchestra e quartetto collega spesso le parti acute e gravi. La sua scrittura valorizza linee interne, accompagnamenti e melodie espressive.",
  violoncello: "Il violoncello ha una grande cassa, quattro corde e si suona seduti con lo strumento appoggiato a terra tramite un puntale. Si sviluppò in Italia tra Cinquecento e Seicento. È usato come basso, accompagnamento e strumento solista. La sua estensione permette sia linee profonde sia melodie cantabili.",
  contrabbasso: "Il contrabbasso è il più grande tra gli archi comunemente usati in orchestra, con cassa ampia e corde lunghe. Si sviluppò progressivamente in Europa tra Rinascimento e Barocco. Sostiene la base armonica in orchestra, jazz e musica da camera. Può essere suonato con arco o pizzicato.",
  arpa: "L'arpa ha una struttura verticale con molte corde tese e, nei modelli moderni, pedali per modificare le altezze. Strumenti ad arpa sono documentati già nelle civiltà antiche del Vicino Oriente e dell'Egitto. È usata per accompagnamenti, arpeggi e colori orchestrali. Il glissando è una delle sue tecniche più riconoscibili.",
  chitarra: "La chitarra ha una cassa, un manico con tasti e sei corde nella forma moderna più comune. Strumenti affini si svilupparono in Europa, mentre la chitarra classica si consolidò in Spagna tra Settecento e Ottocento. È usata per accompagnare, suonare melodie e repertori solistici. Permette accordi e linee simultanee.",
  liuto: "Il liuto ha cassa bombata, manico tastato e corde disposte in cori. Si diffuse in Europa dal Medioevo, con legami storici con strumenti provenienti dal mondo arabo. Fu molto usato nel Rinascimento e nel Barocco per accompagnare il canto e suonare brani solistici. La sua scrittura valorizza accordi e contrappunto.",
  mandolino: "Il mandolino ha una piccola cassa e corde doppie suonate con plettro. La famiglia moderna si sviluppò in Italia, soprattutto tra Settecento e Ottocento. È usato in musica popolare, repertorio da camera e tradizioni regionali. La tecnica del tremolo permette di prolungare note che altrimenti decadrebbero rapidamente.",
  lira: "La lira è uno strumento a corde con bracci laterali e una traversa superiore. È documentata nell'antica Grecia e in altre culture del Mediterraneo antico. Accompagnava poesia, canto e pratiche educative o rituali. La sua importanza è soprattutto storica, perché mostra il legame tra musica, parola e società antica.",
  viella: "La viella è uno strumento ad arco medievale con cassa di forme variabili e più corde. Si sviluppò in Europa tra Medioevo e primo Rinascimento. Era usata da musicisti itineranti, corti e contesti di danza o canto. Rappresenta una tappa importante nella storia degli strumenti ad arco europei.",
  clavicembalo: "Il clavicembalo ha una tastiera che aziona plettri interni capaci di pizzicare le corde. Si diffuse in Europa tra Rinascimento e Barocco. Fu usato per accompagnare, sostenere il basso continuo e suonare repertori solistici. La sua caratteristica è che il tasto produce un attacco chiaro, ma con dinamica poco variabile.",
  pianoforte: "Il pianoforte ha una tastiera collegata a martelletti che colpiscono le corde. Fu sviluppato in Italia da Bartolomeo Cristofori all'inizio del Settecento. È usato come strumento solista, d'accompagnamento, da camera e per lo studio musicale. La sua innovazione fu permettere variazioni dinamiche tramite il tocco.",
  "chitarra-elettrica": "La chitarra elettrica ha corde, manico con tasti e pickup che trasformano la vibrazione in segnale elettrico. Si sviluppò negli Stati Uniti negli anni Trenta del Novecento. È usata in jazz, blues, rock, pop e molti generi contemporanei. Amplificazione ed effetti permettono di modificare molto il timbro.",
  "basso-elettrico": "Il basso elettrico ha corpo solid-body, manico con tasti e pickup, di solito con quattro corde. Si diffuse dagli Stati Uniti negli anni Cinquanta del Novecento. È usato per sostenere ritmo e armonia in musica pop, rock, jazz e funk. La sua portabilità lo rese un'alternativa pratica al contrabbasso amplificato.",
  "organo-hammond": "L'organo Hammond è uno strumento elettromeccanico con tastiere, drawbars e ruote foniche. Fu prodotto negli Stati Uniti a partire dal 1935. È usato in jazz, gospel, blues, rock e musica leggera. La combinazione con il diffusore rotante Leslie contribuì a renderne riconoscibile il fraseggio e il colore.",
  theremin: "Il theremin è formato da un circuito elettronico e due antenne controllate senza contatto. Fu inventato da Lev Termen, noto in Occidente come Léon Theremin, negli anni Venti del Novecento. È usato in musica colta, sperimentale e colonne sonore. La posizione delle mani modifica altezza e intensità.",
  "onde-martenot": "Le onde Martenot sono uno strumento elettronico con tastiera, nastro o anello di controllo e diffusori dedicati. Furono create in Francia da Maurice Martenot e presentate nel 1928. Sono usate nella musica del Novecento e in alcune colonne sonore. Permettono glissandi continui e grande controllo espressivo.",
  sintetizzatore: "Il sintetizzatore genera suoni attraverso circuiti elettronici o sistemi digitali controllati da tastiere, moduli o software. Si sviluppò nel Novecento, con forte diffusione dagli anni Sessanta. È usato in musica elettronica, pop, cinema e sperimentazione. La sua caratteristica è creare o trasformare timbri tramite parametri controllabili.",
  campionatore: "Il campionatore registra o importa suoni e li riproduce tramite tasti, pad o sequencer. Si diffuse nella seconda metà del Novecento con lo sviluppo delle tecnologie digitali. È usato nella produzione musicale, nel pop, nell'hip hop e nella musica elettronica. Permette di trasformare suoni registrati in materiale eseguibile."
};

Object.entries(instrumentDescriptions).forEach(([id, text]) => {
  if (instrumentInfo[id]) instrumentInfo[id].text = text;
});

const instrumentFamiliesShowcase = [
  {
    title: "Corde",
    sectionId: "corde",
    image: "img/strumenti/famiglie/corde.webp",
    alt: "Famiglia degli strumenti a corde",
    desc: "Il suono nasce dalla vibrazione delle corde: pizzicate, strofinate o percosse.",
    aura: "rgba(255, 145, 77, 0.34)"
  },
  {
    title: "Fiati",
    sectionId: "fiato",
    image: "img/strumenti/famiglie/fiati.webp",
    alt: "Famiglia degli strumenti a fiato",
    desc: "Il suono prende forma dall'aria: legni, ottoni, ance e imboccature diverse.",
    aura: "rgba(0, 166, 189, 0.34)"
  },
  {
    title: "Percussioni",
    sectionId: "percussioni",
    image: "img/strumenti/famiglie/percussioni.webp",
    alt: "Famiglia degli strumenti a percussione",
    desc: "Il suono nasce da colpi, scuotimenti e vibrazioni di membrane o materiali.",
    aura: "rgba(255, 183, 77, 0.38)"
  },
  {
    title: "Tastiere",
    sectionId: "tastiera",
    image: "img/strumenti/famiglie/tastiere.webp",
    alt: "Famiglia degli strumenti a tastiera",
    desc: "Un meccanismo a tasti mette in movimento corde, aria o circuiti sonori.",
    aura: "rgba(112, 126, 255, 0.30)"
  },
  {
    title: "Elettrofoni",
    sectionId: "elettrofoni",
    image: "img/strumenti/famiglie/elettrofoni.webp",
    alt: "Famiglia degli strumenti elettrofoni",
    desc: "Il suono nasce o viene trasformato grazie a circuiti elettrici ed elettronici.",
    aura: "rgba(126, 221, 164, 0.34)"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupBrokenImages();
  setupFamilyShowcase();
  setupFilters();
  setupSearch();
  highlightHashCard();

  if (window.MGH?.detectActiveSection) {
    window.addEventListener("scroll", () => MGH.detectActiveSection(), { passive: true });
  }
});

function setupFamilyShowcase() {
  const showcase = document.getElementById("instrumentFamilyShowcase");
  const card = document.getElementById("familyShowcaseCard");
  const image = document.getElementById("familyShowcaseImage");
  const title = document.getElementById("familyShowcaseTitle");
  const desc = document.getElementById("familyShowcaseDesc");
  const button = document.getElementById("familyShowcaseButton");

  if (!showcase || !card || !image || !title || !desc || !button) return;

  let activeIndex = 0;
  let timer = null;
  let isPaused = false;

  const renderFamily = (nextIndex, animate = true) => {
    const family = instrumentFamiliesShowcase[nextIndex];
    if (!family) return;

    const updateContent = () => {
      activeIndex = nextIndex;
      showcase.dataset.targetSection = family.sectionId;
      card.style.setProperty("--family-aura", family.aura);
      image.src = family.image;
      image.alt = family.alt;
      title.textContent = family.title;
      desc.textContent = family.desc;
      card.classList.remove("isChanging");
      card.classList.remove("isReady");
      requestAnimationFrame(() => card.classList.add("isReady"));
    };

    if (!animate) {
      updateContent();
      return;
    }

    card.classList.add("isChanging");
    setTimeout(updateContent, 240);
  };

  const nextFamily = () => {
    if (isPaused) return;
    renderFamily((activeIndex + 1) % instrumentFamiliesShowcase.length);
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(nextFamily, 3500);
  };

  const pause = () => {
    isPaused = true;
  };

  const resume = () => {
    isPaused = false;
  };

  const scrollToActiveFamily = () => {
    const family = instrumentFamiliesShowcase[activeIndex];
    if (!family) return;
    MGH.scrollToSection(family.sectionId);
  };

  showcase.addEventListener("mouseenter", pause);
  showcase.addEventListener("mouseleave", resume);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    scrollToActiveFamily();
    resume();
    button.blur();
  });

  renderFamily(0, false);
  startTimer();
}

function setupBrokenImages() {
  document.querySelectorAll(".instrumentFlip img, .instrumentImage img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";

      const imageBox = img.closest(".instrumentImage, .modalInstrumentImage");
      const fallback = imageBox?.querySelector(".fallbackEmoji");

      if (fallback) fallback.style.opacity = "1";
    });
  });
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filterBtn[data-filter]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });
}

function setupSearch() {
  const input = document.getElementById("instrumentSearch");
  if (!input) return;

  input.addEventListener("input", applyFilters);
}

function applyFilters() {
  const activeFilter = document.querySelector(".filterBtn.active")?.dataset.filter || "all";
  const term = (document.getElementById("instrumentSearch")?.value || "").trim().toLowerCase();

  document.querySelectorAll(".instrumentTile").forEach((card) => {
    const matchesFamily = activeFilter === "all" || card.dataset.family === activeFilter;
    const searchable = `${card.dataset.name || ""} ${card.textContent || ""}`.toLowerCase();
    const matchesTerm = !term || searchable.includes(term);

    card.classList.toggle("hiddenCard", !(matchesFamily && matchesTerm));
  });
}

function highlightHashCard() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  setTimeout(() => {
    target.classList.add("hashFocus");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => target.classList.remove("hashFocus"), 1800);
  }, 350);
}

function openInstrumentInfo(id) {
  const data = instrumentInfo[id];
  if (!data) return;

  document.getElementById("instrumentModalTitle").textContent = data.title;
  document.getElementById("instrumentModalText").textContent = data.text;
  document.getElementById("instrumentModalMeta").innerHTML =
    data.meta.map((item) => {
      const [label, ...valueParts] = item.split(":");
      const value = valueParts.join(":").trim();

      return value
        ? `<span><small>${label}</small><strong>${value}</strong></span>`
        : `<span><strong>${item}</strong></span>`;
    }).join("");

  const imageBox = document.getElementById("instrumentModalImage");

  imageBox.innerHTML = `
    <div class="instrumentFlip">
      <img class="normalSide" src="${data.image}" alt="${data.title}">
      <img class="blueSide" src="${data.blueImage}" alt="${data.title} stile blueprint">
    </div>
  `;

  imageBox.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  const audio = document.getElementById("instrumentAudio");
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.src = data.audio;
    audio.load();
  }

  document.getElementById("audioLabel").textContent = `🎧 Audio: ${data.title}`;
  document.getElementById("instrumentModal").style.display = "flex";
}

function closeInstrumentInfo() {
  const modal = document.getElementById("instrumentModal");
  const audio = document.getElementById("instrumentAudio");

  audio?.pause();

  if (modal) modal.style.display = "none";
}

function openInstrumentQuiz() {
  document.getElementById("instrumentQuizModal").style.display = "flex";
}

function closeInstrumentQuiz() {
  document.getElementById("instrumentQuizModal").style.display = "none";
}

function checkInstrumentQuiz() {
  const correct = { iq1: "a", iq2: "b", iq3: "a" };
  let score = 0;

  Object.keys(correct).forEach((name) => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected && selected.value === correct[name]) score += 1;
  });

  document.querySelectorAll("#instrumentQuizModal .quizAnswer").forEach((answer) => {
    answer.style.display = "block";
  });

  const result = document.getElementById("instrumentQuizResult");

  result.style.display = "block";
  result.classList.toggle("incorrect", score < 2);
  result.innerHTML = `Hai totalizzato <strong>${score}/3</strong>. ${
    score === 3
      ? "Ottimo lavoro! 🎉"
      : "Riprova osservando bene che cosa vibra in ogni famiglia."
  }`;
}

function resetInstrumentQuiz() {
  document.querySelectorAll("#instrumentQuizModal input[type='radio']").forEach((input) => {
    input.checked = false;
  });

  document.querySelectorAll("#instrumentQuizModal .quizAnswer").forEach((answer) => {
    answer.style.display = "none";
  });

  const result = document.getElementById("instrumentQuizResult");

  result.style.display = "none";
  result.classList.remove("incorrect");
}

function initMouthpieceZoom() {
  const images = document.querySelectorAll(".mouthpieceVisual img, .mouthpieceSubtypes img");
  if (!images.length) return;

  const preview = document.createElement("div");
  preview.className = "mouthpieceZoomPreview";
  preview.innerHTML = '<img alt="">';
  document.body.appendChild(preview);

  const previewImage = preview.querySelector("img");

  const movePreview = (event) => {
    const offset = 22;
    const width = preview.offsetWidth || 260;
    const height = preview.offsetHeight || 180;
    let left = event.clientX + offset;
    let top = event.clientY + offset;

    if (left + width > window.innerWidth - 14) left = event.clientX - width - offset;
    if (top + height > window.innerHeight - 14) top = event.clientY - height - offset;

    preview.style.left = `${Math.max(14, left)}px`;
    preview.style.top = `${Math.max(14, top)}px`;
  };

  images.forEach((image) => {
    image.addEventListener("mouseenter", (event) => {
      previewImage.src = image.src;
      previewImage.alt = image.alt || "";
      previewImage.classList.toggle(
        "naturalLipZoom",
        image.src.includes("imboccatura_naturale_semplice")
      );
      preview.classList.add("visible");
      movePreview(event);
    });

    image.addEventListener("mousemove", movePreview);
    image.addEventListener("mouseleave", () => {
      preview.classList.remove("visible");
      previewImage.classList.remove("naturalLipZoom");
      previewImage.removeAttribute("src");
    });
  });
}

document.addEventListener("DOMContentLoaded", initMouthpieceZoom);

window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("instrumentModal")) closeInstrumentInfo();
  if (event.target === document.getElementById("instrumentQuizModal")) closeInstrumentQuiz();
});

window.openInstrumentInfo = openInstrumentInfo;
window.closeInstrumentInfo = closeInstrumentInfo;
window.openInstrumentQuiz = openInstrumentQuiz;
window.closeInstrumentQuiz = closeInstrumentQuiz;
window.checkInstrumentQuiz = checkInstrumentQuiz;
window.resetInstrumentQuiz = resetInstrumentQuiz;
