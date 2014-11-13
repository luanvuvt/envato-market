angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;

    if (!window.localStorage.getItem('username')) {
      $scope.login();
    }
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $http({
        method: 'GET',
        url: 'http://marketplace.envato.com/api/edge/'+ $scope.loginData.username +'/'+ $scope.loginData.apiKey +'/vitals.json'
    })
    .success(function (data) {
      localStorage.setItem('username', $scope.loginData.username);
      localStorage.setItem('apiKey', $scope.loginData.apiKey);

      $scope.loginMessage = {
        success: true,
        message: 'Username and API Key saved.'
      };

      $scope.$broadcast('sales');

      $timeout(function () {
        $scope.closeLogin();
      }, 500);
    })
    .error(function (data) {
      $scope.loginMessage = {
        error: true
      };

      if (data.error) {
        $scope.loginMessage.message = data.error;
      } else {
        $scope.loginMessage.message = 'Uncaught error';       
      }
    });
  };
})

.controller('RecentSalesCtrl', function($scope, $http, $q, $ionicLoading, $ionicPopover) {
  $ionicPopover.fromTemplateUrl('components/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.showSaleDetail = function (sale) {
    console.log($scope.popover);

    $scope.popover.show();
  };

  $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };

  function apiGet(path) {
    return $http.get('http://marketplace.envato.com/api/edge/'+ localStorage.getItem('username') +'/'+ localStorage.getItem('apiKey') +'/' + path);
  }

  function loadRecentSales() {
    return $q.all([apiGet('recent-sales.json'), apiGet('account.json')]);
  }

  function processSuccess(data) {
    $scope.recentSales = data[0]['data']['recent-sales'];
    $scope.authorName = data[1]['data']['account']['firstname'];
    $scope.balance = data[1]['data']['account']['balance'];

    if (!$scope.recentSales.length) {
      $scope.messageData = {
        message: 'No sale!'
      };
    } else {
      $scope.messageData = null;
    }
  }

  function processError(data) {
    console.log(data);
  }

  function initRecentSales() {
    if (localStorage.getItem('username')) {
      $scope.show();

      loadRecentSales()
      .then(processSuccess, processError)
      .finally(function() {
         $ionicLoading.hide();
      });
    }
  }

  $scope.doRefresh = function() {
    loadRecentSales()
    .then(processSuccess, processError)
    .finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.$on('sales', function () {
    initRecentSales();    
  });

  initRecentSales();
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
