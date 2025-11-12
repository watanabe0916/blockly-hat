(function () {
    // グループ定義（othello.js と同じ）
    const GROUP_COORDS = {
        A: [[0, 0], [0, 7], [7, 0], [7, 7]],
        B: [[0, 2], [0, 5], [2, 0], [2, 7], [5, 0], [5, 7], [7, 2], [7, 5]],
        C: [[0, 3], [0, 4], [3, 0], [4, 0], [3, 7], [4, 7], [7, 3], [7, 4]],
        D: [[2, 2], [2, 5], [5, 2], [5, 5]],
        E: [[2, 3], [2, 4], [3, 2], [4, 2], [3, 5], [4, 5], [5, 3], [5, 4]],
        F: [[3, 3], [3, 4], [4, 3], [4, 4]],
        G: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 1], [2, 6], [3, 1], [3, 6], [4, 1], [4, 6], [5, 1], [5, 6], [6, 2], [6, 3], [6, 4], [6, 5]],
        H: [[0, 1], [1, 0], [0, 6], [1, 7], [6, 0], [7, 1], [6, 7], [7, 6]],
        I: [[1, 1], [1, 6], [6, 1], [6, 6]]
    };
    const GROUP_COLORS = {
        A: '#16a085', B: '#e67e22', C: '#34495e', D: '#2ecc71', E: '#f1c40f',
        F: '#e74c3c', G: '#3498db', H: '#9b59b6', I: '#bdc3c7'
    };

    function hexToRgba(hex, alpha) {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        const h = hex.replace('#', '');
        const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // UI を作る（更新ボタンは作らない）
    function ensureUI() {
        if (document.getElementById('evalMultiDisplay')) return;
        const hatOut = document.getElementById('terminal');
        const othelloArea = document.getElementById('othello_area');
        const container = document.createElement('div');
        container.id = 'evalMultiDisplay';
        container.style.border = '1px solid #ddd';
        container.style.padding = '2px';
        container.style.margin = '2px';
        container.style.background = '#fff';
        container.style.maxHeight = '360px';
        container.style.overflow = 'auto';
        container.style.marginTop = '60px';
        container.style.marginBottom = '30px';


        const header = document.createElement('div');
        header.textContent = '評価値表示';
        header.style.fontWeight = '600';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        // 関数ラベルとセレクトを中央寄せで横並び（更新ボタンは削除）
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center'; // コンテナは常に中央揃え
        controls.style.alignItems = 'center';
        controls.style.gap = '8px';
        controls.style.marginBottom = '6px';

        const select = document.createElement('select');
        select.id = 'evalFuncSelect';
        select.style.minWidth = '200px';
        controls.appendChild(select);

        container.appendChild(controls);

        const tablesWrap = document.createElement('div');
        tablesWrap.id = 'evalTablesContainer';
        tablesWrap.style.marginTop = '8px';
        container.appendChild(tablesWrap);

        // insert between HatCode area and othelloArea (prefer before othello_area)
        if (hatOut && hatOut.parentNode) {
            hatOut.parentNode.parentNode.insertBefore(container, hatOut.parentNode.nextSibling);
        } else if (othelloArea && othelloArea.parentNode) {
            othelloArea.parentNode.insertBefore(container, othelloArea);
        } else {
            document.body.appendChild(container);
        }

        select.addEventListener('change', function () {
            renderTableForSelected();
        });

        // 外部からラベルの余白を動的に変更できるユーティリティを公開
        window.setEvalLabelMarginLeft = function (px) {
            window.EVAL_LABEL_MARGIN_LEFT = px;
            const lbl = document.getElementById('evalLabel');
            if (lbl) lbl.style.marginLeft = px;
        };
        // 便利関数: 一括でスタイルを渡す (例: {marginLeft:'20px', color:'#333'})
        window.setEvalLabelStyle = function (styleObj) {
            if (!styleObj || typeof styleObj !== 'object') return;
            window.EVAL_LABEL_STYLE = Object.assign(window.EVAL_LABEL_STYLE || {}, styleObj);
            const lbl = document.getElementById('evalLabel');
            if (!lbl) return;
            Object.keys(styleObj).forEach(k => {
                try { lbl.style[k] = styleObj[k]; } catch (e) { /* ignore */ }
            });
        };
    }

    // HatCode テキスト（ここでは workspace_function の出力）から defineCPS と othelloCPUTurn の eval 引数を抽出
    function parseHatCodeFunctionsFromText(hatText) {
        const map = {};
        if (!hatText || typeof hatText !== 'string') return map;
        map['__GLOBAL__'] = null;
        const re = /\(defineCPS\s+([^\s\)]+)[\s\S]*?\(othelloCPUTurn\s+("(?:(?:\\.|[^"\\])*)")\s+("(?:(?:\\.|[^"\\])*)")\s*\)/g;
        let m;
        while ((m = re.exec(hatText)) !== null) {
            const fname = m[1];
            const evalLit = m[3];
            let evalObj = null;
            try {
                const s1 = JSON.parse(evalLit);
                try { evalObj = JSON.parse(s1); } catch (e) { evalObj = s1; }
            } catch (e) { evalObj = null; }
            map[fname] = evalObj;
        }
        return map;
    }

    // workspace_function の Hat 出力のみを使って関数ごとの eval マップを取得する
    function getFunctionEvalMap() {
        const map = {};
        map['__GLOBAL__'] = null;
        try {
            if (typeof Blockly !== 'undefined' && typeof workspace_function !== 'undefined') {
                const hatText = Blockly.Hat.workspaceToCode(workspace_function) || '';
                const parsed = parseHatCodeFunctionsFromText(hatText);
                // マップは parsed を返す（必ず __GLOBAL__ を含める）
                if (!('__GLOBAL__' in parsed)) parsed['__GLOBAL__'] = null;
                return parsed;
            }
        } catch (e) {
            console.warn('eval_display_ui getFunctionEvalMap workspace_function parse failed', e);
        }
        // フォールバック：textarea の HatCode を使う（極力使わない）
        const hatEl = document.getElementById('HatCode');
        if (hatEl && hatEl.value) return parseHatCodeFunctionsFromText(hatEl.value);
        return map;
    }

    // evalObj -> 8x8 numeric matrix
    function evalObjToMatrix(evalObj) {
        const empty = Array.from({ length: 8 }, () => Array(8).fill(0));
        if (!evalObj) return empty;
        if (typeof evalObj === 'string') {
            try { evalObj = JSON.parse(evalObj); } catch (e) { return empty; }
        }
        if (evalObj.type === 'evalTable' && Array.isArray(evalObj.table)) {
            return Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => {
                return (evalObj.table[y] && typeof evalObj.table[y][x] !== 'undefined') ? Number(evalObj.table[y][x]) : 0;
            }));
        }
        if (evalObj.type === 'evalGroups' && evalObj.values) {
            const m = Array.from({ length: 8 }, () => Array(8).fill(0));
            Object.keys(evalObj.values).forEach(g => {
                const v = Number(evalObj.values[g]) || 0;
                const coords = GROUP_COORDS[g];
                if (!coords) return;
                coords.forEach(([y, x]) => { m[y][x] = v; });
            });
            return m;
        }
        return empty;
    }

    // matrix: 8x8 数値行列
    function renderMatrix(matrix, container, forceLetters = false) {
        container.innerHTML = '';
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.maxWidth = '420px';
        table.style.fontSize = '12px';
        table.style.margin = '0 auto';
        // 判定: 全セルが 0 のときはグループ文字を表示するモード
        const allZero = forceLetters || matrix.every(row => row.every(v => Number(v) === 0));
        for (let y = 0; y < 8; y++) {
            const tr = document.createElement('tr');
            for (let x = 0; x < 8; x++) {
                const td = document.createElement('td');
                td.style.border = '1px solid #eee';
                td.style.padding = '6px';
                td.style.textAlign = 'center';
                td.style.width = '12.5%';
                const v = (matrix[y] && typeof matrix[y][x] !== 'undefined') ? matrix[y][x] : 0;
                // グループ判定
                let group = null;
                for (const g in GROUP_COORDS) {
                    const coords = GROUP_COORDS[g];
                    for (let i = 0; i < coords.length; i++) {
                        if (coords[i][0] === y && coords[i][1] === x) { group = g; break; }
                    }
                    if (group) break;
                }
                if (allZero) {
                    // グループアルファベットを表示
                    td.textContent = group ? group : '';
                    td.style.fontWeight = '600';
                    td.style.color = '#333';
                } else {
                    // 値があるときは数値表示
                    td.textContent = (typeof v !== 'undefined') ? String(v) : '0';
                }
                if (group) {
                    td.style.background = hexToRgba(GROUP_COLORS[group], 0.12);
                    td.style.borderLeft = `4px solid ${GROUP_COLORS[group]}`;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        container.appendChild(table);
    }

    // populate select and display selected
    function updateDisplays() {
        ensureUI();
        const select = document.getElementById('evalFuncSelect');
        const tablesWrap = document.getElementById('evalTablesContainer');
        if (!select || !tablesWrap) return;
        const map = getFunctionEvalMap();
        select.innerHTML = '';
        const optGlobal = document.createElement('option');
        optGlobal.value = '__GLOBAL__';
        optGlobal.textContent = '評価値グループ';
        select.appendChild(optGlobal);
        Object.keys(map).forEach(n => {
            if (n === '__GLOBAL__') return;
            const o = document.createElement('option');
            o.value = n;
            o.textContent = n;
            select.appendChild(o);
        });
        select.value = (select.options.length > 1) ? select.options[1].value : '__GLOBAL__';
        renderTableForSelected();
    }

    function renderTableForSelected() {
        ensureUI();
        const select = document.getElementById('evalFuncSelect');
        const tablesWrap = document.getElementById('evalTablesContainer');
        if (!select || !tablesWrap) return;
        const sel = select.value;
        const map = getFunctionEvalMap();
        if (sel === '__GLOBAL__') {
            // 初期「評価値グループ」は常にアルファベット表示にしたい（forceLetters = true）
            const matrix = (window.evaluate8 && Array.isArray(window.evaluate8)) ? window.evaluate8 : (map['__GLOBAL__'] ? evalObjToMatrix(map['__GLOBAL__']) : Array.from({ length: 8 }, () => Array(8).fill(0)));
            renderMatrix(matrix, tablesWrap, true);
            return;
        }
        const evalObj = map[sel] || null;
        const matrix = evalObjToMatrix(evalObj);
        renderMatrix(matrix, tablesWrap, false);
    }

    // wrap runCode so displays update only when runCode is pressed
    function wrapRunCode() {
        if (typeof window.runCode !== 'function') return;
        const orig = window.runCode;
        window.runCode = function (...args) {
            try {
                // workspace_function の Hat 出力を基に表示を更新する
                updateDisplays();
            } catch (e) { console.warn(e); }
            return orig.apply(this, args);
        };
    }

    // do not auto-update on load; only set up UI and runCode wrapper
    window.addEventListener('load', () => {
        try {
            ensureUI();
            // 初期表示: グローバル評価値をすぐ表示（runCode 押下前）
            const tablesWrap = document.getElementById('evalTablesContainer');
            const select = document.getElementById('evalFuncSelect');
            // セレクトにグローバルのみ追加（後で runCode 時に上書きされる）
            if (select) {
                select.innerHTML = '';
                const optGlobal = document.createElement('option');
                optGlobal.value = '__GLOBAL__';
                optGlobal.textContent = '評価値グループ';
                select.appendChild(optGlobal);
                select.value = '__GLOBAL__';
            }
            // グローバル行列を決定：まず window.evaluate8、なければ workspace_function のパース、さらに無ければゼロ行列
            let matrix = Array.from({ length: 8 }, () => Array(8).fill(0));
            if (window.evaluate8 && Array.isArray(window.evaluate8)) {
                matrix = window.evaluate8;
            } else {
                try {
                    const map = getFunctionEvalMap();
                    if (map && map['__GLOBAL__']) matrix = evalObjToMatrix(map['__GLOBAL__']);
                } catch (e) { /* ignore */ }
            }
            if (tablesWrap) renderMatrix(matrix, tablesWrap);
        } catch (e) { /* ignore */ }
        setTimeout(wrapRunCode, 200);
    });

    // expose for debugging if needed
    window._evalDisplay_update = updateDisplays;
})();