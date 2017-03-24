angular.module('starterApp', [
    'funfun',
    'ngRoute',
    'firebase',
    'LocalStorageModule',
    'chart.js',
    'angularUtils.directives.dirPagination',
    'ngMessages',
    'md.data.table',
    'oitozero.ngSweetAlert',
]).config(ApplicationConfig);

function ApplicationConfig($mdThemingProvider, $mdIconProvider, $routeProvider, localStorageServiceProvider, ChartJsProvider, $httpProvider) {

    $mdIconProvider.defaultIconSet("./assets/svg/avatars.svg", 512)
        .icon("menu", "./assets/svg/menu.svg", 512)
        .icon("cancel", "./assets/svg/ic_cancel_white_48px.svg", 512)
        .icon("more", "./assets/svg/ic_more_vert_white_24px.svg", 512)
        .icon("share", "./assets/svg/share.svg", 512)
        .icon("google_plus", "./assets/svg/google_plus.svg", 512)
        .icon("hangouts", "./assets/svg/hangouts.svg", 512)
        .icon("twitter", "./assets/svg/twitter.svg", 512)
        .icon("setting", "./assets/svg/ic_settings_applications_white_24px.svg", 512)
        .icon("deleteForever", "./assets/svg/ic_delete_forever_white_48px.svg", 512)
        .icon("addTutor", "./assets/svg/ic_perm_contact_calendar_white_48px.svg", 512)
        .icon("edit", "./assets/svg/ic_tune_white_48px.svg", 512)
        .icon("info", "./assets/svg/ic_portrait_white_48px.svg", 512)
        .icon("waiting", "./assets/svg/ic_hourglass_empty_white_48px.svg", 512)
        .icon("done", "./assets/svg/ic_done_white_48px.svg", 512)
        .icon("phone", "./assets/svg/phone.svg", 512);

    $mdThemingProvider.theme('default').primaryPalette('deep-purple').accentPalette('deep-purple');

    $routeProvider.when('/', {
        templateUrl: 'src/template/index.html',
        controller: 'dashboardIndexCtrl as ul'
    }).when('/profile', {
        templateUrl: 'src/template/profile.html',
        controller: 'ProfileCtrl as ul'
    }).when('/profile-school', {
        templateUrl: 'src/template/school/profile-school.html',
        controller: 'ProfileSchoolCtrl as ul'
    }).when('/info-school', {
        templateUrl: 'src/template/school/info-school.html',
        controller: 'infoSchoolCtrl as ul'
    }).when('/info-course', {
        templateUrl: 'src/template/school/info-course.html',
        controller: 'infoCourseCtrl as ul'
    }).when('/dashboard-school', {
        templateUrl: 'src/template/school/dashboard-school.html',
        controller: 'dashboardSchoolCtrl as ul'
    }).when('/manage-school', {
        templateUrl: 'src/template/school/manage-school.html',
        controller: 'manageSchoolCtrl'
    }).when('/register', {
        templateUrl: 'src/template/signup.html',
        controller: 'signUpCtrl as ul'
    }).when('/dashboard-user', {
        templateUrl: 'src/template/student/dashboard-user.html',
        controller: 'dashboardUserCtrl as ul'
    }).when('/doing-poll', {
        templateUrl: 'src/template/student/poll.html',
        controller: 'pollUserCtrl as ul'
    }).when('/dashboard-tutor', {
        templateUrl: 'src/template/tutor/dashboard-tutor.html',
        controller: 'dashboardUserCtrl as ul'
    }).when('/admin', {
        templateUrl: 'src/template/admin.html',
        controller: 'adminCtrl as ul'
    }).otherwise({
        redirectTo: '/'
    });
    // use the HTML5 History API


    localStorageServiceProvider.setPrefix('starterApp');

    ChartJsProvider.setOptions({
        colors: [
            '#97BBCD',
            '#DCDCDC',
            '#F7464A',
            '#46BFBD',
            '#FDB45C',
            '#949FB1',
            '#4D5360'
        ]
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('doughnut', {
        cutoutPercentage: 60
    });
    ChartJsProvider.setOptions('bubble', {
        tooltips: {
            enabled: false
        }
    });
}