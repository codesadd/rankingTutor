(function() {

    angular
        .module('funfun')
        .controller('ProfileSchoolCtrl', [
            '$scope', 'localStorageService', '$firebaseAuth', '$location', '$firebaseObject', 'ChartJs', 'dataService',
            ProfileSchoolCtrl
        ]);


    function ProfileSchoolCtrl($scope, localStorageService, $firebaseAuth, $location, $firebaseObject, ChartJs, dataService) {
        var self = this;
        self.user = [ ];
        self.school = [ ];
        self.selectedId = null;
        self.updateInfoSchool = updateInfoSchool;
        var obj ={
          nameSchools: "Dota2",
          addressSchools: "43/2 test Adrress สนันดเวเสกาด",
          tels: "081-857-8334",
          hello: "Heloo World"
        };

        $firebaseAuth().$onAuthStateChanged(function(user) {
            if (user == null || localStorageService.get("status") != "school") {
                $location.path('/');
            } else {
                dataService.loadSchool(user.uid).then(function(snp) { 
                  self.school = snp;
                });
            }
        });
        function updateInfoSchool(param) {
          console.log(param,self.school.$id);
          dataService.updateSchoolInfo(param, self.school.$id);
          
        }
        // data chart -------------------------
        $scope.labels = ["Eating", "Location", "document", "Designing", "Coding", "Cycling", "test"];
        $scope.data = [
            [65, 59, 90, 81, 56, 55, 77]
        ];

    }
})();