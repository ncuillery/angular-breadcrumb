<a name="0.2.3"></a>
### 0.2.3 (2014-07-26)


#### Bug Fixes

* **$breadcrumb:** use `$stateParams` in case of unhierarchical states ([1c3c05e0](http://github.com/ncuillery/angular-breadcrumb/commit/1c3c05e0acac191fe2e76db2ef18da339caefaaa), closes [#29](http://github.com/ncuillery/angular-breadcrumb/issues/29))


<a name="0.2.2"></a>
### 0.2.2 (2014-06-23)


#### Bug Fixes

* catch the `$viewContentLoaded` earlier ([bb47dd54](http://github.com/ncuillery/angular-breadcrumb/commit/bb47dd54deb5efc579ccb9b1575e686803dee1c5), closes [#14](http://github.com/ncuillery/angular-breadcrumb/issues/14))
* **sample:**
  * make the CRU(D) about rooms working ([3ca89ec7](http://github.com/ncuillery/angular-breadcrumb/commit/3ca89ec771fd20dc4ab2d733612bdcfb96ced703))
  * prevent direct URL access to a day disabled in the datepicker ([95236916](http://github.com/ncuillery/angular-breadcrumb/commit/95236916e00b19464a3dfe3584ef1b18da9ffb25), closes [#17](http://github.com/ncuillery/angular-breadcrumb/issues/17))
  * use the same variable in the datepicker and from url params for state `booking.day` ([646f7060](http://github.com/ncuillery/angular-breadcrumb/commit/646f70607e494f0e5e3c2483ed69f689684b2742), closes [#16](http://github.com/ncuillery/angular-breadcrumb/issues/16))


#### Features

* **ncyBreadcrumb:** watch every expression founded in labels ([1363515e](http://github.com/ncuillery/angular-breadcrumb/commit/1363515e20977ce2f39a1f5e5e1d701f0d7af296), closes [#20](http://github.com/ncuillery/angular-breadcrumb/issues/20))


<a name="0.2.1"></a>
### 0.2.1 (2014-05-16)


#### Bug Fixes

* **$breadcrumb:** check if a state has a parent when looking for an inheritated property ([77e668b5](http://github.com/ncuillery/angular-breadcrumb/commit/77e668b5eb759570a64c2a885e81580953af3201), closes [#11](http://github.com/ncuillery/angular-breadcrumb/issues/11))


<a name="0.2.0"></a>
### 0.2.0 (2014-05-08)


#### Bug Fixes

* **$breadcrumb:** remove abstract states from breadcrumb ([8a06c5ab](http://github.com/ncuillery/angular-breadcrumb/commit/8a06c5abce749027d48f7309d1aabea1e447dfd5), closes [#8](http://github.com/ncuillery/angular-breadcrumb/issues/8))
* **ncyBreadcrumb:** display the correct breadcrumb in case of direct access ([e1f455ba](http://github.com/ncuillery/angular-breadcrumb/commit/e1f455ba4def97d3fc76b53772867b5f9daf4232), closes [#10](http://github.com/ncuillery/angular-breadcrumb/issues/10))


#### Features

* **$breadcrumb:**
  * add a configuration property for skipping a state in the breadcrumb ([dd255d90](http://github.com/ncuillery/angular-breadcrumb/commit/dd255d906c4231f44b48f066d4db197a9c6b9e27), closes [#9](http://github.com/ncuillery/angular-breadcrumb/issues/9))
  * allow chain of states customization ([028e493a](http://github.com/ncuillery/angular-breadcrumb/commit/028e493a1ebcae5ae60b8a9d42b949262000d7df), closes [#7](http://github.com/ncuillery/angular-breadcrumb/issues/7))
* **ncyBreadcrumb:** add 'Element' declaration style '<ncy-breadcrumb />' ([b51441ea](http://github.com/ncuillery/angular-breadcrumb/commit/b51441eafb1659b782fea1f8668c7f455e1d6b4d))

