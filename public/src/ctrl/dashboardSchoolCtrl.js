(function() {
    angular
        .module('funfun')
        .controller('dashboardSchoolCtrl', [
            '$scope', '$firebaseAuth', '$log', '$mdDialog', '$location', 'dataService', 'SweetAlert', 'NgEditor','$sce',
            dashboardSchoolCtrl
        ])

    function dashboardSchoolCtrl($scope, $firebaseAuth, $log, $mdDialog, $location, dataService, SweetAlert, NgEditor, $sce) {
        var self = this
        self.currentId
        self.courseKey
        self.course = []
        self.students = []
        self.cp
        $scope.selectedIndex = 0
        self.deleteCourse = deleteCourse
        self.closeCourse = closeCourse
        self.acceptStudent = acceptStudent
        self.acceptTutor = acceptTutor
        self.AuthenticationControl = AuthenticationControl

        self.countTutor = "loading data..."
        self.countStudent = "loading data..."
        $scope.isLoading = true
        $scope.query = {
            limit: 5,
            page: 1
        }
        $scope.addCourse = {
            content: '',
            name: '',
            time: '',
            date: ''
        };

        $scope.menu = [{
            1: {
                name: "ลายละเอียด",
                link: true
            },
            2: {
                name: "นักเรียน",
                link: false
            },
            3: {
                name: "ติวเตอร์",
                link: false
            },
        }]

        $scope.doc = { content: '' };
        $scope.editor = new NgEditor({
            top: 0,
            uploadUrl: 'apis/image/',
            uploadHeaders: {
                'Authorization': 'Bearer ' + '',
                'uid': ''
            }
        });

        self.AuthenticationControl()

        $scope.closeAndOpen = function(param) {
            if (param == "opening") {
                self.cp = true
                $scope.filter = "opening"
            } else if (param == "closed") {
                self.cp = false
                $scope.filter = "closed"
            }
        }

        $scope.test = function(i) {
            $scope.listMenu = true
            $scope.mm = i
        }

        $scope.goto = function(param) {
            $scope.linkDashboard = true
            Object.keys($scope.menu[0]).forEach(function(item) {
                if (item == param) {
                    $scope.menu[0][item].link = true
                } else {
                    $scope.menu[0][item].link = false
                }
            })
        }

        $scope.fetchStudent = function(items, param) {
            return items.filter(item => item.std_status == param).length
        }

        $scope.checkPayment = function(ev, infoStd, infoCourse) {
            console.log(infoStd, infoCourse)
            $scope.infoStudent = infoStd
            $scope.infoCourse = infoCourse
            $mdDialog.show({
                contentElement: '#checkPayment',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            }).then(function(item) {
               console.log(item)
            }, function() {
                console.log("canceled dailog")
            })
        }

         $scope.showPayment = function(ev, infoStd, infoCourse) {
            console.log(infoStd, infoCourse)
            $scope.infoStudent = infoStd
            $scope.infoCourse = infoCourse
            $mdDialog.show({
                contentElement: '#showPayment',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            }).then(function(item) {
               console.log(item)
            }, function() {
                console.log("canceled dailog")
            })
        }

        $scope.checkStudent = function() {
            $scope.dateStudentNow = getDateTime()
            AuthenticationControl()
        };

        $scope.checkTutor = function() {
            $scope.dateTutorNow = getDateTime()
            AuthenticationControl()
        };

        $scope.createCourse = function(param) {
            console.log(param);
            var item = {
                name: param.name,
                eventTime: param.time,
                dateTime: param.date,
                details: param.content,
                numStd: param.numStd,
                status: "opening",
                createTime: getDateTime()
            }
            $mdDialog.hide(item)
        }

        $scope.openCreateForm = function(ev) {
            $mdDialog.show({
                contentElement: '#addCourse',
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
                console.log(item)
                dataService.createCourse(item, self.currentId).then(function(snp) {
                    self.course = snp[0].data
                })
                setTimeout(function() {
                    SweetAlert.swal("เพิ่มข้อมูลเรียบร้อยแล้ว!", "This data has been added.", "success")
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
                        self.countTutor = snp[0].countTutor
                        self.pendingCountTutor = snp[0].pendingCountTutor
                        self.pendingCountStudent = snp[0].pendingCountStudent
                        $scope.dateStudentNow = getDateTime()
                        $scope.selectedIndex = 0
                        console.log(snp[0].data)
                    })
                }
            })
        }

        function deleteCourse(course) {
            var index = self.course.indexOf(course)
            SweetAlert.swal({
                    title: "ต้องการลบวิชา " + course.course.name + " ?",
                    text: "Your will not be able to change this Data !!",
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
                            self.course = snp[0].data
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ลบข้อมูลเรียบร้อยแล้ว!", "This data has been deleted.", "success")
                            $scope.selectedIndex = 0
                        }, 1000)

                    } else {
                        SweetAlert.swal("ยกเลิกการลบข้อมูลเรียบร้อย", "This data is safe :)", "error")
                    }
                })
        }

        function closeCourse(course) {
            var index = self.course.indexOf(course)
            SweetAlert.swal({
                    title: "ต้องการปิดการเรียนวิชา " + course.course.name + " ?",
                    text: "Your will not be able to change this Data !!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, do it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        swal({
                            title: "กำลังปิด..",
                            text: "I will close in few seconds.",
                            timer: 2000,
                            showConfirmButton: false
                        })
                        dataService.closeCourse(course.courseId, self.currentId).then(function(snp) {
                            self.course = snp[0].data
                            console.log(snp)
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ปิดการเรียนเรียบร้อยแล้ว!", "This data has been deleted.", "success")
                            $scope.selectedIndex = 0
                        }, 1000)

                    } else {
                        SweetAlert.swal("ยกเลิกการปิดวิชาเรียบร้อย", "This data is safe :)", "error")
                    }
                })
        }

        function acceptStudent(infoStudent, infoCourse) {
            SweetAlert.swal({
                    title: "ยืนยันการเข้าเรียนของ " + infoStudent.value.displayName + " ?",
                    text: "Your will not be able to change this Data !!",
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
                        dataService.acceptStudent(self.currentId, infoCourse.courseId, infoStudent.std_id).then(function(snp) {
                            self.course = snp[0].data
                            console.log(self.course)
                            $scope.mm =  self.course.filter(course => course.courseId === infoCourse.courseId)[0]
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ยืนยันข้อมูลเรียบร้อยแล้ว!", "This data has been accepted.", "success")
                            $mdDialog.hide()
                        }, 2000)

                    } else {
                        SweetAlert.swal("ยกเลิกการยืนยันข้อมูลเรียบร้อย", "This data is pending :)", "error")
                    }
                })
        }

        function acceptTutor(tutor, infoCourse) {
            SweetAlert.swal({
                    title: "ยืนยันการเข้าสอนของ " + tutor.value.displayName + " ?",
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
                        dataService.acceptTutor(self.currentId, infoCourse.courseId, tutor.tutor_id).then(function(snp) {
                            self.course = snp[0].data
                            $scope.mm =  self.course.filter(course => course.courseId === infoCourse.courseId)[0]
                        })
                        setTimeout(function() {
                            SweetAlert.swal("ยืนยันข้อมูลเรียบร้อยแล้ว!", "This data has been accepted.", "success")
                        }, 2000)

                    } else {
                        SweetAlert.swal("ยกเลิกการยืนยันข้อมูลเรียบร้อย", "This data is pending :)", "error")
                    }
                })
        }

        $scope.detail = function(detail) {
            return $sce.trustAsHtml(detail);
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