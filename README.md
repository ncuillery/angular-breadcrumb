# angular-breadcrumb

Generate a breadcrumb from ui-router's states

## In development
angular-breadcrumb is unusable for the moment. Basic functionalities are currently in development.

### Roadmap
- [x] Build a breadcrumb presenting a step for each state in the current state's hierarchy
- [ ] Display a human readeable label for each step in the breadcrumb
- [ ] Build a working link for each step expect the last one.
- [ ] Probably first release here ;-)
- [ ] Reflection about templating (maybe not everybody want to use the [bootstrap's breadcrumb](http://getbootstrap.com/components/#breadcrumbs))

## Getting Started
### Dependencies
angular-breadcrumb requires ui-router in minimal version *0.2.0* (when the method `$state.get` was added).

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ncuillery/angular-breadcrumb/master/dist/angular-breadcrumb.min.js
[max]: https://raw.github.com/ncuillery/angular-breadcrumb/master/dist/angular-breadcrumb.js

In your web page:

```html
<script src="dist/angular-breadcrumb.min.js"></script>
```

Add dependency to your app module:
```js
'ncy-angular-breadcrumb'
```

Use the directive `ncy-breadcrumb'
```html
<div ncy-breadcrumb></div>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Nicolas Cuillery  
Licensed under the MIT license.
