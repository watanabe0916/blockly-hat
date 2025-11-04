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

    // UI を作る（Hat出力と othello_area の間に挿入）
    function ensureUI() {
        if (document.getElementById('evalMultiDisplay')) return;
        const hatOut = document.getElementById('HatCode');
        const othelloArea = document.getElementById('othello_area');
        const container = document.createElement('div');
        container.id = 'evalMultiDisplay';
        container.style.border = '1px solid #ddd';
        container.style.padding = '8px';
        container.style.margin = '8px 0';
        container.style.background = '#fff';
        container.style.maxHeight = '360px';
        container.style.overflow = 'auto';

        const header = document.createElement('div');
        header.textContent = '評価値表示';
        header.style.fontWeight = '600';
        header.style.marginBottom = '6px';
        container.appendChild(header);

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.alignItems = 'center';
        const label = document.createElement('div');
        label.textContent = '関数:';
        row.appendChild(label);

        const select = document.createElement('select');
        select.id = 'evalFuncSelect';
        select.style.minWidth = '160px';
        row.appendChild(select);

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '更新';
        refreshBtn.addEventListener('click', updateDisplays);
        row.appendChild(refreshBtn);

        container.appendChild(row);

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
    }

    // workspace から関数定義ブロック（call_func_andarg）を集め、
    // 各関数ブロック内に含まれる eval_table / eval_groups を探して evalObj を得る
    function collectFunctionEvals() {
        const result = {}; // name -> evalObj
        if (typeof workspace === 'undefined') return result;
        const blocks = workspace.getAllBlocks(false);
        blocks.forEach(b => {
            if (b && b.type === 'call_func_andarg') {
                const name = b.getFieldValue && b.getFieldValue('func_name') ? b.getFieldValue('func_name') : 'fn';
                // search descendants for eval_table blocks
                const descendants = b.getDescendants ? b.getDescendants() : [];
                let foundEval = null;
                for (let i = 0; i < descendants.length && !foundEval; i++) {
                    const d = descendants[i];
                    if (!d || !d.type) continue;
                    if (d.type === 'eval_table' || d.type === 'eval_groups_input' || d.type === 'eval_groups') {
                        // use generator to obtain payload (Hat generator for eval_table exists)
                        try {
                            const gen = Blockly.Hat[d.type];
                            if (typeof gen === 'function') {
                                const code0 = gen(d)[0]; // quoted JSON string
                                // parse carefully (may be JSON.stringify(payloadStr) etc.)
                                let payload = null;
                                try {
                                    const step1 = JSON.parse(code0); // yields payloadStr or object
                                    try { payload = JSON.parse(step1); } catch (e) { payload = step1; }
                                } catch (e) {
                                    try { payload = JSON.parse(code0); } catch (e) { payload = null; }
                                }
                                if (payload) foundEval = payload;
                            }
                        } catch (e) {
                            // ignore
                        }
                    }
                }
                // if not found, keep undefined (will show default)
                result[name] = foundEval || null;
            }
        });
        return result;
    }

    // evalObj -> 8x8 numeric matrix
    function evalObjToMatrix(evalObj) {
        const empty = Array.from({ length: 8 }, () => Array(8).fill(0));
        if (!evalObj) return empty;
        if (evalObj.type === 'evalTable' && Array.isArray(evalObj.table)) {
            // normalize length to 8
            const m = Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => {
                return (evalObj.table[y] && typeof evalObj.table[y][x] !== 'undefined') ? Number(evalObj.table[y][x]) : 0;
            }));
            return m;
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

    // render one 8x8 matrix into container element (color by group)
    function renderMatrix(matrix, container) {
        container.innerHTML = '';
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.maxWidth = '420px';
        table.style.fontSize = '12px';
        for (let y = 0; y < 8; y++) {
            const tr = document.createElement('tr');
            for (let x = 0; x < 8; x++) {
                const td = document.createElement('td');
                td.style.border = '1px solid #eee';
                td.style.padding = '6px';
                td.style.textAlign = 'center';
                td.style.width = '12.5%';
                const v = (matrix[y] && typeof matrix[y][x] !== 'undefined') ? matrix[y][x] : 0;
                td.textContent = v;
                // color by group
                let group = null;
                for (const g in GROUP_COORDS) {
                    const coords = GROUP_COORDS[g];
                    for (let i = 0; i < coords.length; i++) {
                        if (coords[i][0] === y && coords[i][1] === x) { group = g; break; }
                    }
                    if (group) break;
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
        const map = collectFunctionEvals();
        // clear select
        select.innerHTML = '';
        const names = Object.keys(map);
        // add default/global option
        const optGlobal = document.createElement('option');
        optGlobal.value = '__GLOBAL__';
        optGlobal.textContent = 'グローバル（既定）';
        select.appendChild(optGlobal);
        names.forEach(n => {
            const o = document.createElement('option');
            o.value = n;
            o.textContent = n;
            select.appendChild(o);
        });
        // render first (global)
        renderTableForSelected();
    }

    function renderTableForSelected() {
        ensureUI();
        const select = document.getElementById('evalFuncSelect');
        const tablesWrap = document.getElementById('evalTablesContainer');
        if (!select || !tablesWrap) return;
        const sel = select.value;
        const map = collectFunctionEvals();
        if (sel === '__GLOBAL__') {
            // show current window.evaluate8 if present, else default
            const matrix = (window.evaluate8 && Array.isArray(window.evaluate8)) ? window.evaluate8 : (window.__DEFAULT_EVALUATE8__ || Array.from({ length: 8 }, () => Array(8).fill(0)));
            renderMatrix(matrix, tablesWrap);
            return;
        }
        const evalObj = map[sel] || null;
        const matrix = evalObjToMatrix(evalObj);
        renderMatrix(matrix, tablesWrap);
    }

    // wrap runCode so displays update before running
    function wrapRunCode() {
        if (typeof window.runCode !== 'function') return;
        const orig = window.runCode;
        window.runCode = function (...args) {
            try { updateDisplays(); } catch (e) { console.warn(e); }
            return orig.apply(this, args);
        };
    }

    window.addEventListener('load', () => {
        // initial UI create
        setTimeout(() => { try { ensureUI(); updateDisplays(); } catch (e) { } }, 200);
        // wrap runCode after short delay
        setTimeout(wrapRunCode, 400);
    });
})();