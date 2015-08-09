/*jshint undef: false */

/**
 * Module with minimalist configuration.
 */
angular.module('ncy-basic-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', ncyBreadcrumb: {label: 'State A'}})
        .state('A.B', {url: '/b', ncyBreadcrumb: {label: 'State B'}})
        .state('A.B.C', {url: '/c', ncyBreadcrumb: {label: 'State C'}})
        .state('D', {parent: 'A.B.C', url: '/d', ncyBreadcrumb: {label: 'State D'}}) // Explicit parent
        .state('D.E', {url: '/e', ncyBreadcrumb: {label: 'State E', skip: true}})
        .state('D.E.F', {url: '/f', ncyBreadcrumb: {label: 'State F'}})
        .state('G', {url: '/g', ncyBreadcrumb: {label: 'State G', skip: true}})
        .state('G.H', {url: '/h', ncyBreadcrumb: {label: 'State H'}});
});

/**
 * Module including abstract states.
 */
angular.module('ncy-abstract-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', abstract: true, ncyBreadcrumb: {label: 'State A'}})
        .state('A.B', {url: '/b', ncyBreadcrumb: {label: 'State B'}})
        .state('A.B.C', {url: '/c', ncyBreadcrumb: {label: 'State C'}})
        .state('D', {url: '/d', ncyBreadcrumb: {label: 'State D'}})
        .state('D.E', {url: '/e', abstract: true, ncyBreadcrumb: {label: 'State E'}})
        .state('D.E.F', {url: '/f', ncyBreadcrumb: {label: 'State F'}})
        .state('G', {url: '/g', abstract: true, ncyBreadcrumb: {label: 'State G', skip: true}})
        .state('G.H', {url: '/h', ncyBreadcrumb: {label: 'State H'}})
        .state('I', {url: '/i', abstract: true, ncyBreadcrumb: {label: 'State I', force: true}})
        .state('I.J', {url: '/j', ncyBreadcrumb: {label: 'State J'}})
        .state('K', {url: '/k', abstract: true, ncyBreadcrumb: {label: 'State K', skip: true, force: true}})
        .state('K.L', {url: '/l', ncyBreadcrumb: {label: 'State L'}});
});

/**
 * Module including parents defined by objects.
 */
angular.module('ncy-object-parent-conf', []).config(function($stateProvider) {
    var A = {
        name: 'A',
        url: '/a',
        ncyBreadcrumb: {label: 'State A'}
    };
    var A_B = {
        name: 'B',
        url: '/b',
        ncyBreadcrumb: {label: 'State B'},
        parent: A
    };
    $stateProvider
        .state(A)
        .state(A_B);
});

/**
 * Module with dynamic parent configuration.
 */
angular.module('ncy-dynamic-parent-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', ncyBreadcrumb: {label: 'State A'}})
        .state('A.B', {url: '/b', ncyBreadcrumb: {label: 'State B'}})
        .state('C', {url: '/c', ncyBreadcrumb: {label: 'State C'}})
        .state('D', {url: '/d', ncyBreadcrumb: {label: 'State D'}})
        .state('D.E', {url: '/e', ncyBreadcrumb: {label: 'State E'}})
        .state('D.E.F', {url:'/f', ncyBreadcrumb: {label: 'State F', parent: 'A.B'}}) // Specific parent for breadcrumb
        .state('D.E.G', {url:'/g', ncyBreadcrumb: {label: 'State G', parent: function() {
            return 'A';
        }}})
        .state('D.E.H', {url:'/h', ncyBreadcrumb: {label: 'State H', parent: function($scope) {
            return $scope.parentState;
        }}})
        .state('I', {url: '/i/:x/:y', ncyBreadcrumb: {label:'State I'}})
        .state('J', {url: '/j', ncyBreadcrumb: {label:'State J', parent: 'I({x: \'love\', y: \'you\'})'}});
}).controller('UndefinedCtrl', function($scope) {
    $scope.parentState = undefined;
}).controller('ReturnCCtrl', function($scope) {
    $scope.parentState = 'C';
});

/**
 * Module with angular expressions in label
 */
angular.module('ncy-interpolation-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', controller: 'ACtrl', template: '<div>View A</div>', ncyBreadcrumb: {label: 'State A'}})
        .state('A.B', {url: '/b', controller: 'BCtrl', template: '<div>View B</div>', ncyBreadcrumb: {label: 'State {{tripleB}}'}})
        .state('A.B.C', {url: '/c', ncyBreadcrumb: {label: 'State C'}}) // no controller
        .state('A.B.D', {url: '/d', controller: function($scope) {$scope.tripleD='DDD';}, template: '<div>View D</div>', ncyBreadcrumb: {label: 'State {{tripleD}}'}}); // inline controller
}).controller('ACtrl', function($scope) {
    $scope.tripleA = 'AAA';
}).controller('BCtrl', function($scope) {
    $scope.tripleB = 'BBB';
});

/**
 * Module with html configuration.
 */
angular.module('ncy-html-conf', ['ngSanitize']).config(function($stateProvider) {
    $stateProvider
        .state('html', {url: '/html', ncyBreadcrumb: {label: 'Html is <b>interpreted</b>'}});
});

angular.module('ncy-sample-conf', ['ncy-sample', 'ngMock']).config(function($urlRouterProvider) {
    // New module to override the otherwise of the sample app.
    // (we don't want to deal with the location according to each state)
    $urlRouterProvider.otherwise(function() {
        return false;
    });
}).run(function($httpBackend) {
    // Due to templateUrl definitions in $state configuration,
    // httpBackend will try to load the view for each state asked.
    $httpBackend.when('GET', 'views/home.html').respond('dummy home view');
    $httpBackend.when('GET', 'views/sample.html').respond('dummy sample view');
    $httpBackend.when('GET', 'views/room_list.html').respond('dummy room_list view');
    $httpBackend.when('GET', 'views/room_detail.html').respond('dummy room_detail view');
    $httpBackend.when('GET', 'views/room_form.html').respond('dummy room_form view');
});

/**
 * Module with multiple views related to one state and interpolated labels
 */
angular.module('ncy-multiple-interpolation-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {
            url: '/a',
            views: {
                'a@': {
                    template: '<div>View A</div>',
                    controller: 'ACtrl'
                }
            }
        })
        .state('A.B', {
            url: '/b',
            views: {
                'b@': {
                    template: '<div>View B</div>',
                    controller: 'BCtrl'
                }
            },
            ncyBreadcrumb: {
                label: 'State {{tripleB}}'
            }
        });
}).controller('ACtrl', function() {
}).controller('BCtrl', function($scope) {
    $scope.tripleB = 'BBB';
});
