(function() {
    'use strict';

    angular.module('funfun')
        .service('dataService', ['$q', '$http', '$firebaseArray', '$firebaseObject', UserService]);
    var config = {
        authDomain: "fun-fun-53400.firebaseapp.com",
        apiKey: "AIzaSyDIpDDBTd08Lwh8uYYybwJQvHwZEe6ACjE",
        databaseURL: "https://fun-fun-53400.firebaseio.com"
    };
    firebase.initializeApp(config);

    function UserService($q, $http, $firebaseArray, $firebaseObject) {
        var self = this;
        // Promise-based API
        return {
            updateSchoolInfo: updateSchoolInfo,
            loadInfoCourse: function(schoolId, courseId) {
                return $q.when($firebaseObject(firebase.database().ref('schools/' + schoolId + '/courses').child(courseId)));
            },
            registerStd: function(schoolId, courseId, studentId) {
                firebase.database().ref('schools/' + schoolId.$id + '/courses/' + courseId.$id + '/students').child(studentId.uid).set({
                    id: studentId.uid
                })
            },
            checkRegister: function(schoolId, courseId) {
                return $q.when($firebaseArray(firebase.database().ref('schools/' + schoolId + '/courses/' + courseId).child('students')))
            },
            loadInfoSchool: loadInfoSchool,
            loadAllCourse: loadAllCourse,
            loadAllSchools: loadAllSchools,
        };


        // ------- Http
        function updateSchoolInfo(params, uid) {
            // console.log(params, uid);
            var request = $http({
                method: "get",
                url: "http://localhost:3000/updateschool/" +
                    params.schoolName + "/" +
                    params.address + "/" +
                    params.city + "/" +
                    params.state + "/" +
                    params.postalCode + "/" +
                    params.biography + "/" +
                    uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadAllCourse(uid) {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/allcoures/" + uid + "/course"
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadAllSchools() {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/schools"
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadInfoSchool(uid) {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/infoschool/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function handleError(response) {
            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {
                return ($q.reject("An unknown error occurred."));
            }
            return ($q.reject(response.data.message));
        }

        function handleSuccess(response) {
            return (response.data);
        }
    }

})();
