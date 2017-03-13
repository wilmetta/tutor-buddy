angular.module('batches', ['ngMaterial', 'ngRoute', 'ngMdIcons', 'material.components.expansionPanels', 'apiConnector'])

    // Routes for this module
    .config(function($routeProvider) {
        $routeProvider.when('/batches', {
            templateUrl: 'dashboard/components/batches/batchesView.html',
            controller: 'batchesController',
            title: "Batches"
        });
    })

    // Controllers
    .controller('batchesController', function($scope, tbBatchService, tbUserService, $mdDialog) {
        // Load the list of batches
        refreshBatchList($scope, tbBatchService);

        // Handle click of the 'Create batch' button
        $scope.createBatch = function(ev) {
            $mdDialog.show({
                    controller: NewBatchDialogController,
                    templateUrl: 'dashboard/components/batches/newBatchDialog.template.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false
                })
                .then(function(data) {
                    $scope.isLoading = true;
                    var userTutorId = tbUserService.getCurrentUser().tutor_profile_id;
                    tbBatchService.createBatch(userTutorId, data).then(function() {
                        refreshBatchList($scope, tbBatchService);
                    });
                }, function() {
                    //Cancel was pressed
                });
        };

        //Handle deletion of batches
        $scope.deleteBatch = function(ev, batch) {
            var confirmDialog = $mdDialog.confirm()
                .title('Delete Batch')
                .textContent('The batch \'' + batch.name + '\' will permanently be deleted. Are you sure you want to proceed?')
                .ariaLabel('Delete Batch ' + batch.name)
                .targetEvent(ev)
                .ok('Yes, delete this batch')
                .cancel('Cancel');

            $mdDialog.show(confirmDialog).then(function() {
                // User confirmed deletion
                $scope.isLoading = true;
                tbBatchService.deleteBatch(batch.id).then(function() {
                    //Batch has been deleted. Refresh the list of batches now
                    refreshBatchList($scope, tbBatchService);
                });
            });
        };

        // Controller for the 'Create batch' controller
        function NewBatchDialogController($scope, $mdDialog) {
            var controller = this;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.form = {};
            $scope.done = function(batchForm) {
                $mdDialog.hide($scope.batch);
            };
        }

        // ----- PRIVATE FUNCTIONS ------ //
        function refreshBatchList($scope, tbBatchService) {
            // Load the list of batches
            $scope.isLoading = true;
            tbBatchService.getBatchesForUser().then(function(data) {
                $scope.batches = data;
                $scope.isLoading = false;
            });
        }
    });