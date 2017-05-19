(function() {
    angular
        .module('funfun')
        .controller('dashboardUserCtrl', [
            'dataService', '$location', '$http', '$scope', 'localStorageService', '$firebaseAuth', '$firebaseStorage','$mdDialog','SweetAlert',
            dashboardUserCtrl
        ]);

    function dashboardUserCtrl(dataService, $location, $http, $scope, localStorageService, $firebaseAuth, $firebaseStorage,$mdDialog, SweetAlert) {
        var self = this;
        self.course = []
        self.user = []
        self.ckeckPending = ckeckPending
        self.ckeckAccepted = ckeckAccepted
        self.doingPoll = doingPoll
        $scope.isLoading = true
        $firebaseAuth().$onAuthStateChanged(function(user) {
            $scope.userID = user.uid
            if (user == null) {
                $location.path('/');
            } else {
                if (localStorageService.get("status") == "tutor") {
                    dataService.getTutor(user.uid).then(function(snp) {
                        console.log(snp)
                        self.user = snp[0]
                        if (snp[1] == undefined) {
                            console.log("ยังไม่มีวิชาที่ลงเรียน่")
                        } else {
                            self.course = snp[1].course
                            console.log(self.course);
                        }
                        $scope.isLoading = false
                    })
                } else if (localStorageService.get("status") == "student") {
                    dataService.getStudent(user.uid).then(function(snp) {
                        self.user = snp[0]
                        if (snp[1] == undefined) {
                            console.log("ยังไม่มีวิชาที่ลงเรียน่")
                        } else {
                            self.course = snp[1].course
                        }
                        $scope.isLoading = false
                    })
                }
            }
        });

          $scope.confirmPayment = function(ev, param) {
            console.log(param)
            $scope.info = param
            $mdDialog.show({
                contentElement: '#confirmPayment',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            })
        }

        $scope.submitPayment = function(item){
            var file = document.querySelector('#input-file-id').files
            console.log(item, file[0])
            var storageRef = firebase.storage().ref('payment/'+$scope.info.school.schoolId+'/'+$scope.info.course.courseId);
            var uploadTask = storageRef.child($scope.userID).put(file[0])

            uploadTask.on('state_changed', function(snapshot){
                $scope.loading  = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + $scope.loading  + '% done');
            }, function(error) {
                // Handle unsuccessful uploads
            }, function() {
                // Handle successful uploads on complete
                var param = {
                    status: 'pending',
                    payment: {
                        name: item.name,
                        bankName: item.bankName,
                        date: item.date,
                        time: item.time,
                        tel: item.tel,
                        imageURL: uploadTask.snapshot.downloadURL
                    }
                }
                firebase.database().ref('schools/'+$scope.info.school.schoolId+'/courses/'+$scope.info.course.courseId+'/students/').child($scope.userID).update(param, function(error) {
                // body...
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    SweetAlert.swal("ส่งข้อมูลเรียบร้อยแล้ว!", "รอการยืนยันจากโรงเรียนกวดวิชา", "success")
                    setTimeout(function() {
                        location.reload()
                    }, 1000)

                }
            })

            });
        }

        function ckeckPending(param) {
            return (param == "waiting" ? true : false)
        }

        function ckeckAccepted(param) {
            return (param == "pending" || param == "accepted" ? true : false)
        }

        function ckeckPolled(param) {
            return (param == "accepted" ? true : false)
        }

        function doingPoll(courseId, schoolId) {
            var params = {
                courseId: courseId,
                schoolId: schoolId
            }
            localStorageService.set("pol", params)
            $location.path("/doing-poll")
        }

        $scope.cancel = function() {
            $mdDialog.cancel()
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


    }
})();