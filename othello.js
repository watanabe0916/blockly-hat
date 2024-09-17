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

let waitingTurnSelectActor;
let waitingTurnSelectReturn;

let waitingActor; // クリックを待っているアクター
let waitingReturn; // クリックを待っている戻り先
let userSente; // undefined, true, or false


// let usersente = 1; //人間の手番 先手ボタンを押したらtrue, 後手ボタンを押したらfalseが入るグローバル変数
//let done = [];
// スタート画面でマスの数が選択された時の処理
/*function start(e) {
  cells = Number(e.target.id);
  console.log(Number(e.target.id));
  board.innerHTML = "";
  Init();
  modal.classList.add("hide");
}*/


function boardnum(num){
  cells = num;
  board.innerHTML = "";
  turn = true;
  Init();
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
function Init() {
  for (let i = 0; i < cells; i++) {
    const tr = document.createElement("tr");
    data[i] = Array(cells).fill(0);
    for (let j = 0; j < cells; j++) {
      const td = document.createElement("td");
      const disk = document.createElement("div");
      tr.appendChild(td);
      td.appendChild(disk);
      td.className = "cell";
      //td.onclick = clickedPromise;
      td.onclick = clicked;
      
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
console.log("turnselect前");

turnSelect();

console.log("turnselect done");

Init();
console.log("Init done");
console.log("aaa");
showTurn();
console.log("showTurn done");
//await waitforclick();

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
  numBlack = nums[1];
  // numEmpty = nums[2];

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

  // let blacDisk = checkReverse(BLACK);

  // let whiteDisk = checkReverse(WHITE);
  // // if (turn == false){
  // //   turnCPU();
  // // }

  // if (numWhite + numBlack === cells * cells || (!blacDisk && !whiteDisk)) {
  //   if (numBlack > numWhite) {
  //     document.getElementById("numBlack").textContent = numBlack + numEmpty;
  //     h2.textContent = "黒の勝ち!!";
  //     restartBtn();
  //     //showAnime();
  //   } else if (numBlack < numWhite) {
  //     document.getElementById("numWhite").textContent = numWhite + numEmpty;
  //     h2.textContent = "白の勝ち!!";
  //     restartBtn();
  //     //showAnime();
  //   } else {
  //     h2.textContent = "引き分け";
  //     restartBtn();
  //     //showAnime();
  //   }
  //   return;
  // }
  // if (!blacDisk && turn) {
  //   h2.textContent = "黒スキップ";
  //   //showAnime();
  //   turnChange;
  //   setTimeout(showTurn, 2000);
  //   return;
  // }
  // if (!whiteDisk && !turn) {
  //   h2.textContent = "白スキップ";
  //   //showAnime();
  //   turnChange;
  //   setTimeout(showTurn, 2000);
  //   return;
  // }
}

// マスがクリックされた時の処理
// function clicked() {
//   //console.log("clicked done");
//   //done = 1;
//   if (usersente == 1){
//     window.alert("先手か後手かを選択してください");
//     return;
//   }
//   const color = turn ? BLACK : WHITE;
//   //console.log(this);
//   const y = this.parentNode.rowIndex;
//   const x = this.cellIndex;

//   firstCheck(x,y,color);
// }
//マスにおけるかチェック
function firstCheck(x,y,color){
  if (data[y][x] !== 0) {
    return;
  }
  const result = checkPut(x, y, color,data);
  if (result.length > 0) {
    result.forEach((value) => {
      console.log(value[0],value[1]);
      putDisc(value[0], value[1], color);
    });
    turnChange();
  }
  // showTurn();
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
      td.onclick = clicked;
      // td.onclick = clicked;
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
  // let player = true;
  sente.classList.remove("hide");
  gote.classList.remove("hide");
  sente.addEventListener('click',function(){
    console.log("sente");
    sente.classList.add("hide");
    gote.classList.add("hide");
    // usersente = true;//人間の手番は黒
    
    // returnTurnSelect(HatInterpreter.True);
    returnTurnSelect(true);
  });
  gote.addEventListener('click',function(){
    console.log("gote");
    sente.classList.add("hide");
    gote.classList.add("hide");
    // usersente = false;  //人間の手番は白
    
    // returnTurnSelect(HatInterpreter.False);
    returnTurnSelect(false);
  });
  
}

//現在の手番の情報を返す
function returnTurn(){
  return turn;
}

//ゲームの終了条件を満たすか判定
function finishGame(){
  let cnt = BoardCount();
  let turnPossibility = turnPut();
  let opponentPossibility = opponentPut();
  if(cnt[0] + cnt[1] === cells * cells || !turnPossibility && !opponentPossibility){
    
    return true; //ゲームの終了条件を満たした
  } else {
    return false; //ゲームの終了条件を満たしていない
  }
}

//現在手番時に石を置く場所があるかチェック
function turnPut(){
  let turnPossibility;
  if (turn) {
    turnPossibility = checkReverse(BLACK);
    console.log(turnPossibility);
  } else {
    turnPossibility = checkReverse(WHITE);
    console.log(turnPossibility);
  }
  return turnPossibility;
}

//相手の手番時に石を置く場所があるかチェック
function opponentPut(){
  let opponentPossibility;
  if (turn) {
    opponentPossibility = checkReverse(WHITE);
    console.log(opponentPossibility);
  } else {
    opponentPossibility = checkReverse(BLACK);
    console.log(opponentPossibility);
  }
  return opponentPossibility;
}

//CPUの暫定的な処理(暫定CPU)
//次の一手で取り得る盤面のリストからランダムに1つ選択
//戻り値の有無や処理内容を編集してもらって構わない
function turnCPU(){
  let candidates = moves(data);
  
  //firstCheck(candidates[i],turn);
  printBoard(candidates[Math.floor(Math.random()*candidates.length)]);
  console.log("printBoard done");
  turnChange();
  //console.log("turnChange done");

  return;
}

//スキップ表示
function skip(){
  h2.textContent = turn ? "白スキップ":"黒スキップ";
  showTurn();
}

//手番を交代する
function turnChange(){
  turn = !turn;
  console.log("turnchange done :次は" + turn + "\n");
  showTurn();
}

//ゲーム終了後、勝敗を表示
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
    document.getElementById("numBlack").textContent = numBlack;
    h2.textContent = "黒の勝ち!!";
    restartBtn();
    //showAnime();
  } else if (numBlack < numWhite) {
    document.getElementById("numWhite").textContent = numWhite;
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

//util.sch 330行目で呼び出される関数
function waitTurnSelect(ret){
  waitingTurnSelectActor = HatInterpreter.getCurrentActor();
  waitingTurnSelectReturn = ret;
}

function returnTurnSelect(user_sente){
  userSente = user_sente;
  HatInterpreter.startTask(waitingTurnSelectActor, waitingTurnSelectReturn, [user_sente? HatInterpreter.True : HatInterpreter.False]);

}

//util.sch 334行目で呼び出される関数
function waitClick(ret){
  waitingActor = HatInterpreter.getCurrentActor( );
  waitingReturn = ret;
}

//人間のプレイヤーが手番を選択したかどうかをチェック
function isUserTurn(){
  if(userSente == true) return turn;
  if(userSente == false) return !turn;
  return false;
}

//盤面をクリックしたときの処理
function clicked(){
  if(!isUserTurn()) return;
  
  const color = turn ? BLACK : WHITE;
  
  const y = this.parentNode.rowIndex;
  const x = this.cellIndex;
  firstCheck(x,y,color);

  HatInterpreter.startTask(waitingActor, waitingReturn, [x,y]);
}

//反復構造ブロックテスト用ブロックの処理定義
function TestLoopOutCondition(){
  let x = TestLoopVariable();
  if (x > 3){
    return true;
  }
  else{
    return false;
  }
}

let testloopvalue = 0;
function TestLoopVariable(){
  testloopvalue += 1; 
  return testloopvalue;
}

let printtest = "テスト";
function PrintTest(testcnt){
  for (let i = 0; i < testcnt; i++){
    printtest += printtest;
  }
  
  return printtest;
}

//現在手番がユーザの手番であるか確認
function userTurncheck(){
  if(userSente == turn) return true;
  return false;
}

//関数firstcheckの作りかけ
function firstcheck2(x,y,color){
  if (data[y][x] !== 0) {
    return;
  }
  const result = checkPut(x, y, color,data);
  if (result.length > 0) {
    result.forEach((value) => {
      afterdata(value[0], value[1], color);
    });
    turnChange();
  }
  //showTurn();
};

//次の一手を打った新しい盤面情報を戻り値にもつ暫定CPUの作りかけ
function CPUput (p){
  let candidates = moves(p);
  
  //firstCheck(candidates[i],turn);
  let nextp = candidates[Math.floor(Math.random()*candidates.length)];
  // console.log("printBoard done");
  // turnChange();
  // console.log("turnChange done");
  // showTurn();
  // console.log("showTurn done");
  turnChange();
  console.log("turnChange done");

  return nextp;
}

//関数printBoardの複製
function test_printBoard(refData){
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
  showTurn();
}

function afterdata(x, y, color) {
  data[y][x] = color;
}


//三手先の盤面を返す
function thirdboard(data){
  let next = moves(data)
  let second =[];
  let third=[];
  turn=!turn;
  for (let i =0 ; i<next.length; i++){
      second.push(moves(next[i]));
      turn=turn;
      for (let j=0 ; j<second[i].length; j++){
          third.push(moves(second[i][j]));
      }
  }
  // console.log(next);
  // console.log(second);
  //console.log(third);
  return third
}





//スコアを返す(mikannsei)
function boardscore(data){
  const COLOR = turn ? BLACK : WHITE;
  //次に置く候補
  if(data.length != cells){
    window.alert("配列のサイズを確認してください");
    return;
  }
  //置いた後の盤面の情報
  let score = [];
  let score2=[];
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      const result = checkPut(x, y, COLOR,data);
      //console.log(result);
        if (result.length > 0) {
        score.push(result);
        score2.push(evaluate8[x][y]);
        //console.log(x,y);
        //console.log(evaluate8[x][y]);
        }
      };
    }
    return score2;
  }


//三手先までのmini-max
function minimax(data){
  let next = moves(data)
  let second =[];
  let third=[];
  let thirdscore=[];
  let resecond=[];
  let rethird=[];
  let lastscore=[];
  let k=0;
  turn=!turn;
  for (let i =0 ; i<next.length; i++){
      second.push(moves(next[i]));
      k=0;
      turn=turn;
      for (let j=0 ; j<second[i].length; j++){
          third.push(moves(second[i][j]));
          thirdscore.push(boardscore(second[i][j]));
          rethird.push(max(boardscore(second[i][j])));
          //console.log(thirdscore);
          //console.log(rethird);
          thirdscore=[];
          //third=[];
          //console.log(thirdscore);
          //console.log(max(thirdscore));
          //ここまでは完成（三手先の盤面のスコアを返している）
          //rethird.push(thirdscore);
          //console.log(rethird);
          // thirdscore=[];
          if (rethird.length === second[i].length){
            //console.log(maxthird);
            //console.log(rethird);
            //console.log(min(rethird));
            resecond.push(min(rethird));
            console.log(rethird);
            rethird=[];
          //   resecond.push(min(rethird));
          // //console.log(resecond);
          //   rethird=[];  
           }  

          
        }
        //console.log(i);
        // console.log(max(thirdscore[k]));
        // k=k+1;
        //console.log(thirdscore);
        //console.log(second[i].length);
        //thirdscore=[];
        //console.log(third)
        //thirdscore=[];
        //thirdscore=[];
  }
  //console.log(resecond);
  // console.log(next);
  // console.log(second);
  //console.log(third);
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (evaluate8[x][y]===max(resecond)){
        lastscore=([[x,y],max(resecond)]);
      }
    }
  }
  return lastscore
}





// //mini-maxを用いたCPU
// function minimaxturnCPU(){
//   // let candidates = moves(data);
//   //firstCheck(candidates[i],turn);
//   //printBoard(candidates[Math.floor(Math.random()*candidates.length)]);
//   printBoard(newminimax(data));
//   //console.log("printBoard done");
//   turnChange();
//   //console.log("turnChange done");

//   return;
// }


//mini-maxを用いたCPU(改良版)
function minimaxturnCPU(){
  let candidates = moves(data);
  //firstCheck(candidates[i],turn);
  //printBoard(candidates[Math.floor(Math.random()*candidates.length)]);
  if (newminimax ==true){
    printBoard(newminimax(data));
  }
  //console.log("printBoard done");
  else{
    printBoard(candidates[Math.floor(Math.random()*candidates.length)]);
  }
  turnChange();
  //console.log("turnChange done");

  return;
}


//test
function yamamoto(){
  data[0][1]=1;
  return data;
}
//
//refData[y][x] === 1

function naoya(){
  let a=[[30,10],[15,1],[12,9]];
  console.log(a.length);
  console.log(a[0]);
  console.log(a[0][0]);
  return;
}

//二次元リストの一要素目を受け取り最大値を返す
function max2(list){
  let maxlist=[];
  let maxnum = list[0][0];
  for(let k = 0;k < list.length;k++){
    if(list[k][0] >= maxnum){
      maxnum = list[k][0];
      maxlist=list[k];
    }
  }
  return maxlist;
}
//二次元リストを受け取り最小値を返す
function min2(list){
  let minlist=[];
  let minnum = list[0][0];
  for(let k = 0;k < list.length;k++){
    if(list[k][0] <= minnum){
      minnum = list[k][0];
      minlist= list[k];
    }
  }
  return minlist;
}



//mini-max最善の手を返す
function newminimax(data){
  let next = moves(data)
  let second =[];
  let third=[];
  let thirdscore=[];
  let resecond=[];
  let rethird=[];
  let lastscore=[];
  let xy1=[];
  let xy2=[];
  let t=[];
  turn=!turn;
  for (let i =0 ; i<next.length; i++){
      second.push(moves(next[i]));
      turn=turn;
      for (let j=0 ; j<second[i].length; j++){
          third.push(moves(second[i][j]));
          thirdscore.push(boardscore(second[i][j]));
          rethird.push(max(boardscore(second[i][j])));
          xy1.push([max(boardscore(second[i][j])),i]);
          //console.log(xy1);
          thirdscore=[];
          if (rethird.length === second[i].length){
            resecond.push(min(rethird));
            //console.log(xy1);
            xy2.push(min2(xy1));
            //console.log(resecond);
            //console.log(xy2);
            xy1=[];
            rethird=[];
           }    
           //console.log(i);
        }
  }
  //console.log(max2(xy2));
  turn=!turn;
  // console.log(moves(data)[max2(xy2)[1]]);
  return moves(data)[max2(xy2)[1]]
  // for (let x = 0; x < cells; x++) {
  //   for (let y = 0; y < cells; y++) {
  //     if (evaluate8[x][y]===max(resecond)){
  //       lastscore=([[x,y],max(resecond)]);
  //     }
  //   }
  // }
  // return lastscore
}


function saiki(a){
  if (a<=20){
  a=a+2;
  console.log(a);
  return saiki(a)
  }
}

function saiki2(a,count){
  console.log(a,count);
  count+=1;
  a=a*2;
  if(count<=15){
    return saiki2(a,count);
  }
  }



//評価値を返す
function Test(x,y){
  return evaluate8[x][y];
}



