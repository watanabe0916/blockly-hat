(function () {
    if (typeof savedBlockPrefix === 'undefined') window.savedBlockPrefix = 'bky.prc.saved.';

    function createPanel() {
        if (document.getElementById('assessmentPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'assessmentPanel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '12px',
            right: '12px',
            width: '340px',
            maxWidth: '40vw',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '8px',
            zIndex: 2000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif',
            fontSize: '13px'
        });

        const header = document.createElement('div');
        header.textContent = '保存プログラム判定';
        header.style.fontWeight = '600';
        header.style.marginBottom = '6px';
        panel.appendChild(header);

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '6px';
        panel.appendChild(row);

        const sel = document.createElement('select');
        sel.id = 'savedProgramSelect';
        sel.style.flex = '1';
        row.appendChild(sel);

        const btn = document.createElement('button');
        btn.id = 'judgeSavedBtn';
        btn.textContent = '判定';
        btn.style.flex = '0 0 auto';
        row.appendChild(btn);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.marginTop = '6px';
        closeBtn.style.width = '100%';
        panel.appendChild(closeBtn);

        const out = document.createElement('pre');
        out.id = 'assessmentResult';
        Object.assign(out.style, {
            marginTop: '8px',
            whiteSpace: 'pre-wrap',
            maxHeight: '36vh',
            overflow: 'auto',
            background: '#fafafa',
            padding: '6px',
            border: '1px solid #eee'
        });
        panel.appendChild(out);

        document.body.appendChild(panel);

        // 開くボタン（パネル非表示時に表示）
        let openBtn = document.getElementById('assessmentOpenBtn');
        if (!openBtn) {
            openBtn = document.createElement('button');
            openBtn.id = 'assessmentOpenBtn';
            openBtn.textContent = '判定パネル';
            Object.assign(openBtn.style, {
                position: 'fixed',
                top: '12px',
                right: '12px',
                zIndex: 2001,
                padding: '6px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                display: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
            });
            document.body.appendChild(openBtn);
        }

        // イベント
        btn.addEventListener('click', () => {
            const name = sel.value;
            judgeSavedProgram(name);
        });
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            openBtn.style.display = 'block';
        });
        openBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            openBtn.style.display = 'none';
            populateSavedPrograms();
        });
    }

    function populateSavedPrograms() {
        const sel = document.getElementById('savedProgramSelect');
        if (!sel) return;
        sel.innerHTML = '';
        const items = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (key.startsWith(savedBlockPrefix)) {
                items.push(key.substr(savedBlockPrefix.length));
            }
        }
        items.sort();
        if (items.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '保存なし';
            sel.appendChild(opt);
            return;
        }
        for (const name of items) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            sel.appendChild(opt);
        }
    }

    function countBlockTypesFromXmlText(xmlText) {
        const map = {};
        if (!xmlText) return map;
        try {
            const dom = Blockly.Xml.textToDom(xmlText);
            const blocks = dom.getElementsByTagName('block');
            for (let i = 0; i < blocks.length; i++) {
                const t = blocks[i].getAttribute('type') || 'unknown';
                map[t] = (map[t] || 0) + 1;
            }
        } catch (e) {
            console.warn('countBlockTypesFromXmlText parse error', e);
        }
        return map;
    }

    function countBlockTypesFromCurrentWorkspaces() {
        const map = {};
        if (typeof workspace_function !== 'undefined' && workspace_function) {
            const domF = Blockly.Xml.workspaceToDom(workspace_function);
            const xmlF = Blockly.Xml.domToText(domF);
            const m = countBlockTypesFromXmlText(xmlF);
            Object.keys(m).forEach(k => map[k] = (map[k] || 0) + m[k]);
        }
        if (typeof workspace !== 'undefined' && workspace) {
            const domM = Blockly.Xml.workspaceToDom(workspace);
            const xmlM = Blockly.Xml.domToText(domM);
            const m2 = countBlockTypesFromXmlText(xmlM);
            Object.keys(m2).forEach(k => map[k] = (map[k] || 0) + m2[k]);
        }
        return map;
    }

    function judgeSavedProgram(name) {
        const resEl = document.getElementById('assessmentResult');
        if (!resEl) return;
        if (!name) {
            resEl.textContent = '判定対象が選択されていません';
            return;
        }
        const key = savedBlockPrefix + name;
        const savedRaw = localStorage.getItem(key);
        if (!savedRaw) {
            resEl.textContent = '保存データが見つかりません: ' + name;
            return;
        }
        let saved;
        try {
            saved = JSON.parse(savedRaw);
        } catch (e) {
            resEl.textContent = '保存データの読み取りに失敗しました';
            return;
        }

        const savedMap = {};
        if (saved.function) {
            const m = countBlockTypesFromXmlText(saved.function);
            Object.keys(m).forEach(k => savedMap[k] = (savedMap[k] || 0) + m[k]);
        }
        if (saved.main) {
            const m2 = countBlockTypesFromXmlText(saved.main);
            Object.keys(m2).forEach(k => savedMap[k] = (savedMap[k] || 0) + m2[k]);
        }

        const currentMap = countBlockTypesFromCurrentWorkspaces();

        const missing = {};
        const excess = {};
        let forbiddenCount = 0;
        const forbiddenTypes = [];

        Object.keys(savedMap).forEach(type => {
            const s = savedMap[type] || 0;
            const c = currentMap[type] || 0;
            if (c < s) missing[type] = s - c;
            if (c > s) excess[type] = c - s;
        });
        Object.keys(currentMap).forEach(type => {
            if (!(type in savedMap)) {
                forbiddenCount += currentMap[type];
                forbiddenTypes.push({ type, count: currentMap[type] });
            }
        });

        const isCorrect = Object.keys(missing).length === 0 && Object.keys(excess).length === 0 && forbiddenCount === 0;

        let out = '';
        out += '判定: ' + (isCorrect ? '正解' : '不正解') + '\n\n';
        out += '欠損ブロック（必要だが現在不足）: ' + (Object.keys(missing).length ? '' : 'なし') + '\n';
        Object.keys(missing).forEach(k => out += `  ${k}: ${missing[k]}\n`);
        out += '\n過剰ブロック（現在多い）: ' + (Object.keys(excess).length ? '' : 'なし') + '\n';
        Object.keys(excess).forEach(k => out += `  ${k}: ${excess[k]}\n`);
        out += '\n本来使用しないブロック（保存にない）: ' + forbiddenCount + '\n';
        forbiddenTypes.forEach(f => out += `  ${f.type}: ${f.count}\n`);
        out += '\n--- 参照情報 ---\n';
        out += '保存時のブロック種類数: ' + Object.keys(savedMap).length + '\n';
        out += '現在のブロック種類数: ' + Object.keys(currentMap).length + '\n';

        resEl.textContent = out;
    }

    window.addEventListener('load', () => {
        createPanel();
        populateSavedPrograms();
        window.addEventListener('storage', populateSavedPrograms);
    });
})();