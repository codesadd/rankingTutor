(function() {
    angular
        .module('funfun')
        .controller('infoSchoolCtrl', [
            'dataService', '$location', 'localStorageService', '$scope', infoSchoolCtrl
        ]);

    function infoSchoolCtrl(dataService, $location, localStorageService, $scope) {
        var self = this;
        var param
        self.goingToCoursePage = goingToCoursePage
        self.updateLike = updateLike
        self.schoolSelected = []
        self.courses = []
        $scope.currentPage = 1
        $scope.pageSize = 5

        getSchool(localStorageService.get("schoolSelectId"))
        getInfoCourse(localStorageService.get("schoolSelectId"))

        function getSchool(id) {
            dataService
                .loadInfoSchool(id)
                .then(function(school) {
                    self.schoolSelected = school
                })
        }

        function getInfoCourse(id) {
            dataService
                .loadAllCourse(id)
                .then(function(snp) {
                    getInfoChart(snp.resultPoll[0])
                    self.courses = []
                    var keys = Object.keys(snp.courses)
                    keys.sort()
                    keys.forEach(function(item) {
                        if (snp.courses[item].value.students == undefined) {
                            var item = {
                                courseId: snp.courses[item].id,
                                std_length: 0,
                                value: snp.courses[item].value
                            }
                        } else {
                            var item = {
                                courseId: snp.courses[item].id,
                                std_length: Object.keys(snp.courses[item].value.students).length,
                                value: snp.courses[item].value
                            }
                        }
                        self.courses.push(item)
                    })
                    console.log(self.courses);
                })
        }

        function updateView(param) {
            dataService.updateViewSchool(param, localStorageService.get("schoolSelectId"))
        }

        function updateLike() {
            console.log(self.schoolSelected[0].value.like);
            dataService.updateLikeSchool(param, localStorageService.get("schoolSelectId"))
        }

        function getInfoChart(poll) {
            r1 = parseInt((poll.p1 / (5 * poll.n)) * 100)
            r2 = parseInt((poll.p2 / (5 * poll.n)) * 100)
            r3 = parseInt((poll.p3 / (5 * poll.n)) * 100)
            r4 = parseInt((poll.p4 / (5 * poll.n)) * 100)
            r5 = parseInt((poll.p5 / (5 * poll.n)) * 100)
            r6 = parseInt((poll.p6 / (5 * poll.n)) * 100)
                // self.labels = ["Location", "document", "Designing", "Coding", "Cycling", "test"]
                // self.data = [
                //     [80, 93, 84, 89, 86, 85]
                // ]

            self.labels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling"];

            self.data = [
                [r1, r2, r3, r4, r5, r6]
            ];
            self.options = {
                responsive: true,
                maintainAspectRatio: true,
                barDatasetSpacing: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5
            }
            console.log(self.data);
        }

        function goingToCoursePage(id) {
            localStorageService.set("courseSelectId", id)
            $location.path("/info-course")
        }
    }
})();
