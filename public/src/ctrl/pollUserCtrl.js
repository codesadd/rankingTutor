(function() {
    angular
        .module('funfun')
        .controller('pollUserCtrl', [
            'dataService', '$location', '$http', '$scope', 'localStorageService', '$firebaseAuth', 'SweetAlert',
            pollUserCtrl
        ])

    function pollUserCtrl(dataService, $location, $http, $scope, localStorageService, $firebaseAuth, SweetAlert) {
        var self = this
        self.currentUser = []
        self.course = []
        self.user = []
        self.id = null
        self.tutorId = null
        self.sendPoll = sendPoll
        self.pollTutor = [{
            title: '1.ความรู้',
            data: ''
        }, {
            title: '2.การถ่ายทอดความรู้',
            data: ''
        }, {
            title: '3.การตอบคำถาม',
            data: ''
        }, {
            title: '4.การพูด',
            data: ''
        }, {
            title: '5.อัธยาศัย',
            data: ''
        }, {
            title: '6.เนื้อหาสอดคล้องกับเรื่องที่เรียน',
            data: ''
        }]

        self.pollSchool = [{
            title: '1.สถานที่เหมาะสม',
            data: ''
        }, {
            title: '2.สิ่งอำนวยความสะดวก',
            data: ''
        }, {
            title: '3.การจัดการเวลา',
            data: ''
        }, {
            title: '4.ความสะอาด',
            data: ''
        }, {
            title: '5.เอกสารต่างๆ',
            data: ''
        }, {
            title: '6.เครื่องดื่ม อาหารว่าง',
            data: ''
        }]

        self.pollUser = [{
            title: '1.ก่อนเข้ามากวดวิชาคุณมีความรู้ระดับใด',
            data: ''
        }, {
            title: '2.หลังจากกวดวิชาคุณมีความรู้ระดับใด',
            data: ''
        }]

        $firebaseAuth().$onAuthStateChanged(function(user) {
            if (user == null) {
                $location.path('/')
            } else {
                self.currentUser = user
                self.id = localStorageService.get("pol")
                console.log(self.id)
                dataService.loadInfoCourse(self.id.schoolId, self.id.courseId).then(function(snp) {
                    self.course = snp
                    self.tutorId = getTutorId()
                })
                dataService.loadInfoSchool(self.id.schoolId).then(function(snp) {
                    self.school = snp
                    // console.log(snp);
                })
            }
        })


        function sendPoll(pollTutor, pollSchool, pollUser) {
            var check = checkPoll(pollTutor, pollSchool, pollUser)
            if (check.checkPollSchool.length > 0 || check.checkPollTutor.length > 0 || check.checkPollUser.length > 0) {
                SweetAlert.swal("ข้อมูลไม่ครบ!", "กรุณาตรวจสอบแบบประเมินใหม่อีกครั้ง!", "warning")
            } else {
                SweetAlert.swal({
                        title: "ยืนยันการส่งแบบประเมิน ?",
                        text: "การทำแบบประเมินไม่สามารถแก้ไขข้อมูลได้!!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, send it!",
                        cancelButtonText: "No, cancel plx!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            swal({
                                title: "กำลังส่งข้อมูล..",
                                text: "I will close in few seconds.",
                                timer: 2000,
                                showConfirmButton: false
                            })
                            dataService.submitPoll(pollSchool, pollTutor, pollUser, self.id, self.tutorId, self.currentUser.uid).then(function(snp) {
                                console.log(snp);
                            })
                            setTimeout(function() {
                                SweetAlert.swal("ส่งข้อมูลเรียบร้อยแล้ว!", "This data has been deleted.", "success")
                                $location.path('/dashboard-user')
                            }, 1000)

                        } else {
                            SweetAlert.swal("ยกเลิกการส่งข้อมูลเรียบร้อย", "This data is safe :)", "error")
                        }
                    })
            }
        }

        function getTutorId() {
            var returnItem = null
            if (self.course[0].value.tutors == undefined) {
                SweetAlert.swal("ไม่มีข้อมูลติวเตอร์", "undefined tutor!", "error")
                $location.path('/dashboard-user')
            } else {
                var keyTutor = Object.keys(self.course[0].value.tutors)
                keyTutor.forEach(function(key) {
                    returnItem = self.course[0].value.tutors[key].data.uid;
                })
                return returnItem
            }
        }

        function checkPoll(pollTutor, pollSchool, pollUser) {

            var pollTutorCheckItem = []
            var pollSchoolCheckItem = []
            var pollUserCheckItem = []
            pollTutor.forEach(function(item) {
                if (item.data == '') {
                    pollTutorCheckItem.push(item)
                }
            })
            pollSchool.forEach(function(item) {
                if (item.data == '') {
                    pollSchoolCheckItem.push(item)
                }
            })
            pollUser.forEach(function(item) {
                if (item.data == '') {
                    pollUserCheckItem.push(item)
                }
            })

            return item = {
                checkPollTutor: pollTutorCheckItem,
                checkPollSchool: pollSchoolCheckItem,
                checkPollUser: pollUserCheckItem,
            }
        }


    }
})()
