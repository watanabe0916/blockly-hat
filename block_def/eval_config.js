/*(function () {
    // 保存キー
    const STORAGE_KEY = 'othello.eval.group.values';

    // グループ -> 座標リスト (y,x)
    const GROUP_COORDS = {
        A: [[0, 0], [0, 7], [7, 0], [7, 7]],
        B: [[0, 2], [0, 5], [2, 0], [2, 7], [5, 0], [5, 7], [7, 2], [7, 5]],
        C: [[0, 3], [0, 4], [3, 0], [4, 0], [3, 7], [4, 7], [7, 3], [7, 4]],
        D: [[2, 2], [2, 5], [5, 2], [5, 5]],
        E: [[2, 3], [2, 4], [3, 2], [4, 2], [3, 5], [4, 5], [5, 3], [5, 4]],
        F: [[3, 3], [3, 4], [4, 3], [4, 4]],
        G: [
            [1, 2], [1, 3], [1, 4], [1, 5],
            [2, 1], [2, 6], [3, 1], [3, 6],
            [4, 1], [4, 6], [5, 1], [5, 6],
            [6, 2], [6, 3], [6, 4], [6, 5]
        ],
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
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function getGroupByCoord(y, x) {
        for (const g in GROUP_COORDS) {
            const coords = GROUP_COORDS[g];
            for (let i = 0; i < coords.length; i++) {
                const [yy, xx] = coords[i];
                if (yy === y && xx === x) return g;
            }
        }
        return null;
    }

    // UI 作成
    function createPanel() {
        if (document.getElementById('evalConfigPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'evalConfigPanel';
        Object.assign(panel.style, {
            position: 'fixed', top: '60px', left: '12px', width: '360px',
            maxWidth: '46vw', background: '#fff', border: '1px solid #ccc',
            padding: '10px', zIndex: 2100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif', fontSize: '13px', display: 'none'
        });

        const header = document.createElement('div');
        header.textContent = '評価値設定';
        header.style.fontWeight = '600';
        header.style.marginBottom = '8px';
        panel.appendChild(header);

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 80px';
        grid.style.gap = '6px 8px';
        panel.appendChild(grid);

        // load stored or compute defaults
        const stored = loadStoredValues();
        Object.keys(GROUP_COORDS).forEach(g => {
            const color = GROUP_COLORS[g] || '#ddd';
            const label = document.createElement('div');
            label.textContent = g;
            label.style.background = color;
            label.style.color = '#fff';
            label.style.padding = '6px';
            label.style.borderRadius = '4px';
            label.style.textAlign = 'center';
            grid.appendChild(label);

            const input = document.createElement('input');
            input.type = 'number';
            input.id = 'eval_group_' + g;
            input.style.width = '100%';
            input.style.boxSizing = 'border-box';
            input.value = (stored && stored[g] !== undefined) ? stored[g] : getRepresentativeValue(g);
            grid.appendChild(input);
        });

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '8px';
        btnRow.style.marginTop = '8px';

        const applyBtn = document.createElement('button');
        applyBtn.textContent = '適用';
        applyBtn.addEventListener('click', () => {
            applyAllInputs(false);
        });
        btnRow.appendChild(applyBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.addEventListener('click', () => {
            applyAllInputs(true);
        });
        btnRow.appendChild(saveBtn);

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'デフォルトに戻す';
        resetBtn.addEventListener('click', () => {
            // 保存値を消す
            localStorage.removeItem(STORAGE_KEY);
            // evaluate8 と入力欄をそれぞれデフォルト（代表値）で更新する
            Object.keys(GROUP_COORDS).forEach(g => {
                const v = getRepresentativeValue(g);
                const el = document.getElementById('eval_group_' + g);
                if (el) el.value = v;
                applyGroupToEvaluate8(g, v);
            });
            updatePreview();
            // 簡単な通知（必要なら別の UI に変更）
            console.log('評価値をデフォルトに戻しました');
        });
        btnRow.appendChild(resetBtn);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.marginLeft = 'auto';
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            openBtn.style.display = 'block';
        });
        btnRow.appendChild(closeBtn);

        panel.appendChild(btnRow);

        // プレビュー（カラフルな 8x8 表示）
        const previewWrap = document.createElement('div');
        previewWrap.id = 'evalPreview';
        previewWrap.style.marginTop = '8px';
        previewWrap.style.background = '#fafafa';
        previewWrap.style.padding = '6px';
        previewWrap.style.maxHeight = '30vh';
        previewWrap.style.overflow = 'auto';
        panel.appendChild(previewWrap);

        document.body.appendChild(panel);

        // Open button （左にずらして表示）
        let openBtn = document.getElementById('evalConfigOpenBtn');
        if (!openBtn) {
            openBtn = document.createElement('button');
            openBtn.id = 'evalConfigOpenBtn';
            openBtn.textContent = '評価値設定';
            Object.assign(openBtn.style, {
                position: 'fixed', top: '12px', left: '12px', zIndex: 2101,
                padding: '6px 10px', fontSize: '16px', borderRadius: '6px'
            });
            document.body.appendChild(openBtn);
        }
        openBtn.addEventListener('click', () => {
            populateInputsFromStored();
            panel.style.display = 'block';
            openBtn.style.display = 'none';
            updatePreview();
        });

        openBtn.style.display = 'block';
    }

    function getRepresentativeValue(group) {
        try {
            // 優先して othello.js で保持したオリジナルの評価テーブルを参照する
            const defaultTable = (typeof window !== 'undefined' && Array.isArray(window.__DEFAULT_EVALUATE8__)) ? window.__DEFAULT_EVALUATE8__ :
                            (typeof evaluate8 !== 'undefined' && Array.isArray(evaluate8) ? evaluate8 : null);
            if (defaultTable) {
                const coords = GROUP_COORDS[group];
                for (let i = 0; i < coords.length; i++) {
                    const [y, x] = coords[i];
                    if (defaultTable[y] && typeof defaultTable[y][x] === 'number') return defaultTable[y][x];
                }
            }
        } catch (e) { }
        return 0;
    }

    function loadStoredValues() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) { return null; }
    }

    function saveStoredValues(obj) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        } catch (e) { console.warn('save failed', e); }
    }

    function applyAllInputs(saveAfter) {
        const obj = {};
        Object.keys(GROUP_COORDS).forEach(g => {
            const el = document.getElementById('eval_group_' + g);
            if (!el) return;
            const v = Number(el.value) || 0;
            obj[g] = v;
            applyGroupToEvaluate8(g, v);
        });
        if (saveAfter) saveStoredValues(obj);
        updatePreview();
        console.log('evaluate8 updated by groups', obj);
    }

    function applyGroupToEvaluate8(group, value) {
        if (typeof evaluate8 === 'undefined' || !Array.isArray(evaluate8)) {
            console.warn('evaluate8 not present');
            return;
        }
        const coords = GROUP_COORDS[group];
        coords.forEach(([y, x]) => {
            if (!evaluate8[y]) evaluate8[y] = [];
            evaluate8[y][x] = value;
        });
    }

    function updatePreview() {
        const wrap = document.getElementById('evalPreview');
        if (!wrap) return;
        // build HTML table with colors per group
        if (typeof evaluate8 === 'undefined' || !Array.isArray(evaluate8)) {
            wrap.innerHTML = '<div style="padding:8px">evaluate8 が未定義です</div>';
            return;
        }
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.fontSize = '13px';

        for (let y = 0; y < 8; y++) {
            const tr = document.createElement('tr');
            for (let x = 0; x < 8; x++) {
                const td = document.createElement('td');
                td.style.padding = '4px';
                td.style.textAlign = 'center';
                td.style.border = '1px solid #ddd';
                td.style.minWidth = '30px';
                const v = (evaluate8[y] && evaluate8[y][x] !== undefined) ? evaluate8[y][x] : 0;
                const g = getGroupByCoord(y, x);
                if (g) {
                    td.style.background = hexToRgba(GROUP_COLORS[g], 0.14);
                    td.style.borderLeft = `4px solid ${GROUP_COLORS[g]}`;
                } else {
                    td.style.background = '#fff';
                }
                td.textContent = v;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        // legend
        const legend = document.createElement('div');
        legend.style.display = 'flex';
        legend.style.flexWrap = 'wrap';
        legend.style.gap = '6px';
        legend.style.marginTop = '6px';
        Object.keys(GROUP_COLORS).forEach(g => {
            const item = document.createElement('div');
            item.style.display = 'inline-flex';
            item.style.alignItems = 'center';
            item.style.gap = '6px';
            item.style.fontSize = '12px';
            const sw = document.createElement('span');
            sw.style.display = 'inline-block';
            sw.style.width = '14px';
            sw.style.height = '14px';
            sw.style.background = GROUP_COLORS[g];
            sw.style.borderRadius = '3px';
            const lbl = document.createElement('span');
            lbl.textContent = `${g}`;
            item.appendChild(sw);
            item.appendChild(lbl);
            legend.appendChild(item);
        });

        wrap.innerHTML = '';
        wrap.appendChild(table);
        wrap.appendChild(legend);
    }

    function populateInputsFromStored() {
        const stored = loadStoredValues();
        Object.keys(GROUP_COORDS).forEach(g => {
            const el = document.getElementById('eval_group_' + g);
            if (!el) return;
            if (stored && stored[g] !== undefined) el.value = stored[g];
            else el.value = getRepresentativeValue(g);
        });
        updatePreview();
    }

    // 初回シード: stored にないグループのみを現在の evaluate8 から埋めて保存
    function seedMissingStored() {
        const stored = loadStoredValues() || {};
        let changed = false;
        Object.keys(GROUP_COORDS).forEach(g => {
            if (stored[g] === undefined) {
                stored[g] = getRepresentativeValue(g);
                changed = true;
            }
        });
        if (changed) saveStoredValues(stored);
    }

    // 初期化
    window.addEventListener('load', () => {
        createPanel();
        seedMissingStored();
        const stored = loadStoredValues();
        if (stored) {
            Object.keys(stored).forEach(g => applyGroupToEvaluate8(g, stored[g]));
        }
    });

    // expose for console debugging
    window.evalConfig = {
        applyGroupToEvaluate8,
        loadStoredValues,
        saveStoredValues,
        updatePreview
    };
})();
*/