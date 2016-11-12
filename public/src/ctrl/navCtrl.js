(function() {
    angular
        .module('funfun')
        .controller('navCtrl', [
            '$scope', '$mdDialog', '$firebaseAuth', '$window', 'localStorageService',
            AuthController
        ]);

    function AuthController($scope, $mdDialog, $firebaseAuth, $window, localStorageService, $firebaseObject) {
        var self = this;
        self.checkStdNav;
        self.checkSchoolNav;
        $firebaseAuth().$onAuthStateChanged(function(user) {
            user != null ? $scope.hide = true : $scope.hide = false;
            localStorageService.get("status") == "school" ? self.checkSchoolNav = true : self.checkSchoolNav = false;
            localStorageService.get("status") == "student" || localStorageService.get("status") == "tutor" ? self.checkStdNav = true : self.checkStdNav = false;
        });

        $scope.signup = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/signup.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };
        $scope.signin = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/signin.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };
        $scope.autoClose = function() {
            $mdDialog.hide();
        }
    }
})();
