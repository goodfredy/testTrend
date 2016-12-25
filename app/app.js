'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myTreeview'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).

controller('myTreeviewCtrl', function ($scope, $http) {
  $scope.checked_prog = 1;

  //инициализация
  $scope.init_app = function() {
    $scope.getMinPrice();
  };

  //выборка данных
  $scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;
    var url = 'https://api.trend-spb.ru/v2/terminal/installments/286/list/';
    $http.get(url).
    then(function(response) {
      $scope.status = response.status;
      $scope.dataJson = [response.data];
    });
  };

  //запрос к api и генерация ответа в правой части формы.
  $scope.get_query = function() {

    $('#calculator__data_prog').text('');
    $('#calculator__data_title').text('');
    $('#calculator__data_value_cost').text('');

    $.ajax({
      type: "GET",
      url: "http://api.trend-dev.ru/v2/terminal/installments/",
      dataType: 'JSON',
      data: {
        "programm_id": $('#calculator__select_prog option:selected').val(),
        "date_end": $('#buildings select option:selected').val(),
        "pay_type": $('#pay_type select option:selected').val(),
        "price": $('#buildings select option:selected').data('minprice'),
        "first_pay": String($('#first_pay input').val().replace(/[^\d]+/g,"")).split(" ").join(""),
      },
      success: function(data, code){
            var dataProg = data.data.title;
            var dataObj = data.data.values;
            //alert(JSON.stringify(data));
            if (data.data.errors.length != 0) {
                $('#calculator__data_prog').text(data.data.errors[0].description);
                $('#calculator__data_value').css({'color':'#eeeded'});
            }
            if (dataProg != null) {
                $scope.boolean_change = true;
                $('#calculator__data_value').css({'color':'#000'});
                $('#calculator__data_prog').text(dataProg);
                $('#calculator__data_title').text(dataObj[0].title);
                var cost = dataObj[0].value;
                cost = String(cost).split("").reverse().join("").replace(/(.{3}\B)/g, "$1 ").split("").reverse().join("");
                $('#calculator__data_value_cost').text(cost);
                if (dataObj[0].pay_type == 1) {
                  $('#calculator__data_value_platez').text('мес.');
                } else {
                  $('#calculator__data_value_platez').text('квартал');
                }
            }
      },
      error:  function(xhr, str){
      }
    });

    var cost = $('#price input').val();
    cost = String(cost).split(" ").join("").split("").reverse().join("").replace(/(.{3}\B)/g, "$1 ").split("").reverse().join("");
    $('#price input').val(cost);

  };

  //пересчет стоимости квартиры
  $scope.getMinPrice = function() {
      setTimeout(function() {
          var cost = $('#buildings select option:selected').data('minprice');
          cost = String(cost).split("").reverse().join("").replace(/(.{3}\B)/g, "$1 ").split("").reverse().join("");
          $('#price input').val($('#buildings select option:selected').data('minprice'));
          $('#price input').attr({'readonly':'readonly'});
          $('#first_pay input').val(parseInt($('#first_pay input').data('min') * $('#'+$('#first_pay input').data('parent')+' input').val() + 1));
          $scope.get_query();
      }, 50);
  };

  $scope.getPrvBlur = function() {

      var preg = $('#first_pay input').val().replace(/[^\d]+/g,"");
      $('#first_pay input').val(preg);

      var cost = $('#price input').val();
      cost = String(cost).split(" ").join("");
      $('#price input').val(cost);
      if ($('#first_pay input').val() < parseInt($('#first_pay input').data('min') * $('#'+$('#first_pay input').data('parent')+' input').val() + 1)) {
          $('#first_pay input').val(parseInt($('#first_pay input').data('min') * $('#'+$('#first_pay input').data('parent')+' input').val() + 1));
          $scope.get_query();
      } else if ($('#first_pay input').val() > parseInt($('#first_pay input').data('max') * $('#'+$('#first_pay input').data('parent')+' input').val())) {
          $('#first_pay input').val(parseInt($('#first_pay input').data('max') * $('#'+$('#first_pay input').data('parent')+' input').val()));
          $scope.get_query();
      }
      cost = String(cost).split("").reverse().join("").replace(/(.{3}\B)/g, "$1 ").split("").reverse().join("");
      $('#price input').val(cost);
      var cost_first = $('#first_pay input').val();
      cost_first = String(cost_first).split("").reverse().join("").replace(/(.{3}\B)/g, "$1 ").split("").reverse().join("");
      $('#first_pay input').val(cost_first);
  };

  $scope.trimInput = function() {
    var cost_first = $('#first_pay input').val();
    cost_first = String(cost_first).split(" ").join("");
    $('#first_pay input').val(cost_first);
  };

});
