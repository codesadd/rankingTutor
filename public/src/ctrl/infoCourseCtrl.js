(function() {
    angular
        .module('funfun')
        .controller('infoCourseCtrl', [
            'dataService', '$location', 'localStorageService', '$scope', '$firebaseAuth',
            infoCourseCtrl
        ]);

    function infoCourseCtrl(dataService, $location, localStorageService, $scope, $firebaseAuth) {
        var self = this;
        self.schoolSelected = [];
        self.course = [];
        self.currentUser = [];
        self.disbleRegister;
        self.lengthRegister = [];
        self.register = register;
        getInfoChart()

        $firebaseAuth().$onAuthStateChanged(function(user) {
            self.currentUser = user
            if (user != null && localStorageService.get("status") != "school") {
                getInfoThisCourse()
                getSchool()
                checkRegister(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"))
                checkLengthStudent()
            } else {
                getInfoThisCourse()
                getSchool()
                setDisbleButton(localStorageService.get("status"))
                checkLengthStudent()
            }
        });

        function setDisbleButton(param) {
            param == "student" ? self.disbleRegister = false : self.disbleRegister = true
            self.disbleRegister != true ? $scope.labalRegister = "ลงทะเบียน" : $scope.labalRegister = "กรุณาสมัครสมาชิก หรือเข้าสู่ระบบเพื่อลงทะเบียน!!"
        }

        function checkRegister(schoolId, courseId) {
            dataService.checkRegister(schoolId, courseId).then(function(snp) {
                console.log(snp.find(checkId));
                snp.find(checkId) != null ? self.disbleRegister = true : self.disbleRegister = false
                snp.find(checkId) != null ? $scope.labalRegister = "คุณลงทะเบียนวิชานี้แล้วว" : $scope.labalRegister = "ลงทะเบียน"
            })
        }
        // function Array ไว้ตรวจสอบว่ามีข้อมูลตรงตามที่ต้องการ
        function checkId(check) {
            return check.$id === self.currentUser.uid;
        }

        function checkLengthStudent() {
            dataService.checkRegister(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId")).then(function(snp) {
                self.lengthRegister = snp.length
            })
        }

        function register() {
            dataService.registerStd(self.schoolSelected, self.course, self.currentUser)
            checkRegister(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"))
        }

        function getInfoThisCourse() {
            dataService.loadInfoCourse(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId")).then(function(course) {
                self.course = course;
            })
        }

        function getSchool() {
            dataService.loadInfoSchool(localStorageService.get("schoolSelectId")).then(function(school) {
                self.schoolSelected = school;
            })
        }

        function getInfoChart() {
            self.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"]
            self.data = [
                [65, 59, 90, 81, 56, 55, 77]
            ]
        }
    }
})();
