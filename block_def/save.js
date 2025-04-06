//全消去、保存、復元

function clearBlocks() {
  if (window.confirm('プログラムを消去してよいですか?')) {
    workspace.clear();
    Blockly.Xml.domToWorkspace(document.getElementById('clearBlocks'),workspace);
    workspace_function.clear();
    Blockly.Xml.domToWorkspace(document.getElementById('clearBlocks'),workspace_function);
  }
}

/** ローカルストレージに保存するときのキー接頭辞 */
var savedBlockPrefix = 'bky.prc.saved.';

//ローカルストレージ削除
//localStorage.removeItem("bky.prc.saved.関数名");

/** ブロックを保存 */
function saveBlocks() {
if ('localStorage' in window) {
  var name = null;
  while (!name) {
    name = window.prompt('プログラム名を入力してください');
    if (!name) { return; } // キャンセル or 空文字
    if (window.localStorage[savedBlockPrefix + name]) {
      if (!window.confirm(name + ' は存在します。上書きしますか?')) {
        name = null;
      }
    }
  }

  const nameKey = savedBlockPrefix + name;

  // workspace_function と workspace の両方を保存
  const xml_function = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace_function));
  const xml_main = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));

  const saveData = {
    function: xml_function,
    main: xml_main
  };

  // JSON文字列にして保存
  window.localStorage.setItem(nameKey, JSON.stringify(saveData));
}
}

/** ブロックを復元 */
function restoreBlocks() {
if ('localStorage' in window) {
  var modal = document.getElementById('restoreModal');
  var list  = document.getElementById('restoreList');
  var items = [];
  for (var key in window.localStorage) {
    if (key.startsWith(savedBlockPrefix)) {
      var keyBody = key.substr(savedBlockPrefix.length);
      items.push(keyBody);
    }
  }
  if (items.length == 0) {
    window.alert('保存されているプログラムはありません');
    return;
  }
  items.sort();
  var itemsHtml = '';
  for (var i = 0; i < items.length; i++) {
    itemsHtml += '<li><a onclick="restoreBlocksFrom(\'' +
                  items[i] + '\')">' + items[i] + '</a></li>';
  }
  list.innerHTML = itemsHtml;
  modal.style.display = 'block';
}
}

function restoreBlocksFrom(name) {
const modal = document.getElementById('restoreModal');
modal.style.display = 'none';

if (!name) return;

const nameKey = savedBlockPrefix + name;
const savedData = window.localStorage.getItem(nameKey);

if (!savedData) {
  window.alert('Error: ' + name + ' がありません');
  return;
}

try {
  const data = JSON.parse(savedData);

  // 現在のブロックを削除
  workspace_function.clear();
  workspace.clear();

  // 復元
  if (data.function) {
    const xml_function = Blockly.Xml.textToDom(data.function);
    Blockly.Xml.domToWorkspace(xml_function, workspace_function);
  }
  if (data.main) {
    const xml_main = Blockly.Xml.textToDom(data.main);
    Blockly.Xml.domToWorkspace(xml_main, workspace);
  }
} catch (e) {
  window.alert('復元中にエラーが発生しました: ' + e);
}
}

//復元キャンセル
function cancelRestoreBlocks() {
var modal = document.getElementById('restoreModal');
modal.style.display = 'none';
}

function pressCancelRestoreBlocks(event) {
var modal = document.getElementById('restoreModal');
if (event.target == modal) {
  cancelRestoreBlocks();
}
}
