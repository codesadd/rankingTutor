(function() {
    angular
        .module('funfun')
        .controller('dashboardSchoolCtrl', [
            '$scope', '$timeout', '$firebaseAuth', '$log', '$mdDialog', '$location',
            dashboardSchoolCtrl
        ]);

    function dashboardSchoolCtrl($scope, $timeout, $firebaseAuth, $log, $mdDialog, $location) {
        var self = this;
        self.courseKey;
        $scope.isLoading = true
        $scope.clock = "loading clock..." // initialise the time variable
        $scope.tickInterval = 1000 //ms
            // Date, Time  -------------------------------
        var tick = function() {
            $scope.clock = Date.now() // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        }
        $timeout(tick, $scope.tickInterval); // Start the timer

        $scope.show = "This page is dashboardSchoolCtrl"
        $scope.courseLength = "Loading..."
        $scope.studentLength = "Loading..."
        $scope.tutorLength = "Loading..."

        AuthenticationControl()

        $scope.createCourse = function(param) {
            console.log(param)
            $firebaseAuth().$onAuthStateChanged(function(user) {
                var id = user.uid;
                if (id == null) {
                    console.log("error");
                } else {
                    firebase.database().ref('schools/' + id).child('courses').push().set({
                        name: param.name,
                        eventTime: param.time,
                        dateTime: param.date,
                        details: param.details,
                        createTime: $scope.clock
                    })
                }
            })
            $mdDialog.hide()
        }

        $scope.openCreateForm = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/school/create-course.html',
                controller: dashboardSchoolCtrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        function AuthenticationControl() {
            $scope.dataRegister = []
            $firebaseAuth().$onAuthStateChanged(function(user) {
                if (user == null) {
                    $location.path('/');
                } else {
                    var info = user;
                    console.log(info);
                    firebase.database().ref('schools/' + info.uid).child('courses').on('value', function(snapshot) {
                        //console.log(snapshot.numChildren(), snapshot.val());
                        $scope.courseLength = snapshot.numChildren(); // count num in row
                        $scope.course = snapshot.val();
                        console.log(snapshot.val());
                        $scope.isLoading = false;
                    });
                    // firebase.database().ref('schools/' + info.uid).child('courses').on('child_added', function(snapshot) { // get key course ID
                    //     firebase.database().ref('schools/' + info.uid + '/courses/' + snapshot.key).child('students').on('value', function(snapshot) {
                    //         $scope.studentLength = snapshot.numChildren(); // count num in row
                    //     });
                    //     firebase.database().ref('schools/' + info.uid + '/courses/' + snapshot.key).child('students').on('child_added', function(snapshot) {
                    //         firebase.database().ref('users').child(snapshot.key).on('value', function(snapshot) {
                    //             $scope.students = snapshot.val();
                    //             console.log(snapshot.val());
                    //             $scope.dataRegister.push($scope.students);
                    //         });
                    //     });
                    //     console.log($scope.dataRegister);
                    //     $scope.isLoading = false;
                    // });
                }
            });
        }

    }
})();
