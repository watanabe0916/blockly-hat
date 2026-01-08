//ブロック追加時
// Blockly.defineBlocksWithJsonArray([
//   /* ここにJSONファイルの内容をコピー */
// ]);

// mainエリア

//ループ終了条件

if (typeof Hat === 'undefined') {
  var Hat = {};
}
Hat.ORDER_NONE = 0;
Hat.ORDER_FUNCTION_CALL = 2;

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "finishGame",
    "message0": "ゲームの終了条件を満たす",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['finishGame'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"finishGame"';
  //code += ' '+'^(result)\n';
  return code;
};

//手番の石が置ける
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "turnPut",
    "message0": "手番プレイヤーの石が置ける",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['turnPut'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"turnPut"';
  //code += ' '+'^(turnPossibility)\n';
  return code;
};

//相手の石が置ける
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "opponentPut",
    "message0": "相手プレイヤーの石が置ける",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['opponentPut'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"opponentPut"';
  //code += ' '+'^(opponentPossibility)\n';
  return code;
};


//盤面表示
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "printboard",
    "message0": "盤面表示",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['printboard'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"printBoard"';
  code += ' ' + '^(dummy)\n';
  return code;
};

//break
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "break",
    "message0": "break",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['break'] = function (block) {
  // TODO: Assemble Hat into code variable.

  let code = 'break';
  code += ' ' + '^()';
  return code;
};

//先手・後手選択
Blockly.defineBlocksWithJsonArray([

  {
    "type": "turn_select",
    "message0": "手番選択",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
]);

Blockly.Hat['turn_select'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = "turnSelect ^(userSente)\n";
  return code;
};


Blockly.defineBlocksWithJsonArray(

  [{
    "type": "othello_put",
    "message0": "オセロ盤面 : ( %1 %2 %3 , %4 %5 %6 ) に %7 %8 %9 を置く",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "board_x",
        "options": [
          [
            "0",
            "0"
          ],
          [
            "1",
            "1"
          ],
          [
            "2",
            "2"
          ],
          [
            "3",
            "3"
          ],
          [
            "4",
            "4"
          ],
          [
            "5",
            "5"
          ],
          [
            "6",
            "6"
          ],
          [
            "7",
            "7"
          ],
          [
            "x",
            "x"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "board_y",
        "options": [
          [
            "0",
            "0"
          ],
          [
            "1",
            "1"
          ],
          [
            "2",
            "2"
          ],
          [
            "3",
            "3"
          ],
          [
            "4",
            "4"
          ],
          [
            "5",
            "5"
          ],
          [
            "6",
            "6"
          ],
          [
            "7",
            "7"
          ],
          [
            "y",
            "y"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "color",
        "options": [
          [
            "黒",
            "BLACK"
          ],
          [
            "白",
            "WHITE"
          ]
        ]
      },
      {
        "type": "input_dummy"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);

Blockly.Hat['othello_put'] = function (block) {
  var dropdown_board_x = block.getFieldValue('board_x');
  var dropdown_board_y = block.getFieldValue('board_y');
  var dropdown_color = block.getFieldValue('color');
  // TODO: Assemble JavaScript into code variable.

  let code = 'JavaScript';
  code += ' ' + '"othello_put"';
  code += ' ' + dropdown_board_x + ' ' + dropdown_board_y + ' ' + dropdown_color;
  code += ' ' + '^()\n';
  return code;
};


//オセロの初期状態配列情報
Blockly.defineBlocksWithJsonArray(
  [{
    "type": "startothello",
    "message0": "オセロ : %1 %2 %3 の初期状態",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "boardnum",
        "options": [
          [
            "4×4",
            "4"
          ],
          [
            "6×6",
            "6"
          ],
          [
            "8×8",
            "8"
          ]
        ]
      },
      {
        "type": "input_dummy"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "中央(2×2)に並べられている情報を持つ配列",
    "helpUrl": ""
  }]
);

Blockly.Hat['startothello'] = function (block) {
  var dropdown_boardnum = block.getFieldValue('boardnum');
  let code = 'JavaScript' + ' ';
  code += '"hatStart"' + ' ' + dropdown_boardnum;
  //code += 'num ^()';
  code += ' ' + '^(redata)\n';
  return code;
};

// //指定した盤面を出力　オセロ盤面の修正が必要
// Blockly.defineBlocksWithJsonArray(
// 
//   [{
//     "type": "positionprint",
//     "message0": "盤面 : %1 を出力する %2 出力後の手番 : %3",
//     "args0": [
//       {
//         "type": "input_statement",
//         "name": "position"
//       },
//       {
//         "type": "input_dummy",
//         "align": "RIGHT"
//       },
//       {
//         "type": "field_dropdown",
//         "name": "next",
//         "options": [
//           [
//             "player",
//             "player"
//           ],
//           [
//             "CPU",
//             "CPU"
//           ]
//         ]
//       }
//     ],
//     "inputsInline": false,
//     "previousStatement": null,
//     "nextStatement": null,
//     "colour": 230,
//     "tooltip": "",
//     "helpUrl": ""
//   }]
// );
// Blockly.Hat['positionprint'] = function(block) {
//   var statements_position = Blockly.Hat.statementToCode(block, 'position');
//   var dropdown_next = block.getFieldValue('next');
//   // TODO: Assemble Hat into code variable.
//   let code = 'JavaScript' + '"' + '(function(position, color)';
//   code += '{ reflectBoard('+ statements_position +','+dropdown_next+');})"\n';
//   code += 'position color ^()'
//   return code;
// };

// //指定した盤面を出力　オセロ盤面の修正が必要
// Blockly.defineBlocksWithJsonArray(
// 
//   [{
//     "type": "positionprint2",
//     "message0": "盤面 : %1 を出力する %2",//出力後の手番 : %3
//     "args0": [
//       {
//         "type": "input_value",
//         "name": "position"
//       },
//       {
//         "type": "input_dummy",
//       }
//       // },
//       // {
//       //   "type": "field_dropdown",
//       //   "name": "next",
//       //   "options": [
//       //     [
//       //       "player",
//       //       "player"
//       //     ],
//       //     [
//       //       "CPU",
//       //       "CPU"
//       //     ]
//       //   ]
//       // }
//     ],
//     "inputsInline": false,
//     "previousStatement": null,
//     "nextStatement": null,
//     "inputsInline": true,
//     "colour": 230,
//     "tooltip": "",
//     "helpUrl": ""
//   }]
// );
// Blockly.Hat['positionprint2'] = function(block) {
//   var value_position = Blockly.Hat.statementToCode(block, 'position');
//   // TODO: Assemble Hat into code variable.
//   let code = 'JavaScript' + '"' + '(function(position)';
//   code += '{ reflectBoard('+ value_position +');})"\n';
//   code += 'position color ^()'
//   return code;
// };



//position定義　othello.jsのdataに該当
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "position",
    "message0": "現在の盤面",
    //"inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "output": null,
    "colour": 230,
    "tooltip": "現在の盤面の状態を表す配列を返す",
    "helpUrl": ""
  }]
);
Blockly.Hat['position'] = function (block) {
  let code = 'JavaScript';
  code += ' ' + '"returnPosition"';
  code += ' ' + '^(data)\n';
  return code;
};

//playerの操作
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "turnPlayer",
    "message0": "playerの操作",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['turnPlayer'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'turnPlayer ^(x y)\n';
  // var code = 'turnPlayer ^(nextp)\n';
  return code;
};

//CPUの操作(暫定CPU)
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "turnCPU",
    "message0": "CPUの操作",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['turnCPU'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = "turnCPU \n"
  return code;
};

//手番 
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "returnTurn",
    "message0": "手番",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['returnTurn'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"returnTurn"';
  //code += ' '+'^(turn)\n';
  return code;
};


//手番交代
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "turnChange",
    "message0": "手番交代",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['turnChange'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'turnChange ^(dummy)';
  return code;
};


//スキップ表示
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "skip",
    "message0": "スキップ表示",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['skip'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"skip"';
  code += ' ' + '^(dummy)\n';
  return code;
};

//勝敗判定・表示
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "showResult",
    "message0": "勝敗判定・表示",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['showResult'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"showResult"';
  code += ' ' + '^(dummy)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "Init",
    "message0": "初期化",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['Init'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"Init"';
  code += ' ' + '^(dummy)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "showTurn",
    "message0": "手番や石の数を表示",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['showTurn'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"showTurn"';
  code += ' ' + '^(dummy)\n';
  return code;
};

//CPUの手番ならば
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "CPUsTurn",
    "message0": "CPUの手番",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['CPUsTurn'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"CPUsTurn"';
  //code += ' '+'^(opponentPossibility)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "TestLoopOutCondition",
    "message0": "テスト用ループ条件",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['TestLoopOutCondition'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"TestLoopOutCondition"';
  //code += ' '+'^(opponentPossibility)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "PrintTest",
    "message0": "表示テスト",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['PrintTest'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"PrintTest"';
  code += ' ' + 'testcnt';
  code += ' ' + '^(printtest)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "userTurncheck",
    "message0": "現在の手番がユーザの手番である",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['userTurncheck'] = function (block) {
  // TODO: Assemble Hat into code variable.
  let code = 'JavaScript';
  code += ' ' + '"userTurncheck"';
  //code += ' '+'^(opponentPossibility)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "CPU_Put",
    "message0": "(更新変数利用)CPUの操作",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['CPU_Put'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"CPUput"';
  code += ' ' + 'p';
  code += ' ' + '^(nextp)\n';
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "test_printBoard",
    "message0": "(引数あり)盤面表示",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['test_printBoard'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'JavaScript';
  code += ' ' + '"test_printBoard"';
  code += ' ' + 'p';
  code += ' ' + '^(dummy)\n';
  return code;
};


Blockly.defineBlocksWithJsonArray(

  [{
    "type": "test_Yamamoto",
    "message0": "テスト山本",//ブロックの表面の文字
    "previousStatement": null,//窪み
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['test_Yamamoto'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = 'print("testyamamoto\n")^()';
  return code;
};


//mini-maxを用いたCPUの操作
Blockly.defineBlocksWithJsonArray(

  [{
    "type": "minimaxturnCPU",
    "message0": "CPUの操作(ミニマックス法)",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['minimaxturnCPU'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = "minimaxturnCPU \n";
  /*var code = 'JavaScript';
  code += ' '+'"minimaxturnCPU"';
  code += ' '+'^(dummy)\n';*/
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "alphabetaturnCPU",
    "message0": "CPUの操作(α-β法)",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]
);
Blockly.Hat['alphabetaturnCPU'] = function (block) {
  // TODO: Assemble Hat into code variable.
  var code = "alphabetaturnCPU \n";
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "minimaxNturnCPU",
    "message0": "CPUの操作(ミニマックス法 深さ %1)",
    "args0": [
      {
        "type": "field_number",
        "name": "DEPTH",
        "value": 5,
        "min": 1,
        "max": 10
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "指定した深さでミニマックス探索を行う",
    "helpUrl": ""
  }]
);
Blockly.Hat['minimaxNturnCPU'] = function (block) {
  var depth = block.getFieldValue('DEPTH');
  var code = `minimaxNturnCPU ${depth}\n`;
  return code;
};

Blockly.defineBlocksWithJsonArray(

  [{
    "type": "alphabetaNturnCPU",
    "message0": "CPUの操作(α-β法 深さ %1)",
    "args0": [
      {
        "type": "field_number",
        "name": "DEPTH",
        "value": 5,
        "min": 1,
        "max": 10
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "指定した深さでα-β探索を行う",
    "helpUrl": ""
  }]
);
Blockly.Hat['alphabetaNturnCPU'] = function (block) {
  var depth = block.getFieldValue('DEPTH');
  var code = `alphabetaNturnCPU ${depth}\n`;
  return code;
};

// --- mmN ブロック (Algorithm value) ---
Blockly.defineBlocksWithJsonArray([{
  "type": "mmN",
  "message0": "ミニマックス探索 (深さ %1)",
  "args0": [
    { "type": "field_number", 
      "name": "DEPTH", 
      "value": 5, 
      "min": 1, 
      "max": 10,
      "precision": 1 }
  ],
  "output": "Algorithm",
  "colour": 230
}]);

Blockly.Hat['mmN'] = function (block) {
  var depth = block.getFieldValue('DEPTH');
  // JSON 文字列リテラル（Hat に渡る値を「文字列」として固定する）
  var code = `"{\\"type\\":\\"mmN\\",\\"depth\\":${depth}}"`;
  return [code, Hat.ORDER_ATOMIC];
};

// --- abN ブロック ---
Blockly.defineBlocksWithJsonArray([{
  "type": "abN",
  "message0": "アルファベータ探索 (深さ %1)",
  "args0": [
    { "type": "field_number", 
      "name": "DEPTH", 
      "value": 5, 
      "min": 1, 
      "max": 10,
      "precision": 1 }
  ],
  "output": "Algorithm",
  "colour": 230
}]);

Blockly.Hat['abN'] = function (block) {
  var depth = block.getFieldValue('DEPTH');
  var code = `"{\\"type\\":\\"abN\\",\\"depth\\":${depth}}"`;
  return [code, Hat.ORDER_ATOMIC];
};

/*
// --- CPU ブロック（アルゴリズム入力） ---
Blockly.defineBlocksWithJsonArray([{
  "type": "othelloCPUTurn",
  "message0": "オセロCPU %1",
  "args0": [
    { "type": "input_value", "name": "ALGO", "check": "Algorithm" }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120
}]);

Blockly.Hat['othelloCPUTurn'] = function(block) {
  var algo = Blockly.Hat.valueToCode(block, 'ALGO', Hat.ORDER_NONE) || 'null';
  var code = `(othelloCPUTurn ${algo})\n`;
  return code;
};
*/

Blockly.defineBlocksWithJsonArray([{
  "type": "chessCPUTurn",
  "message0": "チェスCPU %1",
  "args0": [
    { "type": "input_value", "name": "ALGO", "check": "Algorithm" }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120
}]);

Blockly.Hat['chessCPUTurn'] = function (block) {
  var algo = Blockly.Hat.valueToCode(block, 'ALGO', Hat.ORDER_NONE) || 'null';
  var code = `(chessCPUTurn ${algo})\n`;
  return code;
};

/*
// 8x8 評価値ブロック (出力: EvalTable) — 行番号・列番号なし
Blockly.Blocks['eval_table'] = {
  init: function() {
    this.setColour(200);
    this.setOutput(true, 'EvalTable');
    // タイトルのみ
    this.appendDummyInput().appendField('評価値テーブル (8x8)');

    // ドロップダウンの選択肢（表示はNBSPでパディング）
    const options = [];
    function makeLabel(n) {
      const s = (n >= 0 ? (n === 0 ? '0' : '+' + n) : String(n));
      const target = 4;
      let out = s;
      while (out.length < target) out = '\u00A0' + out;
      return out;
    }
    for (let v = -100; v <= 100; v += 10) {
      options.push([ makeLabel(v), String(v) ]);
    }

    // 各行（行番号・列番号なしで8×8のドロップダウンを配置）
    for (let y = 0; y < 8; y++) {
      const row = this.appendDummyInput('ROW' + y);
      for (let x = 0; x < 8; x++) {
        const fname = 'r' + y + 'c' + x;
        row.appendField(new Blockly.FieldDropdown(options), fname);
      }
    }
    this.setTooltip('各マスの評価値を -100〜100 (10刻み) で指定します');
  }
};

Blockly.Hat['eval_table'] = function(block) {
  // collect values into 2D array
  const table = [];
  for (let y = 0; y < 8; y++) {
    table[y] = [];
    for (let x = 0; x < 8; x++) {
      const fname = 'r' + y + 'c' + x;
      const v = block.getFieldValue(fname) || '0';
      table[y][x] = Number(v);
    }
  }
  const payload = JSON.stringify({ type: 'evalTable', table: table });
  return [JSON.stringify(payload), Hat.ORDER_ATOMIC];
};
*/

// --- CPU ブロック（アルゴリズム入力 + 評価テーブル） ---
Blockly.defineBlocksWithJsonArray([{
  "type": "othelloCPUTurn",
  "message0": "オセロCPU %1 評価値 %2",
  "args0": [
    { "type": "input_value", "name": "ALGO", "check": "Algorithm" },
    { "type": "input_value", "name": "EVAL", "check": "EvalTable" }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120
}]);

Blockly.Hat['othelloCPUTurn'] = function (block) {
  var algo = Blockly.Hat.valueToCode(block, 'ALGO', Hat.ORDER_NONE) || 'null';
  var evaltbl = Blockly.Hat.valueToCode(block, 'EVAL', Hat.ORDER_NONE) || 'null';
  // pass two args to othelloCPUTurn: algorithm and evaltable
  var code = `(othelloCPUTurn ${algo} ${evaltbl})\n`;
  return code;
};

// ...existing code...
const GROUP_COLORS = {
  A: '#16a085', B: '#e67e22', C: '#bdc3c7', D: '#2ecc71', E: '#f1c40f',
  F: '#e74c3c', G: '#3498db', H: '#9b59b6'
};

Blockly.defineBlocksWithJsonArray([{
  "type": "eval_table",
  "message0": "評価値グループ",

  "message1": "A %1 評価値大 %2",
  "args1": [
    { "type": "field_colour", "colour": GROUP_COLORS.A },
    { "type": "input_value", "name": "G_A", "check": "Number" }
  ],

  "message2": "B %1 %3 ↑ %2",
  "args2": [
    { "type": "field_colour", "colour": GROUP_COLORS.B },
    { "type": "input_value", "name": "G_B", "check": "Number" },
    {
      "type": "field_image",
      "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "width": 12,
      "height": 1,
      "alt": "space"
    }
  ],

  "message3": "C %1 %2",
  "args3": [
    { "type": "field_colour", "colour": GROUP_COLORS.C },
    { "type": "input_value", "name": "G_C", "check": "Number" },
  ],

  "message4": "D %1 %2",
  "args4": [
    { "type": "field_colour", "colour": GROUP_COLORS.D },
    { "type": "input_value", "name": "G_D", "check": "Number" }
  ],

  "message5": "E %1 %2",
  "args5": [
    { "type": "field_colour", "colour": GROUP_COLORS.E },
    { "type": "input_value", "name": "G_E", "check": "Number" }
  ],

  "message6": "F %1 %2",
  "args6": [
    { "type": "field_colour", "colour": GROUP_COLORS.F },
    { "type": "input_value", "name": "G_F", "check": "Number" }
  ],

  "message7": "G %1 %3 ↓ %2",
  "args7": [
    { "type": "field_colour", "colour": GROUP_COLORS.G },
    { "type": "input_value", "name": "G_G", "check": "Number" },
    {
      "type": "field_image",
      "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "width": 12,
      "height": 1,
      "alt": "space"
    }
  ],

  "message8": "H %1 評価値小 %2",
  "args8": [
    { "type": "field_colour", "colour": GROUP_COLORS.H },
    { "type": "input_value", "name": "G_H", "check": "Number" },
  ],

  "inputsInline": false,
  "output": "EvalTable",
  "colour": 200,
  "tooltip": "グループごとの評価値（各引数は数値ブロック）"
}]);

// Hat 出力: 8グループの数値を集めて JSON 文字列を返す
Blockly.Hat['eval_table'] = function (block) {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const vals = {};
  groups.forEach(g => {
    const code = Blockly.Hat.valueToCode(block, 'G_' + g, Hat.ORDER_NONE) || '0';
    let n = 0;
    try {
      n = Number(JSON.parse(code));
    } catch (e) {
      n = Number(code) || 0;
    }
    vals[g] = n;
  });
  const payload = { type: 'evalGroups', values: vals };
  const payloadStr = JSON.stringify(payload);
  return [JSON.stringify(payloadStr), Hat.ORDER_ATOMIC];
};

// 単体の評価値ブロック
Blockly.defineBlocksWithJsonArray([{
  "type": "eval_group_value",
  "message0": "評価値(-100〜100） %1",
  "args0": [
    {
      "type": "field_number",
      "name": "VAL",
      "value": 0,
      "min": -100,
      "max": 100,
      "precision": 1
    }
  ],
  "output": "Number",
  "colour": 200
}]);

Blockly.Hat['eval_group_value'] = function (block) {
  const v = Number(block.getFieldValue('VAL')) || 0;
  return [String(v), Hat.ORDER_ATOMIC];
};