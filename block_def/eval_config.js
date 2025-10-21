(function () {
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
        A: '#e74c3c', B: '#e67e22', C: '#f1c40f', D: '#2ecc71', E: '#27ae60',
        F: '#16a085', G: '#3498db', H: '#9b59b6', I: '#95a5a6'
    };

    // UI 作成
    function createPanel() {
        if (document.getElementById('evalConfigPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'evalConfigPanel';
        Object.assign(panel.style, {
            position: 'fixed', top: '60px', right: '12px', width: '360px',
            maxWidth: '46vw', background: '#fff', border: '1px solid #ccc',
            padding: '10px', zIndex: 2100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif', fontSize: '13px', display: 'none'
        });

        const header = document.createElement('div');
        header.textContent = '評価値設定 (evaluate8 グループ設定)';
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
            localStorage.removeItem(STORAGE_KEY);
            // 再読み込みしてUIを初期化（既存 evaluate8 値に戻す）
            window.location.reload();
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

        // プレビュー（簡易 8x8 表示）
        const preview = document.createElement('pre');
        preview.id = 'evalPreview';
        preview.style.marginTop = '8px';
        preview.style.background = '#fafafa';
        preview.style.padding = '6px';
        preview.style.maxHeight = '30vh';
        preview.style.overflow = 'auto';
        panel.appendChild(preview);

        document.body.appendChild(panel);

        // Open button
        let openBtn = document.getElementById('evalConfigOpenBtn');
        if (!openBtn) {
            openBtn = document.createElement('button');
            openBtn.id = 'evalConfigOpenBtn';
            openBtn.textContent = '評価値設定';
            Object.assign(openBtn.style, {
                position: 'fixed', top: '12px', right: '12px', zIndex: 2101,
                padding: '6px 10px', fontSize: '12px', borderRadius: '6px'
            });
            document.body.appendChild(openBtn);
        }
        openBtn.addEventListener('click', () => {
            populateInputsFromStored();
            panel.style.display = 'block';
            openBtn.style.display = 'none';
            updatePreview();
        });

        // set close behavior when starting hidden
        openBtn.style.display = 'block';
    }

    function getRepresentativeValue(group) {
        // try to derive from current evaluate8 if available
        try {
            if (typeof evaluate8 !== 'undefined' && Array.isArray(evaluate8)) {
                const coords = GROUP_COORDS[group];
                for (let i = 0; i < coords.length; i++) {
                    const [y, x] = coords[i];
                    if (evaluate8[y] && typeof evaluate8[y][x] === 'number') return evaluate8[y][x];
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
        // notify user
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
        const preview = document.getElementById('evalPreview');
        if (!preview) return;
        if (typeof evaluate8 === 'undefined' || !Array.isArray(evaluate8)) {
            preview.textContent = 'evaluate8 が未定義です';
            return;
        }
        let s = '';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const v = (evaluate8[y] && evaluate8[y][x] !== undefined) ? evaluate8[y][x] : 0;
                s += v.toString().padStart(6, ' ');
            }
            s += '\n';
        }
        preview.textContent = s;
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
        // apply stored values to evaluate8 on load so othello uses them immediately
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