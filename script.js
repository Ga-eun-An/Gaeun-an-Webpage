// 1. 변수 선언 (정상 선언)
let clickCount = 0;
let dragDuration = 0;
let isDragging = false;
let dragStartTime = 0;
let GOAL_CLICK = 28;
let GOAL_DRAG = 7;
let currentInteractionStage = 1;
let interactionScene = false;
let ruleScene = false;
let scene = 1;
let index = -1;
let colorIndex = 0;
let secondIndex = -1;
let resetScene = false;
let resetIndex = -1;
let dragColorIndex = 0;
let lastDragX = 0;
let lastDragY = 0;
let ruleIndex = -1;
let dragTimer;
let accumulatedDistance = 0; 

// 2. 데이터
const texts = ["이제", "이곳에서", "클릭", "은", "근력,", "힘이다."];
const secondScene = ["클릭", "횟수", "는", "힘", "의 크기에", "비례한다."];
const resetSceneTexts = ["이제", "이곳에서", "드래그", "는", "유연성", "이다."];
const clickColors = ["#00FF22", "#FF00BF", "#FFF200", "#FF0004"];
const wordChanges = ["Strength", "Core", "Power", "Muscles"];
const dragColors = ["#00FF22", "#FF00BF", "#FFF200", "#FF0004"];
const dragWordChanges = ["Flexibility", "Balance", "Mobility", "Stretch"];
const ruleTexts = ["규칙", "클릭", "또는", "드래그", "에 따라", "이 동작을", "만들어보세요."];

const container = document.querySelector(".container");

// 3. 유틸 함수
function addText(className, text) {
  const el = document.createElement("div");
  el.className = className;
  el.innerText = text;
  container.appendChild(el);
  return el;
}

function removeLastText() {
  const last = container.querySelector(".text:last-child");
  if (last) last.remove();
}

function startRuleScene() {
  document.querySelectorAll(".text").forEach(el => el.remove());
  ruleScene = true;
  ruleIndex = -1;
}

function startInteractionScene() {
  document.querySelectorAll(".text").forEach(el => el.remove());
  interactionScene = true;
  container.style.backgroundImage = "url('landing.png')";
  const title = document.createElement("div");
  title.className = "text interaction-title";
  title.innerText = "이 동작은";
  container.appendChild(title);
}

// 4. 클릭 이벤트 리스너
window.addEventListener("click", (e) => {
  const center = window.innerWidth / 2;

  // [A] 실제 게임 인터랙션 중
  if (interactionScene) {
    clickCount++;
    const text = document.createElement("div");
    text.className = "interaction-text";
    text.innerText = "힘이 필요하다";
    text.style.color = "#00FFFB"; 
    const scale = Math.max(window.innerWidth / 1728, window.innerHeight / 1117);
    text.style.left = ((e.clientX / scale) + 35) + "px";
    text.style.top = ((e.clientY / scale) + 25) + "px";
    container.appendChild(text);
    checkNextStage();
    return;
  }

  // [B] 규칙 설명 중 (색상 가변 로직 반영)
  if (ruleScene) {
    ruleIndex++;
    if (ruleIndex >= ruleTexts.length) {
      ruleScene = false;
      startInteractionScene();
      return;
    }

    const el = addText("text rule-" + ruleIndex, ruleTexts[ruleIndex]);

    // 각 요소 찾기 (색상 변경을 위해)
    const clickWord = document.querySelector(".rule-1");
    const orWord = document.querySelector(".rule-2");
    const dragWord = document.querySelector(".rule-3");

    // --- 인덱스별 스타일 및 실시간 색상 변경 ---
    if (ruleIndex === 0) { // 규칙
      el.style.fontSize = "430px"; el.style.color = "#00FBFF"; el.style.top = "3%"; el.style.left = "5%"; 
    }
    if (ruleIndex === 1) { // 클릭
      el.style.fontSize = "200px"; el.style.color = "#00FBFF"; el.style.top = "5%"; el.style.left = "50%"; 
    }
    if (ruleIndex === 2) { // 또는
      el.style.fontSize = "200px"; el.style.color = "#00FBFF"; el.style.top = "5%"; el.style.left = "72%"; 
      if (clickWord) clickWord.style.color = "#00FF22"; // 클릭 색 변경
    }
    if (ruleIndex === 3) { // 드래그
      el.style.fontSize = "200px"; el.style.color = "#00FBFF"; el.style.top = "24%"; el.style.left = "50%"; 
      if (clickWord) clickWord.style.color = "#FF00BF"; // 클릭 색 변경
    }
    if (ruleIndex === 4) { // 에 따라
      el.style.fontSize = "200px"; el.style.color = "#00FBFF"; el.style.top = "48%"; el.style.left = "6%"; el.style.letterSpacing = "10px"; 
      if (clickWord) clickWord.style.color = "#EAFF00"; // 클릭 색 변경
      if (dragWord) dragWord.style.color = "#FF0004";   // 드래그 색 변경
    }
    if (ruleIndex === 5) { // 이 동작을
      el.style.fontSize = "200px"; el.style.color = "#00FBFF"; el.style.top = "48%"; el.style.left = "46%"; el.style.letterSpacing = "10px"; 
      if (clickWord) clickWord.style.color = "#FF0004"; // 클릭 색 변경
      if (dragWord) dragWord.style.color = "#EAFF00";   // 드래그 색 변경
    }
    if (ruleIndex === 6) { // 만들어보세요.
      el.style.fontSize = "286px"; el.style.color = "#00FBFF"; el.style.top = "70%"; el.style.left = "5%"; 
      if (clickWord) clickWord.style.color = "#00FF22"; // 클릭 색 변경
      if (dragWord) dragWord.style.color = "#FF00BF";   // 드래그 색 변경
    }
    return;
  }

  // [C] 드래그 인트로
  if (resetScene) {
    if (resetIndex < resetSceneTexts.length - 1) {
      resetIndex++;
      addText("text t" + resetIndex + " drag-scene", resetSceneTexts[resetIndex]);
    } else {
      const dragText = document.querySelector(".t2");
      const flexText = document.querySelector(".t4");
      const idaText = document.querySelector(".t5");

      if (dragText && dragColorIndex < dragColors.length) {
        dragText.style.color = dragColors[dragColorIndex];
        if (flexText && idaText) {
          flexText.classList.add("drag-wrap");
          flexText.innerHTML = `<span class="drag-word">${dragWordChanges[dragColorIndex]}</span><span class="drag-ida">이다.</span>`;
          flexText.style.display = "flex";
          idaText.style.display = "none";
        }
        dragColorIndex++;
      } else {
        startRuleScene();
      }
    }
    return;
  }

  // [D] Scene 2
  if (scene === 2) {
    secondIndex++;
    if (secondIndex < secondScene.length) {
      addText("text s" + secondIndex, secondScene[secondIndex]);
      const clickWord = document.querySelector(".s0");
      const countWord = document.querySelector(".s1");
      if (secondIndex === 2) { if (clickWord) clickWord.style.color = "#00FF22"; if (countWord) countWord.style.color = "#00FF22"; }
      if (secondIndex === 3) { if (clickWord) clickWord.style.color = "#FF00BF"; if (countWord) countWord.style.color = "#FF00BF"; }
      if (secondIndex === 4) { if (clickWord) clickWord.style.color = "#FFF200"; if (countWord) countWord.style.color = "#FFF200"; }
      if (secondIndex === 5) { if (clickWord) clickWord.style.color = "#FF0004"; if (countWord) countWord.style.color = "#FF0004"; }
      return;
    }
    if (secondIndex >= secondScene.length) {
      document.querySelectorAll(".text").forEach(el => el.remove());
      scene = 0;
      resetScene = true;
      resetIndex = -1;
    }
    return;
  }

  // [E] Scene 1 (수정 포인트 반영)
  if (scene === 1) {
    if (e.clientX > center) {
      if (index < texts.length - 1) {
        index++;
        addText("text t" + index, texts[index]);
      } else {
        const clickText = document.querySelector(".t2");
        const strengthText = document.querySelector(".t4");
        const powerText = document.querySelector(".t5"); // "힘이다."

        if (clickText && colorIndex < wordChanges.length) {
          // 영어 단어가 나올 때 "힘이다." 즉시 제거
          if (powerText) powerText.style.display = "none";

          clickText.style.color = clickColors[colorIndex];
          if (strengthText) {
            strengthText.innerHTML = `<div class="drag-group"><span class="english-word">${wordChanges[colorIndex]}</span><span class="ida-word">이다.</span></div>`;
          }

          colorIndex++;
          if (colorIndex >= wordChanges.length) {
            setTimeout(() => {
              document.querySelectorAll(".text").forEach(el => el.remove());
              scene = 2;
              secondIndex = -1;
            }, 0); 
          }
          return;
        }
      }
    } else {
      if (index >= 0) { removeLastText(); index--; }
    }
  }
});

// 5. 드래그 로직
window.addEventListener("mousemove", (e) => {
  if (!interactionScene || e.buttons !== 1) return;
  const dx = e.clientX - lastDragX;
  const dy = e.clientY - lastDragY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 80) return; 

  lastDragX = e.clientX; 
  lastDragY = e.clientY;

  const text = document.createElement("div");
  text.className = "interaction-text";
  text.innerText = "유연성이 필요하다";
  text.style.color = "#00FF22"; 
  const scale = Math.max(window.innerWidth / 1728, window.innerHeight / 1117);
  text.style.left = ((e.clientX / scale) + 35) + "px";
  text.style.top = ((e.clientY / scale) + 25) + "px";
  container.appendChild(text);
  
  dragDuration += 0.15;
  checkNextStage();
});

window.addEventListener("mouseup", () => { isDragging = false; });

// 6. 마무리 로직
function checkNextStage() {
  let isStageComplete = false;
  if (currentInteractionStage === 1 && clickCount >= GOAL_CLICK) isStageComplete = true;
  if (currentInteractionStage === 2 && dragDuration >= GOAL_DRAG) isStageComplete = true;
  if (currentInteractionStage === 3 && clickCount >= 10 && dragDuration >= 5) isStageComplete = true;
  
  if (isStageComplete) {
    document.querySelectorAll(".interaction-text").forEach(t => t.remove());
    if (currentInteractionStage < 3) {
      currentInteractionStage++; clickCount = 0; dragDuration = 0;

      if (currentInteractionStage === 2) {
        container.style.backgroundImage = "url('interaction-2.png')";
      } else if (currentInteractionStage === 3) {
        container.style.backgroundImage = "url('Chakrasana.png')";
      }
      alert(currentInteractionStage + "단계 시작!");
    } else { completeAllStages(); }
  }
}

function completeAllStages() { alert("완료!"); window.location.href = "final.html"; }

function resize() {
  const scale = Math.max(window.innerWidth / 1728, window.innerHeight / 1117);
  container.style.transform = `scale(${scale})`;
}
window.addEventListener("resize", resize);
resize();