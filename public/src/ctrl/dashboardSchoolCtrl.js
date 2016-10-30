(function() {
    angular
        .module('funfun')
        .controller('dashboardSchoolCtrl', [
            '$scope', '$timeout', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$log', '$mdDialog','$location',
            dashboardSchoolCtrl
        ]);

    function dashboardSchoolCtrl($scope, $timeout, $firebaseAuth, $firebaseObject, $firebaseArray, $log, $mdDialog, $location) {
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
                firebase.database().ref('schools/' + user.uid).child('courses').push().set({
                    name: param.name,
                    eventTime: param.time,
                    dateTime: param.date,
                    details: param.details,
                    createTime: $scope.clock
                })
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
            $firebaseAuth().$onAuthStateChanged(function(user) {
                if (user == null) {
                    $location.path('/');
                } else {

                    var info = user;
                    console.log(info.uid);
                    var course = firebase.database().ref('schools/' + info.uid).child('courses');
                    course.on('value', function(snapshot) {
                        //console.log(snapshot.numChildren(), snapshot.val());
                        $scope.courseLength = snapshot.numChildren(); // count num in row
                        $scope.course = snapshot.val();
                        $scope.isLoading = false;
                    });
                }
            });
        }
    }
})();
