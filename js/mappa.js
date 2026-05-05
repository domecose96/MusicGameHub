const resources=MusicGameHubResources.byId;

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
const rootNode=document.querySelector("[data-root='true']");

let zoom=1;

function setFilter(filter){
  filterButtons.forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.filter===filter);
  });

  nodes.forEach(node=>{
    const visible=filter==="all"||node.dataset.type===filter;
    node.classList.toggle("dimmed",!visible);
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

nodes.forEach(node=>{
  node.addEventListener("click",()=>{
    openModal(node.dataset.id);
    node.blur();
  });
});

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
  const labels={theory:"📘 Teoria",games:"🎮 Giochi",practice:"💡 Allenamento"};
  mobileList.innerHTML="";

  Object.entries(labels).forEach(([group,label])=>{
    const wrapper=document.createElement("div");
    wrapper.className="mobileGroup";

    const title=document.createElement("h2");
    title.textContent=label;
    wrapper.appendChild(title);

    Object.entries(resources)
      .filter(([,item])=>item.group===group)
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
