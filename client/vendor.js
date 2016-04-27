window.jQuery = window.$ = require("jquery");

module.exports = function() {
    // CSS
    require('style!css!bootstrap/dist/css/bootstrap.min.css');

    // JS
    require('script!angular/angular.js');
    // VERSIONS ARE NO GOOD
    //require('script!chart.js/Chart.js');
    //require('script!angular-chartjs/dist/angular-chartjs.js');
    require('script!angular-ui-router/release/angular-ui-router.js');
    require('script!bootstrap/dist/js/bootstrap.min.js');
    require('script!jspsych/jspsych.js');
    require('script!jspsych/plugins/jspsych-text.js');
    require('script!jspsych/plugins/jspsych-single-stim.js');
}();
