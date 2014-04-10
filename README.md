# angular-breadcrumb
[![Build Status](https://travis-ci.org/ncuillery/angular-breadcrumb.png)](https://travis-ci.org/ncuillery/angular-breadcrumb) [![Coverage Status](https://coveralls.io/repos/ncuillery/angular-breadcrumb/badge.png)](https://coveralls.io/r/ncuillery/angular-breadcrumb)

Generate a breadcrumb from ui-router's states

## Roadmap
- [x] Build a breadcrumb presenting a step for each state in the current state's hierarchy
- [x] Display a human readeable label for each step in the breadcrumb
- [x] Build a working link for each step except the last one.
- [x] Reflection about templating (maybe not everybody want to use the [bootstrap's breadcrumb](http://getbootstrap.com/components/#breadcrumbs))
- [ ] Wiki
- [ ] Probably first release here ;-)

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
### Configuration of ui-router states
The breadcrumb is strongly based on ui-router. In order to build a human readable breadcrumb, it needs to have additional properties defined of each states :
**ncyBreadcrumbLabel**
This property define the label displayed by the angular-breadcrumb directive :
```js
$stateProvider.state('home', {
  url: '/home',
  templateUrl: 'views/home.html',
  controller: 'HomeCtrl',
  data: {
    ncyBreadcrumbLabel: 'Home page'
  }
})
```
The property `ncyBreadcrumbLabel` can contains bindings which are evaluated against the current state controller. For example, this state's config :
```js
$stateProvider.state('home', {
  url: '/home',
  templateUrl: 'views/home.html',
  controller: function($scope) {
    $scope.foo='bar';
  },
  data: {
    ncyBreadcrumbLabel: 'State {{foo}}'
  }
})
```
will produces `State bar`. 

Every states that can be displayed in the breadcrumb *must* defined this property. If not, a state [inherit the property from his parent](https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#inherited-custom-data). It results a breadcrumb including 2 states with the same label...

## Examples
See sample [here](http://ncuillery.github.io/angular-breadcrumb/sample/)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Nicolas Cuillery  
Licensed under the MIT license.
