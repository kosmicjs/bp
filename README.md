# kosmic

> Express like framework powered by Koa.

## Installation

`npm install @kosmic/core`

## About

`@kosmic/core` aims to recreate the familiar and useful api of express with Koa powering the underlying http server. You can think of `@kosmic/core` as just an extended Koa. Developed in TypeScript so no additional types are needed to get started right away with a first class TS experience.

## Philosophy and Why kosmic?

Koa and Express share an extremely similar core, and were originally authored by the same person/team. At the time of its writing, Koa was extremely advanced, using the most cutting edge JavaScript under the hood to create the middleware system that is Koa (which we believe is the most expressive and powerful middleware system for http available). This meant that most early adopters of Koa we're generaly JS power users, who wanted maximum control and understanding over their http framework and had a strong understanding of advanced JS async patterns. We believe this led to Koa being a more modularized framework that required piecing together many early and experimental libraries to build a full http server experience that was customized to each developer. Fast forward to 2022, Koa has matured, and eco system has mostly settled on a handful of libraries that are generally pieced together in a similar way for most developers using Koa (although admittedly there is still many who heavily customize their Koa usage), and the Koa api is no longer as "cutting edge," as async/await has become commonplace in the Node ecosystem as whole. However, because of Koa's early roots, it remains extremely modular and barebones and not nescessarily trivial experience to set up. It can be intimidating or seem not worth the time to set it up to provide the same out of the box power as express. This discourages developers coming from express to adopt Koa, because, why should they?

Exspence aims to fix this and encourage Koa ecosystem growth and adoption by doing a few things and making a few promises.

1) Extending Koa to have a similar Api and feature set as express, easing developer transition from express to a more modern expressive http framework (Koa).
2) Providing a first class TypeScript experience for Koa, eliminating the need for installing separate types for common Koa libraries and middlewares.
3) Provide some extra functionality for converting express projects to kosmic (Koa) projects.
4) Honor the Koa ecosystem by NOT providing custom middleware written by the kosmic team and instead acting as a simple glue layer between Koa and its own ecosystem which will significantly simplify the transition to Koa, while at the same time, not attempting to disrupt and compete with current Koa eco-system and its amazing community of talented maintainers.
5) Support the maintenance of the Koa ecosystem (which is largely unneeded at this time).
6) Provide unified documentation and explanations for common Koa modules which are included in kosmic to improve developer understanding.
7) Remain unopinionated about how to set up your server. (We may provide opinionated generators in the future, but the core kosmic module aims to never force more opinions than are provided by express)

## Example

```javascript
import Kosmic from '@kosmic/core';

const app = new Kosmic();
const router = Kosmic.Router();

app.set('view engine', 'pug');

app.use(Kosmic.static('public'));
app.use(Kosmic.bodyParser());

app.get('/', ctx => {
	ctx.request.render('someview', {...locals})
});
app.post('/', ctx => {...});
app.put('/', ctx => {...});
app.delete('/', ctx => {...});

router.get('/', ctx => {...});
router.post('/', ctx => {...});
router.put('/', ctx => {...});
router.delete('/', ctx => {...});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(app.routes());
app.use(app.allowedMethods());

(async () => {
	await app.start({...})
})()
```
