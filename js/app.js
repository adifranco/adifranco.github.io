(function() {

    'use strict';

    angular
        .module('portfolio', [])
        .filter('unique', function () {
            return function (items, filterOn) {
                if (filterOn === false) {
                    return items;
                }
                if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                    var hashCheck = {}, newItems = [];
                    var extractValueToCompare = function (item) {  
                        if (angular.isObject(item) && angular.isString(filterOn)) {
                            return item[filterOn];
                        } else {
                            return item;
                        }
                    };               
                    angular.forEach(items, function (item) {
                        var valueToCheck, isDuplicate = false;
                        for (var i = 0; i < newItems.length; i++) {
                            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate && item[filterOn] != null) {
                            newItems.push(item);
                        }
                    });
                    items = newItems;
                }
                return items;
            };
        })
        .factory('portfolioService', function ($http, $q) {
            return {
                fetchData: fetchData
            };
            function fetchData(file) {
                return $http({
                    method: 'GET',
                    url: 'data/' + file
                })
                .then(readPortfolioSuccess)
                .catch(readPortfolioError)
                function readPortfolioSuccess(response) {
                    return response.data;
                }
                function readPortfolioError(response) {
                    return $q.reject(response);
                }
            } 
        })
        .controller('PortfolioController', function (portfolioService, $q, $filter) {
            var vm = this;  
            vm.site = [];
            vm.categories = [];
            vm.postfolio = [];
            vm.today = new Date();
            vm.year = vm.today.getFullYear().toString();
            vm.selectedProject = {};
            vm.filter = '';         
            activate();
            function activate() {         
                readConfig().then(readPortfolio);
            }   
            function readConfig() {
                return portfolioService.fetchData('config.json')
                .then(readDataSuccess)
                .catch(readDataError);
                function readDataSuccess(data) {
                    vm.site = data;
                    return vm.site;
                }
                function readDataError(response) {   
                    return $q.reject(response);  
                }
            }   
            function readPortfolio() {
                return portfolioService.fetchData('portfolio.json')
                .then(readDataSuccess)
                .catch(readDataError);
                function readDataSuccess(data) {
                    vm.portfolio = data;
                    vm.categories = $filter('unique')(data, 'Category');
                    return vm.site;
                }
                function readDataError(response) {   
                    return $q.reject(response);  
                }
            }     
        });
})();
