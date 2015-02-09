'use strict';

describe('datepicker range', function() {
	beforeEach(module('tink'));

	var bodyEl = $('body'), sandboxEl,today,scope,$compile,$templateCache,dateCalculator;

	beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_,_dateCalculator_) {
		scope = _$rootScope_.$new();
		$compile = _$compile_;
		$templateCache = _$templateCache_;
		dateCalculator = _dateCalculator_;
		today = new Date();
		bodyEl.html('');
		sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
	}));

	afterEach(function() {
		scope.$destroy();
		sandboxEl.remove();
	});

	var templates = {
		'default': {
			scope: {dates: {first:new Date(2014,11,30),last:null}},
			element: '<tink-datepicker-range data-first-date="dates.first" data-last-date="dates.last"></tink-datepicker-range>'
		},
		'no-dates': {
			scope: {dates: {first:null,last:null}},
			element: '<tink-datepicker-range data-first-date="dates.first" data-last-date="dates.last"></tink-datepicker-range>'
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

		it('should open on focus', function() {
			var elm = compileDirective('default');
			expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			scope.$digest();
			expect(sandboxEl.find('.datepickerrange').css('display')).toBe('block');
		});

		it('should close on blur', function() {
			var elm = compileDirective('default');
			expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			scope.$digest();
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('blur');
			scope.$digest();
			expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
		});

		it('should open with right months', function() {
			var elm = compileDirective('default');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			scope.$digest();
			expect(sandboxEl.find('div label')[0].innerText).toBe('December 2014');
			expect(sandboxEl.find('div label')[1].innerText).toBe('Januari 2015');
		});

		function getDatehtml(va){
			return va.html().replace(/<span class="placeholder">/g,'').replace(/<\/span>/g,'');
		}

		it('should correctly display active date', function() {
			var elm = compileDirective('default');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			var date = new Date(2014,11,30);
			scope.$digest();
			expect(getDatehtml(sandboxEl.find('div.faux-input:first'))).toBe(date.getDate() + '/'+('0'+(date.getMonth() + 1)).slice(-2) + '/'+ date.getFullYear() );
		});

		it('should correctly select a new date', function() {
			var elm = compileDirective('default');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			angular.element(sandboxEl.find('tr td button:contains(18)')[0]).triggerHandler('click');
			var date = new Date(2014,11,18);
			expect(getDatehtml(sandboxEl.find('div.faux-input:first'))).toBe(date.getDate() + '/'+('0'+(date.getMonth()+1)).slice(-2) + '/'+ date.getFullYear() );
		});

		it('should correctly change when scope changes', function() {
			compileDirective('default');
			scope.dates.first = new Date(2015,0,20);
			scope.dates.last = new Date(2015,1,20);
			scope.$digest();
			expect(getDatehtml(sandboxEl.find('div.faux-input:first'))).toBe('20/01/2015');
			expect(getDatehtml(sandboxEl.find('div.faux-input:last'))).toBe('20/02/2015');
		});

		it('should correctly change when next month is clicked', function() {
			var elm = compileDirective('default');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			scope.$digest();
			expect(sandboxEl.find('div label')[0].innerText).toBe('December 2014');
			expect(sandboxEl.find('div label')[1].innerText).toBe('Januari 2015');
			elm.find('button.btn.pull-left:last').triggerHandler('click');
			scope.$digest();
			expect(sandboxEl.find('div label')[0].innerText).toBe('Januari 2015');
			expect(sandboxEl.find('div label')[1].innerText).toBe('Februari 2015');
		});


		it('should correctly change view month when selecting next month button', function() {
			var elm = compileDirective('default');
      // set date to last day of January
      scope.dates.first = new Date(2014, 0, 31);

      scope.$digest();
      angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
      for (var nextMonth = 1; nextMonth < 24; nextMonth++) {
        // should show next month view when selecting next month button
        elm.find('button.btn.pull-left:last').triggerHandler('click');
        expect(sandboxEl.find('div label')[0].innerText).toBe(dateCalculator.format(new Date(2014, nextMonth, 1), 'MMMM yyyy'));
        expect(sandboxEl.find('div label')[1].innerText).toBe(dateCalculator.format(new Date(2014, nextMonth+1, 1), 'MMMM yyyy'));
     }
    });

		it('should correctly change view month when selecting previous month button', function() {
			var elm = compileDirective('default');
      // set date to last day of December
      scope.dates.first = new Date(2016, 11, 31);
      scope.$digest();
      angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('click');
      for (var previousMonth = 10; previousMonth > -12; previousMonth--) {
        // should show previous month view when selecting previous month button
        elm.find('button.btn.pull-left:first').triggerHandler('click');
        expect(sandboxEl.find('div label')[0].innerText).toBe(dateCalculator.format(new Date(2016, previousMonth, 1), 'MMMM yyyy'));
        expect(sandboxEl.find('div label')[1].innerText).toBe(dateCalculator.format(new Date(2016, previousMonth+1, 1), 'MMMM yyyy'));
      }
    });

		it('should correctly display today date', function() {
			var elm = compileDirective('default');
			var daybefore = new Date(today);
			daybefore.setDate(today.getDate()-1);
			scope.dates.first = daybefore;
			scope.$digest();
			angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
			console.log(sandboxEl.find('button.btn-primary span')[0])
			expect(today.getDate()+'').toBe(sandboxEl.find('button.btn-warning span').text());
		});

	});

describe('with no dates', function() {
	it('should open on focus', function() {
		var elm = compileDirective('no-dates');
		expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		scope.$digest();
		expect(sandboxEl.find('.datepickerrange').css('display')).toBe('block');
	});

	it('should close on blur', function() {
		var elm = compileDirective('no-dates');
		expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		scope.$digest();
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('blur');
		scope.$digest();
		expect(sandboxEl.find('.datepickerrange').css('display')).toBe('none');
	});

	it('should open with right months', function() {
		var elm = compileDirective('no-dates');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		scope.$digest();
		expect(sandboxEl.find('div label')[0].innerText).toBe(dateCalculator.format(today,'mmmm yyyy'));
		var monthLater = today.setMonth(today.getMonth()+1);
		expect(sandboxEl.find('div label')[1].innerText).toBe(dateCalculator.format(monthLater,'mmmm yyyy'));
	});

	it('when has error on first input do noting', function() {
		var elm = compileDirective('no-dates');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		elm.find('input:first').val('02/31/14');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('change');
		scope.$digest();
		expect(sandboxEl.find('input:first').val()).toBe('02/31/14');
		expect(scope.dates.first).toBe(null);
	});

	it('when has error on first input blur be empty', function() {
		var elm = compileDirective('no-dates');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		elm.find('input:first').val('02/31/14');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('blur');
		scope.$digest();
		expect(sandboxEl.find('input:first').val()).toBe('');
		expect(scope.dates.first).toBe(null);
	});

	it('when has error on last do noting', function() {
		var elm = compileDirective('no-dates');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('focus');
		elm.find('input:last').val('02/31/14');
		angular.element(elm.find('div.faux-input')[0]).triggerHandler('change');
		scope.$digest();
		expect(sandboxEl.find('input:last').val()).toBe('02/31/14');
		expect(scope.dates.first).toBe(null);
	});

	it('when has error on first blur be empty', function() {
		var elm = compileDirective('no-dates');
		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('02/31/14');
		elm.find('input:last').triggerHandler('blur');
		scope.$digest();
		expect(sandboxEl.find('input:last').val()).toBe('');
		expect(scope.dates.first).toBe(null);
	});

	it('both valid should change on blur', function() {
		var elm = compileDirective('no-dates');

		expect(scope.dates.first).toBe(null);
		expect(scope.dates.last).toBe(null);

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('14/01/2014');
		elm.find('input:first').triggerHandler('change');

		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('19/02/2014');
		elm.find('input:last').triggerHandler('change');
		scope.$digest();

		expect(sandboxEl.find('input:first').val()).toBe('14/01/2014');
		expect(sandboxEl.find('input:last').val()).toBe('19/02/2014');

		expect(scope.dates.first.getDate()).toBe(new Date(2014,0,14).getDate());
		expect(scope.dates.last.getDate()).toBe(new Date(2014,1,19).getDate());

	});

	it('both valid, first change badly would not change scope only on blur', function() {
		var elm = compileDirective('no-dates');

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('14/01/2014');
		elm.find('input:first').triggerHandler('change');

		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('19/02/2014');
		elm.find('input:last').triggerHandler('change');
		scope.$digest();

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('1f/01/2014');
		elm.find('input:first').triggerHandler('change');
		scope.$digest();
		expect(sandboxEl.find('input:first').val()).toBe('1f/01/2014');
		expect(sandboxEl.find('input:last').val()).toBe('19/02/2014');

		expect(scope.dates.first.getDate()).toBe(new Date(2014,0,14).getDate());
		expect(scope.dates.last.getDate()).toBe(new Date(2014,1,19).getDate());

		elm.find('input:first').triggerHandler('blur');
		expect(scope.dates.first).toBe(null);
		expect(sandboxEl.find('input:last').val()).toBe('19/02/2014');
		expect(scope.dates.last.getDate()).toBe(new Date(2014,1,19).getDate());
	});

it('both valid, last change badly would not change scope only on blur', function() {
		var elm = compileDirective('no-dates');

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('14/01/2014');
		elm.find('input:first').triggerHandler('change');

		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('19/02/2014');
		elm.find('input:last').triggerHandler('change');
		scope.$digest();

		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('1f/02/2014');
		elm.find('input:last').triggerHandler('change');
		scope.$digest();

		expect(sandboxEl.find('input:first').val()).toBe('14/01/2014');
		expect(sandboxEl.find('input:last').val()).toBe('1f/02/2014');

		expect(scope.dates.first.getDate()).toBe(new Date(2014,0,14).getDate());
		expect(scope.dates.last.getDate()).toBe(new Date(2014,1,19).getDate());

		elm.find('input:last').triggerHandler('blur');
		expect(scope.dates.last).toBe(null);
		expect(sandboxEl.find('input:first').val()).toBe('14/01/2014');
		expect(scope.dates.first.getDate()).toBe(new Date(2014,0,14).getDate());
	});

it('both dates valid, first new correctly but later then second should clear the second one.', function() {
		var elm = compileDirective('no-dates');

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('14/01/2014');
		elm.find('input:first').triggerHandler('change');

		elm.find('input:last').triggerHandler('focus');
		elm.find('input:last').val('19/01/2014');
		elm.find('input:last').triggerHandler('change');
		scope.$digest();

		elm.find('input:first').triggerHandler('focus');
		elm.find('input:first').val('20/01/2014');
		elm.find('input:first').triggerHandler('change');

		scope.$digest();
		expect(sandboxEl.find('input:first').val()).toBe('20/01/2014');
		expect(sandboxEl.find('input:last').val()).toBe('');

		expect(scope.dates.first.getDate()).toBe(new Date(2014,0,20).getDate());
		expect(scope.dates.last).toBe(null);

	});


});
});