(function() {

    angular
        .module('funfun')
        .controller('ProfileSchoolCtrl', [
            '$scope', 'localStorageService', '$firebaseAuth', '$location', '$firebaseObject', 'ChartJs', 'dataService', 'SweetAlert',
            ProfileSchoolCtrl
        ]);


    function ProfileSchoolCtrl($scope, localStorageService, $firebaseAuth, $location, $firebaseObject, ChartJs, dataService, SweetAlert) {
        var self = this;
        self.user = [];
        self.school = [];
        self.selectedId = null;
        self.userId
        self.updateInfoSchool = updateInfoSchool;

        $firebaseAuth().$onAuthStateChanged(function(user) {
            if (user == null || localStorageService.get("status") != "school") {
                $location.path('/');
            } else {
                dataService.loadInfoSchool(user.uid).then(function(snp) {
                    self.school = snp;
                    self.userId = user.uid
                    getInfoCourse(user.uid)
                });
            }
        });

        function getInfoCourse(id) {
            dataService
                .loadAllCourse(id)
                .then(function(snp) {
                    console.log(snp);
                    getInfoChart(snp.resultPoll[0])
                })
        }

        function getInfoChart(poll) {
            if (poll == undefined) {

            } else {
                r1 = parseInt((poll.p1 / (5 * poll.n)) * 100)
                r2 = parseInt((poll.p2 / (5 * poll.n)) * 100)
                r3 = parseInt((poll.p3 / (5 * poll.n)) * 100)
                r4 = parseInt((poll.p4 / (5 * poll.n)) * 100)
                r5 = parseInt((poll.p5 / (5 * poll.n)) * 100)
                r6 = parseInt((poll.p6 / (5 * poll.n)) * 100)

                self.labels = ["สถานที่เหมาะสม", "สิ่งอำนวยความสะดวก", "การจัดการเวลา", "ความสะอาด", "เอกสาร", "อาหาร"];

                self.data = [
                    [r1, r2, r3, r4, r5, r6]
                ];
                self.options = {
                    title: {
                        display: true,
                        text: 'คะแนน',
                        fontSize: 16
                    },
                    scale: {
                        reverse: false,
                        ticks: {
                            beginAtZero: 100
                        }
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14
                    }
                }
            }
        }

        function updateInfoSchool(param) {
            firebase.database().ref('schools').child(self.userId).update(param, function(error) {
                // body...
                if (error) {
                    console.log("Data could not be saved." + error);
                    // self.infoSchools.push({ status: 400 })
                } else {
                    SweetAlert.swal("อัพเดทข้อมูลเรียบร้อยแล้ว!", "This data has been updated.", "success")
                    setTimeout(function() {
                        location.reload()
                    }, 1000)
                }
            })

        }
        // data chart -------------------------
        $scope.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"];
        $scope.data = [
            [65, 59, 90, 81, 56, 55, 77]
        ];

    }
})();