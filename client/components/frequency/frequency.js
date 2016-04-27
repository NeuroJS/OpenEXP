angular.module('OpenEXP')
    .directive('bciFrequency', function () {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                labels: '='
            },
            templateUrl: './components/frequency/frequency.html',
            controllerAs: '$ctrl',
            bindToController: true,
            controller: function () {

                var $ctrl = this;

                $ctrl.options = {
                    responsive: true,
                    animation: true,
                    animationSteps: 5
                };

                $ctrl.colors = [
                    { strokeColor: 'rgba(112,185,252,1)' },
                    { strokeColor: 'rgba(116,150,161,1)' },
                    { strokeColor: 'rgba(162,86,178,1)' },
                    { strokeColor: 'rgba(144,132,246,1)' },
                    { strokeColor: 'rgba(138,219,229,1)' },
                    { strokeColor: 'rgba(232,223,133,1)' },
                    { strokeColor: 'rgba(148,159,177,1)' },
                    { strokeColor: 'rgba(182,224,53,1)' }
                ];

                $ctrl.series = [
                    'Channel 1',
                    'Channel 2',
                    'Channel 3',
                    'Channel 4',
                    'Channel 5',
                    'Channel 6',
                    'Channel 7',
                    'Channel 8'
                ];

            }
        }
    });
