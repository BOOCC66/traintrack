const STORAGE_KEY = "traintrack-records-v2";
const LEGACY_STORAGE_KEY = "traintrack-records-v1";
const PLAN_STORAGE_KEY = "traintrack-week-plans-v1";
const MONDAY_BASED_WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const MUSCLE_GROUPS = [
  "全部肌群",
  "胸部",
  "背部",
  "腿部",
  "肩部",
  "手臂",
  "核心",
  "臀部",
  "全身",
  "有氧"
];

const EXERCISE_LIBRARY = [
  { name: "深蹲", muscleGroup: "腿部", category: "力量训练" },
  { name: "卧推", muscleGroup: "胸部", category: "力量训练" },
  { name: "硬拉", muscleGroup: "全身", category: "力量训练" },
  { name: "引体向上", muscleGroup: "背部", category: "力量训练" },
  { name: "俯卧撑", muscleGroup: "胸部", category: "增肌训练" },
  { name: "杠铃划船", muscleGroup: "背部", category: "增肌训练" },
  { name: "高位下拉", muscleGroup: "背部", category: "增肌训练" },
  { name: "肩推", muscleGroup: "肩部", category: "增肌训练" },
  { name: "箭步蹲", muscleGroup: "腿部", category: "增肌训练" },
  { name: "臀推", muscleGroup: "臀部", category: "增肌训练" },
  { name: "腿举", muscleGroup: "腿部", category: "增肌训练" },
  { name: "保加利亚分腿蹲", muscleGroup: "腿部", category: "增肌训练" },
  { name: "平板支撑", muscleGroup: "核心", category: "核心训练" },
  { name: "侧平举", muscleGroup: "肩部", category: "增肌训练" },
  { name: "哑铃弯举", muscleGroup: "手臂", category: "增肌训练" },
  { name: "绳索下压", muscleGroup: "手臂", category: "增肌训练" },
  { name: "卷腹", muscleGroup: "核心", category: "核心训练" },
  { name: "跑步", muscleGroup: "有氧", category: "有氧训练" }
];

const sampleRecords = [
  { date: "2026-04-04", exercise: "深蹲", muscleGroup: "腿部", sets: 5, reps: 5, weight: 80, category: "力量训练", notes: "最后两组比较吃力" },
  { date: "2026-04-04", exercise: "腿举", muscleGroup: "腿部", sets: 4, reps: 12, weight: 160, category: "增肌训练", notes: "动作节奏稳定" },
  { date: "2026-04-06", exercise: "卧推", muscleGroup: "胸部", sets: 5, reps: 5, weight: 62.5, category: "力量训练", notes: "推起顺畅" },
  { date: "2026-04-06", exercise: "侧平举", muscleGroup: "肩部", sets: 4, reps: 15, weight: 10, category: "增肌训练", notes: "肩部灼烧感明显" },
  { date: "2026-04-09", exercise: "硬拉", muscleGroup: "全身", sets: 4, reps: 5, weight: 100, category: "力量训练", notes: "注意收紧核心" },
  { date: "2026-04-09", exercise: "引体向上", muscleGroup: "背部", sets: 4, reps: 8, weight: 0, category: "力量训练", notes: "最后一组借力明显" },
  { date: "2026-04-11", exercise: "肩推", muscleGroup: "肩部", sets: 4, reps: 10, weight: 32.5, category: "增肌训练", notes: "坐姿完成" },
  { date: "2026-04-13", exercise: "杠铃划船", muscleGroup: "背部", sets: 4, reps: 10, weight: 50, category: "增肌训练", notes: "背阔发力感不错" },
  { date: "2026-04-13", exercise: "高位下拉", muscleGroup: "背部", sets: 4, reps: 12, weight: 55, category: "增肌训练", notes: "控制离心" },
  { date: "2026-04-15", exercise: "平板支撑", muscleGroup: "核心", sets: 3, reps: 60, weight: 0, category: "核心训练", notes: "每组 60 秒" }
];

const DEFAULT_WEEK_PLANS = [
  { weekday: 0, title: "推训练", muscleGroup: "胸部", category: "力量训练", exercises: ["卧推", "俯卧撑", "绳索下压"] },
  { weekday: 1, title: "腿部力量", muscleGroup: "腿部", category: "力量训练", exercises: ["深蹲", "腿举", "保加利亚分腿蹲"] },
  { weekday: 2, title: "拉训练", muscleGroup: "背部", category: "增肌训练", exercises: ["引体向上", "杠铃划船", "高位下拉"] },
  { weekday: 3, title: "肩臂强化", muscleGroup: "肩部", category: "增肌训练", exercises: ["肩推", "侧平举", "哑铃弯举"] },
  { weekday: 4, title: "臀腿训练", muscleGroup: "臀部", category: "增肌训练", exercises: ["臀推", "箭步蹲", "深蹲"] },
  { weekday: 5, title: "核心 + 有氧", muscleGroup: "核心", category: "核心训练", exercises: ["平板支撑", "卷腹", "跑步"] },
  { weekday: 6, title: "恢复日", muscleGroup: "全身", category: "恢复训练", exercises: ["跑步"] }
];

const state = {
  currentView: "calendar",
  viewDate: startOfMonth(new Date()),
  weekAnchor: startOfWeek(new Date()),
  selectedDate: formatDate(new Date()),
  filterMuscleGroup: "全部肌群",
  selectedProgressExercises: [],
  records: loadRecords(),
  weekPlans: loadWeekPlans()
};

let deferredInstallPrompt = null;
const mobileMediaQuery = window.matchMedia("(max-width: 720px)");

const refs = {
  calendarView: document.getElementById("calendarView"),
  weekView: document.getElementById("weekView"),
  calendarGrid: document.getElementById("calendarGrid"),
  calendarMonthLabel: document.getElementById("calendarMonthLabel"),
  calendarSummary: document.getElementById("calendarSummary"),
  weekRangeLabel: document.getElementById("weekRangeLabel"),
  weekSummary: document.getElementById("weekSummary"),
  weekGrid: document.getElementById("weekGrid"),
  selectedDateLabel: document.getElementById("selectedDateLabel"),
  monthDaysCount: document.getElementById("monthDaysCount"),
  monthExerciseCount: document.getElementById("monthExerciseCount"),
  streakCount: document.getElementById("streakCount"),
  detailTitle: document.getElementById("detailTitle"),
  dayRecords: document.getElementById("dayRecords"),
  topExercises: document.getElementById("topExercises"),
  muscleSummary: document.getElementById("muscleSummary"),
  progressTitle: document.getElementById("progressTitle"),
  progressStats: document.getElementById("progressStats"),
  progressChart: document.getElementById("progressChart"),
  weekPlanList: document.getElementById("weekPlanList"),
  selectedPlanLabel: document.getElementById("selectedPlanLabel"),
  planExerciseChips: document.getElementById("planExerciseChips"),
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
  prevWeekBtn: document.getElementById("prevWeekBtn"),
  nextWeekBtn: document.getElementById("nextWeekBtn"),
  thisWeekBtn: document.getElementById("thisWeekBtn"),
  calendarViewBtn: document.getElementById("calendarViewBtn"),
  weekViewBtn: document.getElementById("weekViewBtn"),
  muscleGroupFilter: document.getElementById("muscleGroupFilter"),
  progressExerciseChoices: document.getElementById("progressExerciseChoices"),
  clearProgressSelectionBtn: document.getElementById("clearProgressSelectionBtn"),
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
  muscleGroupInput: document.getElementById("muscleGroupInput"),
  categoryInput: document.getElementById("categoryInput"),
  notesInput: document.getElementById("notesInput"),
  recordItemTemplate: document.getElementById("recordItemTemplate")
};

initialize();

function initialize() {
  populateExerciseOptions();
  populateMuscleGroupOptions();
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
  refs.prevMonthBtn.addEventListener("click", () => {
    state.viewDate = startOfMonth(addMonths(state.viewDate, -1));
    render();
  });
  refs.nextMonthBtn.addEventListener("click", () => {
    state.viewDate = startOfMonth(addMonths(state.viewDate, 1));
    render();
  });
  refs.prevWeekBtn.addEventListener("click", () => {
    state.weekAnchor = addDays(state.weekAnchor, -7);
    render();
  });
  refs.nextWeekBtn.addEventListener("click", () => {
    state.weekAnchor = addDays(state.weekAnchor, 7);
    render();
  });
  refs.thisWeekBtn.addEventListener("click", () => {
    state.weekAnchor = startOfWeek(parseDateKey(state.selectedDate));
    render();
  });
  refs.calendarViewBtn.addEventListener("click", () => setCurrentView("calendar"));
  refs.weekViewBtn.addEventListener("click", () => setCurrentView("week"));
  refs.muscleGroupFilter.addEventListener("change", (event) => {
    state.filterMuscleGroup = event.target.value;
    ensureProgressExerciseSelection(true);
    render();
  });
  refs.clearProgressSelectionBtn.addEventListener("click", () => {
    state.selectedProgressExercises = [];
    ensureProgressExerciseSelection(true);
    syncFilterControls();
    renderProgressPanel();
  });
  refs.exerciseInput.addEventListener("change", handleExerciseInputChange);
  refs.exportBtn.addEventListener("click", exportRecords);
  refs.importBtn.addEventListener("click", () => refs.importFileInput.click());
  refs.importFileInput.addEventListener("change", importRecords);
  refs.installAppBtn.addEventListener("click", installApp);
  refs.openComposerBtn.addEventListener("click", openComposer);
  refs.sheetBackdrop.addEventListener("click", closeComposer);
  window.addEventListener("keydown", handleKeydown);
  if (typeof mobileMediaQuery.addEventListener === "function") {
    mobileMediaQuery.addEventListener("change", handleViewportChange);
  } else if (typeof mobileMediaQuery.addListener === "function") {
    mobileMediaQuery.addListener(handleViewportChange);
  }
}

function render() {
  syncFilterControls();
  renderHeaderStats();
  renderCurrentView();
  renderSelectedDay();
  renderTopExercises();
  renderProgressPanel();
  renderWeekPlans();
  renderPlanSuggestionChips();
}

function renderCurrentView() {
  const isCalendar = state.currentView === "calendar";
  refs.calendarView.classList.toggle("hidden", !isCalendar);
  refs.weekView.classList.toggle("hidden", isCalendar);
  refs.calendarViewBtn.classList.toggle("is-active", isCalendar);
  refs.weekViewBtn.classList.toggle("is-active", !isCalendar);

  if (isCalendar) {
    renderCalendar();
  } else {
    renderWeekView();
  }
}

function renderHeaderStats() {
  const monthRecords = getFilteredMonthRecords(state.viewDate);
  const monthDays = new Set(monthRecords.map((record) => record.date)).size;
  refs.monthDaysCount.textContent = String(monthDays);
  refs.monthExerciseCount.textContent = String(monthRecords.length);
  refs.selectedDateLabel.textContent = formatDisplayDate(state.selectedDate);
  refs.streakCount.textContent = `${calculateLongestStreak(getFilteredRecords()).value} 天`;
}

function renderCalendar() {
  const viewYear = state.viewDate.getFullYear();
  const viewMonth = state.viewDate.getMonth();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOffset = convertWeekday(new Date(viewYear, viewMonth, 1).getDay());

  refs.calendarMonthLabel.textContent = `${viewYear} 年 ${viewMonth + 1} 月`;
  refs.calendarSummary.textContent = createMonthSummary();
  refs.calendarGrid.innerHTML = "";

  for (let index = 0; index < firstDayOffset; index += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    refs.calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(viewYear, viewMonth, day);
    const dateKey = formatDate(currentDate);
    const dailyRecords = getRecordsByDate(dateKey, true);
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

    button.addEventListener("click", () => selectDate(dateKey));
    refs.calendarGrid.appendChild(button);
  }
}

function renderWeekView() {
  const days = Array.from({ length: 7 }, (_, index) => addDays(state.weekAnchor, index));
  refs.weekGrid.innerHTML = "";
  refs.weekRangeLabel.textContent = `${formatDisplayDate(formatDate(days[0]))} - ${formatDisplayDate(formatDate(days[6]))}`;

  const records = getFilteredRecords().filter((record) => {
    const date = parseDateKey(record.date);
    return date >= startOfDay(state.weekAnchor) && date <= endOfDay(days[6]);
  });
  const completedDays = new Set(records.map((record) => record.date)).size;
  refs.weekSummary.textContent = `本周已完成 ${completedDays} 个训练日，共 ${records.length} 条记录。`;

  days.forEach((date) => {
    const dateKey = formatDate(date);
    const dayRecords = getRecordsByDate(dateKey, true);
    const weekdayIndex = convertWeekday(date.getDay());
    const plan = getPlanByWeekday(weekdayIndex);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "week-day-btn";

    if (dateKey === state.selectedDate) {
      button.classList.add("selected");
    }
    if (dateKey === formatDate(new Date())) {
      button.classList.add("today");
    }
    if (dayRecords.length > 0) {
      button.classList.add("has-record");
    }

    button.innerHTML = `
      <div class="week-card-head">
        <div>
          <p class="section-kicker">${MONDAY_BASED_WEEKDAYS[weekdayIndex]}</p>
          <h3 class="week-day-title">${date.getMonth() + 1}/${date.getDate()}</h3>
        </div>
        <span class="week-day-number">${date.getDate()}</span>
      </div>
      <p class="week-card-meta">${plan.title} · ${plan.muscleGroup}</p>
      ${dayRecords.length > 0 ? `<span class="week-day-badge">${dayRecords.length} 条</span>` : ""}
      <div class="week-day-preview">${dayRecords.slice(0, 2).map((record) => record.exercise).join(" / ") || plan.exercises.join(" / ")}</div>
    `;

    button.addEventListener("click", () => selectDate(dateKey));
    refs.weekGrid.appendChild(button);
  });
}

function renderSelectedDay() {
  const dailyRecords = getRecordsByDate(state.selectedDate, true);
  refs.detailTitle.textContent = `${formatDisplayDate(state.selectedDate)} 的训练详情`;
  refs.dayRecords.innerHTML = "";

  if (dailyRecords.length === 0) {
    refs.dayRecords.appendChild(createEmptyState(
      "这一天还没有训练记录",
      "你可以直接在右侧填写动作、组数、次数并保存，也可以先从下方周计划和热门动作里快速带入。"
    ));
    return;
  }

  dailyRecords
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((record) => {
      const node = refs.recordItemTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector(".record-name").textContent = record.exercise;
      node.querySelector(".record-meta").textContent =
        `${record.muscleGroup} · ${record.category} · ${record.sets} 组 × ${record.reps} 次` +
        (Number(record.weight) > 0 ? ` · ${record.weight} kg` : "");
      node.querySelector(".record-notes").textContent = record.notes || "无备注";
      node.querySelector(".delete-btn").addEventListener("click", () => deleteRecord(record.id));
      refs.dayRecords.appendChild(node);
    });
}

function renderTopExercises() {
  const records = getFilteredRecords();
  const counts = records.reduce((accumulator, record) => {
    const key = record.exercise.trim();
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
  const muscles = records.reduce((accumulator, record) => {
    accumulator[record.muscleGroup] = (accumulator[record.muscleGroup] || 0) + 1;
    return accumulator;
  }, {});

  refs.muscleSummary.innerHTML = "";
  Object.entries(muscles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([name, count]) => {
      const chip = document.createElement("span");
      chip.className = "muscle-pill";
      chip.textContent = `${name} ${count}`;
      refs.muscleSummary.appendChild(chip);
    });

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  refs.topExercises.innerHTML = "";
  if (ranked.length === 0) {
    refs.topExercises.appendChild(createEmptyState(
      "当前筛选下还没有统计数据",
      "换个肌群筛选，或者先补一些训练记录，这里会自动显示最常练的动作。"
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

function renderProgressPanel() {
  ensureProgressExerciseSelection();
  const exerciseNames = resolveSelectedProgressExercises();
  refs.progressTitle.textContent = exerciseNames.length > 0
    ? `${exerciseNames.join(" / ")} 的 PR 曲线`
    : "重量进步图表";
  refs.progressStats.innerHTML = "";
  refs.progressChart.innerHTML = "";

  if (exerciseNames.length === 0) {
    refs.progressStats.appendChild(createProgressStat("记录状态", "暂无数据"));
    refs.progressStats.appendChild(createProgressStat("建议", "先选择一个动作"));
    renderEmptyChart("请选择至少一个动作来展示 PR 曲线。");
    return;
  }

  const datasets = exerciseNames
    .map((exerciseName) => ({
      exerciseName,
      points: buildProgressSeries(exerciseName)
    }))
    .filter((dataset) => dataset.points.length > 0);

  if (datasets.length === 0) {
    refs.progressStats.appendChild(createProgressStat("图表动作", exerciseNames.join(" / ")));
    refs.progressStats.appendChild(createProgressStat("重量记录", "0 条"));
    renderEmptyChart("当前所选动作都还没有重量数据，记录重量后就能看到进步趋势。");
    return;
  }

  const bestWeight = Math.max(...datasets.flatMap((dataset) => dataset.points.map((item) => item.weight)));
  const bestPr = Math.max(...datasets.flatMap((dataset) => dataset.points.map((item) => item.estimatedPr)));
  const latest = datasets
    .flatMap((dataset) => dataset.points.map((point) => ({ ...point, exerciseName: dataset.exerciseName })))
    .sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date))
    .at(-1);

  refs.progressStats.appendChild(createProgressStat("展示动作", `${datasets.length} 个`));
  refs.progressStats.appendChild(createProgressStat("最佳重量", `${formatNumber(bestWeight)} kg`));
  refs.progressStats.appendChild(createProgressStat("最佳估算 1RM", `${formatNumber(bestPr)} kg`));
  refs.progressStats.appendChild(createProgressStat("最近一次", `${latest.exerciseName} · ${formatNumber(latest.weight)} kg`));

  renderChart(datasets);
}

function renderWeekPlans() {
  refs.weekPlanList.innerHTML = "";

  state.weekPlans.forEach((plan) => {
    const card = document.createElement("article");
    card.className = "plan-card";
    card.innerHTML = `
      <div class="plan-card-head">
        <div>
          <p class="section-kicker">${MONDAY_BASED_WEEKDAYS[plan.weekday]}</p>
          <h3>${plan.title}</h3>
        </div>
        <span class="muscle-pill">${plan.muscleGroup}</span>
      </div>
      <p class="plan-card-copy">${plan.exercises.join(" / ")}</p>
      <div class="plan-chip-row">
        <span class="mini-pill">${plan.category}</span>
        <span class="mini-pill">推荐 ${plan.exercises.length} 个动作</span>
      </div>
    `;

    const actionRow = document.createElement("div");
    actionRow.className = "plan-action-row";

    const applyButton = document.createElement("button");
    applyButton.className = "plan-action-btn";
    applyButton.type = "button";
    applyButton.textContent = "应用到选中日期";
    applyButton.addEventListener("click", () => applyPlanToSelectedDate(plan));

    const jumpButton = document.createElement("button");
    jumpButton.className = "plan-action-btn";
    jumpButton.type = "button";
    jumpButton.textContent = "跳到该日";
    jumpButton.addEventListener("click", () => jumpToNextWeekday(plan.weekday));

    actionRow.appendChild(applyButton);
    actionRow.appendChild(jumpButton);
    card.appendChild(actionRow);
    refs.weekPlanList.appendChild(card);
  });
}

function renderPlanSuggestionChips() {
  const selectedDate = parseDateKey(state.selectedDate);
  const weekdayIndex = convertWeekday(selectedDate.getDay());
  const plan = getPlanByWeekday(weekdayIndex);

  refs.selectedPlanLabel.textContent = `${MONDAY_BASED_WEEKDAYS[weekdayIndex]} · ${plan.title}`;
  refs.planExerciseChips.innerHTML = "";

  plan.exercises.forEach((exercise) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = exercise;
    chip.addEventListener("click", () => fillFormFromExercise(exercise, plan));
    refs.planExerciseChips.appendChild(chip);
  });
}

function populateExerciseOptions() {
  refs.exerciseOptions.innerHTML = "";
  refs.exerciseChips.innerHTML = "";

  EXERCISE_LIBRARY.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.name;
    refs.exerciseOptions.appendChild(option);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = entry.name;
    chip.addEventListener("click", () => fillFormFromExercise(entry.name, entry));
    refs.exerciseChips.appendChild(chip);
  });
}

function populateMuscleGroupOptions() {
  refs.muscleGroupFilter.innerHTML = "";
  MUSCLE_GROUPS.forEach((muscleGroup) => {
    refs.muscleGroupFilter.appendChild(createOptionElement(muscleGroup, muscleGroup));
  });

  refs.muscleGroupInput.innerHTML = "";
  MUSCLE_GROUPS.filter((name) => name !== "全部肌群").forEach((muscleGroup) => {
    refs.muscleGroupInput.appendChild(createOptionElement(muscleGroup, muscleGroup));
  });
}

function syncFilterControls() {
  refs.muscleGroupFilter.value = state.filterMuscleGroup;
  ensureProgressExerciseSelection();
  refs.progressExerciseChoices.innerHTML = "";

  getAvailableExercisesForFilter().forEach((exercise) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    if (state.selectedProgressExercises.includes(exercise)) {
      chip.classList.add("is-selected");
    }
    chip.textContent = exercise;
    chip.addEventListener("click", () => toggleProgressExercise(exercise));
    refs.progressExerciseChoices.appendChild(chip);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const newRecord = {
    id: createId(),
    date: refs.dateInput.value,
    exercise: refs.exerciseInput.value.trim(),
    muscleGroup: refs.muscleGroupInput.value,
    sets: Number(refs.setsInput.value),
    reps: Number(refs.repsInput.value),
    weight: refs.weightInput.value ? Number(refs.weightInput.value) : 0,
    category: refs.categoryInput.value,
    notes: refs.notesInput.value.trim(),
    createdAt: Date.now()
  };

  if (!newRecord.date || !newRecord.exercise || !newRecord.muscleGroup || newRecord.sets <= 0 || newRecord.reps <= 0) {
    window.alert("请完整填写日期、动作、肌群、组数和次数。");
    return;
  }

  state.records.push(newRecord);
  state.selectedDate = newRecord.date;
  state.viewDate = startOfMonth(parseDateKey(newRecord.date));
  state.weekAnchor = startOfWeek(parseDateKey(newRecord.date));
  persistRecords();
  if (!state.selectedProgressExercises.includes(newRecord.exercise)) {
    state.selectedProgressExercises = [newRecord.exercise];
  }
  resetForm();
  syncFormDate();
  render();

  if (isMobileViewport()) {
    closeComposer();
  }
}

function resetForm() {
  refs.entryForm.reset();
  refs.categoryInput.value = "力量训练";
  refs.dateInput.value = state.selectedDate;
  refs.muscleGroupInput.value = inferMuscleGroup(refs.exerciseInput.value) || "胸部";
}

function clearSelectedDay() {
  const allDayRecords = getRecordsByDate(state.selectedDate, false);
  if (allDayRecords.length === 0) {
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

  state.records = mergeRecords(seed);
  persistRecords();
  ensureProgressExerciseSelection(true);
  render();
}

function deleteRecord(recordId) {
  state.records = state.records.filter((record) => record.id !== recordId);
  persistRecords();
  render();
}

function goToToday() {
  const today = new Date();
  state.selectedDate = formatDate(today);
  state.viewDate = startOfMonth(today);
  state.weekAnchor = startOfWeek(today);
  syncFormDate();
  render();
}

function selectDate(dateKey) {
  state.selectedDate = dateKey;
  state.viewDate = startOfMonth(parseDateKey(dateKey));
  state.weekAnchor = startOfWeek(parseDateKey(dateKey));
  syncFormDate();
  render();
  if (isMobileViewport()) {
    closeComposer();
  }
}

function setCurrentView(view) {
  state.currentView = view;
  renderCurrentView();
}

function handleExerciseInputChange() {
  const match = findExercise(refs.exerciseInput.value.trim());
  if (match) {
    refs.muscleGroupInput.value = match.muscleGroup;
    refs.categoryInput.value = match.category;
  }
}

function fillFormFromExercise(exerciseName, source = null) {
  const entry = source && source.muscleGroup ? source : findExercise(exerciseName);
  refs.exerciseInput.value = exerciseName;
  refs.muscleGroupInput.value = entry?.muscleGroup || inferMuscleGroup(exerciseName) || "胸部";
  refs.categoryInput.value = entry?.category || refs.categoryInput.value;
  refs.notesInput.value = source?.title ? `周计划：${source.title}` : refs.notesInput.value;
  refs.exerciseInput.focus();
  openComposer();
}

function applyPlanToSelectedDate(plan) {
  state.selectedDate = state.selectedDate || formatDate(new Date());
  refs.dateInput.value = state.selectedDate;
  refs.exerciseInput.value = plan.exercises[0];
  refs.muscleGroupInput.value = plan.muscleGroup;
  refs.categoryInput.value = plan.category;
  refs.notesInput.value = `周计划：${plan.title} · ${plan.exercises.join(" / ")}`;
  openComposer();
}

function jumpToNextWeekday(weekdayIndex) {
  const anchor = parseDateKey(state.selectedDate);
  let cursor = new Date(anchor);
  for (let attempt = 0; attempt < 7; attempt += 1) {
    if (convertWeekday(cursor.getDay()) === weekdayIndex) {
      break;
    }
    cursor = addDays(cursor, 1);
  }
  selectDate(formatDate(cursor));
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
    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    const rawRecords = stored ? JSON.parse(stored) : legacyStored ? JSON.parse(legacyStored) : [];
    return migrateRecords(rawRecords);
  } catch (error) {
    console.error("读取训练记录失败", error);
    return [];
  }
}

function persistRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function loadWeekPlans() {
  try {
    const stored = localStorage.getItem(PLAN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WEEK_PLANS;
  } catch (error) {
    console.error("读取训练计划失败", error);
    return DEFAULT_WEEK_PLANS;
  }
}

function exportRecords() {
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    records: state.records,
    weekPlans: state.weekPlans
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

      state.records = mergeRecords(importedRecords);
      if (Array.isArray(parsed.weekPlans)) {
        state.weekPlans = parsed.weekPlans;
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(state.weekPlans));
      }
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
  const normalized = migrateRecords(importedRecords);
  const uniqueMap = new Map();

  [...state.records, ...normalized].forEach((record) => {
    const fingerprint = [
      record.date,
      record.exercise,
      record.muscleGroup,
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

function migrateRecords(records) {
  return (records || [])
    .filter(isValidRecordShape)
    .map((record) => ({
      id: record.id || createId("import"),
      date: record.date,
      exercise: String(record.exercise).trim(),
      muscleGroup: record.muscleGroup || inferMuscleGroup(record.exercise) || "全身",
      sets: Number(record.sets),
      reps: Number(record.reps),
      weight: Number(record.weight) || 0,
      category: record.category || inferCategory(record.exercise),
      notes: record.notes || "",
      createdAt: Number(record.createdAt) || Date.now()
    }));
}

function isValidRecordShape(record) {
  return record &&
    typeof record.date === "string" &&
    typeof record.exercise === "string" &&
    Number(record.sets) > 0 &&
    Number(record.reps) > 0;
}

function getFilteredRecords() {
  if (state.filterMuscleGroup === "全部肌群") {
    return [...state.records];
  }
  return state.records.filter((record) => record.muscleGroup === state.filterMuscleGroup);
}

function getRecordsByDate(dateKey, respectFilter) {
  const source = respectFilter ? getFilteredRecords() : state.records;
  return source.filter((record) => record.date === dateKey);
}

function getFilteredMonthRecords(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  return getFilteredRecords().filter((record) => {
    const recordDate = parseDateKey(record.date);
    return recordDate.getFullYear() === year && recordDate.getMonth() === month;
  });
}

function createMonthSummary() {
  const monthRecords = getFilteredMonthRecords(state.viewDate);
  if (monthRecords.length === 0) {
    return "这个月在当前筛选下还没有训练记录，先从一次动作录入开始。";
  }

  const monthDays = new Set(monthRecords.map((record) => record.date)).size;
  return `本月共记录 ${monthRecords.length} 个动作，覆盖 ${monthDays} 个训练日。`;
}

function getAvailableExercisesForFilter() {
  const records = getFilteredRecords();
  const exerciseSet = new Set([...EXERCISE_LIBRARY.map((entry) => entry.name), ...records.map((record) => record.exercise)]);
  return [...exerciseSet].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function ensureProgressExerciseSelection(forceFallback = false) {
  const available = getAvailableExercisesForFilter();
  state.selectedProgressExercises = state.selectedProgressExercises.filter((exercise) => available.includes(exercise));

  if (state.selectedProgressExercises.length > 0 && !forceFallback) {
    return;
  }

  if (state.selectedProgressExercises.length === 0 && available.length > 0) {
    state.selectedProgressExercises = [available[0]];
  }
}

function resolveSelectedProgressExercises() {
  return [...state.selectedProgressExercises];
}

function buildProgressSeries(exerciseName) {
  const grouped = new Map();
  getFilteredRecords()
    .filter((record) => record.exercise === exerciseName && Number(record.weight) > 0)
    .forEach((record) => {
      const estimatedPr = calculateEstimatedPr(record.weight, record.reps);
      const existing = grouped.get(record.date);
      const snapshot = {
        date: record.date,
        weight: record.weight,
        estimatedPr,
        reps: record.reps
      };

      if (!existing || existing.weight < snapshot.weight || existing.estimatedPr < snapshot.estimatedPr) {
        grouped.set(record.date, snapshot);
      }
    });

  return [...grouped.values()].sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date));
}

function renderChart(datasets) {
  const width = 640;
  const height = 260;
  const padding = { top: 24, right: 20, bottom: 42, left: 48 };
  const palette = [
    { weight: "#ea5d2d", pr: "#1d4ed8" },
    { weight: "#0f766e", pr: "#8b5cf6" },
    { weight: "#d97706", pr: "#ec4899" },
    { weight: "#059669", pr: "#7c3aed" }
  ];
  const values = datasets.flatMap((dataset) => dataset.points.flatMap((point) => [point.weight, point.estimatedPr]));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, 10);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const longestSeries = datasets.reduce((best, dataset) => dataset.points.length > best.length ? dataset.points : best, []);
  const labelStep = Math.max(1, Math.ceil(longestSeries.length / 5));

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const value = minValue + (range / 3) * index;
    const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(28,26,23,0.10)" stroke-dasharray="4 6"></line>
      <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#70675b" font-size="12">${formatNumber(value)}</text>
    `;
  }).join("");

  const labels = longestSeries
    .map((point, index) => {
      if (index % labelStep !== 0 && index !== longestSeries.length - 1) {
        return "";
      }
      const x = padding.left + (longestSeries.length === 1 ? chartWidth / 2 : (index / (longestSeries.length - 1)) * chartWidth);
      return `<text x="${x}" y="${height - 12}" text-anchor="middle" fill="#70675b" font-size="12">${point.date.slice(5)}</text>`;
    })
    .join("");

  const lines = datasets.map((dataset, datasetIndex) => {
    const colors = palette[datasetIndex % palette.length];
    const weightPoints = [];
    const prPoints = [];

    dataset.points.forEach((point, index) => {
      const x = padding.left + (dataset.points.length === 1 ? chartWidth / 2 : (index / (dataset.points.length - 1)) * chartWidth);
      const weightY = padding.top + chartHeight - ((point.weight - minValue) / range) * chartHeight;
      const prY = padding.top + chartHeight - ((point.estimatedPr - minValue) / range) * chartHeight;
      weightPoints.push(`${x},${weightY}`);
      prPoints.push(`${x},${prY}`);
    });

    return `
      <polyline fill="none" stroke="${colors.weight}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${weightPoints.join(" ")}"></polyline>
      <polyline fill="none" stroke="${colors.pr}" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round" stroke-linejoin="round" points="${prPoints.join(" ")}"></polyline>
      ${dataset.points.map((point, index) => {
        const x = padding.left + (dataset.points.length === 1 ? chartWidth / 2 : (index / (dataset.points.length - 1)) * chartWidth);
        const weightY = padding.top + chartHeight - ((point.weight - minValue) / range) * chartHeight;
        const prY = padding.top + chartHeight - ((point.estimatedPr - minValue) / range) * chartHeight;
        return `
          <circle cx="${x}" cy="${weightY}" r="4" fill="${colors.weight}"></circle>
          <circle cx="${x}" cy="${prY}" r="4" fill="${colors.pr}"></circle>
        `;
      }).join("")}
    `;
  }).join("");

  const legend = datasets.map((dataset, datasetIndex) => {
    const colors = palette[datasetIndex % palette.length];
    const baseX = datasetIndex * 154;
    return `
      <rect x="${baseX}" y="-16" width="12" height="12" rx="6" fill="${colors.weight}"></rect>
      <text x="${baseX + 18}" y="-6" fill="#70675b" font-size="12">${dataset.exerciseName} 重量</text>
      <rect x="${baseX}" y="10" width="12" height="12" rx="6" fill="${colors.pr}"></rect>
      <text x="${baseX + 18}" y="20" fill="#70675b" font-size="12">${dataset.exerciseName} 1RM</text>
    `;
  }).join("");

  refs.progressChart.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="rgba(255,255,255,0.68)"></rect>
    ${gridLines}
    ${lines}
    ${labels}
    <g transform="translate(${padding.left}, ${height - 4})">
      <g class="chart-legend">
        ${legend}
      </g>
    </g>
  `;
}

function toggleProgressExercise(exercise) {
  if (state.selectedProgressExercises.includes(exercise)) {
    state.selectedProgressExercises = state.selectedProgressExercises.filter((item) => item !== exercise);
  } else {
    state.selectedProgressExercises = [...state.selectedProgressExercises, exercise];
  }
  ensureProgressExerciseSelection();
  syncFilterControls();
  renderProgressPanel();
}

function renderEmptyChart(message) {
  refs.progressChart.innerHTML = `
    <rect x="0" y="0" width="640" height="260" rx="24" fill="rgba(255,255,255,0.68)"></rect>
    <text x="320" y="124" text-anchor="middle" fill="#70675b" font-size="16">${message}</text>
  `;
}

function createProgressStat(label, value) {
  const node = document.createElement("article");
  node.className = "progress-stat";
  node.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  return node;
}

function createEmptyState(title, description) {
  const node = document.createElement("div");
  node.className = "empty-state";
  node.innerHTML = `<strong>${title}</strong><p>${description}</p>`;
  return node;
}

function getPlanByWeekday(weekdayIndex) {
  return state.weekPlans.find((plan) => plan.weekday === weekdayIndex) || DEFAULT_WEEK_PLANS[weekdayIndex];
}

function calculateEstimatedPr(weight, reps) {
  return weight * (1 + reps / 30);
}

function calculateLongestStreak(records) {
  const dates = [...new Set(records.map((record) => record.date))].sort();
  let longest = 0;
  let current = 0;
  let lastDate = null;

  dates.forEach((dateKey) => {
    const date = parseDateKey(dateKey);
    if (!lastDate) {
      current = 1;
    } else {
      const diffDays = Math.round((date - lastDate) / 86400000);
      current = diffDays === 1 ? current + 1 : 1;
    }
    longest = Math.max(longest, current);
    lastDate = date;
  });

  return { value: longest };
}

function createOptionElement(label, value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function syncFormDate() {
  refs.dateInput.value = state.selectedDate;
}

function inferMuscleGroup(exerciseName) {
  return findExercise(exerciseName)?.muscleGroup || "全身";
}

function inferCategory(exerciseName) {
  return findExercise(exerciseName)?.category || "力量训练";
}

function findExercise(exerciseName) {
  return EXERCISE_LIBRARY.find((entry) => entry.name === exerciseName);
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

function formatNumber(value) {
  return Number(value).toFixed(value % 1 === 0 ? 0 : 1);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date) {
  const current = new Date(date);
  const weekday = convertWeekday(current.getDay());
  current.setDate(current.getDate() - weekday);
  return startOfDay(current);
}

function addMonths(date, value) {
  return new Date(date.getFullYear(), date.getMonth() + value, 1);
}

function addDays(date, value) {
  const next = new Date(date);
  next.setDate(next.getDate() + value);
  return next;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
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
