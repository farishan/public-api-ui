
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fetcher(path, callback) {
      fetch('https://api.publicapis.org' + path)
        .then((res) => res.json())
        .then((res) => {
          callback(res);
        });
    }

    function debounce(func, timeout = 500) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    /* src/components/DarkToggler.svelte generated by Svelte v3.50.0 */

    const file$b = "src/components/DarkToggler.svelte";

    function create_fragment$c(ctx) {
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
    			add_location(path, file$b, 37, 4, 1768);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-moon");
    			add_location(svg, file$b, 25, 2, 1498);
    			attr_dev(button, "class", "dark-toggler svelte-2nwa6p");
    			attr_dev(button, "id", "darkToggler");
    			attr_dev(button, "title", "Current theme: dark. Click to switch");
    			add_location(button, file$b, 19, 0, 1366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", handleClick, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleClick() {
    	if (document.body.classList.contains('dark')) {
    		document.body.classList.remove('dark');
    		this.title = 'Current theme: light. Click to switch';

    		this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        `;

    		return;
    	}

    	this.title = 'Current theme: dark. Click to switch';

    	this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      `;

    	document.body.classList.add('dark');
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DarkToggler', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DarkToggler> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ handleClick });
    	return [];
    }

    class DarkToggler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DarkToggler",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.50.0 */
    const file$a = "src/components/Header.svelte";

    function create_fragment$b(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let small;
    	let t2;
    	let h2;
    	let t3;
    	let a;
    	let t5;
    	let div1;
    	let darktoggler;
    	let current;
    	darktoggler = new DarkToggler({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("Public APIs\r\n          ");
    			small = element("small");
    			small.textContent = "BETA";
    			t2 = space();
    			h2 = element("h2");
    			t3 = text("Unofficial User Interface for\r\n          ");
    			a = element("a");
    			a.textContent = "Public API for Public APIs";
    			t5 = space();
    			div1 = element("div");
    			create_component(darktoggler.$$.fragment);
    			attr_dev(small, "class", "api-status svelte-rivc8z");
    			attr_dev(small, "id", "apiStatus");
    			add_location(small, file$a, 10, 10, 295);
    			attr_dev(h1, "class", "svelte-rivc8z");
    			add_location(h1, file$a, 8, 8, 256);
    			attr_dev(a, "href", "https://api.publicapis.org/");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$a, 14, 10, 430);
    			attr_dev(h2, "class", "svelte-rivc8z");
    			add_location(h2, file$a, 12, 8, 373);
    			attr_dev(div0, "class", "flex flex-wrap items-center");
    			add_location(div0, file$a, 7, 6, 205);
    			add_location(div1, file$a, 21, 6, 628);
    			attr_dev(div2, "class", "header__flexbox flex flex-wrap justify-between svelte-rivc8z");
    			add_location(div2, file$a, 6, 4, 137);
    			attr_dev(div3, "class", "container--fluid");
    			add_location(div3, file$a, 5, 2, 101);
    			attr_dev(header, "class", "header svelte-rivc8z");
    			add_location(header, file$a, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, small);
    			append_dev(div0, t2);
    			append_dev(div0, h2);
    			append_dev(h2, t3);
    			append_dev(h2, a);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(darktoggler, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(darktoggler.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(darktoggler.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(darktoggler);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ DarkToggler });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const selectedCategories = writable([]);
    const addSelectedCategory = (value) => {
      selectedCategories.update((arr) => [...arr, value]);
    };
    const removeSelectedCategory = (value) => {
      let newArray = [];

      selectedCategories.subscribe((arr) => {
        newArray = [...arr];
      });

      newArray.splice(newArray.indexOf(value), 1);
      selectedCategories.set(newArray);
    };

    const entries = writable([]);

    /* src/components/entry/StatusIcon.svelte generated by Svelte v3.50.0 */

    // (24:0) {:else}
    function create_else_block$2(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*IconTimes*/ ctx[1], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(24:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if truthy}
    function create_if_block$3(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*IconCheck*/ ctx[2], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(22:0) {#if truthy}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*truthy*/ ctx[0]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StatusIcon', slots, []);
    	let { truthy } = $$props;

    	const IconTimes = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  class="feather feather-x">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;

    	const IconCheck = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  class="feather feather-check">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
`;

    	const writable_props = ['truthy'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StatusIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('truthy' in $$props) $$invalidate(0, truthy = $$props.truthy);
    	};

    	$$self.$capture_state = () => ({ truthy, IconTimes, IconCheck });

    	$$self.$inject_state = $$props => {
    		if ('truthy' in $$props) $$invalidate(0, truthy = $$props.truthy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [truthy, IconTimes, IconCheck];
    }

    class StatusIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { truthy: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StatusIcon",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*truthy*/ ctx[0] === undefined && !('truthy' in props)) {
    			console.warn("<StatusIcon> was created without expected prop 'truthy'");
    		}
    	}

    	get truthy() {
    		throw new Error("<StatusIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set truthy(value) {
    		throw new Error("<StatusIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/entry/Entry.svelte generated by Svelte v3.50.0 */
    const file$9 = "src/components/entry/Entry.svelte";

    function create_fragment$9(ctx) {
    	let article;
    	let h3;
    	let a;
    	let t0_value = /*entry*/ ctx[0].API + "";
    	let t0;
    	let a_href_value;
    	let small;
    	let t1_value = /*entry*/ ctx[0].Category + "";
    	let t1;
    	let t2;
    	let p;

    	let t3_value = (/*entry*/ ctx[0].Description.length > 30
    	? /*entry*/ ctx[0].Description.substr(0, 30) + '...'
    	: /*entry*/ ctx[0].Description) + "";

    	let t3;
    	let p_title_value;
    	let t4;
    	let div;
    	let span0;
    	let t5;
    	let span1;
    	let t7;
    	let statusicon0;
    	let t8;
    	let span2;
    	let t9;
    	let span3;
    	let t11;
    	let statusicon1;
    	let t12;
    	let span4;
    	let t13;
    	let span5;
    	let t15;
    	let statusicon2;
    	let div_title_value;
    	let article_class_value;
    	let current;

    	statusicon0 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].Auth === '' },
    			$$inline: true
    		});

    	statusicon1 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].HTTPS },
    			$$inline: true
    		});

    	statusicon2 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].Cors === 'yes' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			h3 = element("h3");
    			a = element("a");
    			t0 = text(t0_value);
    			small = element("small");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div = element("div");
    			span0 = element("span");
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "Auth";
    			t7 = space();
    			create_component(statusicon0.$$.fragment);
    			t8 = space();
    			span2 = element("span");
    			t9 = space();
    			span3 = element("span");
    			span3.textContent = "HTTPS";
    			t11 = space();
    			create_component(statusicon1.$$.fragment);
    			t12 = space();
    			span4 = element("span");
    			t13 = space();
    			span5 = element("span");
    			span5.textContent = "CORS";
    			t15 = space();
    			create_component(statusicon2.$$.fragment);
    			attr_dev(a, "href", a_href_value = /*entry*/ ctx[0].Link);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$9, 25, 4, 681);
    			attr_dev(small, "class", "entry__category svelte-15tibmb");
    			add_location(small, file$9, 27, 5, 773);
    			attr_dev(h3, "class", "entry__title flex items-center justify-between svelte-15tibmb");
    			add_location(h3, file$9, 24, 2, 616);
    			attr_dev(p, "class", "entry__description svelte-15tibmb");
    			attr_dev(p, "title", p_title_value = /*entry*/ ctx[0].Description);
    			add_location(p, file$9, 29, 2, 841);
    			set_style(span0, "display", "inline-block");
    			set_style(span0, "width", "8px");
    			set_style(span0, "height", "8px");
    			set_style(span0, "border-radius", "50%");
    			set_style(span0, "background", /*entry*/ ctx[0].Auth === '' ? 'green' : 'red');
    			add_location(span0, file$9, 39, 4, 1180);
    			set_style(span1, "margin", "0 2px 0 4px");
    			add_location(span1, file$9, 45, 4, 1349);
    			set_style(span2, "display", "inline-block");
    			set_style(span2, "width", "8px");
    			set_style(span2, "height", "8px");
    			set_style(span2, "border-radius", "50%");
    			set_style(span2, "background", /*entry*/ ctx[0].HTTPS ? 'green' : 'red');
    			add_location(span2, file$9, 48, 4, 1448);
    			set_style(span3, "margin", "0 2px 0 4px");
    			add_location(span3, file$9, 53, 4, 1604);
    			set_style(span4, "display", "inline-block");
    			set_style(span4, "width", "8px");
    			set_style(span4, "height", "8px");
    			set_style(span4, "border-radius", "50%");

    			set_style(span4, "background", /*entry*/ ctx[0].Cors === 'yes'
    			? 'green'
    			: /*entry*/ ctx[0].Cors === 'no' ? 'red' : 'orange');

    			add_location(span4, file$9, 56, 4, 1698);
    			set_style(span5, "margin", "0 2px 0 4px");
    			add_location(span5, file$9, 64, 4, 1921);
    			attr_dev(div, "class", "flex items-center");
    			set_style(div, "font-size", "0.75rem");
    			attr_dev(div, "title", div_title_value = `Auth: ${/*entry*/ ctx[0].Auth} | HTTPS: ${/*entry*/ ctx[0].HTTPS} | Cors: ${/*entry*/ ctx[0].Cors}`);
    			add_location(div, file$9, 34, 2, 1022);

    			attr_dev(article, "class", article_class_value = "entry " + (/*recommended*/ ctx[2]
    			? 'recommended'
    			: /*notRecommended*/ ctx[1] ? 'not-recommended' : '') + " svelte-15tibmb");

    			add_location(article, file$9, 17, 0, 492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h3);
    			append_dev(h3, a);
    			append_dev(a, t0);
    			append_dev(h3, small);
    			append_dev(small, t1);
    			append_dev(article, t2);
    			append_dev(article, p);
    			append_dev(p, t3);
    			append_dev(article, t4);
    			append_dev(article, div);
    			append_dev(div, span0);
    			append_dev(div, t5);
    			append_dev(div, span1);
    			append_dev(div, t7);
    			mount_component(statusicon0, div, null);
    			append_dev(div, t8);
    			append_dev(div, span2);
    			append_dev(div, t9);
    			append_dev(div, span3);
    			append_dev(div, t11);
    			mount_component(statusicon1, div, null);
    			append_dev(div, t12);
    			append_dev(div, span4);
    			append_dev(div, t13);
    			append_dev(div, span5);
    			append_dev(div, t15);
    			mount_component(statusicon2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*entry*/ 1) && t0_value !== (t0_value = /*entry*/ ctx[0].API + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*entry*/ 1 && a_href_value !== (a_href_value = /*entry*/ ctx[0].Link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*entry*/ 1) && t1_value !== (t1_value = /*entry*/ ctx[0].Category + "")) set_data_dev(t1, t1_value);

    			if ((!current || dirty & /*entry*/ 1) && t3_value !== (t3_value = (/*entry*/ ctx[0].Description.length > 30
    			? /*entry*/ ctx[0].Description.substr(0, 30) + '...'
    			: /*entry*/ ctx[0].Description) + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*entry*/ 1 && p_title_value !== (p_title_value = /*entry*/ ctx[0].Description)) {
    				attr_dev(p, "title", p_title_value);
    			}

    			if (!current || dirty & /*entry*/ 1) {
    				set_style(span0, "background", /*entry*/ ctx[0].Auth === '' ? 'green' : 'red');
    			}

    			const statusicon0_changes = {};
    			if (dirty & /*entry*/ 1) statusicon0_changes.truthy = /*entry*/ ctx[0].Auth === '';
    			statusicon0.$set(statusicon0_changes);

    			if (!current || dirty & /*entry*/ 1) {
    				set_style(span2, "background", /*entry*/ ctx[0].HTTPS ? 'green' : 'red');
    			}

    			const statusicon1_changes = {};
    			if (dirty & /*entry*/ 1) statusicon1_changes.truthy = /*entry*/ ctx[0].HTTPS;
    			statusicon1.$set(statusicon1_changes);

    			if (!current || dirty & /*entry*/ 1) {
    				set_style(span4, "background", /*entry*/ ctx[0].Cors === 'yes'
    				? 'green'
    				: /*entry*/ ctx[0].Cors === 'no' ? 'red' : 'orange');
    			}

    			const statusicon2_changes = {};
    			if (dirty & /*entry*/ 1) statusicon2_changes.truthy = /*entry*/ ctx[0].Cors === 'yes';
    			statusicon2.$set(statusicon2_changes);

    			if (!current || dirty & /*entry*/ 1 && div_title_value !== (div_title_value = `Auth: ${/*entry*/ ctx[0].Auth} | HTTPS: ${/*entry*/ ctx[0].HTTPS} | Cors: ${/*entry*/ ctx[0].Cors}`)) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!current || dirty & /*recommended, notRecommended*/ 6 && article_class_value !== (article_class_value = "entry " + (/*recommended*/ ctx[2]
    			? 'recommended'
    			: /*notRecommended*/ ctx[1] ? 'not-recommended' : '') + " svelte-15tibmb")) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(statusicon0.$$.fragment, local);
    			transition_in(statusicon1.$$.fragment, local);
    			transition_in(statusicon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(statusicon0.$$.fragment, local);
    			transition_out(statusicon1.$$.fragment, local);
    			transition_out(statusicon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(statusicon0);
    			destroy_component(statusicon1);
    			destroy_component(statusicon2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let recommended;
    	let notRecommended;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Entry', slots, []);

    	let { entry = {
    		API: 'AdoptAPet',
    		Auth: 'apiKey',
    		Category: 'Animals',
    		Cors: 'yes',
    		Description: 'Resource to help get pets adopted',
    		HTTPS: true,
    		Link: 'https://www.adoptapet.com/public/apis/pet_list.html'
    	} } = $$props;

    	const writable_props = ['entry'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Entry> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    	};

    	$$self.$capture_state = () => ({
    		StatusIcon,
    		entry,
    		notRecommended,
    		recommended
    	});

    	$$self.$inject_state = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    		if ('notRecommended' in $$props) $$invalidate(1, notRecommended = $$props.notRecommended);
    		if ('recommended' in $$props) $$invalidate(2, recommended = $$props.recommended);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*entry*/ 1) {
    			$$invalidate(2, recommended = entry.Auth === '' && entry.HTTPS && entry.Cors === 'yes');
    		}

    		if ($$self.$$.dirty & /*entry*/ 1) {
    			$$invalidate(1, notRecommended = entry.Auth !== '' && !entry.HTTPS && entry.Cors !== 'yes');
    		}
    	};

    	return [entry, notRecommended, recommended];
    }

    class Entry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { entry: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entry",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get entry() {
    		throw new Error("<Entry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<Entry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/entry/Entries.svelte generated by Svelte v3.50.0 */
    const file$8 = "src/components/entry/Entries.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:2) {#if !$entries || $entries === null || !$entries.length}
    function create_if_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No entry.";
    			attr_dev(p, "class", "info svelte-10bbv7l");
    			add_location(p, file$8, 9, 4, 258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(9:2) {#if !$entries || $entries === null || !$entries.length}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*$entries*/ ctx[1].slice(0, 12);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$entries*/ 2) {
    				each_value_1 = /*$entries*/ ctx[1].slice(0, 12);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(17:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {#if showAll}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$entries*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$entries*/ 2) {
    				each_value = /*$entries*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(13:2) {#if showAll}",
    		ctx
    	});

    	return block;
    }

    // (18:4) {#each $entries.slice(0, 12) as entry}
    function create_each_block_1(ctx) {
    	let entry;
    	let current;

    	entry = new Entry({
    			props: { entry: /*entry*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(entry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entry, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const entry_changes = {};
    			if (dirty & /*$entries*/ 2) entry_changes.entry = /*entry*/ ctx[3];
    			entry.$set(entry_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(18:4) {#each $entries.slice(0, 12) as entry}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#each $entries as entry}
    function create_each_block$3(ctx) {
    	let entry;
    	let current;

    	entry = new Entry({
    			props: { entry: /*entry*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(entry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entry, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const entry_changes = {};
    			if (dirty & /*$entries*/ 2) entry_changes.entry = /*entry*/ ctx[3];
    			entry.$set(entry_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(14:4) {#each $entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if showAll === false}
    function create_if_block$2(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Show All";
    			add_location(button, file$8, 24, 4, 551);
    			attr_dev(div, "class", "show-all svelte-10bbv7l");
    			add_location(div, file$8, 23, 2, 523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:0) {#if showAll === false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t0;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = (!/*$entries*/ ctx[1] || /*$entries*/ ctx[1] === null || !/*$entries*/ ctx[1].length) && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showAll*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = /*showAll*/ ctx[0] === false && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "entries svelte-10bbv7l");
    			add_location(div, file$8, 7, 0, 171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if_blocks[current_block_type_index].m(div, null);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*$entries*/ ctx[1] || /*$entries*/ ctx[1] === null || !/*$entries*/ ctx[1].length) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}

    			if (/*showAll*/ ctx[0] === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $entries;
    	validate_store(entries, 'entries');
    	component_subscribe($$self, entries, $$value => $$invalidate(1, $entries = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Entries', slots, []);
    	let showAll = $entries.length > 12 ? false : true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Entries> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, showAll = true);
    	$$self.$capture_state = () => ({ entries, Entry, showAll, $entries });

    	$$self.$inject_state = $$props => {
    		if ('showAll' in $$props) $$invalidate(0, showAll = $$props.showAll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showAll, $entries, click_handler];
    }

    class Entries extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Entries",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/entry/EntrySkeleton.svelte generated by Svelte v3.50.0 */
    const file$7 = "src/components/entry/EntrySkeleton.svelte";

    function create_fragment$7(ctx) {
    	let article;
    	let h3;
    	let span0;
    	let t0_value = /*entry*/ ctx[0].API + "";
    	let t0;
    	let small;
    	let t1_value = /*entry*/ ctx[0].Category + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*entry*/ ctx[0].Description.substr(0, 30) + '...' + "";
    	let t3;
    	let p_title_value;
    	let t4;
    	let div;
    	let span1;
    	let t5;
    	let span2;
    	let t7;
    	let statusicon0;
    	let t8;
    	let span3;
    	let t9;
    	let span4;
    	let t11;
    	let statusicon1;
    	let t12;
    	let span5;
    	let t13;
    	let span6;
    	let t15;
    	let statusicon2;
    	let current;

    	statusicon0 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].Auth === '' },
    			$$inline: true
    		});

    	statusicon1 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].HTTPS },
    			$$inline: true
    		});

    	statusicon2 = new StatusIcon({
    			props: { truthy: /*entry*/ ctx[0].Cors === 'yes' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			h3 = element("h3");
    			span0 = element("span");
    			t0 = text(t0_value);
    			small = element("small");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div = element("div");
    			span1 = element("span");
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "Auth";
    			t7 = space();
    			create_component(statusicon0.$$.fragment);
    			t8 = space();
    			span3 = element("span");
    			t9 = space();
    			span4 = element("span");
    			span4.textContent = "HTTPS";
    			t11 = space();
    			create_component(statusicon1.$$.fragment);
    			t12 = space();
    			span5 = element("span");
    			t13 = space();
    			span6 = element("span");
    			span6.textContent = "CORS";
    			t15 = space();
    			create_component(statusicon2.$$.fragment);
    			add_location(span0, file$7, 16, 4, 439);
    			attr_dev(small, "class", "entry__category grey svelte-1ahn75l");
    			add_location(small, file$7, 16, 28, 463);
    			attr_dev(h3, "class", "entry__title grey flex items-center justify-between svelte-1ahn75l");
    			add_location(h3, file$7, 15, 2, 369);
    			attr_dev(p, "class", "entry__description grey svelte-1ahn75l");
    			attr_dev(p, "title", p_title_value = /*entry*/ ctx[0].Description);
    			add_location(p, file$7, 20, 2, 550);
    			set_style(span1, "display", "inline-block");
    			set_style(span1, "width", "8px");
    			set_style(span1, "height", "8px");
    			set_style(span1, "border-radius", "50%");
    			set_style(span1, "background", "green");
    			add_location(span1, file$7, 24, 4, 738);
    			set_style(span2, "margin", "0 2px 0 4px");
    			add_location(span2, file$7, 27, 4, 850);
    			set_style(span3, "display", "inline-block");
    			set_style(span3, "width", "8px");
    			set_style(span3, "height", "8px");
    			set_style(span3, "border-radius", "50%");
    			set_style(span3, "background", "green");
    			add_location(span3, file$7, 29, 4, 947);
    			set_style(span4, "margin", "0 2px 0 4px");
    			add_location(span4, file$7, 32, 4, 1059);
    			set_style(span5, "display", "inline-block");
    			set_style(span5, "width", "8px");
    			set_style(span5, "height", "8px");
    			set_style(span5, "border-radius", "50%");
    			set_style(span5, "background", "green");
    			add_location(span5, file$7, 34, 4, 1151);
    			set_style(span6, "margin", "0 2px 0 4px");
    			add_location(span6, file$7, 37, 4, 1263);
    			attr_dev(div, "class", "flex items-center grey svelte-1ahn75l");
    			set_style(div, "font-size", "0.75rem");
    			add_location(div, file$7, 23, 2, 670);
    			attr_dev(article, "class", "entry recommended svelte-1ahn75l");
    			add_location(article, file$7, 14, 0, 330);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h3);
    			append_dev(h3, span0);
    			append_dev(span0, t0);
    			append_dev(h3, small);
    			append_dev(small, t1);
    			append_dev(article, t2);
    			append_dev(article, p);
    			append_dev(p, t3);
    			append_dev(article, t4);
    			append_dev(article, div);
    			append_dev(div, span1);
    			append_dev(div, t5);
    			append_dev(div, span2);
    			append_dev(div, t7);
    			mount_component(statusicon0, div, null);
    			append_dev(div, t8);
    			append_dev(div, span3);
    			append_dev(div, t9);
    			append_dev(div, span4);
    			append_dev(div, t11);
    			mount_component(statusicon1, div, null);
    			append_dev(div, t12);
    			append_dev(div, span5);
    			append_dev(div, t13);
    			append_dev(div, span6);
    			append_dev(div, t15);
    			mount_component(statusicon2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*entry*/ 1) && t0_value !== (t0_value = /*entry*/ ctx[0].API + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*entry*/ 1) && t1_value !== (t1_value = /*entry*/ ctx[0].Category + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*entry*/ 1) && t3_value !== (t3_value = /*entry*/ ctx[0].Description.substr(0, 30) + '...' + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*entry*/ 1 && p_title_value !== (p_title_value = /*entry*/ ctx[0].Description)) {
    				attr_dev(p, "title", p_title_value);
    			}

    			const statusicon0_changes = {};
    			if (dirty & /*entry*/ 1) statusicon0_changes.truthy = /*entry*/ ctx[0].Auth === '';
    			statusicon0.$set(statusicon0_changes);
    			const statusicon1_changes = {};
    			if (dirty & /*entry*/ 1) statusicon1_changes.truthy = /*entry*/ ctx[0].HTTPS;
    			statusicon1.$set(statusicon1_changes);
    			const statusicon2_changes = {};
    			if (dirty & /*entry*/ 1) statusicon2_changes.truthy = /*entry*/ ctx[0].Cors === 'yes';
    			statusicon2.$set(statusicon2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(statusicon0.$$.fragment, local);
    			transition_in(statusicon1.$$.fragment, local);
    			transition_in(statusicon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(statusicon0.$$.fragment, local);
    			transition_out(statusicon1.$$.fragment, local);
    			transition_out(statusicon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(statusicon0);
    			destroy_component(statusicon1);
    			destroy_component(statusicon2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EntrySkeleton', slots, []);

    	let { entry = {
    		API: 'AdoptAPet',
    		Auth: 'apiKey',
    		Category: 'Animals',
    		Cors: 'yes',
    		Description: 'Resource to help get pets adopted',
    		HTTPS: true,
    		Link: 'https://www.adoptapet.com/public/apis/pet_list.html'
    	} } = $$props;

    	const writable_props = ['entry'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EntrySkeleton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    	};

    	$$self.$capture_state = () => ({ StatusIcon, entry });

    	$$self.$inject_state = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entry];
    }

    class EntrySkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { entry: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EntrySkeleton",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get entry() {
    		throw new Error("<EntrySkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<EntrySkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/entry/EntriesSkeleton.svelte generated by Svelte v3.50.0 */
    const file$6 = "src/components/entry/EntriesSkeleton.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	child_ctx[2] = i;
    	return child_ctx;
    }

    // (6:2) {#each Array(12) as _, i}
    function create_each_block$2(ctx) {
    	let entryskeleton;
    	let current;
    	entryskeleton = new EntrySkeleton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(entryskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entryskeleton, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entryskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entryskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entryskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(6:2) {#each Array(12) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	let each_value = Array(12);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "entries svelte-1s374q");
    			add_location(div, file$6, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EntriesSkeleton', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EntriesSkeleton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ EntrySkeleton });
    	return [];
    }

    class EntriesSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EntriesSkeleton",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/form/FormRow.svelte generated by Svelte v3.50.0 */

    const file$5 = "src/components/form/FormRow.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "form-row svelte-czg3e6");
    			add_location(div, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormRow', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class FormRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormRow",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/layout/MainLayout.svelte generated by Svelte v3.50.0 */

    const file$4 = "src/components/layout/MainLayout.svelte";
    const get_aside_slot_changes = dirty => ({});
    const get_aside_slot_context = ctx => ({});
    const get_main_slot_changes = dirty => ({});
    const get_main_slot_context = ctx => ({});

    function create_fragment$4(ctx) {
    	let div;
    	let main;
    	let t;
    	let aside;
    	let current;
    	const main_slot_template = /*#slots*/ ctx[1].main;
    	const main_slot = create_slot(main_slot_template, ctx, /*$$scope*/ ctx[0], get_main_slot_context);
    	const aside_slot_template = /*#slots*/ ctx[1].aside;
    	const aside_slot = create_slot(aside_slot_template, ctx, /*$$scope*/ ctx[0], get_aside_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			main = element("main");
    			if (main_slot) main_slot.c();
    			t = space();
    			aside = element("aside");
    			if (aside_slot) aside_slot.c();
    			attr_dev(main, "class", "main svelte-1aizzw5");
    			add_location(main, file$4, 1, 2, 52);
    			attr_dev(aside, "class", "sidebar relative svelte-1aizzw5");
    			add_location(aside, file$4, 4, 2, 112);
    			attr_dev(div, "class", "main-wrapper container--fluid flex svelte-1aizzw5");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, main);

    			if (main_slot) {
    				main_slot.m(main, null);
    			}

    			append_dev(div, t);
    			append_dev(div, aside);

    			if (aside_slot) {
    				aside_slot.m(aside, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (main_slot) {
    				if (main_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						main_slot,
    						main_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(main_slot_template, /*$$scope*/ ctx[0], dirty, get_main_slot_changes),
    						get_main_slot_context
    					);
    				}
    			}

    			if (aside_slot) {
    				if (aside_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						aside_slot,
    						aside_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(aside_slot_template, /*$$scope*/ ctx[0], dirty, get_aside_slot_changes),
    						get_aside_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main_slot, local);
    			transition_in(aside_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main_slot, local);
    			transition_out(aside_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (main_slot) main_slot.d(detaching);
    			if (aside_slot) aside_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainLayout', slots, ['main','aside']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainLayout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class MainLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainLayout",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/CheckboxWithLabel.svelte generated by Svelte v3.50.0 */

    const file$3 = "src/components/CheckboxWithLabel.svelte";

    function create_fragment$3(ctx) {
    	let label;
    	let input;
    	let input_id_value;
    	let input_checked_value;
    	let t0;
    	let span;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*category*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = "checkbox_" + /*category*/ ctx[1]);
    			attr_dev(input, "name", /*name*/ ctx[0]);
    			input.value = /*category*/ ctx[1];
    			input.checked = input_checked_value = /*$selectedCategories*/ ctx[2].includes(/*category*/ ctx[1]);
    			attr_dev(input, "class", "svelte-ojm33k");
    			add_location(input, file$3, 27, 2, 632);
    			attr_dev(span, "class", "svelte-ojm33k");
    			add_location(span, file$3, 35, 2, 817);
    			attr_dev(label, "class", "flex items-center svelte-ojm33k");
    			add_location(label, file$3, 26, 0, 595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*handleChange*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*category*/ 2 && input_id_value !== (input_id_value = "checkbox_" + /*category*/ ctx[1])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(input, "name", /*name*/ ctx[0]);
    			}

    			if (dirty & /*category*/ 2) {
    				prop_dev(input, "value", /*category*/ ctx[1]);
    			}

    			if (dirty & /*$selectedCategories, category*/ 6 && input_checked_value !== (input_checked_value = /*$selectedCategories*/ ctx[2].includes(/*category*/ ctx[1]))) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*category*/ 2) set_data_dev(t1, /*category*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $selectedCategories;
    	validate_store(selectedCategories, 'selectedCategories');
    	component_subscribe($$self, selectedCategories, $$value => $$invalidate(2, $selectedCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckboxWithLabel', slots, []);
    	let { name } = $$props;
    	let { category } = $$props;

    	function handleSelectedCategory(value, checked) {
    		if (checked && !$selectedCategories.includes(value)) {
    			addSelectedCategory(value);
    		}

    		if (!checked && $selectedCategories.includes(value)) {
    			removeSelectedCategory(value);
    		}
    	} // fetchSelectedCategories();

    	const handleChange = e => handleSelectedCategory(e.target.value, e.target.checked);
    	const writable_props = ['name', 'category'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckboxWithLabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    	};

    	$$self.$capture_state = () => ({
    		selectedCategories,
    		addSelectedCategory,
    		removeSelectedCategory,
    		name,
    		category,
    		handleSelectedCategory,
    		handleChange,
    		$selectedCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, category, $selectedCategories, handleChange];
    }

    class CheckboxWithLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { name: 0, category: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckboxWithLabel",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<CheckboxWithLabel> was created without expected prop 'name'");
    		}

    		if (/*category*/ ctx[1] === undefined && !('category' in props)) {
    			console.warn("<CheckboxWithLabel> was created without expected prop 'category'");
    		}
    	}

    	get name() {
    		throw new Error("<CheckboxWithLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<CheckboxWithLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<CheckboxWithLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<CheckboxWithLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/CategoryCheckboxes.svelte generated by Svelte v3.50.0 */

    const { console: console_1 } = globals;
    const file$2 = "src/components/CategoryCheckboxes.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (46:4) {#if categories}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories*/ 2) {
    				each_value = /*categories*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(46:4) {#if categories}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#each categories as category}
    function create_each_block$1(ctx) {
    	let checkboxwithlabel;
    	let current;

    	checkboxwithlabel = new CheckboxWithLabel({
    			props: {
    				name: "categories",
    				category: /*category*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(checkboxwithlabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkboxwithlabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkboxwithlabel_changes = {};
    			if (dirty & /*categories*/ 2) checkboxwithlabel_changes.category = /*category*/ ctx[4];
    			checkboxwithlabel.$set(checkboxwithlabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkboxwithlabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkboxwithlabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkboxwithlabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(47:6) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let input;
    	let t3;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*categories*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			t0 = text("Filter by categories ");
    			t1 = text(/*keyword*/ ctx[0]);
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			add_location(h3, file$2, 38, 2, 1107);
    			attr_dev(input, "class", "w-full mb-4");
    			attr_dev(input, "placeholder", "Search category");
    			add_location(input, file$2, 39, 2, 1150);
    			attr_dev(div0, "class", "category-checkboxes svelte-4ydsdf");
    			attr_dev(div0, "id", "categoryOptions");
    			add_location(div0, file$2, 44, 2, 1252);
    			attr_dev(div1, "class", "category-widget svelte-4ydsdf");
    			add_location(div1, file$2, 37, 0, 1074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			set_input_value(input, /*keyword*/ ctx[0]);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*keyword*/ 1) set_data_dev(t1, /*keyword*/ ctx[0]);

    			if (dirty & /*keyword*/ 1 && input.value !== /*keyword*/ ctx[0]) {
    				set_input_value(input, /*keyword*/ ctx[0]);
    			}

    			if (/*categories*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*categories*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const KEY = "PUBLIC_API_CATEGORIES";

    function instance$2($$self, $$props, $$invalidate) {
    	let categories;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CategoryCheckboxes', slots, []);
    	let defaultCategories = [];
    	let keyword = "";

    	if (sessionStorage.getItem(KEY)) {
    		const savedCategories = JSON.parse(sessionStorage.getItem(KEY));

    		if (savedCategories) {
    			defaultCategories = savedCategories;
    			categories = defaultCategories;
    		} else {
    			console.log("Something went wrong", { savedCategories });
    		}
    	} else {
    		fetcher("/categories", function (res) {
    			if (res && res.categories) {
    				sessionStorage.setItem(KEY, JSON.stringify(res.categories));
    				$$invalidate(2, defaultCategories = res.categories);
    				$$invalidate(1, categories = defaultCategories);
    			} else {
    				console.log("Something went wrong", { res });
    			}
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<CategoryCheckboxes> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		keyword = this.value;
    		$$invalidate(0, keyword);
    	}

    	$$self.$capture_state = () => ({
    		fetcher,
    		CheckboxWithLabel,
    		KEY,
    		defaultCategories,
    		keyword,
    		categories
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultCategories' in $$props) $$invalidate(2, defaultCategories = $$props.defaultCategories);
    		if ('keyword' in $$props) $$invalidate(0, keyword = $$props.keyword);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*keyword, defaultCategories*/ 5) {
    			$$invalidate(1, categories = keyword === ""
    			? defaultCategories
    			: defaultCategories.filter(category => category.toLowerCase().includes(keyword.toLowerCase())));
    		}
    	};

    	return [keyword, categories, defaultCategories, input_input_handler];
    }

    class CategoryCheckboxes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CategoryCheckboxes",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/SelectedCategories.svelte generated by Svelte v3.50.0 */
    const file$1 = "src/components/SelectedCategories.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each $selectedCategories as category}
    function create_each_block(ctx) {
    	let span;
    	let t_value = /*category*/ ctx[2] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*category*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "selected-category svelte-wafgqv");
    			add_location(span, file$1, 9, 4, 291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$selectedCategories*/ 1 && t_value !== (t_value = /*category*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:2) {#each $selectedCategories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let div_class_value;
    	let each_value = /*$selectedCategories*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "selected-categories " + (/*$selectedCategories*/ ctx[0].length ? 'filled' : '') + " svelte-wafgqv");
    			attr_dev(div, "id", "selectedCategories");
    			set_style(div, "width", "70%");
    			add_location(div, file$1, 7, 0, 121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*removeSelectedCategory, $selectedCategories*/ 1) {
    				each_value = /*$selectedCategories*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$selectedCategories*/ 1 && div_class_value !== (div_class_value = "selected-categories " + (/*$selectedCategories*/ ctx[0].length ? 'filled' : '') + " svelte-wafgqv")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $selectedCategories;
    	validate_store(selectedCategories, 'selectedCategories');
    	component_subscribe($$self, selectedCategories, $$value => $$invalidate(0, $selectedCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectedCategories', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectedCategories> was created with unknown prop '${key}'`);
    	});

    	const click_handler = category => removeSelectedCategory(category);

    	$$self.$capture_state = () => ({
    		selectedCategories,
    		removeSelectedCategory,
    		$selectedCategories
    	});

    	return [$selectedCategories, click_handler];
    }

    class SelectedCategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectedCategories",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.50.0 */
    const file = "src/App.svelte";

    // (128:4) {:else}
    function create_else_block(ctx) {
    	let entries_1;
    	let current;
    	entries_1 = new Entries({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(entries_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entries_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entries_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entries_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entries_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(128:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (126:4) {#if isFetching}
    function create_if_block(ctx) {
    	let entriesskeleton;
    	let current;
    	entriesskeleton = new EntriesSkeleton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(entriesskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(entriesskeleton, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(entriesskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(entriesskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(entriesskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(126:4) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (124:2) <svelte:fragment slot="main">
    function create_main_slot(ctx) {
    	let selectedcategories;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	selectedcategories = new SelectedCategories({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(selectedcategories.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectedcategories, target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectedcategories.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectedcategories.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectedcategories, detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_main_slot.name,
    		type: "slot",
    		source: "(124:2) <svelte:fragment slot=\\\"main\\\">",
    		ctx
    	});

    	return block;
    }

    // (134:6) <FormRow>
    function create_default_slot(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "w-full border svelte-1pn3l3v");
    			attr_dev(input, "placeholder", "Search");
    			add_location(input, file, 134, 8, 3560);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*keyword*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*keyword*/ 1 && input.value !== /*keyword*/ ctx[0]) {
    				set_input_value(input, /*keyword*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(134:6) <FormRow>",
    		ctx
    	});

    	return block;
    }

    // (132:2) <svelte:fragment slot="aside">
    function create_aside_slot(ctx) {
    	let div;
    	let formrow;
    	let t;
    	let categorycheckboxes;
    	let current;

    	formrow = new FormRow({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	categorycheckboxes = new CategoryCheckboxes({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(formrow.$$.fragment);
    			t = space();
    			create_component(categorycheckboxes.$$.fragment);
    			attr_dev(div, "class", "sticky top-0");
    			add_location(div, file, 132, 4, 3509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(formrow, div, null);
    			append_dev(div, t);
    			mount_component(categorycheckboxes, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formrow_changes = {};

    			if (dirty & /*$$scope, keyword*/ 65) {
    				formrow_changes.$$scope = { dirty, ctx };
    			}

    			formrow.$set(formrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formrow.$$.fragment, local);
    			transition_in(categorycheckboxes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formrow.$$.fragment, local);
    			transition_out(categorycheckboxes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(formrow);
    			destroy_component(categorycheckboxes);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_aside_slot.name,
    		type: "slot",
    		source: "(132:2) <svelte:fragment slot=\\\"aside\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t;
    	let mainlayout;
    	let current;
    	header = new Header({ $$inline: true });

    	mainlayout = new MainLayout({
    			props: {
    				$$slots: {
    					aside: [create_aside_slot],
    					main: [create_main_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(mainlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(mainlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mainlayout_changes = {};

    			if (dirty & /*$$scope, keyword, isFetching*/ 67) {
    				mainlayout_changes.$$scope = { dirty, ctx };
    			}

    			mainlayout.$set(mainlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(mainlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(mainlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(mainlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const DEFAULT_QUERY = '?auth=null&cors=yes&https=true';

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const cache = { init: [] };
    	let isFetching = true;
    	let keyword = '';

    	const debouncedGetByKeyword = debounce(keyword => {
    		const onlyWhitespace = !keyword.replace(/\s/g, '').length;

    		if (!onlyWhitespace && isFetching === false) {
    			$$invalidate(1, isFetching = true);
    			let newEntries = [];

    			const titlePromise = new Promise(resolve => {
    					fetcher(`/entries?title=${keyword}`, function (res) {
    						resolve(res);
    					});
    				});

    			const descPromise = new Promise(resolve => {
    					fetcher(`/entries?description=${keyword}`, function (res) {
    						resolve(res);
    					});
    				});

    			Promise.all([titlePromise, descPromise]).then(res => {
    				res.forEach(resObj => {
    					if (resObj.count) {
    						newEntries = [...newEntries, ...resObj.entries];
    					}
    				});
    			}).finally(() => {
    				$$invalidate(1, isFetching = false);
    				entries.set(newEntries);
    			});
    		}
    	});

    	const debouncedGetByCategory = debounce(cacheKeys => {
    		const promises = [];
    		let newEntries = [];

    		cacheKeys.forEach(cacheKey => {
    			if (!cache[cacheKey]) {
    				promises.push(new Promise((resolve, reject) => {
    						fetcher(`/entries?category=${cacheKey}`, function (res) {
    							if (res && res.entries) {
    								$$invalidate(2, cache[cacheKey] = res.entries, cache);
    								resolve(res);
    							}
    						});
    					}));
    			} else {
    				newEntries = [...newEntries, ...cache[cacheKey]];
    			}
    		});

    		if (promises.length) {
    			$$invalidate(1, isFetching = true);

    			Promise.all(promises).then(res => {
    				res.forEach(byCat => {
    					newEntries = [...newEntries, ...byCat.entries];
    				});
    			}).finally(() => {
    				$$invalidate(1, isFetching = false);
    				entries.set(newEntries);
    			});
    		} else {
    			$$invalidate(1, isFetching = false);
    			entries.set(newEntries);
    		}
    	});

    	/* Initial data fetch */
    	fetcher('/entries' + DEFAULT_QUERY, function (res) {
    		if (res && res.entries) {
    			$$invalidate(2, cache.init = res.entries, cache);
    			entries.set(res.entries);
    		}

    		$$invalidate(1, isFetching = false);
    	});

    	/* Listen to category changes */
    	selectedCategories.subscribe(value => {
    		if (isFetching === false) {
    			debouncedGetByCategory(value);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		keyword = this.value;
    		$$invalidate(0, keyword);
    	}

    	$$self.$capture_state = () => ({
    		fetcher,
    		debounce,
    		Header,
    		Entries,
    		EntriesSkeleton,
    		FormRow,
    		MainLayout,
    		CategoryCheckboxes,
    		SelectedCategories,
    		entries,
    		selectedCategories,
    		DEFAULT_QUERY,
    		cache,
    		isFetching,
    		keyword,
    		debouncedGetByKeyword,
    		debouncedGetByCategory
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFetching' in $$props) $$invalidate(1, isFetching = $$props.isFetching);
    		if ('keyword' in $$props) $$invalidate(0, keyword = $$props.keyword);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*keyword, cache*/ 5) {
    			/* Listen to keyword changes */
    			if (keyword === '') {
    				entries.set(cache.init);
    			} else {
    				debouncedGetByKeyword(keyword);
    			}
    		}
    	};

    	return [keyword, isFetching, cache, input_input_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
