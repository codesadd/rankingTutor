(function() {
    angular
        .module('funfun')
        .controller('signUpCtrl', [
            '$scope', '$mdDialog', '$location', '$firebaseAuth', '$window', 'localStorageService',
            signUpCtrl
        ]);

    function signUpCtrl($scope, $mdDialog, $location, $firebaseAuth, $window, localStorageService) {
        $scope.max = 3;
        $scope.selectedIndex = 0;
        $scope.nextTab = function() {
            var index = ($scope.selectedIndex == $scope.max) ? $scope.max : $scope.selectedIndex + 1;
            $scope.selectedIndex = index;

        };
        var schoolRef = firebase.database().ref('schools');
        $scope.check = true;
        $scope.signUp = function(data, text) {
            var t1 = 'email';
            var auth = $firebaseAuth();

            if (data == t1) {
                // login with Email
                var email = text.email;
                var password = text.password;
                console.log(data, text);
                auth.$createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
                    if (text.select != "school") { // check if not school Register
                        addUserToDb(firebaseUser, text);
                        localStorageService.set("status", text.select);
                        $location.path('/profile');
                    } else {
                        addUserToDb(firebaseUser, text); // add new user to DB
                        addSchoolFromEmailToDB(firebaseUser, text); // add new Register school
                        localStorageService.set("status", text.select); // create localStorage status
                        $location.path('/profile-school');
                    }
                    // Add Sweet  Alert
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error);
                });
            } else {
                // login with Facebook
                var providerData = data;
                console.log(providerData, text);
                auth.$signInWithPopup(providerData).then(function(firebaseUser) {
                    if (text.select != "school") {
                        addUserToDb(firebaseUser, text);
                        localStorageService.set("status", text.select);
                        $location.path('/profile');
                    } else {
                        addUserToDb(firebaseUser, text);
                        addSchoolFromProviderToDB(firebaseUser, text);
                        localStorageService.set("status", text.select);
                        $location.path('/profile-school');
                    }
                }).catch(function(error) {
                    console.log("This Account already member Please Signin Website Authentication failed:", error);
                    firebase.auth().signOut().then(function() {
                        localStorageService.clearAll();
                    });
                });
            }
        }


        function addUserToDb(firebaseUser, param) {
            console.log(param);
            var clock = Date.now()
            if (firebaseUser.uid == null) {
                // add user from Facebook , Google+
                console.log(firebaseUser.uid);
                firebase.database().ref('users/' + firebaseUser.user.uid).set({
                    displayName: firebaseUser.user.displayName,
                    email: firebaseUser.user.email,
                    emailVerified: firebaseUser.user.emailVerified,
                    photoURL: firebaseUser.user.photoURL,
                    status: param.select,
                    tel: ' ',
                    createTime: Date.now()
                });
            } else {
                // add user from email,password
                // bug dissplayName,photoURL was null cant add to Database
                console.log(firebaseUser);
                firebase.database().ref('users/' + firebaseUser.uid).set({
                    displayName: param.firstname + " " + param.lastname,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                    photoURL: 'https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png',
                    status: param.select,
                    tel: param.tel,
                    createTime: Date.now()
                });
            }
        }

        function addSchoolFromProviderToDB(firebaseUser, param) {
            firebase.database().ref('schools').child(firebaseUser.user.uid).set({
                displayName: firebaseUser.user.displayName,
                email: firebaseUser.user.email,
                emailVerified: firebaseUser.user.emailVerified,
                photoURL: firebaseUser.user.photoURL,
                status: param.select,
                tel: ' ',
                like: 0,
                view: 0,
                createTime: Date.now()
            });
        }

        function addSchoolFromEmailToDB(firebaseUser, param) {
            firebase.database().ref('schools').child(firebaseUser.uid).set({
                like: 0,
                view: 0,
                displayName: param.firstname + " " + param.lastname,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
                photoURL: 'https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png',
                status: param.select,
                tel: param.tel,
                createTime: Date.now(),
            });
        }
    }

})();
