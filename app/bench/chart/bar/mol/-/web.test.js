function require( path ){ return $node[ path ] };
"use strict";
var $;
(function ($_1) {
    let $$;
    (function ($$) {
        let $;
    })($$ = $_1.$$ || ($_1.$$ = {}));
    function $mol_test(set) {
        for (let name in set) {
            const code = set[name];
            const test = (typeof code === 'string') ? new Function('', code) : code;
            $_1.$mol_test_all.push($_1.$mol_log_group(name, test));
        }
        $mol_test_schedule();
    }
    $_1.$mol_test = $mol_test;
    $_1.$mol_test_mocks = [];
    $_1.$mol_test_all = [];
    async function $mol_test_run() {
        for (var test of $_1.$mol_test_all) {
            let context = Object.create($$);
            for (let mock of $_1.$mol_test_mocks)
                await mock(context);
            await test(context);
        }
        console.info('$mol_test completed', $_1.$mol_test_all.length);
    }
    $_1.$mol_test_run = $mol_test_run;
    let scheduled = false;
    function $mol_test_schedule() {
        if (scheduled)
            return;
        scheduled = true;
        setTimeout($_1.$mol_log_group('$mol_test', () => {
            scheduled = false;
            $mol_test_run();
        }));
    }
    $_1.$mol_test_schedule = $mol_test_schedule;
    $_1.$mol_test_mocks.push(context => {
        let seed = 0;
        context.Math = Object.create(Math);
        context.Math.random = () => Math.sin(seed++);
        const forbidden = ['XMLHttpRequest', 'fetch'];
        for (let api of forbidden) {
            context[api] = new Proxy(function () { }, {
                get() {
                    $_1.$mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
                apply() {
                    $_1.$mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
            });
        }
    });
    $mol_test({
        'mocked Math.random'($) {
            console.assert($.Math.random() === 0);
            console.assert($.Math.random() === Math.sin(1));
        },
        'forbidden XMLHttpRequest'($) {
            try {
                console.assert(void new $.XMLHttpRequest);
            }
            catch (error) {
                console.assert(error.message === 'XMLHttpRequest is forbidden in tests');
            }
        },
        'forbidden fetch'($) {
            try {
                console.assert(void $.fetch(''));
            }
            catch (error) {
                console.assert(error.message === 'fetch is forbidden in tests');
            }
        },
    });
})($ || ($ = {}));
//test.test.js.map
;
"use strict";
//assert.test.js.map
;
"use strict";
//assert.js.map
;
"use strict";
//deep.test.js.map
;
"use strict";
//deep.js.map
;
"use strict";
//jsx d.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_jsx_prefix = '';
    $.$mol_jsx_booked = null;
    $.$mol_jsx_document = {
        getElementById: () => null,
        createElement: (name) => $.$mol_dom_context.document.createElement(name)
    };
})($ || ($ = {}));
//jsx.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Make empty div'() {
            $.$mol_assert_equal(($.$mol_jsx_make("div", null)).outerHTML, '<div></div>');
        },
        'Define native field'() {
            const dom = $.$mol_jsx_make("input", { value: '123' });
            $.$mol_assert_equal(dom.outerHTML, '<input value="123">');
            $.$mol_assert_equal(dom.value, '123');
        },
        'Define classes'() {
            const dom = $.$mol_jsx_make("div", { classList: ['foo bar'] });
            $.$mol_assert_equal(dom.outerHTML, '<div class="foo bar"></div>');
        },
        'Define styles'() {
            const dom = $.$mol_jsx_make("div", { style: { color: 'red' } });
            $.$mol_assert_equal(dom.outerHTML, '<div style="color: red;"></div>');
        },
        'Define dataset'() {
            const dom = $.$mol_jsx_make("div", { dataset: { foo: 'bar' } });
            $.$mol_assert_equal(dom.outerHTML, '<div data-foo="bar"></div>');
        },
        'Define attributes'() {
            const dom = $.$mol_jsx_make("div", { hidden: true, lang: "ru" });
            $.$mol_assert_equal(dom.outerHTML, '<div hidden="" lang="ru"></div>');
        },
        'Define child nodes'() {
            const dom = $.$mol_jsx_make("div", null,
                "hello",
                $.$mol_jsx_make("strong", null, "world"),
                "!");
            $.$mol_assert_equal(dom.outerHTML, '<div>hello<strong>world</strong>!</div>');
        },
        'Function as component'() {
            const Button = ({ hint }, target) => {
                return $.$mol_jsx_make("button", { title: hint }, target());
            };
            const dom = $.$mol_jsx_make(Button, { id: "/foo", hint: "click me" }, () => 'hey!');
            $.$mol_assert_equal(dom.outerHTML, '<button title="click me" id="/foo">hey!</button>');
        },
        'Nested guid generation'() {
            const Foo = () => {
                return $.$mol_jsx_make("div", null,
                    $.$mol_jsx_make(Bar, { id: "/bar" },
                        $.$mol_jsx_make("img", { id: "/icon" })));
            };
            const Bar = (props, icon) => {
                return $.$mol_jsx_make("span", null, icon);
            };
            const dom = $.$mol_jsx_make(Foo, { id: "/foo" });
            $.$mol_assert_equal(dom.outerHTML, '<div id="/foo"><span id="/foo/bar"><img id="/foo/icon"></span></div>');
        },
        'Fail on non unique ids'() {
            const App = () => {
                return $.$mol_jsx_make("div", null,
                    $.$mol_jsx_make("span", { id: "/bar" }),
                    $.$mol_jsx_make("span", { id: "/bar" }));
            };
            $.$mol_assert_fail(() => $.$mol_jsx_make(App, { id: "/foo" }), 'JSX already has tag with id "/bar"');
        },
    });
})($ || ($ = {}));
//make.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_jsx_make(Elem, props, ...childNodes) {
        const id = props && props.id || '';
        if ($.$mol_jsx_booked) {
            if ($.$mol_jsx_booked.has(id)) {
                $.$mol_fail(new Error(`JSX already has tag with id ${JSON.stringify(id)}`));
            }
            else {
                $.$mol_jsx_booked.add(id);
            }
        }
        const guid = $.$mol_jsx_prefix + id;
        let node = guid && $.$mol_jsx_document.getElementById(guid);
        if (typeof Elem !== 'string') {
            if (Elem.prototype) {
                const view = node && node[Elem] || new Elem;
                Object.assign(view, props);
                view[Symbol.toStringTag] = guid;
                view.childNodes = childNodes;
                if (!view.ownerDocument)
                    view.ownerDocument = $.$mol_jsx_document;
                node = view.valueOf();
                node[Elem] = view;
                return node;
            }
            else {
                const prefix = $.$mol_jsx_prefix;
                const booked = $.$mol_jsx_booked;
                try {
                    $.$mol_jsx_prefix = guid;
                    $.$mol_jsx_booked = new Set;
                    return Elem(props, ...childNodes);
                }
                finally {
                    $.$mol_jsx_prefix = prefix;
                    $.$mol_jsx_booked = booked;
                }
            }
        }
        if (!node)
            node = $.$mol_jsx_document.createElement(Elem);
        $.$mol_dom_render_children(node, [].concat(...childNodes));
        for (const key in props) {
            if (typeof props[key] === 'string') {
                node.setAttribute(key, props[key]);
            }
            else if (props[key] && props[key]['constructor'] === Object) {
                if (typeof node[key] === 'object') {
                    Object.assign(node[key], props[key]);
                    continue;
                }
            }
            node[key] = props[key];
        }
        if (guid)
            node.id = guid;
        return node;
    }
    $.$mol_jsx_make = $mol_jsx_make;
})($ || ($ = {}));
//make.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'nulls & undefineds'() {
            $.$mol_assert_ok($.$mol_compare_deep(null, null));
            $.$mol_assert_ok($.$mol_compare_deep(undefined, undefined));
            $.$mol_assert_not($.$mol_compare_deep(undefined, null));
            $.$mol_assert_not($.$mol_compare_deep({}, null));
        },
        'number'() {
            $.$mol_assert_ok($.$mol_compare_deep(1, 1));
            $.$mol_assert_ok($.$mol_compare_deep(Number.NaN, Number.NaN));
            $.$mol_assert_not($.$mol_compare_deep(1, 2));
        },
        'Number'() {
            $.$mol_assert_ok($.$mol_compare_deep(Object(1), Object(1)));
            $.$mol_assert_ok($.$mol_compare_deep(Object(Number.NaN), Object(Number.NaN)));
            $.$mol_assert_not($.$mol_compare_deep(Object(1), Object(2)));
        },
        'empty POJOs'() {
            $.$mol_assert_ok($.$mol_compare_deep({}, {}));
        },
        'different POJOs'() {
            $.$mol_assert_not($.$mol_compare_deep({ a: 1 }, { b: 2 }));
        },
        'different POJOs with same keys but different values'() {
            $.$mol_assert_not($.$mol_compare_deep({ a: 1 }, { a: 2 }));
        },
        'different POJOs with different keys but same values'() {
            $.$mol_assert_not($.$mol_compare_deep({}, { a: undefined }));
        },
        'Array'() {
            $.$mol_assert_ok($.$mol_compare_deep([], []));
            $.$mol_assert_ok($.$mol_compare_deep([1, [2]], [1, [2]]));
            $.$mol_assert_not($.$mol_compare_deep([1, 2], [1, 3]));
            $.$mol_assert_not($.$mol_compare_deep([1, 2,], [1, 3, undefined]));
        },
        'same POJO trees'() {
            $.$mol_assert_ok($.$mol_compare_deep({ a: { b: 1 } }, { a: { b: 1 } }));
        },
        'different classes with same values'() {
            class Obj {
                constructor() {
                    this.foo = 1;
                }
            }
            const a = new Obj;
            const b = new class extends Obj {
            };
            $.$mol_assert_not($.$mol_compare_deep(a, b));
        },
        'same POJOs with cyclic reference'() {
            const a = { foo: {} };
            a['self'] = a;
            const b = { foo: {} };
            b['self'] = b;
            $.$mol_assert_ok($.$mol_compare_deep(a, b));
        },
        'empty Element'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx_make("div", null), $.$mol_jsx_make("div", null)));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", null), $.$mol_jsx_make("span", null)));
        },
        'Element with attributes'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx_make("div", { dir: "rtl" }), $.$mol_jsx_make("div", { dir: "rtl" })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", { dir: "rtl" }), $.$mol_jsx_make("div", null)));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", { dir: "rtl" }), $.$mol_jsx_make("div", { dir: "ltr" })));
        },
        'Element with styles'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx_make("div", { style: { color: 'red' } }), $.$mol_jsx_make("div", { style: { color: 'red' } })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", { style: { color: 'red' } }), $.$mol_jsx_make("div", { style: {} })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", { style: { color: 'red' } }), $.$mol_jsx_make("div", { style: { color: 'blue' } })));
        },
        'Element with content'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx_make("div", null,
                "foo",
                $.$mol_jsx_make("br", null)), $.$mol_jsx_make("div", null,
                "foo",
                $.$mol_jsx_make("br", null))));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", null,
                "foo",
                $.$mol_jsx_make("br", null)), $.$mol_jsx_make("div", null,
                "bar",
                $.$mol_jsx_make("br", null))));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", null,
                "foo",
                $.$mol_jsx_make("br", null)), $.$mol_jsx_make("div", null,
                "foo",
                $.$mol_jsx_make("hr", null))));
        },
        'Element with handlers'() {
            $.$mol_assert_ok($.$mol_compare_deep($.$mol_jsx_make("div", { onclick: () => 1 }), $.$mol_jsx_make("div", { onclick: () => 1 })));
            $.$mol_assert_not($.$mol_compare_deep($.$mol_jsx_make("div", { onclick: () => 1 }), $.$mol_jsx_make("div", { onclick: () => 2 })));
        },
        'Date'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Date(12345), new Date(12345)));
            $.$mol_assert_not($.$mol_compare_deep(new Date(12345), new Date(12346)));
        },
        'RegExp'() {
            $.$mol_assert_ok($.$mol_compare_deep(/\x22/mig, /\x22/mig));
            $.$mol_assert_not($.$mol_compare_deep(/\x22/mig, /\x21/mig));
            $.$mol_assert_not($.$mol_compare_deep(/\x22/mig, /\x22/mg));
        },
        'Map'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Map, new Map));
            $.$mol_assert_ok($.$mol_compare_deep(new Map([[[1], [2]]]), new Map([[[1], [2]]])));
            $.$mol_assert_not($.$mol_compare_deep(new Map([[1, 2]]), new Map([[1, 3]])));
        },
        'Set'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Set, new Set));
            $.$mol_assert_ok($.$mol_compare_deep(new Set([1, [2]]), new Set([1, [2]])));
            $.$mol_assert_not($.$mol_compare_deep(new Set([1]), new Set([2])));
        },
        'Uint8Array'() {
            $.$mol_assert_ok($.$mol_compare_deep(new Uint8Array, new Uint8Array));
            $.$mol_assert_ok($.$mol_compare_deep(new Uint8Array([0]), new Uint8Array([0])));
            $.$mol_assert_not($.$mol_compare_deep(new Uint8Array([0]), new Uint8Array([1])));
        },
    });
})($ || ($ = {}));
//deep.test.js.map
;
"use strict";
var $;
(function ($) {
    const a_stack = [];
    const b_stack = [];
    let cache = null;
    function $mol_compare_deep(a, b) {
        if (Object.is(a, b))
            return true;
        const a_type = typeof a;
        const b_type = typeof b;
        if (a_type !== b_type)
            return false;
        if (a_type === 'function')
            return String(a) === String(b);
        if (a_type !== 'object')
            return false;
        if (!a || !b)
            return false;
        if (a instanceof Error)
            return false;
        if (a['constructor'] !== b['constructor'])
            return false;
        if (a instanceof RegExp)
            return Object.is(String(a), String(b));
        const ref = a_stack.indexOf(a);
        if (ref >= 0) {
            return Object.is(b_stack[ref], b);
        }
        if (!cache)
            cache = new WeakMap;
        let a_cache = cache.get(a);
        if (a_cache) {
            const b_cache = a_cache.get(b);
            if (typeof b_cache === 'boolean')
                return b_cache;
        }
        else {
            a_cache = new WeakMap();
            cache.set(a, a_cache);
        }
        a_stack.push(a);
        b_stack.push(b);
        let result;
        try {
            if (a[Symbol.iterator]) {
                const a_iter = a[Symbol.iterator]();
                const b_iter = b[Symbol.iterator]();
                while (true) {
                    const a_next = a_iter.next();
                    const b_next = b_iter.next();
                    if (a_next.done !== a_next.done)
                        return result = false;
                    if (a_next.done)
                        break;
                    if (!$mol_compare_deep(a_next.value, b_next.value))
                        return result = false;
                }
                return result = true;
            }
            let count = 0;
            for (let key in a) {
                if (!$mol_compare_deep(a[key], b[key]))
                    return result = false;
                ++count;
            }
            for (let key in b) {
                --count;
                if (count < 0)
                    return result = false;
            }
            const a_val = a['valueOf']();
            if (Object.is(a_val, a))
                return result = true;
            const b_val = b['valueOf']();
            if (!Object.is(a_val, b_val))
                return result = false;
            return result = true;
        }
        finally {
            a_stack.pop();
            b_stack.pop();
            if (a_stack.length === 0) {
                cache = null;
            }
            else {
                a_cache.set(b, result);
            }
        }
    }
    $.$mol_compare_deep = $mol_compare_deep;
})($ || ($ = {}));
//deep.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'must be false'() {
            $.$mol_assert_not(0);
        },
        'must be true'() {
            $.$mol_assert_ok(1);
        },
        'two must be equal'() {
            $.$mol_assert_equal(2, 2);
        },
        'three must be equal'() {
            $.$mol_assert_equal(2, 2, 2);
        },
        'two must be unique'() {
            $.$mol_assert_unique([3], [3]);
        },
        'three must be unique'() {
            $.$mol_assert_unique([3], [3], [3]);
        },
        'two must be alike'() {
            $.$mol_assert_like([3], [3]);
        },
        'three must be alike'() {
            $.$mol_assert_like([3], [3], [3]);
        },
    });
})($ || ($ = {}));
//assert.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_assert_ok(value) {
        if (value)
            return;
        $.$mol_fail(new Error(`${value} ≠ true`));
    }
    $.$mol_assert_ok = $mol_assert_ok;
    function $mol_assert_not(value) {
        if (!value)
            return;
        $.$mol_fail(new Error(`${value} ≠ false`));
    }
    $.$mol_assert_not = $mol_assert_not;
    function $mol_assert_fail(handler, ErrorRight) {
        const fail = $.$mol_fail;
        try {
            $.$mol_fail = $.$mol_fail_hidden;
            handler();
        }
        catch (error) {
            if (!ErrorRight)
                return error;
            if (typeof ErrorRight === 'string') {
                if (error.message !== ErrorRight)
                    throw error;
            }
            else {
                if (!(error instanceof ErrorRight))
                    throw error;
            }
            return error;
        }
        finally {
            $.$mol_fail = fail;
        }
        $.$mol_fail(new Error('Not failed'));
    }
    $.$mol_assert_fail = $mol_assert_fail;
    function $mol_assert_equal(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (Number.isNaN(args[i]) && Number.isNaN(args[j]))
                    continue;
                if (args[i] !== args[j])
                    $.$mol_fail(new Error(`Not equal\n${args[i]}\n${args[j]}`));
            }
        }
    }
    $.$mol_assert_equal = $mol_assert_equal;
    function $mol_assert_unique(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (args[i] === args[j] || (Number.isNaN(args[i]) && Number.isNaN(args[j]))) {
                    $.$mol_fail(new Error(`args[${i}] = args[${j}] = ${args[i]}`));
                }
            }
        }
    }
    $.$mol_assert_unique = $mol_assert_unique;
    function $mol_assert_like(head, ...tail) {
        for (let value of tail) {
            if ($.$mol_compare_deep(value, head)) {
                head = value;
            }
            else {
                const print = (val) => {
                    if (!val)
                        return val;
                    if (typeof val !== 'object')
                        return val;
                    if ('outerHTML' in val)
                        return val.outerHTML;
                    return val;
                };
                return $.$mol_fail(new Error(`Not like\n${print(head)}\n---\n${print(value)}`));
            }
        }
    }
    $.$mol_assert_like = $mol_assert_like;
})($ || ($ = {}));
//assert.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'run callback'() {
            let Plus1 = class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            };
            Plus1 = __decorate([
                $.$mol_class
            ], Plus1);
            $.$mol_assert_equal(Plus1.run(() => 2), 3);
        },
        'wrap function'() {
            let Plus1 = class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            };
            Plus1 = __decorate([
                $.$mol_class
            ], Plus1);
            const obj = {
                level: 2,
                pow: Plus1.func(function (a) {
                    return a ** this.level;
                })
            };
            $.$mol_assert_equal(obj.pow(2), 5);
        },
        'decorate instance method'() {
            let Plus1 = class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            };
            Plus1 = __decorate([
                $.$mol_class
            ], Plus1);
            class Foo1 {
                constructor() {
                    this.level = 2;
                }
                pow(a) {
                    return a ** this.level;
                }
            }
            __decorate([
                Plus1.method
            ], Foo1.prototype, "pow", null);
            const Foo2 = Foo1;
            const foo = new Foo2;
            $.$mol_assert_equal(foo.pow(2), 5);
        },
        'decorate static method'() {
            let Plus1 = class Plus1 extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        return task.call(this, ...args) + 1;
                    };
                }
            };
            Plus1 = __decorate([
                $.$mol_class
            ], Plus1);
            let Foo = class Foo {
                static pow(a) {
                    return a ** this.level;
                }
            };
            Foo.level = 2;
            __decorate([
                Plus1.method
            ], Foo, "pow", null);
            Foo = __decorate([
                $.$mol_class
            ], Foo);
            $.$mol_assert_equal(Foo.pow(2), 5);
        },
        'decorate class'() {
            let BarInc = class BarInc extends $.$mol_wrapper {
                static wrap(task) {
                    return function (...args) {
                        const foo = task.call(this, ...args);
                        foo.bar++;
                        return foo;
                    };
                }
            };
            BarInc = __decorate([
                $.$mol_class
            ], BarInc);
            let Foo = class Foo {
                constructor(bar) {
                    this.bar = bar;
                }
            };
            Foo = __decorate([
                BarInc.class,
                $.$mol_class
            ], Foo);
            $.$mol_assert_equal(new Foo(2).bar, 3);
        },
    });
})($ || ($ = {}));
//wrapper.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'all cases of using maybe'() {
            $.$mol_assert_equal($.$mol_maybe(0)[0], 0);
            $.$mol_assert_equal($.$mol_maybe(false)[0], false);
            $.$mol_assert_equal($.$mol_maybe(null)[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(void 0)[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(void 0).map(v => v.toString())[0], void 0);
            $.$mol_assert_equal($.$mol_maybe(0).map(v => v.toString())[0], '0');
        },
    });
})($ || ($ = {}));
//maybe.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        var _a;
        $.$mol_log2 = (_a = class extends $_1.$mol_log2 {
            },
            _a.current = new $_1.$mol_log2(null, '$mol_log2_mock', []),
            _a);
    });
})($ || ($ = {}));
//log2.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_after_mock_queue = [];
    function $mol_after_mock_warp() {
        const queue = $.$mol_after_mock_queue.splice(0);
        for (const task of queue)
            task();
    }
    $.$mol_after_mock_warp = $mol_after_mock_warp;
    class $mol_after_mock_commmon extends $.$mol_object2 {
        constructor(task) {
            super();
            this.task = task;
            this.promise = Promise.resolve();
            this.cancelled = false;
            $.$mol_after_mock_queue.push(task);
        }
        destructor() {
            const index = $.$mol_after_mock_queue.indexOf(this.task);
            if (index >= 0)
                $.$mol_after_mock_queue.splice(index, 1);
        }
    }
    $.$mol_after_mock_commmon = $mol_after_mock_commmon;
    class $mol_after_mock_timeout extends $mol_after_mock_commmon {
        constructor(delay, task) {
            super(task);
            this.delay = delay;
        }
    }
    $.$mol_after_mock_timeout = $mol_after_mock_timeout;
})($ || ($ = {}));
//mock.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_frame = $_1.$mol_after_mock_commmon;
    });
})($ || ($ = {}));
//frame.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'objects by reference'() {
            $.$mol_assert_equal($.$mol_compare_any({}, {}), false);
        },
        'primitives by value'() {
            $.$mol_assert_equal($.$mol_compare_any('a', 'a'), true);
        },
        'NaN by value'() {
            $.$mol_assert_equal($.$mol_compare_any(Number.NaN, Number.NaN), true);
        },
        'NaN not equal zero'() {
            $.$mol_assert_equal($.$mol_compare_any(Number.NaN, 0), false);
        },
    });
})($ || ($ = {}));
//any.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'return source when same object'() {
            const target = {};
            $.$mol_assert_equal($.$mol_conform(target, target), target);
        },
        'return target when some is not object'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(true, obj), true);
            $.$mol_assert_equal($.$mol_conform(obj, true), obj);
        },
        'return target when some is null'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(null, obj), null);
            $.$mol_assert_equal($.$mol_conform(obj, null), obj);
        },
        'return target when some is undefined'() {
            const obj = { a: 1 };
            $.$mol_assert_equal($.$mol_conform(undefined, obj), undefined);
            $.$mol_assert_equal($.$mol_conform(obj, undefined), obj);
        },
        'return target when different keys count'() {
            const target = [1, 2, 3];
            const source = [1, 2, 3, undefined];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.join(','), '1,2,3');
        },
        'return source when array values are strong equal'() {
            const source = [1, 2, 3];
            $.$mol_assert_equal($.$mol_conform([1, 2, 3], source), source);
        },
        'return source when object values are strong equal'() {
            const source = { a: 1, b: 2 };
            $.$mol_assert_equal($.$mol_conform({ a: 1, b: 2 }, source), source);
        },
        'return target when some values are not equal'() {
            const target = [1, 2, 3];
            const source = [1, 2, 5];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.join(','), '1,2,3');
        },
        'return source when values are deep equal'() {
            const source = { foo: { bar: 1 } };
            $.$mol_assert_equal($.$mol_conform({ foo: { bar: 1 } }, source), source);
        },
        'return target with equal values from source and not equal from target'() {
            const source = { foo: { xxx: 1 }, bar: { xxx: 2 } };
            const target = { foo: { xxx: 1 }, bar: { xxx: 3 } };
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.foo, source.foo);
            $.$mol_assert_equal(result.bar, target.bar);
        },
        'return target when equal but with different class'() {
            const target = { '0': 1 };
            $.$mol_assert_equal($.$mol_conform(target, [1]), target);
        },
        'return target when conformer for class is not defined'() {
            const Obj = class {
            };
            const source = new Obj;
            const target = new Obj;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
        },
        'return target when has cyclic reference'() {
            const source = { foo: {} };
            source['self'] = source;
            const target = { foo: {} };
            target['self'] = target;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result['self'], target);
            $.$mol_assert_equal(result.foo, source.foo);
        },
        'return source when equal dates'() {
            const source = new Date(12345);
            const target = new Date(12345);
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'return source when equal regular expressions'() {
            const source = /\x22/mig;
            const target = /\x22/mig;
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'return cached value if already conformed'() {
            const source = { foo: { xxx: 1 }, bar: { xxx: 3 } };
            const target = { foo: { xxx: 2 }, bar: { xxx: 3 } };
            const result = $.$mol_conform(target, source);
            target.foo.xxx = 1;
            $.$mol_assert_equal($.$mol_conform(target.foo, source.foo), target.foo);
        },
        'skip readlony fields'() {
            const source = { foo: {}, bar: {} };
            const target = { foo: {}, bar: {} };
            Object.defineProperty(target, 'bar', { value: {}, writable: false });
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, target);
            $.$mol_assert_equal(result.foo, source.foo);
            $.$mol_assert_equal(result.bar, target.bar);
        },
        'object with NaN'() {
            const source = { foo: Number.NaN };
            const target = { foo: Number.NaN };
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
        'array with NaN'() {
            const source = [Number.NaN];
            const target = [Number.NaN];
            const result = $.$mol_conform(target, source);
            $.$mol_assert_equal(result, source);
        },
    });
})($ || ($ = {}));
//conform.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'trim array'() {
            const array = [undefined, null, 0, false, null, undefined, undefined];
            const correct = [undefined, null, 0, false, null];
            $.$mol_array_trim(array);
            $.$mol_assert_like(array, correct);
        }
    });
})($ || ($ = {}));
//trim.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push(async ($) => {
        await $_1.$mol_fiber_warp();
        $_1.$mol_fiber.deadline = Date.now() + 100;
    });
})($ || ($ = {}));
//fiber.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test({
        'Value has js-path name'() {
            let App = class App extends $_1.$mol_object2 {
                static get title() { return new $_1.$mol_object2; }
            };
            __decorate([
                $_1.$mol_atom2_field
            ], App, "title", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(`${App.title}`, 'App.title');
        },
        'Simple property'() {
            let App = class App extends $_1.$mol_object2 {
            };
            App.value = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", void 0);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.value, 1);
            App.value = 2;
            $_1.$mol_assert_equal(App.value, 2);
        },
        'Instant actualization'() {
            let Source = class Source extends $_1.$mol_object2 {
                constructor() {
                    super(...arguments);
                    this.value = 1;
                }
            };
            __decorate([
                $_1.$mol_atom2_field
            ], Source.prototype, "value", void 0);
            Source = __decorate([
                $_1.$mol_class
            ], Source);
            let App = class App extends $_1.$mol_object2 {
                static get source() { return Source.make(); }
                static get value() { return this.source.value + 1; }
            };
            __decorate([
                $_1.$mol_atom2_field
            ], App, "source", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.value, 2);
            App.source.value = 2;
            $_1.$mol_assert_equal(App.value, 3);
        },
        'Access to cached value'() {
            let App = class App extends $_1.$mol_object2 {
                static get value() { return 1; }
            };
            __decorate([
                $_1.$mol_atom2_field
            ], App, "value", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal($_1.$mol_atom2_value(() => App.value), undefined);
            $_1.$mol_assert_equal(App.value, 1);
            $_1.$mol_assert_equal($_1.$mol_atom2_value(() => App.value), 1);
        },
        'Do not recalc slaves on equal changes'() {
            let App = class App extends $_1.$mol_object2 {
                static get result() { return this.first[0] + this.counter++; }
            };
            App.first = [1];
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 1);
            App.first = [1];
            $_1.$mol_assert_equal(App.result, 1);
        },
        'Do not recalc grand slave on equal direct slave result '() {
            let App = class App extends $_1.$mol_object2 {
                static get second() { return Math.abs(this.first); }
                static get result() { return this.second + ++this.counter; }
            };
            App.first = 1;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 2);
            App.first = -1;
            $_1.$mol_assert_equal(App.result, 2);
        },
        'Recalc when [not changed master] changes [following master]'() {
            let App = class App extends $_1.$mol_object2 {
                static get second() {
                    this.third = this.first;
                    return 0;
                }
                static get result() { return this.second + this.third + ++this.counter; }
            };
            App.first = 1;
            App.third = 0;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "third", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 2);
            App.first = 5;
            $_1.$mol_assert_equal(App.result, 7);
        },
        'Branch switching'() {
            let App = class App extends $_1.$mol_object2 {
                static get second() { return 2; }
                static get result() {
                    return (this.condition ? this.first : this.second) + this.counter++;
                }
            };
            App.first = 1;
            App.condition = true;
            App.counter = 0;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 1);
            App.condition = false;
            $_1.$mol_assert_equal(App.result, 3);
            App.first = 10;
            $_1.$mol_assert_equal(App.result, 3);
        },
        'Forbidden self invalidation'() {
            let App = class App extends $_1.$mol_object2 {
                static get second() { return this.first + 1; }
                static get result() {
                    this.second;
                    return this.first++;
                }
            };
            App.first = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_fail(() => App.result);
        },
        'Side effect inside computation'() {
            let App = class App extends $_1.$mol_object2 {
                static increase() { return ++this.first; }
                static get result() {
                    return this.increase() + 1;
                }
            };
            App.first = 1;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", void 0);
            __decorate([
                $_1.$mol_fiber.method
            ], App, "increase", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 3);
        },
        'Forbidden cyclic dependency'() {
            let App = class App extends $_1.$mol_object2 {
                static get first() { return this.second - 1; }
                static get second() { return this.first + 1; }
            };
            __decorate([
                $_1.$mol_atom2_field
            ], App, "first", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "second", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_fail(() => App.first);
        },
        'Forget sub fibers on complete'() {
            let App = class App extends $_1.$mol_object2 {
                static count() { return this.counter++; }
                static get result() { return this.count() + this.data; }
            };
            App.counter = 0;
            App.data = 1;
            __decorate([
                $_1.$mol_fiber.method
            ], App, "count", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "data", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 1);
            App.data = 2;
            $_1.$mol_assert_equal(App.result, 3);
        },
        async 'Automatic destroy owned value on self destruction'() {
            let counter = 0;
            let Having = class Having extends $_1.$mol_object2 {
                destructor() { counter++; }
            };
            Having = __decorate([
                $_1.$mol_class
            ], Having);
            let App = class App extends $_1.$mol_object2 {
                static get having() { return Having.make(); }
                static get result() {
                    if (this.condition)
                        this.having;
                    return 0;
                }
            };
            App.condition = true;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "having", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            App.result;
            App.condition = false;
            App.result;
            $_1.$mol_assert_equal(counter, 0);
            await $_1.$mol_fiber_warp();
            $_1.$mol_assert_equal(counter, 1);
        },
        async 'Do not destroy putted value'() {
            let App = class App extends $_1.$mol_object2 {
                static get target() {
                    return this.condition ? this.source : 0;
                }
            };
            App.condition = true;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "source", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "target", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            App.source = 1;
            $_1.$mol_assert_equal(App.target, 1);
            App.condition = false;
            $_1.$mol_assert_equal(App.target, 0);
            await $_1.$mol_fiber_warp();
            App.condition = true;
            $_1.$mol_assert_equal(App.target, 1);
        },
        'Restore after error'() {
            let App = class App extends $_1.$mol_object2 {
                static get broken() {
                    if (this.condition)
                        $_1.$mol_fail(new Error('test error'));
                    return 1;
                }
                static get result() { return this.broken; }
            };
            App.condition = false;
            __decorate([
                $_1.$mol_atom2_field
            ], App, "condition", void 0);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "broken", null);
            __decorate([
                $_1.$mol_atom2_field
            ], App, "result", null);
            App = __decorate([
                $_1.$mol_class
            ], App);
            $_1.$mol_assert_equal(App.result, 1);
            App.condition = true;
            $_1.$mol_assert_fail(() => App.result);
            App.condition = false;
            $_1.$mol_assert_equal(App.result, 1);
        },
        async 'auto fresh only when alive'($) {
            let state = 1;
            const monitor = new $.$mol_atom2;
            monitor.calculate = () => {
                new $.$mol_after_frame($_1.$mol_atom2.current.fresh);
                return state;
            };
            $_1.$mol_assert_equal(monitor.get(), 1);
            state = 2;
            $_1.$mol_assert_equal(monitor.get(), 1);
            $.$mol_after_mock_warp();
            $_1.$mol_assert_equal(monitor.get(), 2);
            state = 3;
            $_1.$mol_assert_equal(monitor.get(), 2);
            monitor.destructor();
            $_1.$mol_assert_equal(monitor.value, undefined);
            $.$mol_after_mock_warp();
            await $.$mol_fiber_warp();
            $_1.$mol_assert_equal(monitor.value, undefined);
        },
    });
})($ || ($ = {}));
//atom2.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'const returns stored value'() {
            const foo = { bar: $.$mol_const(Math.random()) };
            $.$mol_assert_equal(foo.bar(), foo.bar());
            $.$mol_assert_equal(foo.bar(), foo.bar['()']);
        },
    });
})($ || ($ = {}));
//const.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'init with overload'() {
            class X extends $.$mol_object {
                foo() {
                    return 1;
                }
            }
            var x = X.make({
                foo: () => 2,
            });
            $.$mol_assert_equal(x.foo(), 2);
        },
    });
})($ || ($ = {}));
//object.test.js.map
;
"use strict";
var $;
(function ($) {
    console.warn('$mol_atom_wait is deprecated. Use $mol_fiber_sync instead.');
    class $mol_atom_wait extends Promise {
        constructor(message = 'Wait...') {
            super(() => { });
            this.message = message;
        }
    }
    $.$mol_atom_wait = $mol_atom_wait;
    $mol_atom_wait.prototype.constructor = Promise;
})($ || ($ = {}));
//wait.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Property method'() {
            class App extends $.$mol_object2 {
                static value(next = 1) { return next + 1; }
            }
            __decorate([
                $.$mol_mem
            ], App, "value", null);
            $.$mol_assert_equal(App.value(), 2);
            App.value(2);
            $.$mol_assert_equal(App.value(), 3);
        },
        'auto sync of properties'() {
            class X extends $.$mol_object2 {
                foo(next) {
                    return next || 1;
                }
                bar() {
                    return this.foo() + 1;
                }
                xxx() {
                    return this.bar() + 1;
                }
            }
            __decorate([
                $.$mol_mem
            ], X.prototype, "foo", null);
            __decorate([
                $.$mol_mem
            ], X.prototype, "bar", null);
            __decorate([
                $.$mol_mem
            ], X.prototype, "xxx", null);
            const x = new X;
            $.$mol_assert_equal(x.bar(), 2);
            $.$mol_assert_equal(x.xxx(), 3);
            x.foo(5);
            $.$mol_assert_equal(x.xxx(), 7);
        },
        async 'must be deferred destroyed when no longer referenced'() {
            let foo;
            let foo_destroyed = false;
            class B extends $.$mol_object2 {
                showing(next) {
                    if (next === void 0)
                        return true;
                    return next;
                }
                foo() {
                    return foo = new class extends $.$mol_object {
                        destructor() {
                            foo_destroyed = true;
                        }
                    };
                }
                bar() {
                    return this.showing() ? this.foo() : null;
                }
            }
            __decorate([
                $.$mol_mem
            ], B.prototype, "showing", null);
            __decorate([
                $.$mol_mem
            ], B.prototype, "foo", null);
            __decorate([
                $.$mol_mem
            ], B.prototype, "bar", null);
            var b = new B;
            var bar = b.bar();
            $.$mol_assert_ok(bar);
            b.showing(false);
            b.bar();
            await $.$mol_fiber_warp();
            $.$mol_assert_ok(foo_destroyed);
            $.$mol_assert_not(b.bar());
            b.showing(true);
            $.$mol_defer.run();
            $.$mol_assert_unique(b.bar(), bar);
        },
        'wait for data'() {
            class Test extends $.$mol_object2 {
                source(next, force) {
                    new $.$mol_defer(() => {
                        this.source('Jin', $.$mol_mem_force_cache);
                    });
                    return $.$mol_fail_hidden(new $.$mol_atom_wait('Wait for data!'));
                }
                middle() {
                    return this.source();
                }
                target() {
                    return this.middle();
                }
            }
            __decorate([
                $.$mol_mem
            ], Test.prototype, "source", null);
            __decorate([
                $.$mol_mem
            ], Test.prototype, "middle", null);
            __decorate([
                $.$mol_mem
            ], Test.prototype, "target", null);
            const t = new Test;
            $.$mol_assert_fail(() => t.target().valueOf(), Promise);
            $.$mol_defer.run();
            $.$mol_assert_equal(t.target(), 'Jin');
        },
    });
})($ || ($ = {}));
//mem.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'number'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get(123), undefined);
            $.$mol_assert_equal(dict.has(123), false);
            dict.set(123, 321);
            $.$mol_assert_equal(dict.get(123), 321);
            $.$mol_assert_equal(dict.has(123), true);
            dict.delete(123);
            $.$mol_assert_equal(dict.get(123), undefined);
            $.$mol_assert_equal(dict.has(123), false);
        },
        'pojo as key'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get({ foo: 123 }), undefined);
            $.$mol_assert_equal(dict.has({ foo: 123 }), false);
            dict.set({ foo: 123 }, 321);
            $.$mol_assert_equal(dict.get({ foo: 123 }), 321);
            $.$mol_assert_equal(dict.has({ foo: 123 }), true);
            dict.delete({ foo: 123 });
            $.$mol_assert_equal(dict.get({ foo: 123 }), undefined);
            $.$mol_assert_equal(dict.has({ foo: 123 }), false);
        },
        'array as key'() {
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get([123]), undefined);
            $.$mol_assert_equal(dict.has([123]), false);
            dict.set([123], 321);
            $.$mol_assert_equal(dict.get([123]), 321);
            $.$mol_assert_equal(dict.has([123]), true);
            dict.delete([123]);
            $.$mol_assert_equal(dict.get([123]), undefined);
            $.$mol_assert_equal(dict.has([123]), false);
        },
        'html element as key'() {
            const el = $.$mol_jsx_make("div", null);
            const dict = new $.$mol_dict();
            $.$mol_assert_equal(dict.get(el), undefined);
            $.$mol_assert_equal(dict.has(el), false);
            dict.set(el, 321);
            $.$mol_assert_equal(dict.get(el), 321);
            $.$mol_assert_equal(dict.has(el), true);
            $.$mol_assert_equal(dict.get($.$mol_jsx_make("div", null)), undefined);
            $.$mol_assert_equal(dict.has($.$mol_jsx_make("div", null)), false);
            dict.delete(el);
            $.$mol_assert_equal(dict.get(el), undefined);
            $.$mol_assert_equal(dict.has(el), false);
        },
        'for-of key restore'() {
            const dict = new $.$mol_dict([[123, 321]]);
            const keys = [];
            const vals = [];
            for (const [key, val] of dict) {
                keys.push(key);
                vals.push(val);
            }
            $.$mol_assert_equal(keys.length, 1);
            $.$mol_assert_equal(keys[0], 123);
            $.$mol_assert_equal(vals.length, 1);
            $.$mol_assert_equal(vals[0], 321);
        },
        'forEach key restore'() {
            const dict = new $.$mol_dict([[123, 321]]);
            const keys = [];
            const vals = [];
            dict.forEach((val, key) => {
                keys.push(key);
                vals.push(val);
            });
            $.$mol_assert_equal(keys.length, 1);
            $.$mol_assert_equal(keys[0], 123);
            $.$mol_assert_equal(vals.length, 1);
            $.$mol_assert_equal(vals[0], 321);
        },
    });
})($ || ($ = {}));
//dict.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'keyed reactive properties'() {
            $.$mol_fiber_warp();
            class Fib extends $.$mol_object2 {
                static value(index, next) {
                    if (next)
                        return next;
                    if (index < 2)
                        return 1;
                    return this.value(index - 1) + this.value(index - 2);
                }
            }
            __decorate([
                $.$mol_mem_key
            ], Fib, "value", null);
            $.$mol_assert_equal(Fib.value(10), 89);
            Fib.value(1, 2);
            $.$mol_assert_equal(Fib.value(10), 144);
        },
        'cached property with simple key'() {
            class X extends $.$mol_object2 {
                foo(id, next) {
                    if (next == null)
                        return new Number(123);
                    return new Number(next);
                }
            }
            __decorate([
                $.$mol_mem_key
            ], X.prototype, "foo", null);
            const x = new X;
            $.$mol_assert_equal(x.foo(0).valueOf(), 123);
            $.$mol_assert_equal(x.foo(0), x.foo(0));
            $.$mol_assert_unique(x.foo(0), x.foo(1));
            x.foo(0, 321);
            $.$mol_assert_equal(x.foo(0).valueOf(), 321);
            x.foo(0, null);
            $.$mol_assert_equal(x.foo(0).valueOf(), 123);
        },
        'cached property with complex key'() {
            class X extends $.$mol_object2 {
                foo(ids) {
                    return Math.random();
                }
            }
            __decorate([
                $.$mol_mem_key
            ], X.prototype, "foo", null);
            const x = new X;
            $.$mol_assert_equal(x.foo([0, 1]), x.foo([0, 1]));
            $.$mol_assert_unique(x.foo([0, 1]), x.foo([0, 2]));
        },
    });
})($ || ($ = {}));
//key.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        async 'Autorun'() {
            class App extends $.$mol_object2 {
                static get init() {
                    ++this.counter;
                    return this.state;
                }
            }
            App.state = 1;
            App.counter = 0;
            __decorate([
                $.$mol_atom2_field
            ], App, "state", void 0);
            __decorate([
                $.$mol_atom2_field
            ], App, "init", null);
            const autorun = $.$mol_atom2_autorun(() => App.init);
            try {
                await $.$mol_fiber_warp();
                $.$mol_assert_equal(App.counter, 1);
                App.state = 2;
                $.$mol_assert_equal(App.counter, 1);
                await $.$mol_fiber_warp();
                $.$mol_assert_equal(App.counter, 2);
                App.state = 3;
            }
            finally {
                autorun.destructor();
            }
            App.state = 4;
            await $.$mol_fiber_warp();
            $.$mol_assert_equal(App.counter, 2);
        },
    });
})($ || ($ = {}));
//autorun.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_tick = $_1.$mol_after_mock_commmon;
    });
})($ || ($ = {}));
//tick.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'id auto generation'() {
            class $mol_view_test_item extends $.$mol_view {
            }
            class $mol_view_test_block extends $.$mol_view {
                element(id) {
                    return new $mol_view_test_item();
                }
            }
            __decorate([
                $.$mol_mem_key
            ], $mol_view_test_block.prototype, "element", null);
            var x = new $mol_view_test_block();
            $.$mol_assert_equal(x.dom_node().id, '$mol_view_test_block.make()');
            $.$mol_assert_equal(x.element(0).dom_node().id, '$mol_view_test_block.make().element(0)');
        },
        'caching ref to dom node'() {
            var x = new class extends $.$mol_view {
            };
            $.$mol_assert_equal(x.dom_node(), x.dom_node());
        },
        'content render'() {
            class $mol_view_test extends $.$mol_view {
                sub() {
                    return ['lol', 5];
                }
            }
            var x = new $mol_view_test();
            var node = x.dom_tree();
            $.$mol_assert_equal(node.innerHTML, 'lol5');
        },
        'bem attributes generation'() {
            class $mol_view_test_item extends $.$mol_view {
            }
            class $mol_view_test_block extends $.$mol_view {
                Element(id) {
                    return new $mol_view_test_item();
                }
            }
            __decorate([
                $.$mol_mem_key
            ], $mol_view_test_block.prototype, "Element", null);
            var x = new $mol_view_test_block();
            $.$mol_assert_equal(x.dom_node().getAttribute('mol_view_test_block'), '');
            $.$mol_assert_equal(x.dom_node().getAttribute('mol_view'), '');
            $.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_block_element'), '');
            $.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view_test_item'), '');
            $.$mol_assert_equal(x.Element(0).dom_node().getAttribute('mol_view'), '');
        },
        'render custom attributes'() {
            class $mol_view_test extends $.$mol_view {
                attr() {
                    return {
                        'href': '#haha',
                        'required': true,
                        'hidden': false,
                    };
                }
            }
            var x = new $mol_view_test();
            var node = x.dom_tree();
            $.$mol_assert_equal(node.getAttribute('href'), '#haha');
            $.$mol_assert_equal(node.getAttribute('required'), 'true');
            $.$mol_assert_equal(node.getAttribute('hidden'), null);
        },
        'render custom fields'() {
            class $mol_view_test extends $.$mol_view {
                field() {
                    return {
                        'hidden': true
                    };
                }
            }
            var x = new $mol_view_test();
            var node = x.dom_tree();
            $.$mol_assert_equal(node.hidden, true);
        },
        'attach event handlers'() {
            var clicked = false;
            class $mol_view_test extends $.$mol_view {
                event() {
                    return {
                        'click': (next) => this.event_click(next)
                    };
                }
                event_click(next) {
                    clicked = true;
                }
            }
            var x = new $mol_view_test();
            var node = x.dom_node();
            node.click();
            $.$mol_assert_ok(clicked);
        },
    });
})($ || ($ = {}));
//view.test.js.map
;
"use strict";
var $;
(function ($_1) {
    $_1.$mol_test_mocks.push($ => {
        $.$mol_after_timeout = $_1.$mol_after_mock_timeout;
    });
})($ || ($ = {}));
//timeout.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Vector limiting'() {
            let point = new $.$mol_vector_3d(7, 10, 13);
            const res = point.limited([[1, 5], [15, 20], [5, 10]]);
            $.$mol_assert_equal(res.x, 5);
            $.$mol_assert_equal(res.y, 15);
            $.$mol_assert_equal(res.z, 10);
        },
        'Vector adding scalar'() {
            let point = new $.$mol_vector_3d(1, 2, 3);
            let res = point.added0(5);
            $.$mol_assert_equal(res.x, 6);
            $.$mol_assert_equal(res.y, 7);
            $.$mol_assert_equal(res.z, 8);
        },
        'Vector adding vector'() {
            let point = new $.$mol_vector_3d(1, 2, 3);
            let res = point.added1([5, 10, 15]);
            $.$mol_assert_equal(res.x, 6);
            $.$mol_assert_equal(res.y, 12);
            $.$mol_assert_equal(res.z, 18);
        },
        'Vector multiplying scalar'() {
            let point = new $.$mol_vector_3d(2, 3, 4);
            let res = point.multed0(-1);
            $.$mol_assert_equal(res.x, -2);
            $.$mol_assert_equal(res.y, -3);
            $.$mol_assert_equal(res.z, -4);
        },
        'Vector multiplying vector'() {
            let point = new $.$mol_vector_3d(2, 3, 4);
            let res = point.multed1([5, 2, -2]);
            $.$mol_assert_equal(res.x, 10);
            $.$mol_assert_equal(res.y, 6);
            $.$mol_assert_equal(res.z, -8);
        },
        'Matrix adding matrix'() {
            let matrix = new $.$mol_vector_matrix(...[[1, 2], [3, 4], [5, 6]]);
            let res = matrix.added2([[10, 20], [30, 40], [50, 60]]);
            $.$mol_assert_equal(res[0][0], 11);
            $.$mol_assert_equal(res[0][1], 22);
            $.$mol_assert_equal(res[1][0], 33);
            $.$mol_assert_equal(res[1][1], 44);
            $.$mol_assert_equal(res[2][0], 55);
            $.$mol_assert_equal(res[2][1], 66);
        },
        'Matrix multiplying matrix'() {
            let matrix = new $.$mol_vector_matrix(...[[2, 3], [4, 5], [6, 7]]);
            let res = matrix.multed2([[2, 3], [4, 5], [6, 7]]);
            $.$mol_assert_equal(res[0][0], 4);
            $.$mol_assert_equal(res[0][1], 9);
            $.$mol_assert_equal(res[1][0], 16);
            $.$mol_assert_equal(res[1][1], 25);
            $.$mol_assert_equal(res[2][0], 36);
            $.$mol_assert_equal(res[2][1], 49);
        },
        'Range expanding'() {
            let range = $.$mol_vector_range_full.inversed;
            const expanded = range.expanded0(10).expanded0(5);
            $.$mol_assert_like([...expanded], [5, 10]);
        },
        'Vector of range expanding by vector'() {
            let dimensions = new $.$mol_vector_2d($.$mol_vector_range_full.inversed, $.$mol_vector_range_full.inversed);
            const expanded = dimensions.expanded1([1, 7]).expanded1([3, 5]);
            $.$mol_assert_like([...expanded.x], [1, 3]);
            $.$mol_assert_like([...expanded.y], [5, 7]);
        },
        'Vector of range expanding by vector of range'() {
            let dimensions = new $.$mol_vector_2d($.$mol_vector_range_full.inversed, $.$mol_vector_range_full.inversed);
            const expanded = dimensions
                .expanded2([[1, 3], [7, 9]])
                .expanded2([[2, 4], [6, 8]]);
            $.$mol_assert_like([...expanded.x], [1, 4]);
            $.$mol_assert_like([...expanded.y], [6, 9]);
        },
        'Vector of infinity range expanding by vector of range'() {
            let dimensions = new $.$mol_vector_2d($.$mol_vector_range_full.inversed, $.$mol_vector_range_full.inversed);
            const next = new $.$mol_vector_2d($.$mol_vector_range_full.inversed, $.$mol_vector_range_full.inversed);
            const expanded = next
                .expanded2(dimensions);
            $.$mol_assert_like([...expanded.x], [Infinity, -Infinity]);
            $.$mol_assert_like([...expanded.y], [Infinity, -Infinity]);
        },
    });
})($ || ($ = {}));
//vector.test.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'lazy calls'() {
            let calls = 0;
            const list = $.$mol_range2(index => (++calls, index), () => 10);
            $.$mol_assert_ok(list instanceof Array);
            $.$mol_assert_equal(list.length, 10);
            $.$mol_assert_equal(list[-1], -1);
            $.$mol_assert_equal(list[0], 0);
            $.$mol_assert_equal(list[9], 9);
            $.$mol_assert_equal(list[9.5], undefined);
            $.$mol_assert_equal(list[10], 10);
            $.$mol_assert_equal(calls, 4);
        },
        'infinity list'() {
            let calls = 0;
            const list = $.$mol_range2(index => (++calls, index));
            $.$mol_assert_equal(list.length, Number.POSITIVE_INFINITY);
            $.$mol_assert_equal(list[0], 0);
            $.$mol_assert_equal(list[4], 4);
            $.$mol_assert_equal(list[Number.MAX_SAFE_INTEGER], Number.MAX_SAFE_INTEGER);
            $.$mol_assert_equal(list[Number.POSITIVE_INFINITY], Number.POSITIVE_INFINITY);
            $.$mol_assert_equal(calls, 4);
        },
        'stringify'() {
            const list = $.$mol_range2(i => i, () => 5);
            $.$mol_assert_equal(list.toString(), '0,1,2,3,4');
            $.$mol_assert_equal(list.join(';'), '0;1;2;3;4');
        },
        'for-of'() {
            let log = '';
            for (let i of $.$mol_range2(i => i + 1, () => 5)) {
                log += i;
            }
            $.$mol_assert_equal(log, '12345');
        },
        'for-in'() {
            let log = '';
            for (let i in $.$mol_range2(i => i, () => 5)) {
                log += i;
            }
            $.$mol_assert_equal(log, '01234');
        },
        'forEach'() {
            let log = '';
            $.$mol_range2(i => i, () => 5).forEach(i => log += i);
            $.$mol_assert_equal(log, '01234');
        },
        'lazy concat'() {
            let calls1 = 0;
            let calls2 = 0;
            const list = $.$mol_range2(index => (++calls1, index), () => 5).concat([0, 1, 2, 3, 4], $.$mol_range2(index => (++calls2, index), () => 5));
            $.$mol_assert_ok(list instanceof Array);
            $.$mol_assert_equal(list.length, 15);
            $.$mol_assert_equal(list[0], 0);
            $.$mol_assert_equal(list[4], 4);
            $.$mol_assert_equal(list[5], 0);
            $.$mol_assert_equal(list[9], 4);
            $.$mol_assert_equal(list[10], 0);
            $.$mol_assert_equal(list[14], 4);
            $.$mol_assert_equal(list[15], 5);
            $.$mol_assert_equal(calls1, 2);
            $.$mol_assert_equal(calls2, 3);
        },
        'filter'() {
            let calls = 0;
            const list = $.$mol_range2(index => (++calls, index), () => 10).filter(v => v % 2).slice(0, 3);
            $.$mol_assert_ok(list instanceof Array);
            $.$mol_assert_equal(list.length, 3);
            $.$mol_assert_equal(list[0], 1);
            $.$mol_assert_equal(list[2], 5);
            $.$mol_assert_equal(list[3], 7);
            $.$mol_assert_equal(calls, 10);
        },
        'reduce'() {
            let calls = 0;
            const list = $.$mol_range2().slice(1, 6);
            $.$mol_assert_equal(list.reduce((s, v) => s + v), 15);
            $.$mol_assert_equal(list.reduce((s, v) => s + v, 5), 20);
        },
        'lazy map'() {
            let calls1 = 0;
            let calls2 = 0;
            const source = $.$mol_range2(index => (++calls1, index), () => 5);
            const target = source.map((item, index, self) => {
                ++calls2;
                $.$mol_assert_equal(source, self);
                return index + 10;
            }, () => 5);
            $.$mol_assert_ok(target instanceof Array);
            $.$mol_assert_equal(target.length, 5);
            $.$mol_assert_equal(target[0], 10);
            $.$mol_assert_equal(target[4], 14);
            $.$mol_assert_equal(target[5], 15);
            $.$mol_assert_equal(calls1, 3);
            $.$mol_assert_equal(calls2, 3);
        },
        'lazy slice'() {
            let calls = 0;
            const list = $.$mol_range2(index => (++calls, index), () => 10).slice(3, 7);
            $.$mol_assert_ok(list instanceof Array);
            $.$mol_assert_equal(list.length, 4);
            $.$mol_assert_equal(list[0], 3);
            $.$mol_assert_equal(list[3], 6);
            $.$mol_assert_equal(list[4], 7);
            $.$mol_assert_equal(calls, 3);
        },
        'lazy some'() {
            let calls = 0;
            $.$mol_assert_ok($.$mol_range2(index => (++calls, index), () => 5).some(v => v >= 2));
            $.$mol_assert_equal(calls, 3);
            $.$mol_assert_not($.$mol_range2(i => i, () => 0).some(v => true));
            $.$mol_assert_ok($.$mol_range2(i => i).some(v => v > 5));
        },
        'lazy every'() {
            let calls = 0;
            $.$mol_assert_not($.$mol_range2(index => (++calls, index), () => 5).every(v => v < 2));
            $.$mol_assert_equal(calls, 3);
            $.$mol_assert_ok($.$mol_range2(i => i, () => 0).every(v => false));
            $.$mol_assert_not($.$mol_range2(i => i).every(v => v < 5));
        },
        'lazyfy'() {
            let calls = 0;
            const list = new $.$mol_range2_array(...[0, 1, 2, 3, 4, 5]).map(i => (++calls, i + 10)).slice(2);
            $.$mol_assert_ok(list instanceof Array);
            $.$mol_assert_equal(list.length, 4);
            $.$mol_assert_equal(calls, 0);
            $.$mol_assert_equal(list[0], 12);
            $.$mol_assert_equal(list[3], 15);
            $.$mol_assert_equal(list[4], Number.NaN);
            $.$mol_assert_equal(calls, 3);
        },
        'prevent modification'() {
            const list = $.$mol_range2(i => i, () => 5);
            $.$mol_assert_fail(() => list.push(4), TypeError);
            $.$mol_assert_fail(() => list.pop(), TypeError);
            $.$mol_assert_fail(() => list.unshift(4), TypeError);
            $.$mol_assert_fail(() => list.shift(), TypeError);
            $.$mol_assert_fail(() => list.splice(1, 2), TypeError);
            $.$mol_assert_fail(() => list[1] = 2, TypeError);
            $.$mol_assert_equal(list.toString(), '0,1,2,3,4');
        }
    });
})($ || ($ = {}));
//range2.test.js.map
;
"use strict";
//equals.test.js.map
;
"use strict";
//equals.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_dom_parse(text, type = 'application/xhtml+xml') {
        const parser = new $.$mol_dom_context.DOMParser();
        const doc = parser.parseFromString(text, type);
        const error = doc.getElementsByTagName('parsererror')[0];
        if (error)
            throw new Error(error.textContent);
        return doc;
    }
    $.$mol_dom_parse = $mol_dom_parse;
})($ || ($ = {}));
//parse.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Attach to document'() {
            const doc = $.$mol_dom_parse('<html><body id="/foo"></body></html>');
            $.$mol_jsx_attach(doc, () => $.$mol_jsx_make("body", { id: "/foo" }, "bar"));
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//attach.test.js.map
;
"use strict";
var $;
(function ($) {
    function $mol_jsx_attach(next, action) {
        const prev = $.$mol_jsx_document;
        try {
            $.$mol_jsx_document = next;
            return action();
        }
        finally {
            $.$mol_jsx_document = prev;
        }
    }
    $.$mol_jsx_attach = $mol_jsx_attach;
})($ || ($ = {}));
//attach.js.map
;
"use strict";
var $;
(function ($) {
    $.$mol_test({
        'Class as component'() {
            let Foo = class Foo extends $.$mol_jsx_view {
                constructor() {
                    super(...arguments);
                    this.title = '';
                }
                render() {
                    return $.$mol_jsx_make("div", null,
                        this.title,
                        " ",
                        this.childNodes.join('-'));
                }
            };
            Foo = __decorate([
                $.$mol_class
            ], Foo);
            const dom = $.$mol_jsx_make(Foo, { id: "/foo", title: "bar" },
                "xxx",
                123);
            $.$mol_assert_equal(dom.outerHTML, '<div id="/foo">bar xxx-123</div>');
        },
        'View by element'() {
            let Br = class Br extends $.$mol_jsx_view {
                render() {
                    view = this;
                    return $.$mol_jsx_make("br", { id: "/foo" });
                }
            };
            Br = __decorate([
                $.$mol_class
            ], Br);
            let view;
            $.$mol_assert_equal(Br.of($.$mol_jsx_make(Br, null)), view);
        },
        'Attached view rerender'() {
            const doc = $.$mol_dom_parse('<html><body id="/foo"></body></html>');
            let Title = class Title extends $.$mol_jsx_view {
                constructor() {
                    super(...arguments);
                    this.value = 'foo';
                }
                render() {
                    return $.$mol_jsx_make("div", null, this.value);
                }
            };
            Title = __decorate([
                $.$mol_class
            ], Title);
            const dom = $.$mol_jsx_attach(doc, () => $.$mol_jsx_make(Title, { id: "/foo" }));
            const title = Title.of(dom);
            $.$mol_assert_equal(title.ownerDocument, doc);
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            title.value = 'bar';
            title.valueOf();
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
        async 'Reactive attached view'() {
            const doc = $.$mol_dom_parse('<html><body id="/foo"></body></html>');
            let Task = class Task {
                title(next) { return next || 'foo'; }
            };
            __decorate([
                $.$mol_mem
            ], Task.prototype, "title", null);
            Task = __decorate([
                $.$mol_class
            ], Task);
            let App = class App extends $.$mol_jsx_view {
                task() { return new Task; }
                valueOf() {
                    return super.valueOf();
                }
                render() {
                    return $.$mol_jsx_make("div", null, this.task().title());
                }
            };
            __decorate([
                $.$mol_mem
            ], App.prototype, "task", null);
            __decorate([
                $.$mol_mem
            ], App.prototype, "valueOf", null);
            App = __decorate([
                $.$mol_class
            ], App);
            const task = new Task;
            $.$mol_atom2_autorun(() => $.$mol_jsx_attach(doc, () => $.$mol_jsx_make(App, { id: "/foo", task: () => task })));
            await $.$mol_fiber_warp();
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            task.title('bar');
            await $.$mol_fiber_warp();
            $.$mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//view.test.js.map
;
"use strict";
var $;
(function ($) {
    class $mol_jsx_view extends $.$mol_object2 {
        static of(node) {
            return node[this];
        }
        valueOf() {
            const prefix = $.$mol_jsx_prefix;
            const booked = $.$mol_jsx_booked;
            const document = $.$mol_jsx_document;
            try {
                $.$mol_jsx_prefix = this[Symbol.toStringTag];
                $.$mol_jsx_booked = new Set;
                $.$mol_jsx_document = this.ownerDocument;
                return this.render();
            }
            finally {
                $.$mol_jsx_prefix = prefix;
                $.$mol_jsx_booked = booked;
                $.$mol_jsx_document = document;
            }
        }
        render() {
            return $.$mol_fail(new Error('dom_tree() not implemented'));
        }
    }
    $.$mol_jsx_view = $mol_jsx_view;
})($ || ($ = {}));
//view.js.map

//# sourceMappingURL=web.test.js.map