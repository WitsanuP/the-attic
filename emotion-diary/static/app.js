// ===== ข้อมูลวงล้ออารมณ์ (3 ชั้น) อิงแนวคิด Wheel of Emotions =====
const EMOTION_TREE = {
  "สุข": {
    color: "#e8b93f",
    children: {
      "มั่นใจ": ["ภาคภูมิใจ", "กล้าหาญ", "เก่งกาจ"],
      "พอใจ": ["สงบ", "ผ่อนคลาย", "อบอุ่นใจ"],
      "สนุกสนาน": ["ร่าเริง", "เบิกบาน", "ตื่นเต้นดีใจ"],
      "มีความหวัง": ["มองโลกในแง่ดี", "ตั้งตารอ", "เชื่อมั่น"]
    }
  },
  "ประหลาดใจ": {
    color: "#9b7fc4",
    children: {
      "ตกใจ": ["งุนงง", "ช็อก", "สะดุ้ง"],
      "อึ้ง": ["ทึ่ง", "อัศจรรย์ใจ", "คาดไม่ถึง"],
      "สับสน": ["มึนงง", "ไม่เข้าใจ", "งง"]
    }
  },
  "กลัว": {
    color: "#e08b3e",
    children: {
      "กังวล": ["เครียด", "กระวนกระวาย", "ประหม่า"],
      "ไม่มั่นคง": ["ไม่ปลอดภัย", "สั่นคลอน", "ระแวง"],
      "ตื่นตระหนก": ["ตกใจกลัว", "หวาดกลัว", "สยองขวัญ"],
      "ลังเล": ["สับสนในใจ", "ไม่แน่ใจตัวเอง", "กลัวผิดพลาด"]
    }
  },
  "โกรธ": {
    color: "#d64545",
    children: {
      "หงุดหงิด": ["รำคาญ", "ขุ่นเคือง", "เคืองใจ"],
      "แค้น": ["ขมขื่น", "อิจฉา", "ไม่พอใจสะสม"],
      "โมโห": ["เดือดดาล", "ระเบิดอารมณ์", "คุมสติไม่อยู่"],
      "รู้สึกไม่เป็นธรรม": ["ถูกเหยียดหยาม", "ถูกดูถูก", "ขายหน้า"]
    }
  },
  "รังเกียจ": {
    color: "#6a9955",
    children: {
      "ขยะแขยง": ["สะอิดสะเอียน", "คลื่นไส้", "เกลียด"],
      "ดูถูก": ["เหยียดหยาม", "เยาะเย้ย", "ไม่ให้ค่า"],
      "ผิดหวังในตัวเอง": ["ละอายใจ", "รู้สึกผิด", "สำนึกเสียใจ"]
    }
  },
  "เสียใจ": {
    color: "#5c9c8a",
    children: {
      "เหงา": ["โดดเดี่ยว", "ถูกทอดทิ้ง", "ว่างเปล่า"],
      "ผิดหวัง": ["ท้อแท้", "หมดหวัง", "เศร้าสร้อย"],
      "เจ็บปวด": ["บอบช้ำ", "ถูกทำร้ายใจ", "ร้าวราน"],
      "สิ้นหวัง": ["หมดกำลังใจ", "มืดมน", "หมดแรงใจ"]
    }
  },
  "ทุกข์": {
    color: "#7a5c9e",
    children: {
      "อ่อนล้า": ["เหนื่อยล้า", "หมดแรง", "ไม่มีเรี่ยวแรง"],
      "กดดัน": ["แบกรับมากเกินไป", "อึดอัด", "จนมุม"],
      "ว่างเปล่า": ["มึนชา", "ไร้ความรู้สึก", "เฉยชา"]
    }
  }
};

// ===== state =====
let state = { core: null, level2: null, level3: null, unsureAt: null };

const $ = sel => document.querySelector(sel);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

function resetState() {
  state = { core: null, level2: null, level3: null, unsureAt: null };
  $("#step2").classList.add("hidden");
  $("#step3").classList.add("hidden");
  $("#step4").classList.add("hidden");
  $("#entryText").value = "";
  $("#entryText").classList.remove("hidden");
  $("#mdPreview").classList.add("hidden");
  $("#previewToggle") && ($("#previewToggle").textContent = "👁️ ดูตัวอย่าง");
  previewOn = false;
  renderCoreGrid();
}

function renderCoreGrid() {
  const grid = $("#coreGrid");
  grid.innerHTML = "";
  Object.entries(EMOTION_TREE).forEach(([name, info]) => {
    const btn = el("button", "emo-btn", name);
    btn.style.background = info.color;
    btn.addEventListener("click", () => pickCore(name));
    grid.appendChild(btn);
  });
}

function pickCore(name) {
  state.core = name;
  state.level2 = null;
  state.level3 = null;
  state.unsureAt = null;

  $("#crumbs2").innerHTML = `เลือกไว้: <b>${state.core}</b>`;
  const grid = $("#level2Grid");
  grid.innerHTML = "";
  const info = EMOTION_TREE[name];
  Object.keys(info.children).forEach(l2 => {
    const btn = el("button", "emo-btn", l2);
    btn.style.background = info.color + "cc";
    btn.addEventListener("click", () => pickLevel2(l2));
    grid.appendChild(btn);
  });

  $("#step2").classList.remove("hidden");
  $("#step3").classList.add("hidden");
  $("#step4").classList.add("hidden");
  $("#step2").scrollIntoView({ behavior: "smooth", block: "start" });
}

function pickLevel2(name) {
  state.level2 = name;
  state.level3 = null;
  state.unsureAt = null;

  $("#crumbs3").innerHTML = `เลือกไว้: <b>${state.core} › ${state.level2}</b>`;
  const grid = $("#level3Grid");
  grid.innerHTML = "";
  const info = EMOTION_TREE[state.core];
  const options = info.children[name] || [];
  options.forEach(l3 => {
    const btn = el("button", "emo-btn", l3);
    btn.style.background = info.color + "99";
    btn.style.color = "#2b2723";
    btn.addEventListener("click", () => pickLevel3(l3));
    grid.appendChild(btn);
  });

  $("#step3").classList.remove("hidden");
  $("#step4").classList.add("hidden");
  $("#step3").scrollIntoView({ behavior: "smooth", block: "start" });
}

function pickLevel3(name) {
  state.level3 = name;
  goToStep4();
}

function goToStep4() {
  const path = [state.core, state.level2, state.level3].filter(Boolean).join(" › ");
  const unsureNote = state.unsureAt ? ` <span class="unsure-badge">ไม่แน่ใจ</span>` : "";
  $("#crumbs4").innerHTML = `บันทึกอารมณ์: <b>${path}</b>${unsureNote}`;

  const now = new Date();
  $("#entryDate").value = now.toISOString().slice(0, 10);
  $("#entryTime").value = now.toTimeString().slice(0, 5);

  $("#step4").classList.remove("hidden");
  $("#step4").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#unsureAtCore").addEventListener("click", () => {
  state.level2 = null;
  state.level3 = null;
  state.unsureAt = "core";
  goToStep4();
});

$("#unsureAtLevel2").addEventListener("click", () => {
  state.level3 = null;
  state.unsureAt = "level2";
  goToStep4();
});

$("#restartBtn").addEventListener("click", resetState);

// ===== แถบเครื่องมือ Markdown + สลับดูตัวอย่าง =====
function wrapSelection(before, after) {
  const ta = $("#entryText");
  const start = ta.selectionStart, end = ta.selectionEnd;
  const val = ta.value;
  const selected = val.slice(start, end) || "ข้อความ";
  ta.value = val.slice(0, start) + before + selected + (after !== undefined ? after : before) + val.slice(end);
  const cursor = start + before.length + selected.length + (after !== undefined ? after.length : before.length);
  ta.focus();
  ta.setSelectionRange(cursor, cursor);
}
function prefixLine(prefix) {
  const ta = $("#entryText");
  const start = ta.selectionStart;
  const val = ta.value;
  const lineStart = val.lastIndexOf("\n", start - 1) + 1;
  ta.value = val.slice(0, lineStart) + prefix + val.slice(lineStart);
  ta.focus();
  ta.setSelectionRange(start + prefix.length, start + prefix.length);
}
document.querySelectorAll(".mdToolbar [data-md]").forEach(btn => {
  btn.addEventListener("click", () => {
    const kind = btn.dataset.md;
    if (kind === "bold") wrapSelection("**");
    else if (kind === "italic") wrapSelection("*");
    else if (kind === "code") wrapSelection("`");
    else if (kind === "h") prefixLine("## ");
    else if (kind === "quote") prefixLine("> ");
    else if (kind === "ul") prefixLine("- ");
    else if (kind === "ol") prefixLine("1. ");
    else if (kind === "link") wrapSelection("[", "](https://)");
    syncPreview();
  });
});

let previewOn = false;
$("#previewToggle").addEventListener("click", () => {
  previewOn = !previewOn;
  $("#entryText").classList.toggle("hidden", previewOn);
  $("#mdPreview").classList.toggle("hidden", !previewOn);
  $("#previewToggle").textContent = previewOn ? "✏️ กลับไปพิมพ์" : "👁️ ดูตัวอย่าง";
  if (previewOn) syncPreview();
});
function syncPreview() {
  $("#mdPreview").innerHTML = renderMarkdown($("#entryText").value) ||
    `<p class="empty" style="padding:0">พิมพ์ข้อความเพื่อดูตัวอย่าง...</p>`;
}
$("#entryText").addEventListener("input", () => { if (previewOn) syncPreview(); });

$("#saveBtn").addEventListener("click", async () => {
  const payload = {
    core: state.core,
    level2: state.level2,
    level3: state.level3,
    unsure: !!state.unsureAt,
    unsureAt: state.unsureAt,
    date: $("#entryDate").value,
    time: $("#entryTime").value,
    text: $("#entryText").value
  };
  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("save failed");
    resetState();
    await loadEntries();
    $(".entries") && window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch (e) {
    alert("บันทึกไม่สำเร็จ ตรวจสอบว่าเซิร์ฟเวอร์ยังทำงานอยู่หรือไม่");
    console.error(e);
  }
});

function fmtDate(dateStr, timeStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T" + (timeStr || "00:00"));
    return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + (timeStr || "");
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ===== ตัวแปลง Markdown → HTML แบบง่าย (รองรับ: หัวข้อ, ตัวหนา/เอียง, ขีดกลาง,
// โค้ด/บล็อกโค้ด, ลิสต์ (bullet/เลข), quote, ลิงก์, เส้นคั่น, ย่อหน้า) =====
function renderMarkdown(raw) {
  if (!raw) return "";
  const text = escapeHtml(raw).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  let html = "";
  let inUl = false, inOl = false, inQuote = false, inCode = false;
  let codeBuf = [];

  const closeLists = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
    if (inQuote) { html += "</blockquote>"; inQuote = false; }
  };

  const inline = s => s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (!inCode) { closeLists(); inCode = true; codeBuf = []; }
      else { html += `<pre><code>${codeBuf.join("\n")}</code></pre>`; inCode = false; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    if (/^\s*$/.test(line)) { closeLists(); continue; }
    if (/^---+\s*$/.test(line)) { closeLists(); html += "<hr>"; continue; }

    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      closeLists();
      const level = m[1].length;
      html += `<h${level}>${inline(m[2])}</h${level}>`;
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) {
      if (!inQuote) { closeLists(); html += "<blockquote>"; inQuote = true; }
      html += `<p>${inline(m[1])}</p>`;
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (!inUl) { closeLists(); html += "<ul>"; inUl = true; }
      html += `<li>${inline(m[1])}</li>`;
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      if (!inOl) { closeLists(); html += "<ol>"; inOl = true; }
      html += `<li>${inline(m[1])}</li>`;
      continue;
    }
    closeLists();
    html += `<p>${inline(line)}</p>`;
  }
  closeLists();
  if (inCode) html += `<pre><code>${codeBuf.join("\n")}</code></pre>`;
  return html;
}

async function loadEntries() {
  const res = await fetch("/api/entries");
  const data = await res.json();
  const entries = data.entries || [];
  renderStats(entries);
  const container = $("#entries");
  if (entries.length === 0) {
    container.innerHTML = `<div class="empty">ยังไม่มีบันทึก เริ่มเลือกอารมณ์ด้านบนได้เลย</div>`;
    return;
  }
  container.innerHTML = entries.map(e => {
    const color = (EMOTION_TREE[e.core] && EMOTION_TREE[e.core].color) || "#999";
    const path = [e.core, e.level2, e.level3].filter(Boolean).join(" › ");
    const unsureBadge = e.unsure ? `<span class="unsure-badge">ไม่แน่ใจ</span>` : "";
    return `<div class="entry" data-id="${e.id}">
      <div class="entry-top">
        <div class="entry-path"><span class="tag" style="background:${color}">${e.core}</span>${path.replace(e.core + " › ", "")}${unsureBadge}</div>
        <span class="entry-date">${fmtDate(e.date, e.time)}</span>
      </div>
      ${e.text ? `<div class="entry-text md-body">${renderMarkdown(e.text)}</div>` : ""}
      <div class="entry-actions"><button class="delBtn" data-id="${e.id}">ลบ</button></div>
    </div>`;
  }).join("");

  container.querySelectorAll(".delBtn").forEach(b => {
    b.addEventListener("click", async () => {
      if (!confirm("ลบบันทึกนี้หรือไม่?")) return;
      await fetch(`/api/entries/${b.dataset.id}`, { method: "DELETE" });
      loadEntries();
    });
  });
}

function renderStats(entries) {
  const el = $("#stats");
  if (entries.length === 0) { el.innerHTML = ""; return; }
  const counts = {};
  entries.forEach(e => { counts[e.core] = (counts[e.core] || 0) + 1; });
  let top = null, topN = 0;
  for (const k in counts) if (counts[k] > topN) { topN = counts[k]; top = k; }
  el.innerHTML = `<span>บันทึกทั้งหมด <b>${entries.length}</b> รายการ</span>` +
    (top ? `<span>อารมณ์ที่พบบ่อย <b>${top}</b></span>` : "");
}

resetState();
loadEntries();
