(function() {

    angular
        .module('funfun')
        .controller('ProfileCtrl', [
            '$scope', 'localStorageService', '$firebaseAuth', '$location', '$firebaseObject', 'SweetAlert',
            ProfileCtrl
        ]);


    function ProfileCtrl($scope, localStorageService, $firebaseAuth, $location, $firebaseObject, SweetAlert) {
        $scope.edit = true
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

        $scope.updateProfileStd = function(user) {
            var param = {
                address: user.address,
                city: user.city,
                state: user.state,
                postalCode: user.postalCode
            }
            firebase.database().ref('users').child(user.$id).update(param, function(error) {
                // body...
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    SweetAlert.swal("อัพเดทข้อมูลเรียบร้อยแล้ว!", "This data has been updated.", "success")
                    setTimeout(function() {
                        location.reload()
                    }, 1000)

                }
            })
        }
    }
})();
