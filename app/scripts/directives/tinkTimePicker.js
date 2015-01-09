angular.module('tink.timepicker', []);
angular.module('tink.timepicker')
.directive('tinkTimepicker',[function(){
  return{
    restrict:'AE',
    //template:'<div style="background:white;"><span style="float:left;">--</span><div style="float:left;">:</div><span>--</span></div>',
    template:'<input value="--:--"/>',
    replace:true,
    link:function(scope,elem,attr){
      var current ={hour:{num:00,reset:true,prev:-1,start:true},min:{num:00,reset:true,start:true}};

      function SelectText(element) {
        var doc = document,
        text = element,
        range, selection;

        if (doc.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(text);
          range.select();
        } else if (window.getSelection) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(text);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      elem.keydown(function(e){
        var keycode = e.keyCode;console.log(keycode)
        var shift = e.shiftKey;
        if((shift && keycode > 47 && keycode <58) || (keycode >95 && keycode <106)){
          if(selected === 1){
            handleHour(keycode);
          }else{
            handleMinute(keycode);
          }
        }else if(keycode === 39 && selected === 1){
          selectMinute(true);
        }else if(keycode === 37 && selected === 2){
          selectHour(true);
        }else if(keycode === 38){
          if(selected === 1){
            addHour(1);
          }else if(selected === 2){
            addMinute(1);
          }
        }else if(keycode === 40){
          if(selected === 1){
            addHour(-1);
          }else if(selected === 2){
            addMinute(-1);
          }
        }
        return false;
      });

      keycodeMapper = {}

      var mapKeycodes = function(){
        var hulp = 0;
        for(var i = 48; i<=57;i++){
          keycodeMapper[i] = hulp;
          hulp++;
        }

        hulp = 0;

        for(var i = 96; i<= 105;i++){
          keycodeMapper[i] = hulp;
          hulp++;
        }
      }
      mapKeycodes();

      var handleHour = function(key){
        var num = keycodeMapper[key];
        if(current.hour.reset){
          current.hour.num = 0;
          current.hour.prev = -1;
          current.hour.reset = !current.hour.reset;
        }
        current.hour.start =false;
        setHour(num);
      }

      var selectHour = function(reset){
        elem[0].setSelectionRange(0, 2);
        selected = 1;
        current.hour.reset = reset;
        current.min.reset = false;
      }

      var selectMinute = function(reset){
        elem[0].setSelectionRange(3, 5);
        selected = 2;
        current.min.reset = reset;
        current.hour.reset = false;
      }

      var setHour = function(num){
        var select;
        var firstNumber = parseInt(hourString()[1]);
        var lastNumber = parseInt(hourString()[1]);
        if(lastNumber<2){
          current.hour.num = (lastNumber*10)+num;
          if(current.hour.prev === 0){
            select = 2;
          }else if(firstNumber !== 0){
            select = 2;
          }else{
            select = 1;
          }
        }else if(lastNumber === 2){
          if(num < 4){
            current.hour.num = (lastNumber*10)+num;
          }else{
            current.hour.num = num;
          }
          select = 2;
        }
        current.hour.prev = num;
        setValue(select);
      }

      var hourString = function(){
        if(current.hour.start){
          return '--';
        }else{
          return ('0'+current.hour.num).slice(-2);
        }

      }

      var minString = function(){
        if(current.min.start){
          return '--';
        }else{
          return ('0'+current.min.num).slice(-2);
        }
      }

      var setMinute = function(num){
        var lastNumber = parseInt(minString()[1]);
        if(isNaN(lastNumber) || lastNumber === 0 || lastNumber > 5){
          current.min.num = num;
        }else if(lastNumber<6){
          current.min.num = (lastNumber*10)+num;
        }

        setValue(2);
      }

      var setValue =  function(select){
        elem.val(hourString()+':'+minString());
        if(select === 1){
          selectHour();
        }else if(select === 2){
          selectMinute();
        }
      }

      var handleMinute = function(key){
        var num = keycodeMapper[key];
        current.min.start =false;
        setMinute(num);
      }

      var selected = -1;

      elem.bind('mousedown',function(evt){
        var offset = evt.offsetX;
        if(offset < 14 || offset > 24){
          selectHour(true);
          selected = 1;
        }else{
          selectMinute(true);
          selected = 2;
        }
        elem.focus();

        return false;
      })

      var addMinute = function(size){
        current.min.start =false;
        var newMin = current.min.num + size;
        if(newMin > 0 && newMin < 60){
          current.min.num = newMin;
        }else if(newMin >= 60 || newMin < 0){
          addHour(Math.floor(newMin/60));
          if(newMin % 60 < 0){
            current.min.num = 60 + (newMin % 60);
          }else{
            current.min.num = newMin % 60;
          }
        }else{
          current.min.num = 0;
        }
        setValue(2);
      }

      var addHour = function(size){
        current.hour.start =false;
        var newHour = current.hour.num + size;
        if(newHour > 0 && newHour < 24){
          current.hour.num = newHour;
        }else if(newHour < 0){
          current.hour.num = 24 + newHour;
        }else{
          current.hour.num = 0;
        }
        setValue(1);
      }

      var reset = function(){
        current ={hour:{num:00,reset:true,prev:-1,start:true},min:{num:00,reset:true,start:true}};
        setValue();
      }
    }
  }
}]);

