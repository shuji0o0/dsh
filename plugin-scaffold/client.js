window.__ModuleLoader__.load({
  id: "@shuji0o0/plugin-scaffold",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var react = require("react");
    var react_dom_client = require("react-dom/client");

    var createElement = react.createElement;
    var useState = react.useState;
    var createRoot = react_dom_client.createRoot;

    var ENTRY_SELECTOR = '[data-dsh-plugin-scaffold-entry]';

    var ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 2.5h5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z"/><path d="M8 5.5v5M5.5 8h5"/></svg>';

    var CSS = [
      '.psg-entry{width:100%;height:32px;color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:0 12px;font-size:13px;display:flex}',
      '.psg-entry:hover{background:var(--dsw-specific-sidebar-nav-item-hover);color:var(--dsw-alias-label-primary)}',
      '.psg-entry[data-active="true"]{background:var(--dsw-specific-sidebar-nav-item-active);color:var(--dsw-alias-label-primary)}',
      '.psg-entry-icon{flex:none;justify-content:center;align-items:center;display:inline-flex}',
      '.psg-entry-label{text-overflow:ellipsis;overflow:hidden}',
      '.psg-overlay{background:var(--dsw-alias-bg-mask-2,#080a1073);z-index:9999;justify-content:center;align-items:center;font-family:system-ui,-apple-system,Segoe UI,sans-serif;display:flex;position:fixed;inset:0}',
      '.psg-card{background:var(--dsw-alias-bg-base,#fdfdfd);width:min(560px,92vw);max-height:84vh;color:var(--dsw-alias-label-primary,#1c1e26);border-radius:12px;flex-direction:column;display:flex;overflow:hidden;box-shadow:0 18px 60px #00000059}',
      '.psg-head{border-bottom:1px solid var(--dsw-alias-border-l1,#e5e7eb);background:var(--dsw-alias-bg-layer-1,#f7f8fa);align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;display:flex}',
      '.psg-title{margin:0;font-size:15px;font-weight:600}',
      '.psg-close{border:1px solid var(--dsw-alias-border-l1,#d7dae0);background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary,#3a3f4b);cursor:pointer;border-radius:6px;padding:4px 10px;font-size:12px}',
      '.psg-body{padding:16px;gap:12px;display:flex;flex-direction:column;overflow:auto}',
      '.psg-row{gap:8px;display:flex;flex-direction:column}',
      '.psg-label{font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.psg-input{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#d7dae0);background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary);border-radius:6px;padding:6px 10px;font-size:13px}',
      '.psg-select{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,#d7dae0);background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary);border-radius:6px;padding:6px 10px;font-size:13px}',
      '.psg-gen{width:100%;background:var(--dsw-specific-sidebar-nav-item-active-accent,#316ac5);color:#fff;cursor:pointer;border:none;border-radius:8px;padding:9px 12px;font-size:13px;font-weight:600}',
      '.psg-out{margin:0;padding:12px;background:var(--dsw-alias-bg-layer-1,#f7f8fa);border:1px solid var(--dsw-alias-border-l1,#e5e7eb);border-radius:8px;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-all}',
    ].join('\n');

    function insertCss() {
      var style = document.createElement('style');
      style.setAttribute('data-dsh-plugin-scaffold', '');
      style.textContent = CSS;
      document.head.appendChild(style);
      return function () { style.remove(); };
    }

    function sidebarRoot() {
      var column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]');
      if (column === null) return undefined;
      return column.querySelector('[class*="logoRow"]')?.parentElement ?? column.firstElementChild;
    }

    function newSessionButton(root) {
      var nested = root.querySelector('button[class*="newSession"]');
      if (nested !== null) return nested;
      for (var i = 0; i < root.children.length; i++) if (root.children[i].tagName === 'BUTTON') return root.children[i];
    }

    function placeEntry(root, entry, options) {
      var button = newSessionButton(root);
      if (button === undefined) return false;
      if (entry.parentElement !== root) {
        var row = button.closest('[class*="logoRow"]');
        var base = row !== null && row.parentElement === root ? row : button;
        var family = Array.from(root.children).filter(function (el) {
          return el instanceof HTMLElement && el.matches(options.familySelectors.join(', '));
        });
        var anchor = options.position === 'before'
          ? (family.length > 0 ? family[0] : base.nextElementSibling)
          : (family.length > 0 ? family[family.length - 1].nextElementSibling : base.nextElementSibling);
        root.insertBefore(entry, anchor);
      }
      return true;
    }

    function mountSidebarEntry(onToggle) {
      if (document.querySelector(ENTRY_SELECTOR) !== null) return function () {};
      var entry = document.createElement('button');
      entry.type = 'button';
      entry.setAttribute('data-dsh-plugin-scaffold-entry', '');
      entry.setAttribute('data-dsh-plugin', 'plugin-scaffold');
      entry.setAttribute('data-dsh-part', 'sidebar-entry');
      entry.className = 'psg-entry';
      entry.setAttribute('aria-label', '插件生成器');
      entry.setAttribute('title', '生成 Cordis 插件骨架');
      entry.innerHTML = '<span class="psg-entry-icon">' + ICON + '</span><span class="psg-entry-label">插件生成器</span>';
      entry.addEventListener('click', onToggle);

      var options = {
        familySelectors: [
          '[data-dsh-taskboard-entry]',
          '[data-dsh-ssh-entry]',
          '[data-dsh-skill-explorer-entry]',
          '[data-dsh-plugin-scaffold-entry]',
        ],
        position: 'after',
      };

      var root;
      var placed = false;
      var tryPlace = function () {
        if (root !== undefined && !root.isConnected) { rootObserver.disconnect(); root = undefined; placed = false; }
        if (placed) {
          if (document.body.contains(entry)) return;
          rootObserver.disconnect(); root = undefined; placed = false;
        }
        root = root ?? sidebarRoot();
        if (root === undefined) return;
        placed = placeEntry(root, entry, options);
        if (placed) rootObserver.observe(root, { childList: true, subtree: true });
      };
      var waitObserver = new MutationObserver(function () { tryPlace(); });
      waitObserver.observe(document.body, { childList: true, subtree: true });
      var rootObserver = new MutationObserver(function () {
        if (root === undefined || !root.isConnected) { placed = false; tryPlace(); return; }
        if (!root.contains(entry)) placed = placeEntry(root, entry, options);
      });
      tryPlace();
      return function () { waitObserver.disconnect(); rootObserver.disconnect(); entry.remove(); };
    }

    function GeneratorOverlay(props) {
      var onClose = props.onClose;
      var nameState = useState('my-plugin');
      var pname = nameState[0];
      var setName = nameState[1];
      var platformState = useState('host');
      var platform = platformState[0];
      var setPlatform = platformState[1];
      var kindState = useState('tool');
      var kind = kindState[0];
      var setKind = kindState[1];
      var outState = useState('');
      var out = outState[0];
      var setOut = outState[1];

      var generate = function () {
        var extra = kind === 'tool' ? '，工具名 demo_tool' : '';
        var text = '用插件生成器生成一个名为 ' + pname + ' 的 ' + kind + ' 类型 ' + platform + ' 插件' + extra;
        setOut(text);
      };

      return createElement('div', { className: 'psg-overlay' },
        createElement('div', { className: 'psg-card' },
          createElement('div', { className: 'psg-head' },
            createElement('h2', { className: 'psg-title' }, '插件生成器'),
            createElement('button', { className: 'psg-close', onClick: onClose }, '关闭'),
          ),
          createElement('div', { className: 'psg-body' },
            createElement('label', { className: 'psg-row' },
              createElement('span', { className: 'psg-label' }, '插件名'),
              createElement('input', { className: 'psg-input', value: pname, onChange: function (e) { setName(e.target.value); } }),
            ),
            createElement('label', { className: 'psg-row' },
              createElement('span', { className: 'psg-label' }, '平台'),
              createElement('select', { className: 'psg-select', value: platform, onChange: function (e) { setPlatform(e.target.value); } },
                createElement('option', { value: 'host' }, 'host'),
                createElement('option', { value: 'client' }, 'client'),
                createElement('option', { value: 'both' }, 'both'),
              ),
            ),
            createElement('label', { className: 'psg-row' },
              createElement('span', { className: 'psg-label' }, '类型'),
              createElement('select', { className: 'psg-select', value: kind, onChange: function (e) { setKind(e.target.value); } },
                createElement('option', { value: 'basic' }, 'basic（空骨架）'),
                createElement('option', { value: 'tool' }, 'tool（注册工具）'),
                createElement('option', { value: 'event' }, 'event（监听事件）'),
                createElement('option', { value: 'ui' }, 'ui（注册 UI）'),
                createElement('option', { value: 'rpc' }, 'rpc（Client→Host 通信）'),
              ),
            ),
            createElement('button', { className: 'psg-gen', onClick: generate }, '生成提示'),
            out !== '' && createElement('div', null,
              createElement('p', { className: 'psg-out' }, out + '\n\n（复制这句话，粘贴到对话里即可让 agent 生成骨架）'),
            ),
          ),
        ),
      );
    }

    function mountOverlayController() {
      var root;
      var container;
      var open = function () {
        if (container !== undefined && container.isConnected) return;
        container = document.createElement('div');
        container.setAttribute('data-dsh-plugin-scaffold-overlay', '');
        document.body.appendChild(container);
        root = createRoot(container);
        root.render(createElement(GeneratorOverlay, { onClose: close }));
      };
      var close = function () {
        if (container === undefined) return;
        if (root) root.unmount();
        root = undefined;
        container.remove();
        container = undefined;
      };
      return { open: open, dispose: close };
    }

    function apply(ctx) {
      var disposers = [];
      try {
        disposers.push(insertCss());
        var overlay = mountOverlayController();
        disposers.push(function () { overlay.dispose(); });
        disposers.push(mountSidebarEntry(function () { overlay.open(); }));
      } catch (error) {
        console.warn('[plugin-scaffold] mount failed:', error);
      }
      ctx.effect(function () {
        return function () { for (var i = 0; i < disposers.length; i++) disposers[i](); };
      }, 'plugin-scaffold: ui');
    }

    exports.apply = apply;
    exports.inject = [];
    return module.exports;
  }
});
