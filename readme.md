# $mol [![Build Status](https://travis-ci.org/eigenmethod/mol.svg?branch=master)](https://travis-ci.org/eigenmethod/mol)

Reactive micro-modular ui framework. Very simple, but very powerful.

# Features

* [Zero configuration](#zero-configuration). Just checkout and use it. 
* [Lazy rendering/evaluating/loading etc.](#lazyness)
* [Full reactivity](#reactivity) in all application layers. Not only between View and ViewModel.
* [Automatic dependency tracking](#reactivity) between reactive containers. No need to manual (un)subscribe and streams routing.
* [Effective state synchronization](atom) in right way. 
* Automatic include modules in package at compile time. No need to manual import them. [Just use it](#zero-configuration).
* Very small modules. [All of them are optional](#zero-configuration).
* Cross platform. [Support any environment](#zero-configuration) (NodeJS, Web, Cordova).
* Static typing ([TypeScript](https://www.typescriptlang.org/)). Full IDE support.
* Full customization. No implementation hiding. [All aspects are overridable](#lego-components).
* [Lifecycle management](#reactivity). Automatic destroy of components.
* [Easy debugging](#debugging). No exception catching. User readable id's of all objects. Quick access to all objects from console.
* Easy [user friendly logging](#debugging) of all state changes.
* Pseudosynchronous code. [Asynchrony is abstracted by reactivity](#reactivity). No callbacks/promises/streams hell. No async/awiat/yield virus.
* Automatic [BEM](https://en.bem.info/methodology/naming-convention/)-attributes generation for elements.

# [Demo applications](demo)

* [$mol_app_demo](app/demo) - demonstrates all components ([online](http://eigenmethod.github.io/mol/))
* [$mol_app_signup](app/signup) - simple form with persistence ([online](http://eigenmethod.github.io/mol/#demo=mol_app_signup))
* [$mol_app_todomvc](app/todomvc) - [ToDoMVC](http://todomvc.com/) realization ([online](http://eigenmethod.github.io/mol/#demo=mol_app_todomvc), [benchmark](https://github.com/nin-jin/todomvc/tree/master/benchmark))
* [$mol_app_supplies](app/supplies) - Supplies management tool ([online](http://eigenmethod.github.io/mol/#demo=mol_app_supplies))
* [$mol_app_users](app/users) - GitHub user "management" tool ([online](http://eigenmethod.github.io/mol/#demo=mol_app_users))

# [Benchmarks](perf)

* [$mol_perf_render](perf/render) - simple benchmark of rendering ([online](http://eigenmethod.github.io/mol/perf/render/))
* [ToDoMVC benchmark](https://github.com/nin-jin/todomvc/tree/master/benchmark)

# Quick start

**Create PMS project**

Easy way is checkout [this preconfigured PMS repository](http://github.com/nin-jin/pms/) and start dev server:

```sh
git clone https://github.com/nin-jin/pms.git ./pms && cd pms
npm start
```

**Create your application component**

In examples we will use namespace `my` and application name `hello`, but you must use your own namespace and application name.

Add **web entry point** at `./my/hello/index.html`:`

```html
<!doctype html>
<head>
	<!-- page title -->
	<title>Hello World!</title>
	
	<!-- Force utf-8 dencoding -->
	<meta charset="utf-8" />
	
	<!-- Disable modile browser auto zoom, $mol is adaptive -->
	<meta name="viewport" content="width=device-width" />
	
	<!-- link to autogenerated css bundle -->
	<link rel="stylesheet" href="-/web.css" />
</head>
<body>
	<!-- autobind component to element on load -->
	<div mol_viewer_root="$my_hello"></div>
	
	<!-- links to autogenerated realease and test js bundles -->
	<script src="-/web.js"></script>
	<script src="-/web.test.js"></script>
</body>
```

Your application will be served at **`http://localhost:8080/my/`**.

Add **declarative component description** at `./my/hello/hello.view.tree` with string input field and greeting message:
```tree
$my_hello $mol_viewer childs /
	< input $mol_stringer
		hint \Name
		value > name \
	< message \
```

That will be compiled to typescript code like this:

```typescript
module $ { export class $my_hello extends $mol_viewer {

	/// name \
	@ $mol_prop()
	name( ...diff : any[] ) {
		return ( diff[0] !== void 0 ) ? diff[0] : ""
	}

	/// input $mol_stringer 
	/// 	hint \Name
	/// 	value > name
	@ $mol_prop()
	input( ...diff : any[] ) {
		return ( diff[0] !== void 0 ) ? diff[0] : new $mol_stringer().setup( __ => { 
			__.hint = () => "Name"
			__.value = ( ...diff : any[] ) => this.name(  ...diff )
		} )
	}

	/// message \
	message() {
		return ""
	}

	/// childs / 
	/// 	< input 
	/// 	< message
	childs() {
		return [].concat( this.input() , this.message() )
	}

} }
```

Add **your behaviour** at `./my/hello/hello.view.ts` by extending generated class:

```typescript
module $.$mol {
	export class $my_hello extends $.$my_hello {
		
		message() {
			let name = this.name()
			return name && `Hello, ${name}!`
		}
		
	}
}
```

Add **styles** at `./my/hello/hello.view.css`:

```css
/* Styling BEM-block by autogenerated attribute */
[my_hello] {
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font: 1.5rem/1 sans-serif;
}

/* Styling BEM-element by autogenerated attribute */
[my_hello_input] {
	flex-grow: 0;
	margin: 1rem;
}
```

That is all!

# Rationale

## Zero configuration
Instead of creating configuration files for an application you want, we better concentrate on working the application 
at one from the box and don't bothers mol's developer creating configuration. 
But of course you could setup for you needs if you want.

For example if you download **[базовый PMS-проект](http://github.com/nin-jin/pms/)** you'd have got that:

**An assembly of JS and CSS bundles for any platforms.** A bundle can be assembled for any module and there are sources 
of that module and sources all other modules from witch this module depends and no redundant modules would be there.  

There are full set of supports bundles:

* `-/web.js` - JS for browser
* `-/web.test.js` - JS with tests for a browser
* `-/web.css` - CSS styles for a browser
* `-/web.deps.json` - a map of dependencies modules for browser
* `-/node.js` - JS for NodeJS
* `-/node.test.js` - JS with tests for NodeJS
* `-/node.deps.json` - a map of dependencies modules for NodeJS

**Support of Source Maps**. Sources are compiled and integrate to maps, they are fully self-sufficient.

**development server**, witch would be compile bundles as needed. For example, 
when requested `http://localhost:8080/mol/app/todomvc/-/web.js` a build is being assembled `js` of `mol/app/todomvc` project 
and `web` environment. Rebuilding would be occur only if some source file would be changed.

**Translating of modern CSS into CSS supported by browsers** 
([postcss-cssnext](https://github.com/MoOx/postcss-cssnext)): arrange prefixes and variables etc.

**Translating [TypeScript](https://github.com/Microsoft/TypeScript) into JS**. 
In TS configuration enabled support annotation and automatic arrangement any types, 
for prevent a missing typing by change.

**Watching dependencies by fact of using** and inclusion needed modules automatically at further bundle.
You don't need to write `include` and `require` everything you need is to refer for essence by full name 
like `$mol_state_arg` and `$mol.state.arg` (looking at its definition) in `*.ts`, `*.view.ts` и `*.view.tree` files. 
At CSS files its dependencies are looked for by entries 
like `[mol_checker_checked]` , `[mol_checker_checked=` and `.mol_checker_checked`.

## Lego components

A component approach is used by $mol to building an interface, but **every component is self-sufficient** and can be used 
as a self-sufficient application. Small component are collected inside of larger components etc.

Unlike of another frameworks the $mol does not seek to isolate insides of components. Vice versa, there are comfortable 
mechanism for configuration them is provided for developers, and there are not any gestures is required from creator 
of the component.

For example, to set a list of childs components you need to redefine `childs` property in view.tree
 
 ```tree
$mol_viewer childs /
	< button1
	< button2
 ```

Or the same through TypeScript:
 
 ```typescript
 new $mol_viewer().setup( obj => {
 	obj.childs = ()=> [ this.button1() , this.button2() ]
 } )
 ```
In both variants a compiler verify existing of property and signature of it.
In normal mode working with properties of object is not required, therefore all defining properties 
are public and can be safely overloaded.

## Lazyness
[$mol_viewer](viewer) realizes the conception of lazy rendering. [$mol_scroller](scroller) is watching a scrolling position and suggest embedded components about viewport size. [$mol_lister](lister) knowing about viewport size and minimal sizes of embedded components, excludes from rendering process the components that is not got into viewport for sure. And all other components could suggest him about its minimal size through `heightMinimal` property.

```
$my_icon $mol_viewer
	heightMinimal 16
```
At the result it come out than opening any window occur while instant time. It's independent of output data size.
And since data would not be rendered, then any requests would not be proceeded. It's allowed us to download them partly, when they are needed. That features are possible due to reactive architecture, that are penetrated all layers of application.

## Reactivity

В отличие от control-flow архитектур, в $mol реализована data-flow архитектура. Всё приложение описывается как набор 
классов, имеющих свойства. Каждое свойство описывается как некоторая функция от других свойства (и свойств других 
классов в том числе). Свойства, к которым было обращение в процессе выполнения функции запоминаются как зависимости 
нашего свойства. В случае изменения их значения, все зависимые от них свойства каскадно инвалидируются. А обращение
 к не актуальному свойству приводит к его предварительной актуализации.

Таким образом всё приложение на этапе исполнения представляет собой огромное дерево зависимостей, в корне которого 
находится особое свойство, которое в случае инвалидации автоматические себя актуализирует. А так как любое свойство 
всегда знает, зависит ли от него кто-нибудь или нет, то это даёт простой и надёжный механизм контроля жизненного 
цикла объектов - они создаются при появлении зависимости и уничтожаются, когда от них никто не зависит. Это в 
корне решает две фундаментальные проблемы: утечки ресурсов и инвалидация кеша.

Кроме того, реактивная архитектура позволяет элегантно абстрагировать код от асинхронных операций. Если функция 
не может вернуть значение сразу, она может кинуть `$mol_atom_wait` исключение, что пометит часть дерева состояний 
как "ожидающие результата". Когда результат будет получен - можно вставить его непосредственно в свойство и 
приложение перестроится под новое состояние.

```typescript
class Greeter {
	
	// Define memoized property with push support
	@ $mol_prop()
	greeting( ...diff : string[] ) : string {
		
		// Defered push value to property
		setTimeout( () => {
			this.greeting( void 0 , 'Hello!' )
		} , 1000 )
		
		// throw special error to notify about waiting
		throw new $mol_atom_wait( 'Wait!' )
	}
	
	// Define memoized property without push support
	@ $mol_prop()
	greetingLength() {
		// Using other properties in synchronous style
		return this.greeting().length
	}
	
}
```

Подробности: [$mol_prop](prop), [$mol_atom](atom).

## Debugging

Особое внимание при разработке $mol уделяется возможностям отладки и исследования работы кода. Например, 
для обработки исключительных ситуаций нигде не используется перехват их с пробросом (`try-catch-throw`), 
так как это маскирует истинное место возникновения исключительной ситуации, усложняя отладку. 

Для каждого DOM-элемента автоматически формируется человекопонятный идентификатор вида `$mol_app_todomvc.root(0).taskRow(0).titler()`, который является валидным яваскриптом, который можно исполнить в консоли, получив ссылку на компонент, которому этот элемент соответствует. Развернув содержимое компонента вы получие имена и значения его полей вида:

```
$mol_app_todomvc
    DOMNode() : div#$mol_app_todomvc.root(0)
    task(1474385802391) : Object
    task(1474386443175) : Object
    taskRow(0) : $mol_app_todomvc_taskRow
    taskRow(1) : $mol_app_todomvc_taskRow
    taskRows() : Array[2]
```

Имя поля соответствует вызову свойства, через которое доступно содержимое этого поля. А благодаря именованию 
классов и функций через подчёркивания вы всегда можете понять инстанс какого именно класса перед вами и можете 
быстро найти его в коде обычным поиском по подстроке. 

# Modules

## Flow

* **[$mol_defer](defer)** - deferred but immediate execution
* **[$mol_atom](atom)** - reactive container
* **[$mol_log](log)** - logging

## Object model

* **[$mol_prop](prop)** - reactive property decorator
* **[$mol_object](object)** - components base class
* **[$mol_model](model)** - reactive model base class

## Functions

* **[$mol_const](const)** - const value returning function

## Collections

* **[$mol_range](range)** - lazy array
* **[$mol_set](set)** - [Set API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
* **[$mol_dict](dict)** - [Map API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* **[$mol_maybe](maybe)** - [maybe monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad)

## [State modules](state)

* **[$mol_state_arg](state/arg)** - arguments state (location/argv)
* **[$mol_state_local](state/local)** - persistent local state (localStorage)
* **[$mol_state_session](state/session)** - session temporaty state (sessionStorage)
* **[$mol_state_history](state/history)** - browser history bound state
* **[$mol_state_stack](state/stack)** - state of current stack of execution

## Communication modules

* **[$mol_http_request](http/request)** - Reactive HTTP Request
* **[$mol_http_resource](http/resource)** - Reactive REST HTTP resource

## Simple components

* **[$mol_viewer](viewer)** - reactive view model base class with lazy error-proof renderer
* **[$mol_filler](filler)** - lorem ipsum
* **[$mol_svg](svg)** - svg base components

## Simple controls

* **[$mol_linker](linker)** - navigation link
* **[$mol_clicker](clicker)** - button
* **[$mol_checker](checker)** - check box
* **[$mol_switcher](switcher)** - radio buttons
* **[$mol_stringer](stringer)** - one string input control
* **[$mol_number](number)** - one number input control
* **[$mol_coder](coder)** - bar code scanner
* **[$mol_portioner](portioner)** - portion visualizer

## Layout components

* **[$mol_scroller](scroller)** - scroll pane with position saving
* **[$mol_tiler](tiler)** - items in row with balanced wrapping
* **[$mol_rower](rower)** - items in row with wrapping and padding between
* **[$mol_barer](barer)** - group of controls as own control
* **[$mol_lister](lister)** - vertical list of rows
* **[$mol_labeler](labeler)** - labeled content
* **[$mol_sectioner](sectioner)** - section with header
* **[$mol_stacker](stacker)** - horizontal stack of panels
* **[$mol_pager](pager)** - page with header, body and footer
* **[$mol_decker](decker)** - deck of panels with tab bar
* **[$mol_carder](carder)** - card whit content

## Complex components

* **[$mol_form](form)** - forms with validators
* **[$mol_demo](demo)** - demonstrates widget in various screens
* **[$mol_attacher](attacher)** - preview list and attach button
* **[$mol_coster](coster)** - prints currency values

## Data formats

* **[$mol_tree](tree)** - [tree format](https://github.com/nin-jin/tree.d)

## Math

* **[$mol_graph](graph)** - graph algorithms
* **[$mol_unit](unit)** - typed number value
* **[$mol_merge_dict](merge/dict)** - merge two dictionaries to new one

## Resources

* **[$mol_logo](logo)** - $mol logotypes
* **[$mol_icon](icon)** - css styled icons
* **[$mol_skin](skin)** - theming

## Testing

* **[$mol_test](test)** - unit testing
* **[$mol_stub](stub)** - stub data generators

## API

* **[$mol_cordova](cordova)** - [Apache Cordova](https://cordova.apache.org) API
* **[$mol_exec](exec)** - synchronous execute of system command
* **[$mol_file](file)** - reactive file system wrapper
* **[$mol_window](window)** - reactive view port configuration

## Building

* **[$mol_build](build)** - pms builder
* **[$mol_build_server](build/server)** - pms developer server

# Cool stuff

[Commits visualization](http://ghv.artzub.com/#repo=mol&user=eigenmethod&climit=100000)
