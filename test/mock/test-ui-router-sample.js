/*jshint undef: false */

/**
 * Module with the ui-router sample conf.
 * Code is taken from https://github.com/angular-ui/ui-router/tree/master/sample
 * and has been merged in this functionnal module in order to test
 * the angular-breadcrumb with the sample of ui-router.
 */
angular.module('ncy-ui-router-conf', ['ngMock'])
    .factory('utils', function () {
        return {
            findById: function findById(a, id) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i].id === id) {
                        return a[i];
                    }
                }
                return null;
            },

            newRandomKey: function newRandomKey(coll, key, currentKey){
                var randKey;
                do {
                    randKey = coll[Math.floor(coll.length * Math.random())][key];
                } while (randKey === currentKey);
                return randKey;
            }
        };
    })
    .factory('contacts', ['utils', function (utils) {
        var contacts = {
            "contacts":[
                {"id": 1, "name": "Alice", "items": [
                    {"id": "a", "type": "phone number", "value": "555-1234-1234"},
                    {"id": "b", "type": "email", "value": "alice@mailinator.com"}
                ]},
                {"id": 42, "name": "Bob", "items": [
                    {"id": "a", "type": "blog", "value": "http://bob.blogger.com"},
                    {"id": "b", "type": "fax", "value": "555-999-9999"}
                ]},
                {"id": 123, "name": "Eve", "items": [
                    {"id": "a", "type": "full name", "value": "Eve Adamsdottir"}
                ]}
            ]
        };
        var factory = {};
        factory.all = function () {
            return contacts;
        };
        factory.get = function (id) {
            return contacts.then(function(){
                return utils.findById(contacts, id);
            });
        };
        return factory;
    }])
    .config(function($stateProvider, $breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home'
        });

        $stateProvider.state("home", {
            url: "/",
            template: '<p class="lead">Welcome to the UI-Router Demo</p>' +
                '<p>Use the menu above to navigate. ' +
                'Pay attention to the <code>$state</code> and <code>$stateParams</code> values below.</p>' +
                '<p>Click these links—<a href="#/c?id=1">Alice</a> or ' +
                '<a href="#/user/42">Bob</a>—to see a url redirect in action.</p>'

        })
        .state('about', {
            url: '/about',
            templateProvider: ['$timeout', function ($timeout) {
                return $timeout(function () {
                    return '<p class="lead">UI-Router Resources</p><ul>' +
                        '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                        '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
                        '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                        '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                        '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                        '</ul>';
                }, 100);
            }]
        })
        .state('contacts', {
            abstract: true,
            url: '/contacts',
            templateUrl: 'app/contacts/contacts.html',
            resolve: {
                contacts: ['contacts',
                    function( contacts){
                        return contacts.all();
                    }]
            },
            controller: ['$scope', '$state', 'contacts', 'utils',
                function (  $scope,   $state,   contacts,   utils) {
                    $scope.contacts = contacts;
                    $scope.goToRandom = function () {
                        var randId = utils.newRandomKey($scope.contacts, "id", $state.params.contactId);
                        $state.go('contacts.detail', { contactId: randId });
                    };
                }]
        })
        .state('contacts.list', {
            url: '',
            templateUrl: 'app/contacts/contacts.list.html'
        })
        .state('contacts.detail', {
            url: '/{contactId:[0-9]{1,4}}',
            views: {
                '': {
                    templateUrl: 'app/contacts/contacts.detail.html',
                    controller: ['$scope', '$stateParams', 'utils',
                        function (  $scope,   $stateParams,   utils) {
                            $scope.contact = utils.findById($scope.contacts, $stateParams.contactId);
                        }]
                },
                'hint@': {
                    template: 'This is contacts.detail populating the "hint" ui-view'
                },
                'menuTip': {
                    templateProvider: ['$stateParams',
                        function ($stateParams) {
                            return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
                        }]
                }
            },
            ncyBreadcrumb: {
                parent: 'contacts.list' // Override the parent state (only for the breadcrumb).
            }
        })
        .state('contacts.detail.item', {
            url: '/item/:itemId',
            views: {
                '': {
                    templateUrl: 'app/contacts/contacts.detail.item.html',
                    controller: ['$scope', '$stateParams', '$state', 'utils',
                        function (  $scope,   $stateParams,   $state,   utils) {
                            $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);

                            $scope.edit = function () {
                                $state.go('.edit', $stateParams);
                            };
                        }]
                },
                'hint@': {
                    template: ' This is contacts.detail.item overriding the "hint" ui-view'
                }
            }
        })
        .state('contacts.detail.item.edit', {
            views: {
                '@contacts.detail': {
                    templateUrl: 'app/contacts/contacts.detail.item.edit.html',
                    controller: ['$scope', '$stateParams', '$state', 'utils',
                        function (  $scope,   $stateParams,   $state,   utils) {
                            $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
                            $scope.done = function () {
                                $state.go('^', $stateParams);
                            };
                        }]
                }
            }
        });
    })
    .run(function($httpBackend) {
        // Due to templateUrl definitions in $state configuration,
        // httpBackend will try to load the view for each state asked.
        $httpBackend.when('GET', 'app/contacts/contacts.html').respond('dummy contacts view');
        $httpBackend.when('GET', 'app/contacts/contacts.list.html').respond('dummy contacts.list view');
        $httpBackend.when('GET', 'app/contacts/contacts.detail.html').respond('dummy contacts.detail view');
        $httpBackend.when('GET', 'app/contacts/contacts.detail.item.html').respond('dummy contacts.detail.item view');
        $httpBackend.when('GET', 'app/contacts/contacts.detail.item.edit.html').respond('dummy contacts.detail.item.edit view');
    });
