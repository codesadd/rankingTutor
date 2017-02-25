// รออัพเดท ไปใช้ dataService ทั้งหมดดดดด

(function() {
    angular
        .module('funfun')
        .controller('signInCtrl', [
            '$scope', '$mdDialog', '$firebaseAuth', '$location', 'localStorageService', '$route','SweetAlert',
            signInCtrl
        ])

    function signInCtrl($scope, $mdDialog, $firebaseAuth, $location, localStorageService, $route, SweetAlert) {

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
                    $mdDialog.hide()
                    location.reload();
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
                          SweetAlert.swal("กรุณาสมัครสมาชิก หรือ email และ password ไม่ถูกต้อง!", error.message , "error")
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
            if (localStorageService.get("checkAdmin") != undefined) {
                localStorageService.remove("checkAdmin")
                $location.path("/")
                location.reload();
            } else {
                firebase.auth().signOut().then(function() {
                    localStorageService.remove("status")
                    $location.path("/")
                    location.reload();
                }).catch(function(error) {
                    console.log("Authentication failed:", error)
                })
            }
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
                location.reload()
            }).catch(function(error) {
                SweetAlert.swal("ชื่อบัญชีนี้ไม่ถูกต้อง! กรุณาสมัครสมาชิก", error.message , "error")
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
