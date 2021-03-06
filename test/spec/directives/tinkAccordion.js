'use strict';

describe('tinkaccordion', function() {
  beforeEach(module('tink'));

  var bodyEl = $('body'), sandboxEl,today,scope,$compile,$templateCache,countCall;

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    today = new Date();
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    countCall=0;
  }));

  afterEach(function() {
    scope.$destroy();
    countCall = 0;
    sandboxEl.remove();
  });

  var templates = {
    'default': {
      scope: {},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="false">'+
      '<tink-accordion-group toggle-var="togle" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group toggle-var="togle" heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    },
    'all-open': {
      scope: {},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="true">'+
      '<tink-accordion-group toggle-var="togle" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group toggle-var="togle" heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    },
    'all-var': {
      scope: {openStart:true},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="openStart">'+
      '<tink-accordion-group data-is-collapsed="group1collapsed" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    },
    'group1-collapsed-false': {
      scope: {openStart:true},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="openStart">'+
      '<tink-accordion-group data-is-collapsed="false" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    },
    'group1-collapsed-true': {
      scope: {openStart:true},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="openStart">'+
      '<tink-accordion-group data-is-collapsed="true" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    },
    'loading-func': {
      scope: {openStart:false},
      element: '<tink-accordion data-one-at-a-time="false" data-start-open="openStart">'+
      '<tink-accordion-group data-is-collapsed="true" heading="head 1">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 2">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group heading="head 3">hier is wat content</tink-accordion-group>'+
      '<tink-accordion-group data-onclick="group1go" heading="head 4">'+
      'nu gaan we effe heel veel content plaatsen<br/>'+
      'hier komt dus super veel<br/>'+
      'om dit goed te kunnen testen<br/>'+
      '<table>'+
        '<thead>'+
          '<tr>'+
            '<th># </th>'+
            '<th>First Name </th>'+
            '<th>Last Name </th>'+
            '<th>Username </th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>'+
          '<tr>'+
            '<td>1 </td>'+
            '<td>Mark </td>'+
            '<td>Otto </td>'+
            '<td>@mdo </td>'+
          '</tr>'+
          '<tr>'+
            '<td>2 </td>'+
            '<td>Jacob </td>'+
            '<td>Thornton </td>'+
            '<td>@fat </td>'+
          '</tr>'+
          '<tr>'+
            '<td>3 </td>'+
            '<td>Larry </td>'+
            '<td>the Bird </td>'+
            '<td>@twitter </td>'+
          '</tr>'+
        '</tbody>'+
        '<tfoot>'+
          '<tr>'+
            '<th> </th>'+
            '<th colspan="3">Footer info can be put here </th>'+
          '</tr>'+
        '</tfoot>'+
      '</table>'+
      '</tink-accordion-group>'+
      '</tink-accordion>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

    describe('with default template', function() {

    it('all collapsers are closed with string', function() {
      compileDirective('default');
        expect(sandboxEl.find('.group-open').length).toBe(0);
    });

    it('all collapsers are open with string', function() {
      compileDirective('all-open');
        expect(sandboxEl.find('.group-open').length).toBe(4);
    });

    it('all collapsers are open with var', function() {
      compileDirective('all-var');
        expect(sandboxEl.find('.group-open').length).toBe(4);
    });

    it('all collapsers are closed with var', function() {
      compileDirective('all-var',{openStart:false});
        expect(sandboxEl.find('.group-open').length).toBe(0);
    });

    it('first accordion open because of data-is-collapsed with variable', function() {
      compileDirective('all-var',{openStart:false,group1collapsed:false});
        expect(sandboxEl.find('section.accordion-panel:first').hasClass('group-open')).toBe(true);
    });

    it('first accordion closed because of data-is-collapsed with variable', function() {
      compileDirective('all-var',{openStart:false,group1collapsed:true});
        expect(sandboxEl.find('section.accordion-panel:first').hasClass('group-open')).toBe(false);
    });

    it('first accordion closed because of data-is-collapsed with sting', function() {
      compileDirective('group1-collapsed-false',{openStart:false});
        expect(sandboxEl.find('section.accordion-panel:first').hasClass('group-open')).toBe(true);
    });

    it('first accordion open because of data-is-collapsed with sting', function() {
      compileDirective('group1-collapsed-true',{openStart:false});
        expect(sandboxEl.find('section.accordion-panel:first').hasClass('group-open')).toBe(false);
    });

    it('when loading and function next is called the action will be open', function() {
      var counts = [];
      var newS = {group1go:function(action,next){
        if(action === 'loading'){
          next();
        }
        counts.push(action);
        countCall++;
      },openStart:false};
      compileDirective('loading-func',newS);
      sandboxEl.find('section.accordion-panel:last .accordion-toggle').click();
      expect(counts).toEqual(['open','loading']);
    });

    it('when loading and the user clicks it will cancel', function() {
      var counts = [];
      var newS = {group1go:function(action){
        counts.push(action);
      },openStart:true};
      compileDirective('loading-func',newS);
        sandboxEl.find('section.accordion-panel:last .accordion-toggle').click();
    });

    it('2 clicks in a row cancels the load', function() {
      var counts = [];
      var newS = {group1go:function(action){
        counts.push(action);
      }};
      compileDirective('loading-func',newS);
        sandboxEl.find('section.accordion-panel:last .accordion-toggle').click();
        sandboxEl.find('section.accordion-panel:last .accordion-toggle').click();
        expect(counts).toEqual(['loading','canceld']);
    });

  });

});