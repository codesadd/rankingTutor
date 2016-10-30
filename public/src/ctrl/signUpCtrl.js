(function() {
    angular
        .module('funfun')
        .controller('signUpCtrl', [
            '$scope', '$mdDialog', '$location', '$firebaseAuth', '$window', 'localStorageService',
            signUpCtrl
        ]);

    function signUpCtrl($scope, $mdDialog, $location, $firebaseAuth, $window, localStorageService) {
        var schoolRef = firebase.database().ref('schools');
        $scope.check = true;
        $scope.signUp = function(data, text) {
            var t1 = 'email';
            var auth = $firebaseAuth();

            if (data == t1) {
                // login with Email
                var email = text.email;
                var password = text.password;
                //console.log(data, email, password);
                auth.$createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
                    if (text.select != "school") { // check if not school Register
                        addUserToDb(firebaseUser, text.select);
                        localStorageService.set("status", text.select);
                        $mdDialog.hide();
                        $location.path('/profile');
                    } else {
                        addUserToDb(firebaseUser, text.select); // add new user to DB 
                        addSchoolFromEmailToDB(firebaseUser); // add new Register school
                        localStorageService.set("status", text.select); // create localStorage status
                        $mdDialog.hide();
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
                auth.$signInWithPopup(providerData).then(function(firebaseUser) {
                    if (text.select != "school") {
                        addUserToDb(firebaseUser, text.select);
                        localStorageService.set("status", text.select);
                        $mdDialog.hide();
                        $location.path('/profile');
                    } else {
                        addUserToDb(firebaseUser, text.select);
                        addSchoolFromProviderToDB(firebaseUser);
                        localStorageService.set("status", text.select);
                        $mdDialog.hide();
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

        function addUserToDb(firebaseUser, tp) {
            var clock = Date.now()
            if (firebaseUser.uid == null) {
                // add user from Facebook , Google+
                console.log(firebaseUser.uid);
                firebase.database().ref('users/' + firebaseUser.user.uid).set({
                    displayName: firebaseUser.user.displayName,
                    email: firebaseUser.user.email,
                    emailVerified: firebaseUser.user.emailVerified,
                    photoURL: firebaseUser.user.photoURL,
                    isAnonymous: firebaseUser.user.isAnonymous,
                    providerData: firebaseUser.user.providerData,
                    status: tp,
                    createTime: Date.now()
                });
            } else {
                // add user from email,password
                // bug dissplayName,photoURL was null cant add to Database
                console.log(firebaseUser);
                firebase.database().ref('users/' + firebaseUser.uid).set({
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                    photoURL: firebaseUser.photoURL,
                    isAnonymous: firebaseUser.isAnonymous,
                    providerData: firebaseUser.providerData,
                    status: tp,
                    createTime: Date.now()
                });
            }
        }

        function addSchoolFromProviderToDB(firebaseUser) {
            firebase.database().ref('schools').child(firebaseUser.user.uid).set({
                info: firebaseUser.user.providerData[0],
                like: 0,
                view: 0,
                createTime: Date.now()
            });
        }

        function addSchoolFromEmailToDB(firebaseUser) {
            firebase.database().ref('schools').child(firebaseUser.uid).set({
                info: firebaseUser.providerData[0],
                like: 0,
                view: 0,
                createTime: Date.now()
            });
        }
    }

})();