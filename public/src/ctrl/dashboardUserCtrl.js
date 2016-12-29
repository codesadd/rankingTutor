(function() {
    angular
        .module('funfun')
        .controller('dashboardUserCtrl', [
            'dataService', '$location', '$http', '$scope', 'localStorageService', '$firebaseAuth',
            dashboardUserCtrl
        ]);

    function dashboardUserCtrl(dataService, $location, $http, $scope, localStorageService, $firebaseAuth) {
        var self = this;
        self.course = []
        self.user = []
        self.ckeckPending = ckeckPending
        self.ckeckAccepted = ckeckAccepted
        self.doingPoll = doingPoll

        $firebaseAuth().$onAuthStateChanged(function(user) {
            if (user == null) {
                $location.path('/');
            } else {
                dataService.getUser(user.uid).then(function(snp) {
                    self.user = snp[0]
                    if (snp[1] == undefined) {
                        console.log("ยังไม่มีวิชาที่ลงเรียน่")
                    } else {
                        self.course = snp[1].course
                        console.log(self.course);
                    }
                })
            }
        });

        function ckeckPending(param) {
            return (param == "pending" ? true : false)
        }

        function ckeckAccepted(param) {
            return (param == "accepted" ? true : false)
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



    }
})();
