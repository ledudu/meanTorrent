(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionController', CollectionController);

  CollectionController.$inject = ['$scope', '$translate', 'getStorageLangService', 'MeanTorrentConfig', 'CollectionsService', 'NotifycationService',
    'DebugConsoleService'];

  function CollectionController($scope, $translate, getStorageLangService, MeanTorrentConfig, CollectionsService, NotifycationService,
                                mtDebug) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;


    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.collectionsListPerPage;
      vm.currentPage = 1;

      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getCollectionsList(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getCollectionsList
     * @param p
     * @param callback
     */
    vm.getCollectionsList = function (p, callback) {
      CollectionsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        keys: vm.search
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        NotifycationService.showErrorNotify(err.data.message, 'COLLECTIONS.LIST_ERROR');
      });
    };


    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    };
  }
}());
