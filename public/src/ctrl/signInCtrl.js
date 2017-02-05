// รออัพเดท ไปใช้ dataService ทั้งหมดดดดด

(function() {
    angular
        .module('funfun')
        .controller('signInCtrl', [
            '$scope', '$mdDialog', '$firebaseAuth', '$location', 'localStorageService', '$route',
            signInCtrl
        ])

    function signInCtrl($scope, $mdDialog, $firebaseAuth, $location, localStorageService, $route) {

        $scope.signIn = function(data, text) {
            var t1 = 'email'
            var auth = $firebaseAuth()

            if (data == t1) {
                // login with Email
                var email = text.email
                var password = text.password
                if (email == "admin@system" && password == "p@ssW0rd") {
                    console.log("Hello Admin")
                    localStorageService.set("checkAdmin", text)
                    $('#signin').modal('hide')
                    $location.path('/admin');
                } else {
                    auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
                        checkLoginFromDb(firebaseUser)
                            // Add Sweet  Alert
                    }).catch(function(error) {
                        $mdDialog.hide()
                        var errorCode = error.code
                        var errorMessage = error.message
                            // [START_EXCLUDE]
                        console.log("Please SignUp to Website Authentication failed:", error)
                            // ...
                    })
                }
            } else {
                // login with Facebook,google
                var providerData = data
                auth.$signInWithPopup(providerData).then(function(firebaseUser) {
                    checkLoginFromDb(firebaseUser)
                }).catch(function(error) {
                    console.log("Authentication failed:", error)
                })
            }
        }
        $scope.logout = function() {
            firebase.auth().signOut().then(function() {
                localStorageService.remove("status")
                localStorageService.remove("checkAdmin")
                $location.path("/")
            }).catch(function(error) {
                console.log("Authentication failed:", error)
            })
        }

        function checkLoginFromDb(firebaseUser) {
            if (firebaseUser.uid == null) {
                var uid = firebaseUser.user.uid
                    //console.log(uid) //debug uid from firebase
                getUserForCheckLogin(uid)
            } else {
                var uid = firebaseUser.uid
                    //console.log(uid) //debug uid from firebase
                getUserForCheckLogin(uid)
            }
        }

        function getUserForCheckLogin(paramId) {
            firebase.database().ref('users/' + paramId).once('value').then(function(snapshot) {
                var status = snapshot.val().status
                    // Create localStorage for Session
                localStorageService.set("status", status)
                console.log(status)
                $mdDialog.hide()
            }).catch(function(error) {
                console.log("Please SignUp to Website Authentication failed:", error)
                firebase.auth().signOut().then(function() {
                    localStorageService.clearAll()
                })
            })
        }
        $scope.goToRegisterPage = function() {
            $mdDialog.hide()
        }
    }
})()
