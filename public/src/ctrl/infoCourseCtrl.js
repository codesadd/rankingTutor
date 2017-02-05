(function() {
    angular
        .module('funfun')
        .controller('infoCourseCtrl', [
            'dataService', '$location', 'localStorageService', '$scope', '$firebaseAuth',
            infoCourseCtrl
        ])

    function infoCourseCtrl(dataService, $location, localStorageService, $scope, $firebaseAuth) {
        var self = this
        self.schoolSelected = []
        self.course = []
        self.currentUser = []
        self.disbleRegister
        self.lengthRegister = []
        self.registerStd = registerStd
        self.registerTutor = registerTutor
        $scope.checkStd = false
        $scope.checkTutor = false
        getInfoChart()

        $firebaseAuth().$onAuthStateChanged(function(user) {
            self.currentUser = user
                //console.log(self.currentUser.uid)
            if (user != null && localStorageService.get("status") == "tutor") {
                getInfoThisCourse()
                getSchool()
                checkRegisterTutor(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"), self.currentUser.uid)
                $scope.checkTutor = true
                    // checkLengthStudent()
            } else if (user != null && localStorageService.get("status") == "student") {
                getInfoThisCourse()
                getSchool()
                checkRegisterStudent(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"), self.currentUser.uid)
                $scope.checkStd = true
                    // checkLengthStudent()
            } else {
                getInfoThisCourse()
                getSchool()
                setDisbleButton(localStorageService.get("status"))
                    // checkLengthStudent()
            }
        })

        function setDisbleButton(param) {
            param == "student" ? self.disbleRegister = false : self.disbleRegister = true
            self.disbleRegister != true ? $scope.labalRegister = "ลงทะเบียน" : $scope.labalRegister = "กรุณาสมัครสมาชิก หรือเข้าสู่ระบบเพื่อลงทะเบียน!!"
        }

        function checkRegisterStudent(schoolId, courseId, studentId) {
            dataService.checkRegisterStudent(schoolId, courseId, studentId).then(function(snp) {
                snp != null ? self.disbleRegister = true : self.disbleRegister = false
                snp != null ? $scope.labalRegister = "คุณลงทะเบียนวิชานี้แล้วว" : $scope.labalRegister = "ลงทะเบียน"
            })
        }

        function checkRegisterTutor(schoolId, courseId, tutorId) {
            dataService.checkRegisterTutor(schoolId, courseId, tutorId).then(function(snp) {
                snp != null ? self.disbleRegister = true : self.disbleRegister = false
                snp != null ? $scope.labalRegister = "คุณลงทะเบียนวิชานี้แล้วว" : $scope.labalRegister = "ลงทะเบียน"
            })
        }

        function checkLengthStudent() {
            dataService.checkRegister(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId")).then(function(snp) {
                self.lengthRegister = snp.length
            })
        }

        function registerStd() {
            dataService.registerStd(self.schoolSelected, self.course, self.currentUser).then(function(snp) {
                if (snp != "") {
                    checkRegisterStudent(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"), self.currentUser.uid)
                }
            })
        }

        function registerTutor() {
            dataService.registerTutor(self.schoolSelected, self.course, self.currentUser).then(function(snp) {
                if (snp != "") {
                    checkRegisterTutor(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId"), self.currentUser.uid)
                }
            })
        }

        function getInfoThisCourse() {
            dataService.loadInfoCourse(localStorageService.get("schoolSelectId"), localStorageService.get("courseSelectId")).then(function(snp) {
                self.course = []
                var keys = Object.keys(snp)
                keys.sort()
                keys.forEach(function(item) {
                    if (snp[item].value.students == undefined) {
                        var item = {
                            courseId: snp[item].id,
                            std_length: 0,
                            value: snp[item].value
                        }
                    } else {
                        var item = {
                            courseId: snp[item].id,
                            std_length: Object.keys(snp[item].value.students).length,
                            value: snp[item].value
                        }
                    }
                    self.course.push(item)
                })
                console.log(self.course)
                //self.count = Object.keys(self.course.student).length

            })
        }

        function getSchool() {
            dataService.loadInfoSchool(localStorageService.get("schoolSelectId")).then(function(school) {
                self.schoolSelected = school
            })
        }

        function getInfoChart() {
            self.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"]
            self.data = [
                [65, 59, 90, 81, 56, 55, 77]
            ]
        }
    }
})()
