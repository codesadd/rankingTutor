(function() {
    'use strict';

    angular.module('funfun')
        .service('dataService', ['$q', '$http', '$firebaseArray', '$firebaseObject', UserService]);
    var config = {
        apiKey: "AIzaSyDIpDDBTd08Lwh8uYYybwJQvHwZEe6ACjE",
        authDomain: "fun-fun-53400.firebaseapp.com",
        databaseURL: "https://fun-fun-53400.firebaseio.com",
        storageBucket: "fun-fun-53400.appspot.com"
    };
    firebase.initializeApp(config);

    function UserService($q, $http, $firebaseArray, $firebaseObject) {
        var self = this;
        // Promise-based API
        return {
            // service for profil school controller ----------
            loadSchool: function(uid) {
                return $q.when($firebaseObject(firebase.database().ref('schools').child(uid)));
            },
            updateSchoolInfo: function(param,id) {
                firebase.database().ref('schools').child(id).update(param);
            },
            // this service for info school controller --------------
            loadInfoSchool: function(uid) {
                return $q.when($firebaseObject(firebase.database().ref('schools').child(uid)));
            },
            loadAllCourse: function(uid) {
                return $q.when($firebaseArray(firebase.database().ref('schools/'+ uid).child('courses')));
            },
            updateLike: function(param, id) {
                console.log(param, id);
                firebase.database().ref('demo').child(id).set(param);
            },
            updateView: function(param, id) {
                console.log(param, id);
                firebase.database().ref('schools').child(id).update(param);
            },
            // this service for info course controller ---------
            loadInfoCourse: function(schoolId,courseId) {
                return $q.when($firebaseObject(firebase.database().ref('schools/'+ schoolId + '/courses').child(courseId)));
            },
            registerStd: function(schoolId,courseId,studentId) {
                firebase.database().ref('schools/'+ schoolId.$id + '/courses/' + courseId.$id +'/students').child(studentId.uid).set({id:studentId.uid})
            },
            checkRegister: function(schoolId,courseId,studentId) {
                return $q.when($firebaseObject(firebase.database().ref('schools/'+ schoolId.$id + '/courses/' + courseId.$id +'/students').child(studentId.uid)))
            },
            // -----------
            loadAllUsers: function() {
                return $q.when($firebaseArray(firebase.database().ref().child('demo')));
            },
            loadAllSchools: function() {
                return $q.when($firebaseArray(firebase.database().ref().child('schools')));
            },
            pushData: function(param) {
                firebase.database().ref('demo').push(param);
                //self.users.$add(param);
            },
            removeData: function(param, id) {
                firebase.database().ref('demo').child(id).remove();
                //self.users.$remove(param);
            },
            updateData: function(param, id) {
                console.log(param, id);
                firebase.database().ref('demo').child(id).set(param);
            }
        };
    }

})();