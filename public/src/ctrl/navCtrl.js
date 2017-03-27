(function() {
    angular
        .module('funfun')
        .controller('navCtrl', [
            '$scope', '$mdDialog', '$firebaseAuth', '$window', 'localStorageService',
            navCtrl
        ])

    function navCtrl($scope, $mdDialog, $firebaseAuth, $window, localStorageService, $firebaseObject) {
        var self = this
        self.checkStdNav
        self.checkSchoolNav
        self.checkTutorNav
        self.checkAdminNav = false
        $firebaseAuth().$onAuthStateChanged(function(user) {
            localStorageService.get("status") == "school" ? $scope.school = true : $scope.school = false
            localStorageService.get("status") == "tutor" ? $scope.tutor = true : $scope.tutor = false
            localStorageService.get("status") == "student" ? $scope.student = true : $scope.student = false
            user != null ? $scope.hide = true : $scope.hide = false
            localStorageService.get("status") == "school" ? self.checkSchoolNav = true : self.checkSchoolNav = false
            localStorageService.get("status") == "student" ? self.checkStdNav = true : self.checkStdNav = false
            localStorageService.get("status") == "tutor" ? self.checkTutorNav = true : self.checkTutorNav = false
            if (localStorageService.get("checkAdmin") == undefined) {
                console.log("hello user");
            } else if (localStorageService.get("checkAdmin").email == "admin@system") {
                self.checkAdminNav = true
                $scope.hide = true
            }
        })

        $scope.signup = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/signup.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        }
        $scope.signin = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/signin.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        }
        $scope.autoClose = function() {
            $mdDialog.hide()
        }
    }
})()