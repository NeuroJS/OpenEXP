var dsp = require('dsp.js');
var topogrid = require('topogrid');

angular.module('OpenEXP')
    .controller('DashboardCtrl', ['$scope', '$timeout', 'boardFactory', ($scope, $timeout, boardFactory) => {

        $scope.board = boardFactory.board;

        $scope.publish = boardFactory.publish;
        $scope.unpublish = boardFactory.unpublish;

        var bins = 128; // Approx .5 second
        var bufferSize = 128;
        var windowRefreshRate = 8;
        var windowSize = bins / windowRefreshRate;
        var sampleRate = 250;
        var sampleNumber = 0;
        var signals = [[], [], [], [], [], [], [], []];

        var timeSeriesWindow = 5; // in seconds
        var timeSeriesRate = 25; // skips every 10 samples
        var seriesNumber = 0;
        var timeSeries = new Array(8).fill([]); // 8 channels

        // the parameters for the grid [x,y,z] where x is the min of the grid, y is the
        // max of the grid and z is the number of points
        var grid_params = [0, 10, 11];
        var pos_x = [3, 7, 2, 8, 0, 10, 3, 7]; // x coordinates of the data
        var pos_y = [0, 0, 3, 3, 8, 8, 10, 10]; // y coordinates of the data
        // var data = [10,0,0,0,0,0,-10,30,25]; // the data values

        timeSeries = timeSeries.map(function (channel) {
            return new Array((sampleRate * timeSeriesWindow) / timeSeriesRate).fill(0)
        });

        boardFactory.board.on('sample', function (sample) {
            //console.log('sample', sample);
            sampleNumber++;

            Object.keys(sample.channelData).forEach(function (channel, i) {
                signals[i].push(sample.channelData[channel]);
            });

            if (sampleNumber === bins) {

                var spectrums = [[], [], [], [], [], [], [], []];

                signals.forEach(function (signal, index) {
                    var fft = new dsp.FFT(bufferSize, sampleRate);
                    fft.forward(signal);
                    spectrums[index] = parseObjectAsArray(fft.spectrum);
                    spectrums[index] = voltsToMicrovolts(spectrums[index], true);
                });

                var scaler = sampleRate / bins;

                var labels = new Array(bins / 2).fill()
                    .map(function (x, i) {
                        return Math.ceil(i * scaler);
                    });

                var grid = topogrid.create(pos_x, pos_y, sample.channelData, grid_params);

                $timeout(function () {
                    $scope.frequencyData = spectrums;
                    $scope.frequencyLabels = labels.map(function (label, i) {
                        return i % 10 === 0 ? label : '';
                    });
                    $scope.gridData = [].concat.apply([], grid);
                });

                signals = signals.map(function (channel) {
                    return channel.filter(function (signal, index) {
                        return index > (windowSize - 1);
                    });
                });

                sampleNumber = bins - windowSize;

            }

            seriesNumber++;

            // Time Series
            if (seriesNumber === timeSeriesRate) {

                timeSeries.forEach(function (channel, index) {
                    channel.push(voltsToMicrovolts(sample.channelData[index]));
                    channel.shift();
                });

                $timeout(function () {
                    $scope.timeData = timeSeries;
                    $scope.timeLabels = new Array((sampleRate * timeSeriesWindow) / timeSeriesRate).fill(0)
                });


                seriesNumber = 0;
            }


        });

        function voltsToMicrovolts(volts, log) {
            if (!Array.isArray(volts)) volts = [volts];
            return volts.map(function (volt) {
                return log ? Math.log10(Math.pow(10, 6) * volt) : Math.pow(10, 6) * volt;
            });
        }

        function parseObjectAsArray(obj) {
            var array = [];
            Object.keys(obj).forEach(function (key) {
                array.push(obj[key]);
            });
            return array;
        }

    }]);
