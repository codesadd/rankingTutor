(function() {
    angular
        .module('funfun')
        .controller('infoCourseCtrl', [
            'dataService', '$location', 'localStorageService', '$scope', '$firebaseAuth',
            infoCourseCtrl
        ]);

    function infoCourseCtrl(dataService, $location, localStorageService, $scope, $firebaseAuth) {
        var self = this;
        self.schoolSelected = []
        self.course = []
        self.currentUser = []
        self.disbleRegister = false
        self.register = register

        getInfoChart()
        getCurrentUser()
        getSchool(localStorageService.get("schoolSelectId"))
        getInfoThisCourse(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"))
        setDisbleButton()
        
        
        function setDisbleButton() {
            localStorageService.get("status") != "student" ? self.disbleRegister = true : self.disbleRegister = false
            self.disbleRegister == true ? $scope.labalRegister = "กรุณาสมัครสมาชิก หรือเข้าสู่ระบบเพื่อลงทะเบียน!!" : $scope.labalRegister = "ลงทะเบียน"
        }
        
        function setEnabledRegister() {
            self.disbleRegister == true ? $scope.labalRegister = "ลงทะเบียนแล้วว" : $scope.labalRegister = "ลงทะเบียน"
        }
        
        function register() {
            dataService.registerStd(self.schoolSelected, self.course, self.currentUser)
        }

        function getSchool(schoolId) {
            dataService.loadInfoSchool(schoolId).then(function(school) {
                    self.schoolSelected = school;
                })
        }

        function getInfoThisCourse(schoolId, courseId) {
            dataService.loadInfoCourse(schoolId, courseId).then(function(course) {
                    self.course = course;
                })
        }

        function getCurrentUser() {
            $firebaseAuth().$onAuthStateChanged(function(user) {
                self.currentUser = user
            });
        }

        function getInfoChart() {
            self.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"]
            self.data = [
                [65, 59, 90, 81, 56, 55, 77]
            ]
        }
    }
})();