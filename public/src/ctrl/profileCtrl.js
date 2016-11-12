(function() {

    angular
        .module('funfun')
        .controller('ProfileCtrl', [
            '$scope', 'localStorageService', '$firebaseAuth', '$location', '$firebaseObject','ChartJs',
            ProfileCtrl
        ]);


    function ProfileCtrl($scope, localStorageService, $firebaseAuth, $location, $firebaseObject, ChartJs) {
        AuthenticationControl();

        function AuthenticationControl() {
            $firebaseAuth().$onAuthStateChanged(function(user) {
                if (user == null) {
                    $location.path('/');
                } else {
                    $scope.user = $firebaseObject(firebase.database().ref('users').child(user.uid));
                    console.log($scope.user);
                }
            });
        }

        $scope.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling","test"];

        $scope.data = [
            [65, 59, 90, 81, 56, 55,77]
        ];

    }
})();
