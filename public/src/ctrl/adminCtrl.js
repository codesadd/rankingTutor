(function() {

    angular
        .module('funfun')
        .controller('adminCtrl', [
            'dataService', 'SweetAlert', '$location', '$log', 'localStorageService', '$mdToast', '$scope',
            adminCtrl
        ]);

    function adminCtrl(dataService, SweetAlert, $location, $log, localStorageService, $mdToast, $scope) {
        var self = this
        self.fetchCourse = fetchCourse
        self.fetchStudentPen = fetchStudentPen
        self.fetchStudentAcc = fetchStudentAcc
        self.removeSchool = removeSchool
        self.fetchChartData = fetchChartData

        $scope.query = {
            limit: 5,
            page: 1
        }

        if (localStorageService.get("checkAdmin").email == "admin@system" && localStorageService.get("checkAdmin").password == "p@ssW0rd") {
            // swal("Hi Admin", "This data has been access by admin.", "success")
            $mdToast.show(
                $mdToast.simple()
                .textContent(localStorageService.get("checkAdmin").email)
                .position('bottom left')
                .hideDelay(3000)
            );
            dataService.getDashboardAdmin().then(function(res) {
                console.log(res)
                self.countTutor = res[0].countTutor
                self.countSchool = res[0].countSchool
                self.countStudent = res[0].countStudent
                self.schools = res[0].schools
                console.log(res[0].schools);
            })
        } else {
            swal("คุณไม่สามารถเข้าถึงระบบนี้ได้", "This data can be access by admin only.", "warning")
        }

        function removeSchool(schoolId) {
            swal({
                    title: "Are you sure?",
                    text: "Your will not be able to recover this imaginary file!",
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
                        SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    } else {
                        SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
                    }
                });
        }

        function fetchChartData(item) {
            $scope.labels = [];
            $scope.data = [];
            var count = 0
            var t1, t2, t3, t4, t5, t6
            t1 = t2 = t3 = t4 = t5 = t6 = 0
            Object.keys(item).forEach(function(course) {
                var count = 0
                Object.keys(item[course].dataPoll).forEach(function(id) {
                    count++
                    if (count == 1) {
                        t1 += item[course].dataPoll[id].data
                        console.log(t1);
                    } else if (count == 2) {
                        t2 += item[course].dataPoll[id].data
                    } else if (count == 3) {
                        t3 += item[course].dataPoll[id].data
                    } else if (count == 4) {
                        t4 += item[course].dataPoll[id].data
                    } else if (count == 5) {
                        t5 += item[course].dataPoll[id].data
                    } else if (count == 6) {
                        t6 += item[course].dataPoll[id].data
                    }
                    $scope.labels.push(item[course].dataPoll[id].title)
                })
            })
            r1 = parseInt((t1 / (5 * Object.keys(item).length)) * 100)
            r2 = parseInt((t2 / (5 * Object.keys(item).length)) * 100)
            r3 = parseInt((t3 / (5 * Object.keys(item).length)) * 100)
            r4 = parseInt((t4 / (5 * Object.keys(item).length)) * 100)
            r5 = parseInt((t5 / (5 * Object.keys(item).length)) * 100)
            r6 = parseInt((t6 / (5 * Object.keys(item).length)) * 100)

            var textTitle = "จากนักเรียนทั้งหมด " + Object.keys(item).length + " คน"
            self.labels = ["สถานที่เหมาะสม", "สิ่งอำนวยความสะดวก", "การจัดการเวลา", "ความสะอาด", "เอกสาร", "อาหาร"];
            self.data = [
                [r1, r2, r3, r4, r5, r6]
            ];
            self.series = [textTitle];
            self.options = {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                scale: {
                    responsive: true,
                    reverse: false,
                    ticks: {
                        beginAtZero: 100
                    }
                }
            }
            $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
            $scope.series = ['ก่อนเรียน', 'หลังเรียน'];
            $scope.options = {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 5,
                            min: 0,
                            stepSize: 1
                        }
                    }]
                }
            };
            $scope.data = [
                [2, 3, 3, 2, 1, 3, 1],
                [4, 5, 4, 4, 3, 4, 4]
            ];
        }

        function fetchCourse(item) {
            var returnItem = []
            keyCourse = Object.keys(item)
            keyCourse.forEach(function(id) {
                returnItem.push(item[id])
            })
            return returnItem
        }

        function fetchStudentAcc(item) {
            var count = 0
            keyCourse = Object.keys(item)
            keyCourse.forEach(function(id) {
                if (item[id].status == "accepted") {
                    count++
                }
            })
            return count
        }

        function fetchStudentPen(item) {
            var count = 0
            keyCourse = Object.keys(item)
            keyCourse.forEach(function(id) {
                if (item[id].status == "pending") {
                    count++
                }
            })
            return count
        }

    }



})();
