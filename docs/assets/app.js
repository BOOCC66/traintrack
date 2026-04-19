const STORAGE_KEY = "traintrack-records-v1";

const popularExercises = [
  "深蹲",
  "卧推",
  "硬拉",
  "引体向上",
  "俯卧撑",
  "杠铃划船",
  "高位下拉",
  "肩推",
  "箭步蹲",
  "臀推",
  "腿举",
  "保加利亚分腿蹲",
  "平板支撑",
  "侧平举",
  "哑铃弯举",
  "绳索下压"
];

const sampleRecords = [
  { date: "2026-04-04", exercise: "深蹲", sets: 5, reps: 5, weight: 80, category: "力量训练", notes: "最后两组比较吃力" },
  { date: "2026-04-04", exercise: "腿举", sets: 4, reps: 12, weight: 160, category: "增肌训练", notes: "动作节奏稳定" },
  { date: "2026-04-06", exercise: "卧推", sets: 5, reps: 5, weight: 62.5, category: "力量训练", notes: "推起顺畅" },
  { date: "2026-04-06", exercise: "侧平举", sets: 4, reps: 15, weight: 10, category: "增肌训练", notes: "肩部灼烧感明显" },
  { date: "2026-04-09", exercise: "硬拉", sets: 4, reps: 5, weight: 100, category: "力量训练", notes: "注意收紧核心" },
  { date: "2026-04-09", exercise: "引体向上", sets: 4, reps: 8, weight: 0, category: "力量训练", notes: "最后一组借力明显" },
  { date: "2026-04-11", exercise: "肩推", sets: 4, reps: 10, weight: 32.5, category: "增肌训练", notes: "坐姿完成" },
  { date: "2026-04-13", exercise: "杠铃划船", sets: 4, reps: 10, weight: 50, category: "增肌训练", notes: "背阔发力感不错" },
  { date: "2026-04-13", exercise: "高位下拉", sets: 4, reps: 12, weight: 55, category: "增肌训练", notes: "控制离心" },
  { date: "2026-04-15", exercise: "平板支撑", sets: 3, reps: 60, weight: 0, category: "核心训练", notes: "每组 60 秒" }
];

const state = {
  viewDate: startOfMonth(new Date()),
  selectedDate: formatDate(new Date()),
  records: loadRecords()
};

let deferredInstallPrompt = null;
const mobileMediaQuery = window.matchMedia("(max-width: 720px)");

const refs = {
  calendarGrid: document.getElementById("calendarGrid"),
  calendarMonthLabel: document.getElementById("calendarMonthLabel"),
  calendarSummary: document.getElementById("calendarSummary"),
  selectedDateLabel: document.getElementById("selectedDateLabel"),
  monthDaysCount: document.getElementById("monthDaysCount"),
  monthExerciseCount: document.getElementById("monthExerciseCount"),
  dayRecords: document.getElementById("dayRecords"),
  detailTitle: document.getElementById("detailTitle"),
  topExercises: document.getElementById("topExercises"),
  exerciseChips: document.getElementById("exerciseChips"),
  exerciseOptions: document.getElementById("exerciseOptions"),
  entryForm: document.getElementById("entryForm"),
  resetFormBtn: document.getElementById("resetFormBtn"),
  closeComposerBtn: document.getElementById("closeComposerBtn"),
  clearDayBtn: document.getElementById("clearDayBtn"),
  seedDataBtn: document.getElementById("seedDataBtn"),
  todayBtn: document.getElementById("todayBtn"),
  prevMonthBtn: document.getElementById("prevMonthBtn"),
  nextMonthBtn: document.getElementById("nextMonthBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  installAppBtn: document.getElementById("installAppBtn"),
  installHint: document.getElementById("installHint"),
  importFileInput: document.getElementById("importFileInput"),
  openComposerBtn: document.getElementById("openComposerBtn"),
  sheetBackdrop: document.getElementById("sheetBackdrop"),
  dateInput: document.getElementById("dateInput"),
  exerciseInput: document.getElementById("exerciseInput"),
  setsInput: document.getElementById("setsInput"),
  repsInput: document.getElementById("repsInput"),
  weightInput: document.getElementById("weightInput"),
  categoryInput: document.getElementById("categoryInput"),
  notesInput: document.getElementById("notesInput"),
  recordItemTemplate: document.getElementById("recordItemTemplate")
};

initialize();

function initialize() {
  renderExerciseOptions();
  bindEvents();
  initializePWA();
  syncFormDate();
  render();
}

function bindEvents() {
  refs.entryForm.addEventListener("submit", handleSubmit);
  refs.resetFormBtn.addEventListener("click", resetForm);
  refs.closeComposerBtn.addEventListener("click", closeComposer);
  refs.clearDayBtn.addEventListener("click", clearSelectedDay);
  refs.seedDataBtn.addEventListener("click", fillSampleData);
  refs.todayBtn.addEventListener("click", goToToday);
  refs.exportBtn.addEventListener("click", exportRecords);
  refs.importBtn.addEventListener("click", () => refs.importFileInput.click());
  refs.importFileInput.addEventListener("change", importRecords);
  refs.installAppBtn.addEventListener("click", installApp);
  refs.openComposerBtn.addEventListener("click", openComposer);
  refs.sheetBackdrop.addEventListener("click", closeComposer);
  refs.prevMonthBtn.addEventListener("click", () => {
    state.viewDate = startOfMonth(addMonths(state.viewDate, -1));
    renderCalendar();
  });
  refs.nextMonthBtn.addEventListener("click", () => {
    state.viewDate = startOfMonth(addMonths(state.viewDate, 1));
    renderCalendar();
  });
  window.addEventListener("keydown", handleKeydown);
  if (typeof mobileMediaQuery.addEventListener === "function") {
    mobileMediaQuery.addEventListener("change", handleViewportChange);
  } else if (typeof mobileMediaQuery.addListener === "function") {
    mobileMediaQuery.addListener(handleViewportChange);
  }
}

function render() {
  renderHeaderStats();
  renderCalendar();
  renderSelectedDay();
  renderTopExercises();
}

function renderExerciseOptions() {
  refs.exerciseOptions.innerHTML = "";
  refs.exerciseChips.innerHTML = "";

  popularExercises.forEach((exercise) => {
    const option = document.createElement("option");
    option.value = exercise;
    refs.exerciseOptions.appendChild(option);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = exercise;
    chip.addEventListener("click", () => {
      refs.exerciseInput.value = exercise;
      refs.exerciseInput.focus();
    });
    refs.exerciseChips.appendChild(chip);
  });
}

function renderHeaderStats() {
  const monthRecords = getMonthRecords(state.viewDate);
  const monthDays = new Set(monthRecords.map((record) => record.date)).size;
  refs.monthDaysCount.textContent = String(monthDays);
  refs.monthExerciseCount.textContent = String(monthRecords.length);
  refs.selectedDateLabel.textContent = formatDisplayDate(state.selectedDate);
}

function renderCalendar() {
  const viewYear = state.viewDate.getFullYear();
  const viewMonth = state.viewDate.getMonth();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOffset = convertWeekday(new Date(viewYear, viewMonth, 1).getDay());

  refs.calendarMonthLabel.textContent = `${viewYear} 年 ${viewMonth + 1} 月`;
  refs.calendarSummary.textContent = createMonthSummary();
  refs.calendarGrid.innerHTML = "";

  for (let i = 0; i < firstDayOffset; i += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    refs.calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(viewYear, viewMonth, day);
    const dateKey = formatDate(currentDate);
    const dailyRecords = getRecordsByDate(dateKey);
    const button = document.createElement("button");
    const previewNames = dailyRecords.slice(0, 2).map((record) => record.exercise).join(" / ");

    button.type = "button";
    button.className = "calendar-day";

    if (dateKey === formatDate(new Date())) {
      button.classList.add("today");
    }

    if (dateKey === state.selectedDate) {
      button.classList.add("selected");
    }

    if (dailyRecords.length > 0) {
      button.classList.add("has-record");
    }

    button.innerHTML = `
      <span class="day-number">${day}</span>
      ${dailyRecords.length > 0 ? `<span class="day-badge">${dailyRecords.length}</span>` : ""}
      <div class="day-preview">${previewNames || "点击查看详情"}</div>
    `;

    button.addEventListener("click", () => {
      state.selectedDate = dateKey;
      syncFormDate();
      render();
      if (isMobileViewport()) {
        closeComposer();
      }
    });

    refs.calendarGrid.appendChild(button);
  }
}

function renderSelectedDay() {
  const dailyRecords = getRecordsByDate(state.selectedDate);
  refs.detailTitle.textContent = `${formatDisplayDate(state.selectedDate)} 的训练详情`;
  refs.dayRecords.innerHTML = "";

  if (dailyRecords.length === 0) {
    refs.dayRecords.appendChild(createEmptyState(
      "这一天还没有训练记录",
      "你可以直接在右侧填写动作、组数、次数并保存，也可以先点热门动作快速带入。"
    ));
    return;
  }

  dailyRecords
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((record) => {
      const node = refs.recordItemTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector(".record-name").textContent = record.exercise;
      node.querySelector(".record-meta").textContent =
        `${record.category} · ${record.sets} 组 × ${record.reps} 次` +
        (Number(record.weight) > 0 ? ` · ${record.weight} kg` : "");
      node.querySelector(".record-notes").textContent = record.notes || "无备注";
      node.querySelector(".delete-btn").addEventListener("click", () => deleteRecord(record.id));
      refs.dayRecords.appendChild(node);
    });
}

function renderTopExercises() {
  const counts = state.records.reduce((accumulator, record) => {
    const key = record.exercise.trim();
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  refs.topExercises.innerHTML = "";

  if (ranked.length === 0) {
    refs.topExercises.appendChild(createEmptyState(
      "还没有统计数据",
      "当你开始记录训练后，这里会自动显示最常练的动作，帮助你看出自己的训练重心。"
    ));
    return;
  }

  ranked.forEach(([name, count], index) => {
    const item = document.createElement("article");
    item.className = "top-exercise-item";
    item.innerHTML = `
      <div>
        <h3>${name}</h3>
        <p>累计记录 ${count} 次</p>
      </div>
      <span class="top-exercise-rank">#${index + 1}</span>
    `;
    refs.topExercises.appendChild(item);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const newRecord = {
    id: createId(),
    date: refs.dateInput.value,
    exercise: refs.exerciseInput.value.trim(),
    sets: Number(refs.setsInput.value),
    reps: Number(refs.repsInput.value),
    weight: refs.weightInput.value ? Number(refs.weightInput.value) : 0,
    category: refs.categoryInput.value,
    notes: refs.notesInput.value.trim(),
    createdAt: Date.now()
  };

  if (!newRecord.date || !newRecord.exercise || newRecord.sets <= 0 || newRecord.reps <= 0) {
    window.alert("请完整填写日期、动作、组数和次数。");
    return;
  }

  state.records.push(newRecord);
  state.selectedDate = newRecord.date;
  state.viewDate = startOfMonth(parseDateKey(newRecord.date));
  persistRecords();
  resetForm();
  syncFormDate();
  render();

  if (isMobileViewport()) {
    closeComposer();
  }
}

function resetForm(shouldKeepSelectedDate = true) {
  refs.entryForm.reset();
  refs.categoryInput.value = "力量训练";
  refs.dateInput.value = shouldKeepSelectedDate ? state.selectedDate : refs.dateInput.value;
}

function clearSelectedDay() {
  const dailyRecords = getRecordsByDate(state.selectedDate);

  if (dailyRecords.length === 0) {
    window.alert("当前日期没有可清空的训练记录。");
    return;
  }

  const confirmed = window.confirm(`确定清空 ${formatDisplayDate(state.selectedDate)} 的全部训练记录吗？`);
  if (!confirmed) {
    return;
  }

  state.records = state.records.filter((record) => record.date !== state.selectedDate);
  persistRecords();
  render();
}

function fillSampleData() {
  if (state.records.length > 0) {
    const confirmed = window.confirm("示例数据会追加到你当前的记录中，是否继续？");
    if (!confirmed) {
      return;
    }
  }

  const now = Date.now();
  const seed = sampleRecords.map((record, index) => ({
    ...record,
    id: createId(`sample-${index}`),
    createdAt: now + index
  }));

  state.records = [...state.records, ...seed];
  persistRecords();
  render();
}

function deleteRecord(recordId) {
  state.records = state.records.filter((record) => record.id !== recordId);
  persistRecords();
  render();
}

function goToToday() {
  const today = new Date();
  state.viewDate = startOfMonth(today);
  state.selectedDate = formatDate(today);
  syncFormDate();
  render();
}

function syncFormDate() {
  refs.dateInput.value = state.selectedDate;
}

function openComposer() {
  if (!isMobileViewport()) {
    refs.exerciseInput.focus();
    return;
  }

  document.body.classList.add("sheet-open");
  refs.sheetBackdrop.hidden = false;
  window.setTimeout(() => refs.exerciseInput.focus(), 80);
}

function closeComposer() {
  document.body.classList.remove("sheet-open");
  refs.sheetBackdrop.hidden = true;
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeComposer();
  }
}

function handleViewportChange(event) {
  if (!event.matches) {
    closeComposer();
  }
}

function loadRecords() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("读取训练记录失败", error);
    return [];
  }
}

function persistRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function exportRecords() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    records: state.records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `traintrack-backup-${formatDate(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importRecords(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const importedRecords = Array.isArray(parsed) ? parsed : parsed.records;

      if (!Array.isArray(importedRecords)) {
        throw new Error("invalid format");
      }

      const merged = mergeRecords(importedRecords);
      state.records = merged;
      persistRecords();
      render();
      window.alert(`导入完成，当前共有 ${state.records.length} 条训练记录。`);
    } catch (error) {
      console.error("导入训练记录失败", error);
      window.alert("导入失败，请确认你选择的是 TrainTrack 导出的 JSON 文件。");
    } finally {
      refs.importFileInput.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
}

function mergeRecords(importedRecords) {
  const normalize = importedRecords
    .filter(isValidRecordShape)
    .map((record) => ({
      id: record.id || createId("import"),
      date: record.date,
      exercise: String(record.exercise).trim(),
      sets: Number(record.sets),
      reps: Number(record.reps),
      weight: Number(record.weight) || 0,
      category: record.category || "力量训练",
      notes: record.notes || "",
      createdAt: Number(record.createdAt) || Date.now()
    }));

  const uniqueMap = new Map();

  [...state.records, ...normalize].forEach((record) => {
    const fingerprint = [
      record.date,
      record.exercise,
      record.sets,
      record.reps,
      record.weight,
      record.category,
      record.notes,
      record.createdAt
    ].join("|");

    if (!uniqueMap.has(fingerprint)) {
      uniqueMap.set(fingerprint, record);
    }
  });

  return [...uniqueMap.values()].sort((a, b) => a.createdAt - b.createdAt);
}

function isValidRecordShape(record) {
  return record &&
    typeof record.date === "string" &&
    typeof record.exercise === "string" &&
    Number(record.sets) > 0 &&
    Number(record.reps) > 0;
}

function getRecordsByDate(dateKey) {
  return state.records.filter((record) => record.date === dateKey);
}

function getMonthRecords(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  return state.records.filter((record) => {
    const recordDate = parseDateKey(record.date);
    return recordDate.getFullYear() === year && recordDate.getMonth() === month;
  });
}

function createMonthSummary() {
  const monthRecords = getMonthRecords(state.viewDate);
  if (monthRecords.length === 0) {
    return "这个月还没有训练记录，先从一次动作录入开始。";
  }

  const monthDays = new Set(monthRecords.map((record) => record.date)).size;
  return `本月共记录 ${monthRecords.length} 个动作，覆盖 ${monthDays} 个训练日。`;
}

function createEmptyState(title, description) {
  const node = document.createElement("div");
  node.className = "empty-state";
  node.innerHTML = `<strong>${title}</strong><p>${description}</p>`;
  return node;
}

function formatDate(date) {
  const dateValue = new Date(date);
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateValue) {
  const date = typeof dateValue === "string" ? parseDateKey(dateValue) : new Date(dateValue);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, value) {
  return new Date(date.getFullYear(), date.getMonth() + value, 1);
}

function convertWeekday(day) {
  return day === 0 ? 6 : day - 1;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function createId(prefix = "record") {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function isMobileViewport() {
  return mobileMediaQuery.matches;
}

function initializePWA() {
  updateInstallAvailability();

  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    navigator.serviceWorker.register("service-worker.js").catch((error) => {
      console.error("service worker 注册失败", error);
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallAvailability();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    refs.installAppBtn.hidden = true;
    refs.installHint.textContent = "已安装到主屏幕，之后可以像普通 app 一样打开。";
  });
}

function updateInstallAvailability() {
  if (window.location.protocol === "file:") {
    refs.installAppBtn.hidden = true;
    refs.installHint.textContent = "当前是本地文件模式；把它放到静态网站后，就能在手机上添加到主屏幕。";
    return;
  }

  if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
    refs.installAppBtn.hidden = true;
    refs.installHint.textContent = "iPhone 请点 Safari 分享按钮，再选择“添加到主屏幕”。";
    return;
  }

  refs.installAppBtn.hidden = deferredInstallPrompt === null;
  refs.installHint.textContent = deferredInstallPrompt
    ? "当前环境支持安装，点“安装到手机”即可像 app 一样使用。"
    : "手机浏览器可直接访问；支持安装时会自动出现“安装到手机”按钮。";
}

async function installApp() {
  if (!deferredInstallPrompt) {
    window.alert("当前浏览环境暂时不支持一键安装，但你仍然可以在手机浏览器中直接使用。");
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  updateInstallAvailability();
}
