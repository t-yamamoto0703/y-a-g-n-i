// 入力値をinputイベントで取得しているため漢字変換中でも文字が一致すれば次の問題に進みます

"use strict";

(() => {
  const QUESTION_NUMBER = 10;

  // --- DOM ---
  const UI = {
    textDisplay: document.querySelector(".text-display"),
    input: document.querySelector(".user-input"),
    startButton: document.querySelector(".start-button"),
    restartButton: document.querySelector(".restart-button"),
    otherGamesButton: document.querySelector(".other-games-button"),
    result: document.querySelector(".result"),
    status: document.querySelector(".status-display"),
    dialog: document.querySelector(".other-games-dialog"),
    resumeButton: document.querySelector(".resume-game-button"),
    stateMessage: document.querySelector(".state-message"),
  };

  // --- Game State ---
  let state = "idle"; // idle | playing | finished | dialog
  let previousState = null;
  let remaining = [];

  const setState = (next) => {
    state = next;
    renderState();
  };

  const renderState = () => {
    // UI 初期化
    UI.result.hidden = true;
    UI.dialog.hidden = true;
    UI.input.disabled = true;
    UI.startButton.disabled = false;
    UI.restartButton.disabled = false;

    switch (state) {
      case "idle":
        UI.status.textContent = "STARTボタンまたはスペースキーを押すとゲームを開始します";
        UI.stateMessage.textContent = "日本語入力モードを「オン」にしてください";
        UI.textDisplay.textContent = "";
        break;

      case "playing":
        UI.input.disabled = false;
        UI.startButton.disabled = true;
        UI.restartButton.disabled = true;
        UI.stateMessage.textContent = "日本語入力モードを「オン」にしてください";
        UI.input.focus();
        break;

      case "finished":
        UI.result.hidden = false;
        UI.textDisplay.textContent = "";
        UI.status.textContent = "STARTボタンまたはスペースキーを押すとゲームを再開します";
        UI.stateMessage.textContent = "日本語入力モードを「オン」にしてください";
        break;

      case "dialog":
        UI.dialog.hidden = false;
        UI.stateMessage.textContent = "スペースキーでゲームに戻ります";
        break;
    }
  };

  // --- Game Logic ---
  const startGame = () => {
    remaining = shuffleArray(texts).slice(0, QUESTION_NUMBER);
    UI.input.value = "";
    setState("playing");
    showNextText();
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const showNextText = () => {
    const current = UI.input.value;

    if (remaining.length === 0) {
      setState("finished");
      return;
    }

    UI.textDisplay.textContent = remaining.shift();
    const target = UI.textDisplay.textContent;
    UI.status.textContent = `(${current.length}/${target.length})　勝利まで残り${remaining.length + 1}問`;
  };

  // --- Input Handling ---
  UI.input.addEventListener("input", () => {
    if (state !== "playing") return;

    const target = UI.textDisplay.textContent;
    const current = UI.input.value;

    UI.status.textContent = `(${current.length}/${target.length})　勝利まで残り${remaining.length + 1}問`;

    if (target.startsWith(current)) {
      UI.input.style.backgroundColor = "";
    }

    console.log("解答文字列：\n", target);
    console.log("", current);

    if (current === target) {
      UI.input.value = "";
      showNextText();
      UI.input.style.backgroundColor = "#e0f0ff";
      setTimeout(() => (UI.input.style.backgroundColor = ""), 100);
    } else if (!target.startsWith(current)) {
      UI.input.style.backgroundColor = "#ffe0e060";
    }
  });

  // --- Dialog ---
  const openOtherGamesDialog = () => {
    previousState = state;
    setState("dialog");

    UI.resumeButton.onclick = () => {
      setState(previousState);
    };
  };

  // --- Keyboard ---
  document.addEventListener("keydown", (event) => {
    if (state === "dialog" && event.code === "Space") {
      setState(previousState);
      event.preventDefault();
      return;
    }
    if (state !== "idle" && state !== "finished") return;
    if (event.code === "Space") {
      startGame();
      event.preventDefault();
    }
  });

  // --- Buttons ---
  UI.startButton.addEventListener("click", startGame);
  UI.otherGamesButton.addEventListener("click", openOtherGamesDialog);
  UI.restartButton.addEventListener("click", startGame);

  // --- Text Data ---
  const texts = [
    "「ヤツは無理だ」という世界的な合意",
    "組織が期待する正常に対する外れ値",
    "アクセシビリティに対応しきれない現実",
    "助けられる事と助けたい事の違い",
    "一般閃光閾値及び赤色閃光閾値",
    "どの一秒間においても三回を超えない閃光",
    "他者の理解とは無関係な行動原理",
    "恒星の阿頼耶識が夢見る十兆年後の孤独",
    "意味のない選択肢を与え続けられる意味のない呪い",
    "深海魚さえ死滅した海",
    "精神の抜け殻となった肉体",
    "サルコペニアの境界",
    "裾が重い分布",
    "石裏に生きる命達の慟哭",
    "国際死因分類",
    "脳内に固着したストレス",
    "常時鳴り続ける意味のない警報",
    "黄色い救急車",
    "世界の記憶として刻まれた痛み",
    "正義を執行する鉄の塊",
    "迫害を見て沈黙する世界",
    "迫害は地獄の一丁目",
    "沈黙は暴力を加速する",
    "人間を飼い慣らすための懲罰",
    "海の底に没した九つの世界",
    "理解しない事を前提にした役割分担",
    "星の名も知らないまま見つけられたオリオン座のリゲル",
    "ホンエビ上目エビ目エビ亜目ヤドカリ下目ヤドカリ上科ほぼカニ",
    "麓では売られない不格好な野菜達の特売",
    "誰かを助けるためには自分が救われていなければならない",
  ];
})();
