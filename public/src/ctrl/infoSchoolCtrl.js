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
        self.schoolSelected = []
        self.courses = []
        $scope.currentPage = 1
        $scope.pageSize = 5
        
        getInfoChart()
        getSchool(localStorageService.get("schoolSelectId"))
        getInfoCourse(localStorageService.get("schoolSelectId"))

        function getSchool(id) {
            dataService
                .loadInfoSchool(id)
                .then(function(school) {
                    self.schoolSelected = school
                    updateView(param = {
                        view: self.schoolSelected.view + 1
                    })
                })
        }

        function getInfoCourse(id) {
            dataService
                .loadAllCourse(id)
                .then(function(courses) {
                    self.courses = courses
                })
        }

        function updateView(param) {
            dataService.updateView(param, localStorageService.get("schoolSelectId"))
        }

        function getInfoChart() {
            self.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"]
            self.data = [
                [65, 59, 90, 81, 56, 55, 77]
            ]
        }

        function goingToCoursePage(id) {
            localStorageService.set("courseSelectId", id)
            $location.path("/info-course")
        }
    }
})();