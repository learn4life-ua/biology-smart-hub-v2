const HUB_KEY = "biology_smart_hub_v2";

function loadHub(){
  try{
    const raw = localStorage.getItem(HUB_KEY);
    return raw ? JSON.parse(raw) : { profile:{ student:"", group:"", opp:"" }, workbooks:{} };
  }catch{
    return { profile:{ student:"", group:"", opp:"" }, workbooks:{} };
  }
}
function saveHub(data){
  localStorage.setItem(HUB_KEY, JSON.stringify(data));
}

function getPageId(){
  // сторінки зошита матимуть <body data-page="m4"> etc.
  return document.body.getAttribute("data-page") || "m1";
}

function bindProfile(){
  const hub = loadHub();
  const studentEl = document.querySelector("[data-bind='student']");
  const groupEl   = document.querySelector("[data-bind='group']");
  const oppEl     = document.querySelector("[data-bind='opp']");

  if (studentEl) studentEl.textContent = hub.profile.student || "—";
  if (groupEl) groupEl.textContent = hub.profile.group || "—";
  if (oppEl) oppEl.textContent = hub.profile.opp || "—";
}

function collectInputs(scope){
  const out = {};
  scope.querySelectorAll("[data-save]").forEach(el=>{
    const key = el.getAttribute("data-save");
    if (el.type === "checkbox"){
      out[key] = el.checked;
    } else if (el.type === "radio"){
      if (el.checked) out[key] = el.value;
    } else {
      out[key] = el.value;
    }
  });

  // чеклісти (множинні)
  scope.querySelectorAll("[data-save-list]").forEach(wrapper=>{
    const key = wrapper.getAttribute("data-save-list");
    const arr = [];
    wrapper.querySelectorAll("input[type='checkbox']").forEach((c, idx)=>{
      if (c.checked) arr.push(idx);
    });
    out[key] = arr;
  });

  // табличні поля (рядок-колонка)
  scope.querySelectorAll("[data-save-grid]").forEach(wrapper=>{
    const key = wrapper.getAttribute("data-save-grid");
    const grid = {};
    wrapper.querySelectorAll("[data-row]").forEach(row=>{
      const rowKey = row.getAttribute("data-row");
      grid[rowKey] = {};
      row.querySelectorAll("[data-col]").forEach(col=>{
        const colKey = col.getAttribute("data-col");
        grid[rowKey][colKey] = col.value;
      });
    });
    out[key] = grid;
  });

  return out;
}

function hydrateInputs(scope, data){
  if (!data) return;

  scope.querySelectorAll("[data-save]").forEach(el=>{
    const key = el.getAttribute("data-save");
    if (!(key in data)) return;

    if (el.type === "checkbox"){
      el.checked = !!data[key];
    } else if (el.type === "radio"){
      el.checked = (el.value === data[key]);
    } else {
      el.value = data[key];
    }
  });

  scope.querySelectorAll("[data-save-list]").forEach(wrapper=>{
    const key = wrapper.getAttribute("data-save-list");
    const arr = Array.isArray(data[key]) ? data[key] : [];
    wrapper.querySelectorAll("input[type='checkbox']").forEach((c, idx)=>{
      c.checked = arr.includes(idx);
    });
  });

  scope.querySelectorAll("[data-save-grid]").forEach(wrapper=>{
    const key = wrapper.getAttribute("data-save-grid");
    const grid = data[key] || {};
    wrapper.querySelectorAll("[data-row]").forEach(row=>{
      const rowKey = row.getAttribute("data-row");
      row.querySelectorAll("[data-col]").forEach(col=>{
        const colKey = col.getAttribute("data-col");
        col.value = grid?.[rowKey]?.[colKey] ?? "";
      });
    });
  });
}

function initWorkbookPage(){
  const pageId = getPageId();
  const hub = loadHub();
  hub.workbooks[pageId] = hub.workbooks[pageId] || {};

  const scope = document.querySelector("[data-scope='workbook']");
  if (!scope) return;

  bindProfile();
  hydrateInputs(scope, hub.workbooks[pageId]);

  const saveBtn = document.getElementById("btnSave");
  const printBtn = document.getElementById("btnPrint");

  if (saveBtn){
    saveBtn.addEventListener("click", ()=>{
      const next = collectInputs(scope);
      hub.workbooks[pageId] = { ...hub.workbooks[pageId], ...next };
      saveHub(hub);
      alert("Збережено.");
    });
  }

  if (printBtn){
    printBtn.addEventListener("click", ()=>{
      window.print();
    });
  }
}

document.addEventListener("DOMContentLoaded", initWorkbookPage);
