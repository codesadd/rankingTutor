(function() {
    angular
        .module('funfun')
        .controller('dashboardSchoolCtrl', [
            '$scope', '$firebaseAuth', '$log', '$mdDialog', '$location', 'dataService', 'SweetAlert',
            dashboardSchoolCtrl
        ])

    function dashboardSchoolCtrl($scope, $firebaseAuth, $log, $mdDialog, $location, dataService, SweetAlert) {
        var self = this
        self.currentId
        self.courseKey
        self.course = []
        self.students = []
        $scope.selectedIndex = 0
        self.deleteCourse = deleteCourse
        self.acceptStudent = acceptStudent
        self.AuthenticationControl = AuthenticationControl

        $scope.studentLength = "loading data..."
        $scope.tutorLength = "loading data..."
        $scope.isLoading = true
        $scope.query = {
            limit: 5,
            page: 1
        }

        self.AuthenticationControl()

        $scope.createCourse = function(param) {
            var item = {
                name: param.name,
                eventTime: param.time,
                dateTime: param.date,
                details: param.details,
                createTime: getDateTime()
            }
            $mdDialog.hide(item)
        }

        $scope.openCreateForm = function(ev) {
            $mdDialog.show({
                templateUrl: './src/template/school/create-course.html',
                controller: dashboardSchoolCtrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            }).then(function(item) {
                swal({
                    title: "กำลังเพิ่มข้อมูล..",
                    text: "I will close in few seconds.",
                    timer: 2000,
                    showConfirmButton: false
                })
                dataService.createCourse(item, self.currentId).then(function(snp) {
                    self.course = snp
                })
                setTimeout(function() {
                    SweetAlert.swal("เพิ่มข้อมูลเรียบร้อยแล้ว!", "This data has been added.", "success")
                    $scope.selectedIndex = self.course.length
                }, 1000)
            }, function() {
                console.log("canceled dailog")
            })
        }
        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        function AuthenticationControl() {
            $firebaseAuth().$onAuthStateChanged(function(user) {
                if (user == null) {
                    $location.path('/')
                } else {
                    self.currentId = user.uid
                    $scope.isLoading = false
                    var info = user
                    dataService.getDashboardSchool(user.uid).then(function(snp) {
                        self.course = snp[0].data
                        self.countStudent = snp[0].countStudent
                        console.log(self.course);
                    })
                }
            })
        }

        function deleteCourse(course) {
            var index = self.course.indexOf(course)
            SweetAlert.swal({
                    title: "ต้องการลบวิชา " + course.course.name + " ?",
                    text: "Your will not be able to recover this Data !!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        swal({
                            title: "กำลังลบข้อมูล..",
                            text: "I will close in few seconds.",
                            timer: 2000,
                            showConfirmButton: false
                        })
                        dataService.deleteCourse(course.courseId, self.currentId).then(function(snp) {
                            self.course = snp
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ลบข้อมูลเรียบร้อยแล้ว!", "This data has been deleted.", "success")
                            $scope.selectedIndex = index - 1
                        }, 1000)

                    } else {
                        SweetAlert.swal("ยกเลิกการลบข้อมูลเรียบร้อย", "This data is safe :)", "error")
                    }
                })
        }

        function acceptStudent(student, courseId, i) {
            var index = self.course.indexOf(i)
            SweetAlert.swal({
                    title: "ยืนยันการเข้าเรียนของ " + student.value.displayName + " ?",
                    text: "Your will not be able to recover this Data !!",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#A5DC86",
                    confirmButtonText: "Yes, accept this user!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        swal({
                            title: "กำลังยืนยันข้อมูล..",
                            text: "I will close in few seconds.",
                            timer: 1000,
                            showConfirmButton: false
                        })
                        dataService.acceptStudent(self.currentId, courseId, student.std_id).then(function(snp) {
                            self.course = snp
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ยืนยันข้อมูลเรียบร้อยแล้ว!", "This data has been accepted.", "success")
                            $scope.selectedIndex = index
                        }, 2000)

                    } else {
                        SweetAlert.swal("ยกเลิกการยืนยันข้อมูลเรียบร้อย", "This data is pending :)", "error")
                    }
                })
        }

        $scope.dateToString = function(param) {
            var date = new Date(param)
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            month = (month < 10 ? "0" : "") + month
            var day = date.getDate()
            day = (day < 10 ? "0" : "") + day

            return day + "/" + month + "/" + year
        }

        function getDateTime() {

            var date = new Date()

            var hour = date.getHours()
            hour = (hour < 10 ? "0" : "") + hour

            var min = date.getMinutes()
            min = (min < 10 ? "0" : "") + min

            var sec = date.getSeconds()
            sec = (sec < 10 ? "0" : "") + sec

            var year = date.getFullYear()

            var month = date.getMonth() + 1
            month = (month < 10 ? "0" : "") + month

            var day = date.getDate()
            day = (day < 10 ? "0" : "") + day

            return hour + ":" + min + ":" + sec + " - " + day + "/" + month + "/" + year

        }

    }
})()
