(function() {
    angular.module('batchDetails', ['ngMaterial', 'ngRoute', 'ngMdIcons', 'material.components.expansionPanels', 'apiConnector'])
        // Routes for this module
        .config(function($routeProvider) {
            $routeProvider.when('/batch/:batchId', {
                templateUrl: 'dashboard/components/batch-details/batchDetailsView.html',
                controller: 'batchDetailsController',
                title: "Batch Details"
            });
        })

        .controller('batchDetailsController', function($scope, $location, tbBatchService, $mdDialog, $routeParams) {
            // Initialize scope variables
            $scope.currentBatchId = $routeParams.batchId;
            $scope.selectedTabIndex = 0;

            tbBatchService.getStudentsForBatch($scope.currentBatchId).then(function(students) {
                $scope.batchStudents = students;
            });

            //Handle deletion of batches
            $scope.deleteBatch = function(ev) {
                var confirmDialog = $mdDialog.confirm()
                    .title('Delete Batch')
                    .textContent('Are you sure you want to delete this batch? There\'s no going back!')
                    .ariaLabel('Delete Batch')
                    .targetEvent(ev)
                    .ok('Yes, delete this batch')
                    .cancel('Cancel');

                $mdDialog.show(confirmDialog).then(function() {
                    // User confirmed deletion
                    tbBatchService.deleteBatch($scope.currentBatchId).then(function() {
                        $location.path('/batches');
                    });
                });
            };
        })

        // Enum for possible tabs
        .constant('BatchDetailsTab', {
            Students: 1,
            Scribble: 2,
            Attendance: 3,
            Payments: 4
        });
})();