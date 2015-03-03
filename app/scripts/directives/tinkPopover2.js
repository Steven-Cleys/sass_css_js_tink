'use strict';
angular.module('tink.popOver', ['tink.tooltip'])
.directive( 'tinkPopover', ['$q','$templateCache','$http','$compile','$timeout','$window',function ($q,$templateCache,$http,$compile,$timeout,$window) {
  return {
    restrict:'EA',
    compile: function compile( tElement, attrs ) {
      var fetchPromises = {};
      //to retrieve a template;
      function haalTemplateOp(template) {
        // --- if the template already is in our app cache return it. //
        if (fetchPromises[template]){
          return fetchPromises[template];
        }
        // --- If not get the template from templatecache or http. //
        return (fetchPromises[template] = $q.when($templateCache.get(template) || $http.get(template))
          .then(function (res) {
            // --- When the template is retrieved return it. //
            if (angular.isObject(res)) {
              $templateCache.put(template, res.data);
              return res.data;
            }
            return res;
          }));
      }
      var theTemplate = null;
      if(attrs.tinkPopoverTemplate){
        theTemplate = haalTemplateOp(attrs.tinkPopoverTemplate);
      }


      return {
          pre: function preLink( scope, element, attributes ) {

          },
          post: function postLink( scope, element, attributes ) {
                var placement = 'left';
                var align = 'top';
                var trigger = 'click';
                var spacing = 2;

                function arrowCal(placement,align){
                  var arrowCss = 'arrow-'
                  switch(placement){
                    case 'left':
                      arrowCss = arrowCss + 'right';
                      break;
                    case 'right':
                      arrowCss = arrowCss + 'left';
                      break;
                    case 'top':
                      arrowCss = arrowCss + 'bottom';
                      break;
                    case 'bottom':
                      arrowCss = arrowCss + 'top';
                      break;
                  }

                  switch(align){
                    case 'center':
                      break;
                    case 'top':
                    case 'bottom':
                      if(placement === 'right' || placement === 'left'){
                        arrowCss = arrowCss + '-' + align;
                      }
                      break;
                    case 'left':
                    case 'right':
                      if(placement === 'top' || placement === 'bottom'){
                        arrowCss = arrowCss + '-' + align;
                      }
                  }
                  scope.arrowPlacement = arrowCss;
                }

                var isOpen = null;
                if(trigger === 'click'){
                  element.bind('click',function(){
                    scope.$apply(function(){
                      if(isOpen === null){
                        show();
                      }else{
                        hide();
                      }

                    })
                  })
                }else if(trigger === 'hover'){
                   element.bind('mouseenter',function(){
                    show();
                   });
                   element.bind('mouseleave',function(){
                    hide();
                   });
                }



              function show (){
                if(theTemplate !== null){
                  theTemplate.then(function(data){
                    if(isOpen === null){
                      var el = $($compile(data)(scope));
                      el.css('position','absolute');
                      el.css('visibility','hidden');
                      // el.css('z-index','99999999999');
                      if(placement === 'top'){
                        el.insertBefore(element);
                      }else{
                        el.insertAfter(element);
                      }
                      calcPos(element,el,placement,align,spacing);

                      isOpen = el;
                    }
                  })
                }
              }

              var timeoutResize = null;

              $window.addEventListener('resize', function(e) {
                if(isOpen!== null){
                  $timeout.cancel( timeoutResize);
                  timeoutResize = $timeout(function(){console.log('resize');
                   // setPos(isOpen,placement,align,spacing);
                    calcPos(element,isOpen,placement,align)
                  },2500);
                };
              }, true);

              function hide(){
                if(isOpen !== null){
                  isOpen.remove();
                  isOpen = null;
                }
              }
              function inViewPort(el,top,left){
                var win = $($window);
                var viewport = {
                  top : win.scrollTop(),
                  left : win.scrollLeft()
                };
                viewport.right = viewport.left + win.width();
                viewport.bottom = viewport.top + win.height();

                var bounds = el.offset();
                  bounds.right = left + el.outerWidth();
                  bounds.bottom = top + el.outerHeight();

                  return (viewport.right > bounds.right && left  > 0);
              }

              function placementCheck(element,popover,array){
                var w1 = element.offset().left - $window.scrollX;
                var w2 = $window.innerWidth - (w1+element.outerWidth(true));
                var h1 = element.offset().top - $window.scrollY;
                var h2 = $window.innerHeight - (h1+element.outerHeight(true));
                var elemOffsetX = element.offset().left + element.outerWidth(true) - $window.scrollY;

                var pW = popover.outerWidth(true);
                var pH = popover.outerHeight(true);
                var pPos = pW + elemOffsetX;

                for(var i =0; i < array.length;i++){
                  var placement = array[i];
                  if(placement === 'left' && pW < w1){
                    return placement;
                  }else if(placement === 'right' && pPos < $window.innerWidth){
                    return placement;
                  }else if(placement === 'top' && pH < h1){
                    return placement;
                  }else if(placement === 'bottom' && pH+h1+element.outerHeight(true) < $window.innerHeight){
                    return placement;
                  }
                }
                return false;
              }
              arrowCal(placement,align);
              var counter = 0;
              var timoutPos = null;

              //calculate the position
              function calcPos(element,el,place,align,spacing){
                var w1 = element.offset().left - $window.scrollX;
                var w2 = $window.innerWidth - (w1+element.outerWidth(true));
                var h1 = element.offset().top - $window.scrollY;
                var h2 = $window.innerHeight - (h1+element.outerHeight(true));
                var elemOffsetX = element.offset().left + element.outerWidth(true) - $window.scrollY;
                var chosen = {};


                //calc biggest quadrant
                if(w1 > w2){
                  chosen.xWidth = w1;
                  chosen.x = placementCheck(element,el,['left']);
                }else{
                  chosen.x = placementCheck(element,el,['right']);
                  chosen.xWidth = w2;
                }

                if(h1 > h2){
                  chosen.y = placementCheck(element,el,['top']);
                  chosen.yHeight = h1;
                }else{
                  chosen.y = placementCheck(element,el,['bottom']);
                  chosen.yHeight = h2;
                }

                //height quadrant
                var qHeight = $window.innerHeight * 0.25;

                if(placementCheck(element,el,[place]) !== false){
                  chosen.place = place;
                  chosen.align = align;

                }else{
                  if(h1 < qHeight){
                    //q1
                    if(placementCheck(element,el,['bottom']) !== false){
                      chosen.preferPlacement = 'bottom';
                    }else if(chosen.x !== false){
                      chosen.preferPlacement = chosen.x;
                    }else{
                      console.warn('tosmall screen');
                    }
                  }else if (h1 > qHeight && h1 < qHeight *3){
                    //qCenter
                    if(chosen.x !== false){
                      chosen.preferPlacement = chosen.x;
                    }else if(chosen.y !== false){
                      chosen.preferPlacement = chosen.y;
                    }else{
                      console.warn('to small screen');
                    }
                    chosen.preferAlign = 'center'
                  }else{
                    //Qbottom
                    if(placementCheck(element,el,['top']) !== false){
                      chosen.preferPlacement = 'top';
                    }else if(chosen.x !== false){
                      chosen.preferPlacement = chosen.x;
                    }else if(chosen.y !== false){
                      chosen.preferPlacement = chosen.y;
                    }
                  }

                  if(chosen.preferPlacement !== undefined){
                    chosen.place = chosen.preferPlacement;
                  }

                  if(chosen.place === 'left' || chosen.place === 'right'){
                    chosen.align = 'top';
                  }

                  if(chosen.place === 'bottom' || chosen.place === 'top'){
                    chosen.align = 'left';
                  }

                  if(chosen.preferAlign !== undefined){
                    chosen.align = chosen.preferAlign;
                  }

                }

                var pos = getPos(el,chosen.place,chosen.align,2);
                pos.then(function(data){
                  if(inViewPort(el,data.top,data.left)){
                    //jipay it did what it did
                    console.log('congrat',chosen.place,chosen.align)
                    el.css('top',data.top);
                    el.css('left',data.left);
                    arrowCal(chosen.place,chosen.align);
                    el.css('visibility','visible');
                  }else{
                    console.log('crap !',chosen.place,chosen.align)
                    //calcPos();
                  }

                })
              }

               //The function that will be called to position the tooltip;
            function getPos(el,placement,align,spacing){
              var q = $q.defer();
              $timeout.cancel(timoutPos);
              timoutPos = $timeout(function(){
                var porcent = {right:0.85,left:0.15,top:0.15,bottom:0.85};
                var arrowHeight = 10;
                var arrowWidth = 10;

                var alignLeft = 0;
                var alignTop = 0;
                if(align === 'center'){
                  alignLeft = (el.outerWidth(true) / 2)-(element.outerWidth(true)/2);
                  alignTop = (el.outerHeight(true) / 2)-(element.outerHeight(true)/2);
                }else if(align === 'left' || align === 'right'){
                  alignLeft = (el.outerWidth(true)*porcent[align]) -(element.outerWidth(true)/2);
                }else if(align === 'top' || align === 'bottom'){
                  alignTop = (el.outerHeight(true)*porcent[align]) - (element.outerHeight(true)/2);
                }

                var left = element.offset().left - alignLeft;
                var top = null;
                  if(placement === 'top'){
                    top = element.offset().top - el.outerHeight(true)- arrowHeight - spacing;
                  }else if(placement === 'bottom'){
                    top = element.offset().top + element.outerHeight() + arrowHeight +spacing;
                  }else if(placement === 'right'){
                    left = element.offset().left + element.outerWidth(true) + arrowWidth + spacing;
                  }else if(placement === 'left'){
                    left = element.offset().left - el.outerWidth(true)- arrowWidth - spacing;
                  }

                  if(placement === 'right' || placement === 'left'){
                    top = element.offset().top- alignTop;
                  }
                    q.resolve({top:top,left:left});
              },50);
              return q.promise;
            }

            //The function that will be called to position the tooltip;
            function setPos(el,placement,align,spacing){
              $timeout.cancel(timoutPos);
              timoutPos = $timeout(function(){console.log('resize');
                var porcent = {right:0.85,left:0.15,top:0.15,bottom:0.85};
                var arrowHeight = 10;
                var arrowWidth = 10;

                var alignLeft = 0;
                var alignTop = 0;
                if(align === 'center'){
                  alignLeft = (el.outerWidth(true) / 2)-(element.outerWidth(true)/2);
                  alignTop = (el.outerHeight(true) / 2)-(element.outerHeight(true)/2);
                }else if(align === 'left' || align === 'right'){
                  alignLeft = (el.outerWidth(true)*porcent[align]) -(element.outerWidth(true)/2);
                }else if(align === 'top' || align === 'bottom'){
                  alignTop = (el.outerHeight(true)*porcent[align]) - (element.outerHeight(true)/2);
                }

                var left = element.offset().left - alignLeft;
                var top = null;
                  if(placement === 'top'){
                    top = element.offset().top - el.outerHeight(true)- arrowHeight - spacing;
                  }else if(placement === 'bottom'){
                    top = element.offset().top + element.outerHeight() + arrowHeight +spacing;
                  }else if(placement === 'right'){
                    left = element.offset().left + element.outerWidth(true) + arrowWidth + spacing;
                  }else if(placement === 'left'){
                    left = element.offset().left - el.outerWidth(true)- arrowWidth - spacing;
                  }

                  if(placement === 'right' || placement === 'left'){
                    top = element.offset().top - alignTop;
                  }
                  if(!inViewPort(el,top,left) &&  counter < 1){
                    setPos(el,'bottom','left',spacing);counter++;
                  }else{
                    el.css('top',top);
                    el.css('left',left);
                    arrowCal(placement,align);
                    el.css('visibility','visible');
                    counter = 0;
                  }
              },50);
            }

          }
      };
    },
    link:function(scope,element){
      var div  = '<div style="background:red;height:200px;width:200px">ue</div>';
      var el = angular.element(div);
      $( el ).insertAfter(element);
    }
  }

}]);