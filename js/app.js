'use strict';
angular.module('Taotaobao', [])
	.controller('Ctrl', ['$scope', '$http', function($scope, $http) {

		// initialization
		$scope.currencyType = '人民幣';
		$scope.currencyRate = 5.15;
		$scope.unitPrice = 47;
		$scope.shipping = 16;
		$scope.purchases = [];

		// automatically get currency rate
		$scope.getCurrencyRate = function() {
			$http({
				method: 'JSONP',
				url: 'http://apilayer.net/api/live?access_key=225131e0a87bf7c13d5761bee7abe195'
			})
			.success(function(data, status) {
				alert(data.quotes.USDAED);
				$scope.currencyStatus = '更新完成！';
				$scope.currencyRate = data;
				$scope.showCurrencyTip = true;
			})
			.error(function(data, status) {
				alert(data.quotes.USDAED);
				$scope.currencyStatus = '更新失敗';
				$scope.showCurrencyTip = false;
			});
		};

		// change currency rate
		$scope.changeCurrencyType = function() {
			if ($scope.disabledSetCurrencyRate) {
				$scope.currencyType = '新台幣';
				$scope.currencyRate = 1;
				$scope.unitPrice = 800;
				$scope.shipping = 80;
				$scope.shippingMethod = $scope.shippingMethods[2];
			} else {
				$scope.currencyType = '人民幣';
				$scope.currencyRate = 4.8;
				$scope.unitPrice = 47;
				$scope.shipping = 16;
				$scope.shippingMethod = $scope.shippingMethods[0];
			};
		};

		// defines charge methods from portage
		$scope.shippingMethods = [{
			name: '每公斤',
			value: 0,
			hide: 0,
			disabledSetUnitWeight: 0
		}, {
			name: '每件',
			value: 1,
			hide: 0,
			disabledSetUnitWeight: 1
		}, {
			name: '總運費（忽略重量或件數）',
			value: 2,
			hide: 0,
			disabledSetUnitWeight: 1
		}, {
			name: '不考慮運費',
			value: 3,
			hide: 1,
			disabledSetUnitWeight: 1
		}];
		$scope.shippingMethod = $scope.shippingMethods[0];

		// calculate the price
		$scope.price = function() {
			return $scope.number * $scope.unitPrice * $scope.currencyRate;
		};

		// calculate the portage
		$scope.portage = function() {
			switch ($scope.shippingMethod.value) {
			case 0:
				var portage = $scope.shipping * $scope.currencyRate * $scope.number * $scope.unitWeight / 1000;
				break;
			case 1:
				var portage = $scope.shipping * $scope.currencyRate * $scope.number;
				break;
			case 2:
				var portage = $scope.shipping * $scope.currencyRate;
				break;
			case 3:
				var portage = 0;
				break;
			}
			return portage;
		};

		// add a purchase to purchases list
		$scope.addPurchase = function() {
			$scope.purchases.push({
				removed: false,
				name: $scope.name,
				unitPrice: $scope.unitPrice * $scope.currencyRate,
				number: $scope.number,
				unitWeight: $scope.unitWeight / 1000,
				shipping: $scope.shipping * $scope.currencyRate,
				shippingMethod: $scope.shippingMethod,
				currencyRate: $scope.currencyRate,
				price: $scope.price(),
				portage: $scope.portage()
			});
		};

		// archive the purchase from purchases list
		$scope.archive = function() {
			var oldPurchase = $scope.purchases;
			$scope.purchases = [];
			angular.forEach(oldPurchase, function(purchase) {
				if (!purchase.removed) $scope.purchases.push(purchase);
			});
		};

		// the remain count
		$scope.remaining = function() {
			var count = 0;
			angular.forEach($scope.purchases, function(purchase) {
				count += purchase.removed ? 0 : 1;
			});
			return count;
		};

		// calculate the portage sum
		$scope.portageSum = function() {
			var count = 0;
			angular.forEach($scope.purchases, function(purchase) {
				if (!purchase.removed) count += purchase.portage;
			});
			return count;
		};

		// calculate price sum
		$scope.priceSum = function() {
			var count = 0;
			angular.forEach($scope.purchases, function(purchase) {
				if (!purchase.removed) count += purchase.price;
			});
			return count;
		};

		// calculate number sum
		$scope.numberSum = function() {
			var count = 0;
			angular.forEach($scope.purchases, function(purchase) {
				if (!purchase.removed) count += purchase.number;
			});
			return count;
		};
	}])