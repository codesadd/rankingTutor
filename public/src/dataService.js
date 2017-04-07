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
        // var url = "https://sleepy-shore-93571.herokuapp.com/api/v1/"
        var url = "http://localhost:3000/api/v1/"

        var self = this;
        // Promise-based API
        return {
            createCourse: createCourse,
            loadInfoSchool: loadInfoSchool,
            loadAllCourse: loadAllCourse,
            loadAllSchools: loadAllSchools,
            registerStd: registerStd,
            registerTutor: registerTutor,
            checkRegisterStudent: checkRegisterStudent,
            checkRegisterTutor: checkRegisterTutor,
            getStudent: getStudent,
            getTutor: getTutor,
            loadInfoCourse: loadInfoCourse,
            getDashboardSchool: getDashboardSchool,
            deleteCourse: deleteCourse,
            closeCourse: closeCourse,
            acceptStudent: acceptStudent,
            acceptTutor: acceptTutor,
            submitPoll: submitPoll,
            getDashboardAdmin: getDashboardAdmin
        };


        // ------- Http


        function getDashboardAdmin() {
            var request = $http({
                method: "get",
                url: url + "get/admin",
                headers: { 'Content-Type': 'application/json' }
            });
            return (request.then(handleSuccess, handleError));
        }

        function submitPoll(pollSchool, pollTutor, pollUser, id, tutorId, currentUserId) {
            var request = $http({
                method: "post",
                url: url + "submitpoll",
                data: {
                    pollSchool: pollSchool,
                    polltutor: pollTutor,
                    pollUser: pollUser,
                    schoolId: id.schoolId,
                    courseId: id.courseId,
                    tutorId: tutorId,
                    currentUserId: currentUserId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function acceptStudent(schoolId, courseId, studentId) {
            var request = $http({
                method: "post",
                url: url + "accept-student",
                data: {
                    schoolId: schoolId,
                    courseId: courseId,
                    studentId: studentId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function acceptTutor(schoolId, courseId, tutorId) {
            console.log(schoolId, courseId, tutorId);
            var request = $http({
                method: "post",
                url: url + "accept-tutor",
                data: {
                    schoolId: schoolId,
                    courseId: courseId,
                    tutorId: tutorId
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
                url: url + "delete/course",
                data: {
                    courseId: courseId,
                    schoolId: schoolId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function closeCourse(courseId, schoolId) {
            // body...
            console.log(courseId);
            var request = $http({
                method: "post",
                url: url + "close/course",
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
                url: url + "get/dashboard",
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
                url: url + "coures/" + schoolId + "/" + courseId
            });
            return (request.then(handleSuccess, handleError));
        }

        function checkRegisterStudent(schoolId, courseId, studentId) {
            //console.log(schoolId, courseId, studentId);
            var request = $http({
                method: "post",
                url: url + "check-register-student",
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
                url: url + "register-student",
                data: params,
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function checkRegisterTutor(schoolId, courseId, tutorId) {
            //console.log(schoolId, courseId, studentId);
            var request = $http({
                method: "post",
                url: url + "check-register-tutor",
                data: {
                    schoolId: schoolId,
                    courseId: courseId,
                    tutorId: tutorId
                },
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function registerTutor(school, course, tutor) {
            // body...
            //console.log(school[0].id, course.$id, student);
            var params = {
                    schoolId: school[0].id,
                    courseId: course[0].courseId,
                    tutor: tutor
                }
                //console.log(params);
            var request = $http({
                method: "post",
                url: url + "register-tutor",
                data: params,
                headers: { 'Content-Type': 'application/json' }
            });

            return (request.then(handleSuccess, handleError))
        }

        function createCourse(value, uid) {
            //console.log(params, uid);
            var request = $http({
                method: "post",
                url: url + "create_course",
                data: {
                    params: value,
                    uid: uid
                }
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadAllCourse(uid) {
            var request = $http({
                method: "get",
                url: url + "allcoures/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadAllSchools() {
            var request = $http({
                method: "get",
                url: url + "schools"
            });
            return (request.then(handleSuccess, handleError));
        }

        function loadInfoSchool(uid) {
            //console.log(uid);
            var request = $http({
                method: "get",
                url: url + "infoschool/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function getStudent(uid) {
            //console.log(uid);
            var request = $http({
                method: "get",
                url: url + "student/" + uid
            });
            return (request.then(handleSuccess, handleError));
        }

        function getTutor(uid) {
            //console.log(uid);
            var request = $http({
                method: "get",
                url: url + "tutor/" + uid
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