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
            createCourse: createCourse,
            updateSchoolInfo: updateSchoolInfo,
            loadInfoSchool: loadInfoSchool,
            loadAllCourse: loadAllCourse,
            loadAllSchools: loadAllSchools,
            registerStd: registerStd,
            checkRegister: checkRegister,
            getUser: getUser,
            loadInfoCourse: loadInfoCourse,
            getDashboardSchool: getDashboardSchool,
            deleteCourse: deleteCourse,
            acceptStudent: acceptStudent,
            submitPoll: submitPoll
        };


        // ------- Http
        function submitPoll(pollSchool,pollTutor, pollUser, id, currentUserId){
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/submitpoll",
                data: {
                    pollSchool: pollSchool,
                    polltutor: pollTutor,
                    pollUser: pollUser,
                    schoolId: id.schoolId,
                    courseId: id.courseId,
                    currentUserId: currentUserId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function acceptStudent(schoolId, courseId, studentId) {
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/accept",
                data: {
                    schoolId: schoolId,
                    courseId: courseId,
                    studentId: studentId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function deleteCourse(courseId, schoolId) {
            // body...
            console.log(courseId);
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/delete/course",
                data: {
                    courseId: courseId,
                    schoolId: schoolId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function getDashboardSchool(param) {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/get/dashboard",
                params: {
                    uid: param
                },
                headers: { 'Content-Type': 'application/json' }
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadInfoCourse(schoolId, courseId) {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/coures/" + schoolId + "/" + courseId
            });
            return (request.then(handleSuccess, handleError));
        }

        function checkRegister(schoolId, courseId, studentId) {
            //console.log(schoolId, courseId, studentId);
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/cregister",
                data: {
                    schoolId: schoolId,
                    courseId: courseId,
                    studentId: studentId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function registerStd(school, course, student) {
            // body...
            //console.log(school[0].id, course.$id, student);
            var params = {
                    schoolId: school[0].id,
                    courseId: course[0].courseId,
                    student: student
                }
                //console.log(params);
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/register",
                data: params,
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function createCourse(value, uid) {
            //console.log(params, uid);
            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/create_course",
                data: {
                    params: value,
                    uid: uid
                }
            });
            return (request.then(handleSuccess, handleError));
        }

        function updateSchoolInfo(params, uid) {

            var request = $http({
                method: "post",
                url: "http://localhost:3000/api/v1/updateschool/" + uid,
                data: params,
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError));
        }

        function loadAllCourse(uid) {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/allcoures/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadAllSchools() {
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/schools"
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadInfoSchool(uid) {
            //console.log(uid);
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/infoschool/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function getUser(uid) {
            //console.log(uid);
            var request = $http({
                method: "get",
                url: "http://localhost:3000/api/v1/user/" + uid
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
