"use strict";

/* для тестов
let iKnowSideOfField = 10; */

let iKnowSideOfField = findSideField();
let snakeBody = [];
let direction = "right";
let snakeSpeed = 500;
let snakeTimer;
let score = 0;
let myRecord = 0;

let btnRestart;
let btnRecordClear;
let steps = false;
let target;
let coordinatesTarget = generateTarget();

function initGame() {
  // Скрываем кнопки рестарта и обнуления рекорда
  btnRestart = document.getElementById("btn");
  btnRestart.classList.add("btn--invisible");
  btnRecordClear = document.getElementById("btnClear");
  btnRecordClear.classList.add("btn--invisible");

  createField(iKnowSideOfField);
  startGame();
  // Храним рекорд в localStorage
  document.addEventListener("DOMContentLoaded", () => {
    myRecord = localStorage.getItem("myRecord");
    if (myRecord) getRecordInHtml();
  });
  // Обнуляем рекорд при желании
  myRecord = localStorage.getItem("myRecord");
  document.getElementById("btnClear").addEventListener("click", () => {
    localStorage.clear();
    console.log("Данные удалены");
  });
  document.getElementById("btn").addEventListener("click", restartGame);
  addEventListener("keydown", changeDirectionSnake);
}

function startGame() {
  createSnake();
  snakeTimer = setInterval(() => move(), snakeSpeed);
  createTarget();
}

function restartGame() {
  location.reload();
}

// Узнаем у игрока размер игрового поля не более 30, 10 по умолчанию
function findSideField() {
  let sideField = prompt("Введите размер игрового поля (*не более 30)", 10);
  while (
    sideField === null ||
    sideField.trim() === "" ||
    sideField < 10 ||
    sideField > 30
  ) {
    alert(
      "Поле не соответствует рекомендованному размеру, введите другое число"
    );
    sideField = prompt("Введите размер игрового поля (*не более 30)", 10);
  }
  sideField = Number(sideField);
  return sideField;
}

// Создаем игровое поля с заданными игроком размерами
function createField(iKnowSideOfField) {
  let gameField = document.querySelector(".game-field");
  gameField.style.setProperty("--sideField", iKnowSideOfField);

  for (let i = 1; i < iKnowSideOfField ** 2 + 1; i++) {
    let cell = document.createElement("div");
    gameField.appendChild(cell);
    cell.classList.add("cell");
  }

  let cell = document.getElementsByClassName("cell");
  let x = 1,
    y = iKnowSideOfField;
  for (let i = 0; i < cell.length; i++) {
    if (x > iKnowSideOfField) {
      x = 1;
      y--;
    }
    cell[i].setAttribute("data-x", x);
    cell[i].setAttribute("data-y", y);
    x++;
  }

  return document.querySelector(".game-field");
}

// Создаем змейку
function createSnake() {
  let snakeStartX = Math.floor(iKnowSideOfField / 2);
  let snakeStartY = snakeStartX;
  let coordinatesStartSnake = [snakeStartX, snakeStartY];
  snakeBody = [
    document.querySelector(
      '[data-x = "' +
        coordinatesStartSnake[0] +
        '"][data-y = "' +
        coordinatesStartSnake[1] +
        '"]'
    ),
    document.querySelector(
      '[data-x = "' +
        (coordinatesStartSnake[0] - 1) +
        '"][data-y = "' +
        coordinatesStartSnake[1] +
        '"]'
    ),
  ];

  for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].classList.add("snake-unit");
  }
  snakeBody[0].classList.add("snake-head");
}

function move() {
  let coordinatesSnake = [
    snakeBody[0].getAttribute("data-x"),
    snakeBody[0].getAttribute("data-y"),
  ];
  snakeBody[0].classList.remove("snake-head");
  snakeBody[snakeBody.length - 1].classList.remove("snake-unit");
  snakeBody.pop();
  if (direction == "right") {
    if (coordinatesSnake[0] < iKnowSideOfField) {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "' +
            (+coordinatesSnake[0] + 1) +
            '"][data-y = "' +
            coordinatesSnake[1] +
            '"]'
        )
      );
    } else {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "1"][data-y = "' + coordinatesSnake[1] + '"]'
        )
      );
    }
  } else if (direction == "left") {
    if (coordinatesSnake[0] > 1) {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "' +
            (coordinatesSnake[0] - 1) +
            '"][data-y = "' +
            coordinatesSnake[1] +
            '"]'
        )
      );
    } else {
      snakeBody.unshift(
        document.querySelector(
          `[data-x = "${iKnowSideOfField}"][data-y = "` +
            coordinatesSnake[1] +
            `"]`
        )
      );
    }
  } else if (direction == "up") {
    if (coordinatesSnake[1] < iKnowSideOfField) {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "' +
            coordinatesSnake[0] +
            '"][data-y = "' +
            (+coordinatesSnake[1] + 1) +
            '"]'
        )
      );
    } else {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "' + coordinatesSnake[0] + '"][data-y = "1"]'
        )
      );
    }
  } else if (direction == "down") {
    if (coordinatesSnake[1] > 1) {
      snakeBody.unshift(
        document.querySelector(
          '[data-x = "' +
            coordinatesSnake[0] +
            '"][data-y = "' +
            (coordinatesSnake[1] - 1) +
            '"]'
        )
      );
    } else {
      snakeBody.unshift(
        document.querySelector(
          `[data-x = "` +
            coordinatesSnake[0] +
            `"][data-y = "${iKnowSideOfField}"]`
        )
      );
    }
  }

  if (
    snakeBody[0].getAttribute("data-x") == target.getAttribute("data-x") &&
    snakeBody[0].getAttribute("data-y") == target.getAttribute("data-y")
  ) {
    target.classList.remove("target");
    let a = snakeBody[snakeBody.length - 1].getAttribute("data-x");
    let b = snakeBody[snakeBody.length - 1].getAttribute("data-y");
    snakeBody.push(
      document.querySelector('[data-x = "' + a + '"][data-y = "' + b + '"]')
    );
    createTarget();
    score++;
  }

  if (!snakeBody[0].classList.contains("snake-unit")) {
    getScoreInHtml();
    getRecordInHtml();
  } else finishGame();

  snakeBody[0].classList.add("snake-head");
  for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].classList.add("snake-unit");
  }
  steps = true;
}

function changeDirectionSnake(e) {
  if (steps == true) {
    if (e.key === "ArrowLeft" && direction != "right") {
      direction = "left";
      steps = false;
    } else if (e.key === "ArrowUp" && direction != "down") {
      direction = "up";
      steps = false;
    } else if (e.key === "ArrowRight" && direction != "left") {
      direction = "right";
      steps = false;
    } else if (e.key === "ArrowDown" && direction != "up") {
      direction = "down";
      steps = false;
    }
  }
}

// Генерируем координаты target
function generateTarget() {
  let targetCellX = Math.round(Math.random() * (iKnowSideOfField - 1) + 1);
  let targetCellY = Math.round(Math.random() * (iKnowSideOfField - 1) + 1);
  return [targetCellX, targetCellY];
}

//  Создаем target
function createTarget() {
  coordinatesTarget = generateTarget();
  target = document.querySelector(
    '[data-x = "' +
      coordinatesTarget[0] +
      '"][data-y = "' +
      coordinatesTarget[1] +
      '"]'
  );
  while (target.classList.contains("snake-unit")) {
    coordinatesTarget = generateTarget();
    target = document.querySelector(
      '[data-x = "' +
        coordinatesTarget[0] +
        '"][data-y = "' +
        coordinatesTarget[1] +
        '"]'
    );
  }
  target.classList.add("target");
}

function getScoreInHtml() {
  let scoreInHtml = document.getElementById("score");
  scoreInHtml.innerHTML = score;
}

function getRecordInHtml() {
  let recordInHtml = document.getElementById("record");
  recordInHtml.innerHTML = myRecord;
}

function finishGame() {
  // Возвращаем кнопки назад
  btnRestart.classList.remove("btn--invisible");
  btnRecordClear.classList.remove("btn--invisible");
  // Проверяем на рекорд
  if (score >= myRecord) {
    alert("Новый рекорд!!! " + score);
    localStorage.setItem("myRecord", score);
  } else {
    localStorage.setItem("myRecord", myRecord);
  }

  clearInterval(snakeTimer);
  setTimeout(() => {
    alert("Игра закончена, Вы собрали " + score + " шт. Пикачу");
  }, 200);
  console.log("Игра закончена, Вы собрали " + score + " шт. Пикачу");
}

window.onload = initGame;
