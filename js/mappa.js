const resources={
pentagramma:{icon:"🎼",type:"Teoria",title:"Pentagramma",desc:"Spiegazione delle 5 righe, dei 4 spazi e dei tagli addizionali.",tags:["pentagramma","righe","spazi","tagli"],url:"/MusicGameHub/#pentagramma",group:"theory"},
chiavi:{icon:"𝄞",type:"Teoria",title:"Chiavi musicali",desc:"Famiglie di chiavi: Sol, Fa e Do, con posizionamento sulle righe.",tags:["chiave di sol","chiave di fa","chiave di do"],url:"/MusicGameHub/#chiavi",group:"theory"},
note:{icon:"🎵",type:"Teoria",title:"Note sul pentagramma",desc:"Le 7 note musicali e la loro posizione in chiave di violino.",tags:["do re mi","note","lettura"],url:"/MusicGameHub/#note",group:"theory"},
figure:{icon:"♩",type:"Teoria",title:"Figure musicali",desc:"Figure e pause musicali con i relativi valori ritmici.",tags:["ritmo","figure","pause"],url:"/MusicGameHub/#figure",group:"theory"},
scale:{icon:"🎹",type:"Teoria",title:"Scale e tonalità",desc:"Schema delle scale, toni, semitoni e armatura di chiave.",tags:["scale","tonalità","semitoni"],url:"/MusicGameHub/#scale",group:"theory"},
pentagrammaGame:{icon:"🎯",type:"Gioco",title:"Orientati sul pentagramma",desc:"Allenamento su righe, spazi e tagli addizionali.",tags:["gioco","pentagramma","posizione"],url:"/MusicGameHub/pentagramma_game.html",group:"games"},
noteGame:{icon:"𝄞",type:"Gioco",title:"Impara le Note",desc:"Riconosci le note in chiave di violino e basso.",tags:["gioco","note","chiavi"],url:"/MusicGameHub/music_game.html",group:"games"},
figuresGame:{icon:"♩",type:"Gioco",title:"Figure Musicali",desc:"Riconosci figure e pause musicali.",tags:["gioco","ritmo","figure"],url:"/MusicGameHub/music_game_figures.html",group:"games"},
wordle:{icon:"W",type:"Gioco",title:"Music Wordle",desc:"Indovina una parola musicale in stile Wordle.",tags:["vocabolario","wordle","giornaliero"],url:"/MusicGameHub/wordle.html",group:"games"},
guanto:{icon:"🏆",type:"Gioco",title:"Guanto di Sfida",desc:"Quiz misto su note, figure e teoria con classifica.",tags:["quiz","sfida","classifica"],url:"/MusicGameHub/guanto.html",group:"games"},
ritmo:{icon:"♪",type:"Allenamento",title:"Ritmo Challenge",desc:"Calcola il valore ritmico di sequenze di figure musicali.",tags:["ritmo","calcolo","valori"],url:"/MusicGameHub/ritmo_challenge.html",group:"practice"},
tempi:{icon:"⏱",type:"Teoria",title:"Tempi e metro",desc:"Come leggere l'indicazione di tempo e il raggruppamento delle pulsazioni.",tags:["tempo","metro","misura"],url:"/MusicGameHub/#tempi",group:"practice"},
espressione:{icon:"🎭",type:"Teoria",title:"Segni di espressione",desc:"Dinamica, articolazione e agogica: come suonare un brano.",tags:["dinamica","agogica","articolazione"],url:"/MusicGameHub/#espressione",group:"practice"}
};

const filterButtons=document.querySelectorAll(".filterBtn[data-filter]");
const resetButton=document.querySelector(".filterBtn[data-action='reset']");
const nodes=document.querySelectorAll(".resourceNode");
const categoryNodes=document.querySelectorAll(".categoryNode");
const mapCanvas=document.getElementById("mapCanvas");
const mobileList=document.getElementById("mobileList");
const modalOverlay=document.getElementById("modalOverlay");
const modalClose=document.getElementById("modalClose");
const modalIcon=document.getElementById("modalIcon");
const modalType=document.getElementById("modalType");
const modalTitle=document.getElementById("modalTitle");
const modalDesc=document.getElementById("modalDesc");
const modalTags=document.getElementById("modalTags");
const modalLink=document.getElementById("modalLink");
let zoom=1;

function setFilter(filter){
  filterButtons.forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===filter));
  nodes.forEach(node=>{
    const visible=filter==="all"||node.dataset.type===filter;
    node.classList.toggle("dimmed",!visible);
  });
  categoryNodes.forEach(node=>{
    const visible=filter==="all"||node.dataset.categoryNode===filter;
    node.classList.toggle("dimmed",!visible);
  });
}
filterButtons.forEach(btn=>btn.addEventListener("click",()=>setFilter(btn.dataset.filter)));
resetButton.addEventListener("click",()=>{setFilter("all");setZoom(1);});
categoryNodes.forEach(node=>node.addEventListener("click",()=>setFilter(node.dataset.categoryNode)));
nodes.forEach(node=>node.addEventListener("click",()=>openModal(node.dataset.id)));

function openModal(id){
  const item=resources[id];
  if(!item)return;
  modalIcon.textContent=item.icon;
  modalType.textContent=item.type;
  modalTitle.textContent=item.title;
  modalDesc.textContent=item.desc;
  modalLink.href=item.url;
  modalTags.innerHTML="";
  item.tags.forEach(tag=>{
    const span=document.createElement("span");
    span.className="tag";
    span.textContent=tag;
    modalTags.appendChild(span);
  });
  modalOverlay.classList.add("show");
}
function closeModal(){modalOverlay.classList.remove("show");}
modalClose.addEventListener("click",closeModal);
modalOverlay.addEventListener("click",e=>{if(e.target===modalOverlay)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

function setZoom(value){
  zoom=Math.min(1.35,Math.max(.72,value));
  mapCanvas.style.transform=`scale(${zoom})`;
}
document.getElementById("zoomIn").addEventListener("click",()=>setZoom(zoom+.08));
document.getElementById("zoomOut").addEventListener("click",()=>setZoom(zoom-.08));
document.getElementById("zoomReset").addEventListener("click",()=>setZoom(1));

document.querySelectorAll(".resourceNode").forEach(node => {
  const item = resources[node.dataset.id];
  if (!item) return;

  node.dataset.tooltip = `${item.title} · ${item.desc}`;
});

function renderMobileList(){
  const labels={theory:"📘 Teoria",games:"🎮 Giochi",practice:"💡 Allenamento"};
  mobileList.innerHTML="";
  Object.entries(labels).forEach(([group,label])=>{
    const wrapper=document.createElement("div");
    wrapper.className="mobileGroup";
    const title=document.createElement("h2");
    title.textContent=label;
    wrapper.appendChild(title);
    Object.entries(resources).filter(([,item])=>item.group===group).forEach(([id,item])=>{
      const card=document.createElement("article");
      card.className="mobileCard";
      card.innerHTML=`<h3>${item.icon} ${item.title}</h3><p>${item.desc}</p>`;
      card.addEventListener("click",()=>openModal(id));
      wrapper.appendChild(card);
    });
    mobileList.appendChild(wrapper);
  });
}
renderMobileList();
setFilter("all");
