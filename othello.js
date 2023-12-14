"use strict";

//オセロ盤面左上(x,y) = (0,0)
//data[y][x]に注意
const BLACK = 1,
 WHITE = -1;
let data = [];
let hatData = [];
let turn = true; //true = 黒, false = 白
const board = document.getElementById("board");
const h2 = document.querySelector("h2");
const counter = document.getElementById("counter");
const modal = document.getElementById("modal");
let cells = 8; // マスの数
const test = document.getElementById("test");
const turn_select = document.getElementById("turn_select");
const sente = document.getElementById("sente");
const gote = document.getElementById("gote");
let done = [];
// スタート画面でマスの数が選択された時の処理
/*function start(e) {
  cells = Number(e.target.id);
  console.log(Number(e.target.id));
  board.innerHTML = "";
  init();
  modal.classList.add("hide");
}*/


function boardnum(num){
  cells = num;
  board.innerHTML = "";
  turn = true;
  init();
  //turnSelect();
}

// //テスト用ボタン
// test.addEventListener('click',function(){
//   firstCheck(0,1,BLACK);
//   firstCheck(0,0,WHITE);
//   console.log(data);
//   console.log(numBlack.textContent);
//   console.log(numWhite.textContent);
// });
// 初期化
function init() {
  for (let i = 0; i < cells; i++) {
    const tr = document.createElement("tr");
    data[i] = Array(cells).fill(0);
    for (let j = 0; j < cells; j++) {
      const td = document.createElement("td");
      const disk = document.createElement("div");
      tr.appendChild(td);
      td.appendChild(disk);
      td.className = "cell";
      td.onclick = click_player;
      
    }
    board.appendChild(tr);
  }
  // マスの数によって石の初期配置を変える
  switch (cells) {
    case 4:
      board.setAttribute('class', '');
      board.classList.add("cell-4");
      putDisc(1, 1, WHITE);
      putDisc(2, 2, WHITE);
      putDisc(1, 2, BLACK);
      putDisc(2, 1, BLACK);
      data.splice(4,1);
      data.splice(4,1);
      data.splice(4,1);
      data.splice(4,1);
      hatData = JSON.parse(JSON.stringify(data));
      break;
    case 6:
      board.setAttribute('class', '');     
      board.classList.add("cell-6");
      putDisc(2, 2, WHITE);
      putDisc(3, 3, WHITE);
      putDisc(2, 3, BLACK);
      putDisc(3, 2, BLACK);
      data.splice(6,1);
      data.splice(6,1);
      hatData = JSON.parse(JSON.stringify(data));
      break;
    case 8:
      board.setAttribute('class', '');
      putDisc(3, 3, WHITE);
      putDisc(4, 4, WHITE);
      putDisc(3, 4, BLACK);
      putDisc(4, 3, BLACK);
      hatData = JSON.parse(JSON.stringify(data));
  }
  //showTurn();
}

init();
showTurn();
//turnSelect();

// 石を描画
function putDisc(x, y, color) {
  board.rows[y].cells[x].firstChild.className =
    color === BLACK ? "black" : "white";
  board.rows[y].cells[x].animate(
    { opacity: [0.4, 1] },
    { duration: 700, fill: "forwards" }
  );
  data[y][x] = color;
}

// 手番などの表示
function showTurn() {
  h2.textContent = turn ? "黒の番です" : "白の番です";
  let nums = BoardCount();
  let numWhite = nums[0],
  numBlack = nums[1],
  numEmpty = nums[2];

  //盤面の石の数を数える
  // for (let x = 0; x < cells; x++) {
  //   for (let y = 0; y < cells; y++) {
  //     if (data[x][y] === WHITE) {
  //       numWhite++;
  //     }
  //     if (data[x][y] === BLACK) {
  //       numBlack++;
  //     }
  //     if (data[x][y] === 0) {
  //       numEmpty++;
  //     }
  //   }
  // }

  document.getElementById("numBlack").textContent = numBlack;
  document.getElementById("numWhite").textContent = numWhite;

  let blacDisk = checkReverse(BLACK);

  let whiteDisk = checkReverse(WHITE);

  if (numWhite + numBlack === cells * cells || (!blacDisk && !whiteDisk)) {
    if (numBlack > numWhite) {
      document.getElementById("numBlack").textContent = numBlack + numEmpty;
      h2.textContent = "黒の勝ち!!";
      restartBtn();
      //showAnime();
    } else if (numBlack < numWhite) {
      document.getElementById("numWhite").textContent = numWhite + numEmpty;
      h2.textContent = "白の勝ち!!";
      restartBtn();
      //showAnime();
    } else {
      h2.textContent = "引き分け";
      restartBtn();
      //showAnime();
    }
    return;
  }
  if (!blacDisk && turn) {
    h2.textContent = "黒スキップ";
    //showAnime();
    turnChange;
    setTimeout(showTurn, 2000);
    return;
  }
  if (!whiteDisk && !turn) {
    h2.textContent = "白スキップ";
    //showAnime();
    turnChange;
    setTimeout(showTurn, 2000);
    return;
  }
}

// マスがクリックされた時の処理
function clicked() {
  //console.log("clicked done");
  //done = 1;
  const color = turn ? BLACK : WHITE;
  const y = this.parentNode.rowIndex;
  const x = this.cellIndex;

  firstCheck(x,y,color);
}
//マスにおけるかチェック
function firstCheck(x,y,color){
  if (data[y][x] !== 0) {
    return;
  }
  const result = checkPut(x, y, color,data);
  if (result.length > 0) {
    result.forEach((value) => {
      putDisc(value[0], value[1], color);
    });
    turnChange();
  }
  showTurn();
};

// 置いたマスの周囲8方向をチェック
function checkPut(x, y, color,data) {
  let dx, dy;
  const opponentColor = color == BLACK ? WHITE : BLACK;
  let tmpReverseDisk = [];
  let reverseDisk = [];
  // 周囲8方向を調べる配列
  const direction = [
    [-1, 0], // 左
    [-1, 1], // 左下
    [0, 1], // 下
    [1, 1], // 右下
    [1, 0], // 右
    [1, -1], // 右上
    [0, -1], // 上
    [-1, -1], // 左上
  ];

  // すでに置いてある
  if (data[y][x] === BLACK || data[y][x] === WHITE) {
    return [];
  }
  // 置いた石の周りに違う色の石があるかチェック
  for (let i = 0; i < direction.length; i++) {
    dx = direction[i][0] + x;
    dy = direction[i][1] + y;
    if (
      dx >= 0 &&
      dy >= 0 &&
      dx <= cells - 1 &&
      dy <= cells - 1 &&
      opponentColor === data[dy][dx]
    ) {
      tmpReverseDisk.push([x, y]);
      tmpReverseDisk.push([dx, dy]);
      // 裏返せるかチェック
      while (true) {
        dx += direction[i][0];
        dy += direction[i][1];
        if (
          dx < 0 ||
          dy < 0 ||
          dx > cells - 1 ||
          dy > cells - 1 ||
          data[dy][dx] === 0
        ) {
          tmpReverseDisk = [];
          break;
        }
        if (opponentColor === data[dy][dx]) {
          tmpReverseDisk.push([dx, dy]);
        }
        if (color === data[dy][dx]) {
          reverseDisk = reverseDisk.concat(tmpReverseDisk);
          tmpReverseDisk = [];
          break;
        }
      }
    }
  }
  
  return reverseDisk;
}

// 裏返せる場所があるか確認
function checkReverse(color) {
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      const result = checkPut(x, y, color,data);
      //console.log(result);
      if (result.length > 0) {
        return true;
      }
    }
  }
  return false;
}

// ゲーム終了画面
function restartBtn() {
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.classList.remove("hide");
  restartBtn.animate(
    { opacity: [1, 0.5, 1] },
    { delay: 2000, duration: 3000, iterations: "Infinity" }
  );

  restartBtn.addEventListener("click", () => {
    //document.location.reload();
    boardnum(8);
    restartBtn.classList.add("hide");
  });
}
/*function showAnime() {
  h2.animate({ opacity: [0, 1] }, { duration: 500, iterations: 4 });
}*/



//次に置く候補と置いた後の盤面(分解可能)
function moves(data){
  const COLOR = turn ? BLACK : WHITE;
  //ディープコピー
  //let copyBoard = JSON.parse(JSON.stringify(data));
  //次に置く候補
  let can_put = [];
  if(data.length != cells){
    window.alert("配列のサイズを確認してください");
    return;
  }
  //置いた後の盤面の情報
  let after_board = [];
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      const result = checkPut(x, y, COLOR,data);
      //console.log(result);
      if (result.length > 0) {
        let copyBoard = JSON.parse(JSON.stringify(data));
        //console.log(copyBoard);
        for(let i=0;i<result.length;i++){
          //resultをcopyBoard[y][x]に上書き
          copyBoard[result[i][1]][result[i][0]] = COLOR;
        };
        after_board.push(copyBoard);     
        can_put.push(result);
      };
    }
  }
  return after_board;
  //console.log(after_board);
  //console.log(can_put,COLOR);
};



//refrectBoard用初期化
function refInit() {
  
  for (let i = 0; i < cells; i++) {
    const tr = document.createElement("tr");
    data[i] = Array(cells).fill(0);
    for (let j = 0; j < cells; j++) {
      const td = document.createElement("td");
      const disk = document.createElement("div");
      tr.appendChild(td);
      td.appendChild(disk);
      td.className = "cell";
      td.onclick = turnPlayer;
    }
    board.appendChild(tr);
  }
  switch (cells) {
    case 4:
      board.setAttribute('class', '');
      board.classList.add("cell-4");
      data.splice(4,1);
      data.splice(4,1);
      data.splice(4,1);
      data.splice(4,1);
      break;
    case 6:
      board.setAttribute('class', '');     
      board.classList.add("cell-6");
      data.splice(6,1);
      data.splice(6,1);
      break;
    case 8:
      board.setAttribute('class', '');
  }
}


//盤面情報配列と次の手番を受け取り、オセロ盤面に反映させる
function printBoard(refData){
  //console.log("done");
  cells = refData.length;
  board.innerHTML = "";
  let numBlack = 0;
  let numWhite = 0;
  refInit();

  // if(refTurn === BLACK){
  //   turn = true; 
  // }else{
  //   turn = false;
  // }

  for(let x = 0;x < cells;x++){
    for(let y = 0;y < cells;y++){
      if(refData[y][x] === 1){ //黒の場合
        putDisc(x,y,BLACK);
        numBlack++;
      }else if(refData[y][x] === -1){  //白の場合
        putDisc(x,y,WHITE);
        numWhite++;
      }
    }
  }
  //turn = !turn;
  //console.log(turn);
  //showTurn();
}

let testdata4 = [];
testdata4[0] = [-1, -1, -1, 1];
testdata4[1] = [0, -1, 1, -1];
testdata4[2] = [0, 0, 0, 0];
testdata4[3] = [1, -1, 1, 1];

let testdata8 = [];
testdata8[0] = [1, 1, 1, 1, 0, 0, 0, 0];
testdata8[1] = [1, -1, 1, 1, 1, 0, 0, 0];
testdata8[2] = [-1, -1, -1, 1, 0, 0, 0, 0];
testdata8[3] = [0, -1, 1, -1, 1, 0, 0, 0];
testdata8[4] = [0, 0, -1, -1, -1, 0, 0, 0];
testdata8[5] = [0, 0, 0, 0, 0, 0, 0, 0];
testdata8[6] = [0, 0, 0, 0, 0, 0, 0, 0];
testdata8[7] = [0, 0, 0, 0, 0, 0, 0, 0];


const evaluate4 = [];

evaluate4[0] = [15,3,3,15];
evaluate4[1] = [3,3,3,3];
evaluate4[2] = [3,3,3,3];
evaluate4[3] = [15,3,3,15];


const evaluate6 = [];

evaluate6[0] = [-20,-40,-5,-5,-5,-5,-40,-20];
evaluate6[1] = [20,-5,15,3,3,15,-5,20];
evaluate6[2] = [5,-5,3,3,3,3,-5,5];
evaluate6[3] = [5,-5,3,3,3,3,-5,5];
evaluate6[4] = [20,-5,15,3,3,15,-5,20];
evaluate6[5] = [-20,-40,-5,-5,-5,-5,-40,-20];


const evaluate8 = [];
evaluate8[0] = [120,-20,20,5,5,20,-20,120];
evaluate8[1] = [-20,-40,-5,-5,-5,-5,-40,-20];
evaluate8[2] = [20,-5,15,3,3,15,-5,20];
evaluate8[3] = [5,-5,3,3,3,3,-5,5];
evaluate8[4] = [5,-5,3,3,3,3,-5,5];
evaluate8[5] = [20,-5,15,3,3,15,-5,20];
evaluate8[6] = [-20,-40,-5,-5,-5,-5,-40,-20];
evaluate8[7] = [120,-20,20,5,5,20,-20,120];


//盤面配列を受け取り、評価値を返す
function staticBoard(staticData){
  let point = 0;
  if(staticData.length != 8){
    window.alert("配列のサイズを確認してください");
    return;
  }

  for(let x = 0;x < cells;x++){
    for(let y = 0;y < cells;y++){
      if(staticData[y][x] === 1){ //黒の場合
        // console.log(staticData[y][x],evaluate[y][x]);
        point += evaluate8[y][x];
      }
    }
  }
  return point;
}

//リストを受け取り最大値を返す
function max(list){
  let maxnum = 0;
  for(let i = 0;i < list.length;i++){
    if(list[i] > maxnum){
      maxnum = list[i];
    }
  }
  return maxnum;
}
//リストを受け取り最小値を返す
function min(list){
  let minnum = 0;
  for(let i = 0;i < list.length;i++){
    if(list[i] < minnum){
      minnum = list[i];
    }
  }
  return minnum;
}

//初期状態配列を返す
function hatStart(num){
  let redata = [];
  if(num === 4){
   redata[0] = [0, 0, 0, 0];
   redata[1] = [0, -1, 1, 0];
   redata[2] = [0, 1, -1, 0];
   redata[3] = [0, 0, 0, 0];
  }else if(num === 6){
    redata[0] = [0, 0, 0, 0, 0, 0];
    redata[1] = [0, 0, 0, 0, 0, 0];
    redata[2] = [0, 0, -1, 1, 0, 0];
    redata[3] = [0, 0, 1, -1, 0, 0];
    redata[4] = [0, 0, 0, 0, 0, 0];
    redata[5] = [0, 0, 0, 0, 0, 0];
  }else if(num === 8){
    redata[0] = [0, 0, 0, 0, 0, 0, 0, 0];
    redata[1] = [0, 0, 0, 0, 0, 0, 0, 0];
    redata[2] = [0, 0, 0, 0, 0, 0, 0, 0];
    redata[3] = [0, 0, 0, -1, 1, 0, 0, 0];
    redata[4] = [0, 0, 0, 1, -1, 0, 0, 0];
    redata[5] = [0, 0, 0, 0, 0, 0, 0, 0];
    redata[6] = [0, 0, 0, 0, 0, 0, 0, 0];
    redata[7] = [0, 0, 0, 0, 0, 0, 0, 0];    
  }
  //console.log(redata);
  return redata;
}

function returnPosition(){
  return data;
}

function turnSelect(){
  sente.classList.remove("hide");
  gote.classList.remove("hide");
  sente.addEventListener('click',function(){
    console.log("sente");
    sente.classList.add("hide");
    gote.classList.add("hide");
    
    return true;
  });
  gote.addEventListener('click',function(){
    console.log("gote");
    sente.classList.add("hide");
    gote.classList.add("hide");
    return false;
  });
}

function returnTurn(){
  return turn;
}

function finishGame(){
  let cnt = BoardCount();
  let turnPossibility = turnPut();
  let opponentPossibility = opponentPut();
  if(cnt[0] + cnt[1] === cells * cells || (!turnPossibility && !opponentPossibility)){
    
    return false; //ゲームの終了条件を満たした
  } else {
    return true; //ゲームの終了条件を満たしていない
  }
}

function turnPut(){
  let turnPossibility;
  if (turn) {
    turnPossibility = checkReverse(BLACK);
  } else {
    turnPossibility = checkReverse(WHITE);
  }
  return turnPossibility;
}

function opponentPut(){
  let opponentPossibility;
  if (turn) {
    opponentPossibility = checkReverse(WHITE);
  } else {
    opponentPossibility = checkReverse(BLACK);
  }
  return opponentPossibility;
}

async function turnPlayer(){
  const color = turn ? BLACK : WHITE;
  click_player().then((clickResult) => {
    const clickedx = clickResult.x;
    const clickedy = clickResult.y;

    firstCheck(clickedx,clickedy,color);
  }).catch((error) => {
    window.alert("errorです",error);
  });
  // let put = await clicked_Player();
  


  // let currentTurn = turn;
  // while (turn == currentTurn){
  // }
  // const color = turn ? BLACK : WHITE;
  // const y = this.parentNode.rowIndex;
  // const x = this.cellIndex;

  // firstCheck(x,y,color);
  
  // const td = document.getElementsByTagName("td");
  // console.log(td);
  
  // td.onclick = clicked;
  // console.log(td);
  // showTurn();
}

function turnCPU(){
  let candidates = moves(data);
  //firstCheck(candidates[0],turn);
  printBoard(candidates[0]);
  turnChange();
  showTurn();
}

function skip(){
  h2.textContent = turn ? "白スキップ" : "黒スキップ";
  showTurn();
}

function turnChange(){
  turn = !turn;
  
}

function showResult(){
  let numWhite = 0,
  numBlack = 0, 
  numEmpty = 0;
  
  //盤面の石の数を数える
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (data[x][y] === WHITE) {
        numWhite++;
      }
      if (data[x][y] === BLACK) {
        numBlack++;
      }
      if (data[x][y] === 0) {
        numEmpty++;
      }
    }
  }
  
  if (numBlack > numWhite) {
    document.getElementById("numBlack").textContent = numBlack + numEmpty;
    h2.textContent = "黒の勝ち!!";
    restartBtn();
    //showAnime();
  } else if (numBlack < numWhite) {
    document.getElementById("numWhite").textContent = numWhite + numEmpty;
    h2.textContent = "白の勝ち!!";
    restartBtn();
    //showAnime();
  } else {
    h2.textContent = "引き分け";
    restartBtn();
    //showAnime();
  }
}

//盤面の石と空きマスを数える
function BoardCount(){
  let count_cell = [],
  numWhite = 0,
  numBlack = 0,
  numEmpty = 0;
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (data[x][y] === WHITE) {
        numWhite++;
      }
      if (data[x][y] === BLACK) {
        numBlack++;
      }
      if (data[x][y] === 0) {
        numEmpty++;
      }
    }
  }
  count_cell[0] = numWhite;
  count_cell[1] = numBlack;
  count_cell[2] = numEmpty;

  return count_cell;
}



function click_player(){
  return new Promise((resolve) => {
    const clickHandler = function(this){
      resolve({x: this.cellIndex, y: this.parentNode.rowIndex});

      document.removeEventListener("click", clickHandler);
    };
    document.addEventListener("click", clickHandler);
  })
}
