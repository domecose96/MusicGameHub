const resources=MusicGameHubResources.byId;

const filterButtons=document.querySelectorAll(".filterBtn[data-filter]");
const resetButton=document.querySelector(".filterBtn[data-action='reset']");
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
const rootNode=document.querySelector("[data-root='true']");

let zoom=1;

const clusterContent={
  elementiMusica:[
    {label:"Eventi",url:"elementi_musica.html#eventi"},
    {label:"Suono/Rumore",url:"elementi_musica.html#rumore"},
    {label:"Elementi",url:"elementi_musica.html#elementi"},
    {label:"Caratteristiche",url:"elementi_musica.html#caratteristiche"},
    {label:"Udito",url:"elementi_musica.html#udito"},
    {label:"Laboratorio",url:"elementi_musica.html#laboratorio"}
  ],
  teoriaBase:[
    {label:"Pentagramma",id:"pentagramma"},
    {label:"Chiavi",id:"chiavi"},
    {label:"Note",id:"note"},
    {label:"Figure",id:"figure"},
    {label:"Tempi",id:"tempi"},
    {label:"Scale",id:"scale"},
    {label:"Simboli",id:"simboli"},
    {label:"Espressione",id:"espressione"}
  ],
  teoriaAvanzata:[
    {label:"Intervalli",id:"intervalliAvanzati"},
    {label:"Accordi",id:"accordiAvanzati"},
    {label:"Rivolti",id:"rivoltiAvanzati"},
    {label:"Scale minori",id:"scaleMinoriAvanzate"},
    {label:"Circolo quinte",id:"circoloQuinte"},
    {label:"Cadenze",id:"cadenzeAvanzate"},
    {label:"Modulazioni",id:"modulazioniAvanzate"},
    {label:"Ritmica",id:"ritmicaAvanzata"},
    {label:"Abbellimenti",id:"abbellimentiAvanzati"},
    {label:"Forma",id:"formaAvanzata"}
  ],
  storiaMusica:[
    {label:"Antichità",url:"storia/storia_antichita.html"},
    {label:"Medioevo",url:"storia/storia_medioevo.html"},
    {label:"Rinascimento",disabled:true},
    {label:"Barocco",disabled:true},
    {label:"Classicismo",disabled:true},
    {label:"Romanticismo",disabled:true},
    {label:"Novecento",disabled:true},
    {label:"Contemporanea",disabled:true}
  ],
  strumentiMusicali:[
    {label:"Panoramica",url:"strumenti.html#panoramica"},
    {label:"Percussioni",url:"strumenti.html#percussioni"},
    {label:"Fiato",url:"strumenti.html#fiato"},
    {label:"Corde",url:"strumenti.html#corde"},
    {label:"Tastiera",url:"strumenti.html#tastiera"},
    {label:"Elettrofoni",url:"strumenti.html#elettrofoni"},
    {label:"Gioco strumenti",url:"giochi/strumenti_game.html"}
  ],
  educazioneCivica:[
    {label:"Ascolto e rispetto",id:"ascoltoRispetto"},
    {label:"Canti della Memoria",id:"cantiMemoria"},
    {label:"Inno d'Italia",id:"innoItalia"},
    {label:"Musica e ambiente",id:"musicaAmbiente"},
    {label:"Copyright e media",id:"copyrightMedia"}
  ],
  ascoltoRispetto:[
    {label:"Ascolto",url:"educazione_civica/ascolto_rispetto.html#ascolto"},
    {label:"Udito",url:"educazione_civica/ascolto_rispetto.html#udito"},
    {label:"Regole",url:"educazione_civica/ascolto_rispetto.html#regole"},
    {label:"Classe",url:"educazione_civica/ascolto_rispetto.html#classe"},
    {label:"Emozioni",url:"educazione_civica/ascolto_rispetto.html#emozioni"},
    {label:"Patto",url:"educazione_civica/ascolto_rispetto.html#patto"},
    {label:"Quiz",url:"educazione_civica/ascolto_rispetto.html#quiz"}
  ],
  cantiMemoria:[
    {label:"Ricordare",url:"educazione_civica/canti_memoria.html#ricordare"},
    {label:"Parole",url:"educazione_civica/canti_memoria.html#parole"},
    {label:"Memoria",url:"educazione_civica/canti_memoria.html#memoria"},
    {label:"Ascolti",url:"educazione_civica/canti_memoria.html#ascolti"},
    {label:"Laboratorio",url:"educazione_civica/canti_memoria.html#laboratorio"},
    {label:"Quiz",url:"educazione_civica/canti_memoria.html#quiz"}
  ],
  innoItalia:[
    {label:"Timeline",url:"educazione_civica/inno_italia.html#timeline"},
    {label:"Ascolto",url:"educazione_civica/inno_italia.html#video"},
    {label:"Simboli",url:"educazione_civica/inno_italia.html#simboli"},
    {label:"Autori",url:"educazione_civica/inno_italia.html#autori"},
    {label:"Significato",url:"educazione_civica/inno_italia.html#significato"},
    {label:"Canto",url:"educazione_civica/inno_italia.html#canta"},
    {label:"Curiosità",url:"educazione_civica/inno_italia.html#curiosita"},
    {label:"Quiz",url:"educazione_civica/inno_italia.html#quiz"}
  ],
  musicaAmbiente:[
    {label:"Introduzione",url:"educazione_civica/musica_ambiente.html#introduzione"},
    {label:"Suoni natura",url:"educazione_civica/musica_ambiente.html#suoni"},
    {label:"Ascolto",url:"educazione_civica/musica_ambiente.html#ascolto"},
    {label:"Canzoni",url:"educazione_civica/musica_ambiente.html#canzoni"},
    {label:"Sostenibilità",url:"educazione_civica/musica_ambiente.html#sostenibilita"},
    {label:"Laboratorio",url:"educazione_civica/musica_ambiente.html#laboratorio"},
    {label:"Quiz",url:"educazione_civica/musica_ambiente.html#quiz"}
  ],
  copyrightMedia:[
    {label:"Perché",url:"educazione_civica/rispetto_copyright_media.html#perche"},
    {label:"Differenze",url:"educazione_civica/rispetto_copyright_media.html#differenze"},
    {label:"Posso usarlo?",url:"educazione_civica/rispetto_copyright_media.html#uso"},
    {label:"Licenze",url:"educazione_civica/rispetto_copyright_media.html#licenze"},
    {label:"IA",url:"educazione_civica/rispetto_copyright_media.html#ia"},
    {label:"Abitudini",url:"educazione_civica/rispetto_copyright_media.html#abitudini"},
    {label:"Scheda",url:"educazione_civica/rispetto_copyright_media.html#scheda"},
    {label:"Patto",url:"educazione_civica/rispetto_copyright_media.html#patto"},
    {label:"Quiz",url:"educazione_civica/rispetto_copyright_media.html#quiz"},
    {label:"Film",url:"educazione_civica/rispetto_copyright_media.html#film"}
  ]
};

function getNodes(){
  return document.querySelectorAll(".resourceNode");
}

function getClusters(){
  return document.querySelectorAll(".resourceCluster");
}

function setFilter(filter){
  filterButtons.forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.filter===filter);
  });

  getNodes().forEach(node=>{
    const visible=filter==="all"||node.dataset.type===filter;
    node.classList.toggle("dimmed",!visible);
  });

  getClusters().forEach(cluster=>{
    const visible=filter==="all"||cluster.dataset.type===filter;
    cluster.classList.toggle("dimmed",!visible);
  });

  categoryNodes.forEach(node=>{
    const visible=filter==="all"||node.dataset.categoryNode===filter;
    node.classList.toggle("dimmed",!visible);
  });
}

filterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    setFilter(btn.dataset.filter);
    btn.blur();
  });
});

resetButton.addEventListener("click",()=>{
  setFilter("all");
  setZoom(1);
  resetButton.blur();
});

categoryNodes.forEach(node=>{
  node.addEventListener("click",()=>{
    setFilter(node.dataset.categoryNode);
    node.blur();
  });
});

rootNode?.addEventListener("click",()=>{
  MGH.goHome();
});

function setupClusters(){
  document.querySelectorAll(".mapResourceGrid").forEach(grid=>{
    Array.from(grid.children).forEach((child,index)=>{
      const node=child.matches?.(".resourceNode")?child:child.querySelector?.(".resourceNode");
      if(!node||!clusterContent[node.dataset.id])return;

      let wrapper=child.matches?.(".resourceCluster")?child:null;
      if(!wrapper){
        wrapper=document.createElement("article");
        wrapper.className="resourceCluster";
        wrapper.dataset.type=node.dataset.type;
        grid.insertBefore(wrapper,node);
        wrapper.appendChild(node);
      }

      wrapper.classList.toggle("clusterFromRight",index%2===1);
      node.classList.add("clusterToggle");
      node.setAttribute("aria-expanded",node.getAttribute("aria-expanded")||"false");
      node.dataset.toggleCluster=node.dataset.id;

      if(!node.querySelector(".clusterHint")){
        const hint=document.createElement("span");
        hint.className="clusterHint";
        node.appendChild(hint);
      }
      node.querySelector(".clusterHint").textContent="Apri contenuti";

      let panel=wrapper.querySelector(".clusterLinks");
      if(!panel){
        panel=document.createElement("div");
        panel.className="clusterLinks";
        panel.id=`cluster-${node.dataset.id}`;
        panel.hidden=true;
        wrapper.appendChild(panel);
      }

      panel.innerHTML="";
      clusterContent[node.dataset.id].forEach(item=>{
        const button=document.createElement("button");
        button.type="button";
        button.textContent=item.label;
        if(item.id)button.dataset.id=item.id;
        if(item.url)button.dataset.url=item.url;
        if(item.disabled){
          button.disabled=true;
          button.title="Pagina in arrivo";
        }
        panel.appendChild(button);
      });
    });
  });
}

setupClusters();

getNodes().forEach(node=>{
  if(node.dataset.toggleCluster||node.querySelector(".cardHint"))return;

  const hint=document.createElement("span");
  hint.className="cardHint directHint";
  hint.textContent=node.dataset.type==="games"?"Apri gioco":"Apri pagina";
  node.appendChild(hint);
});

getNodes().forEach(node=>{
  node.addEventListener("click",event=>{
    const hint=event.target.closest?.(".clusterHint");
    if(hint){
      event.preventDefault();
      event.stopPropagation();
      toggleCluster(node);
      node.blur();
      return;
    }

    goToResource(node.dataset.id);
    node.blur();
  });
});

function toggleCluster(button){
  const cluster=document.getElementById(`cluster-${button.dataset.toggleCluster}`);
  const wrapper=button.closest(".resourceCluster");
  if(!cluster||!wrapper)return;

  const isOpen=button.getAttribute("aria-expanded")==="true";

  document.querySelectorAll(".resourceCluster.open").forEach(openWrapper=>{
    if(openWrapper===wrapper)return;
    const openButton=openWrapper.querySelector(".clusterToggle");
    const openCluster=openWrapper.querySelector(".clusterLinks");
    const openHint=openButton?.querySelector(".clusterHint");

    openWrapper.classList.remove("open");
    if(openButton)openButton.setAttribute("aria-expanded","false");
    if(openCluster)openCluster.hidden=true;
    if(openHint)openHint.firstChild.textContent="Apri contenuti";
  });

  button.setAttribute("aria-expanded",String(!isOpen));
  wrapper.classList.toggle("open",!isOpen);
  cluster.hidden=isOpen;

  const hint=button.querySelector(".clusterHint");
  if(hint){
    hint.firstChild.textContent=isOpen?"Apri contenuti":"Chiudi contenuti";
  }
}

document.querySelectorAll(".clusterLinks button").forEach(link=>{
  link.addEventListener("click",()=>{
    if(link.disabled)return;
    if(link.dataset.url){
      MGH.goTo(link.dataset.url);
    }else{
      goToResource(link.dataset.id);
    }
    link.blur();
  });
});

function goToResource(id){
  const item=resources[id];
  if(item?.url)MGH.goTo(item.url);
}

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

function closeModal(){
  modalOverlay.classList.remove("show");
}

modalClose.addEventListener("click",()=>{
  closeModal();
  modalClose.blur();
});

modalOverlay.addEventListener("click",e=>{
  if(e.target===modalOverlay) closeModal();
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeModal();
});

function setZoom(value){
  zoom=Math.min(1.35,Math.max(.72,value));
  mapCanvas.style.transform=`scale(${zoom})`;
}

document.getElementById("zoomIn").addEventListener("click",e=>{
  setZoom(zoom+.08);
  e.currentTarget.blur();
});

document.getElementById("zoomOut").addEventListener("click",e=>{
  setZoom(zoom-.08);
  e.currentTarget.blur();
});

document.getElementById("zoomReset").addEventListener("click",e=>{
  setZoom(1);
  e.currentTarget.blur();
});

document.querySelectorAll(".resourceNode").forEach(node=>{
  const item=resources[node.dataset.id];
  if(!item)return;
  node.dataset.tooltip=`${item.title} · ${item.desc}`;
});

function renderMobileList(){
  const labels={theory:"📘 Teoria",paths:"🧭 Percorsi",games:"🎮 Giochi"};
  mobileList.innerHTML="";

  Object.entries(labels).forEach(([group,label])=>{
    const wrapper=document.createElement("div");
    wrapper.className="mobileGroup";

    const title=document.createElement("h2");
    title.textContent=label;
    wrapper.appendChild(title);

    Object.entries(resources)
      .filter(([,item])=>item.group===group&&!item.excludeFromStats)
      .forEach(([id,item])=>{
        const card=document.createElement("article");
        card.className="mobileCard";

        const cardTitle=document.createElement("h3");
        cardTitle.textContent=`${item.icon} ${item.title}`;

        const cardDesc=document.createElement("p");
        cardDesc.textContent=item.desc;

        card.append(cardTitle,cardDesc);
        card.addEventListener("click",()=>openModal(id));
        wrapper.appendChild(card);
      });

    mobileList.appendChild(wrapper);
  });
}

renderMobileList();
setFilter("all");
