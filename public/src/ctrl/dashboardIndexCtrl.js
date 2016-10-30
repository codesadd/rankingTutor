(function() {
    angular
        .module('funfun')
        .controller('dashboardIndexCtrl', [
            'dataService', '$location','localStorageService',
            dashboardIndexCtrl
        ]);

    function dashboardIndexCtrl(dataService, $location, localStorageService) {
        var self = this;
        self.shools = [];
        self.goToSchoolPage = goToSchoolPage;
        dataService
            .loadAllSchools()
            .then(function(schools) {
                self.schools = schools;
                console.log(self.schools);
            })

        function goToSchoolPage(id) {
            localStorageService.set("schoolSelectId", id);
            $location.path("/info-school");
        }
    }
})();