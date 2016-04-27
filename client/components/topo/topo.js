angular.module('OpenEXP')
    .directive('bciTopo', function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: './components/topo/topo.html',
            controllerAs: '$ctrl',
            bindToController: true,
            controller: function () {

                var $ctrl = this;

                $ctrl.getClass = function(index){
                    return 'topoplot-u' + index;
                };

                $ctrl.getColor = function(index, pixel, grid) {
                    var min = Math.min.apply(Math, grid);
                    var max = Math.max.apply(Math, grid);
                    var f = chroma.scale('Spectral').domain([min, max]);
                    return {'background-color': f(pixel)}
                };

            }
        }
    });
