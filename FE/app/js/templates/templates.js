angular.module('allowance').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/parent-deposit.html',
    "<ion-modal-view>\r" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\r" +
    "\n" +
    "		<h1 class=\"title\">Make a Deposit</h1>\r" +
    "\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"closeDepositModal()\">Cancel</button>\r" +
    "\n" +
    "	</ion-header-bar>\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<label class=\"item item-input item-stacked-label\">\r" +
    "\n" +
    "				<span class=\"input-label\">Amount to Deposit</span>\r" +
    "\n" +
    "				<input type=\"number\">\r" +
    "\n" +
    "			</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<ion-checkbox>Set as Monthly Allowance</ion-checkbox>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<button class=\"button button-block button-balanced\" ng-click=\"\">\r" +
    "\n" +
    "			Deposit\r" +
    "\n" +
    "		</button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/parentsChild.html',
    "<ion-view view-title=\"Expanded View\">\r" +
    "\n" +
    "	<ion-content class=\"padding\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"card\">\r" +
    "\n" +
    "			<div class=\"item item-divider\">\r" +
    "\n" +
    "				{{vm.child.name}}\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "			<div class=\"item item-text-wrap\">\r" +
    "\n" +
    "				<ul class=\"list\">\r" +
    "\n" +
    "					<li class=\"item\">\r" +
    "\n" +
    "						Current Balance\r" +
    "\n" +
    "						<span class=\"badge\" ng-class=\"{'badge-balanced':vm.child.balance>=0, 'badge-assertive':vm.child.balance<0}\">\r" +
    "\n" +
    "							{{vm.child.balance}}\r" +
    "\n" +
    "						</span>\r" +
    "\n" +
    "					</li>\r" +
    "\n" +
    "					<li class=\"item\" ng-if=\"vm.child.allowance\">\r" +
    "\n" +
    "						Monthly Allowance\r" +
    "\n" +
    "						<span class=\"badge badge-positive\">{{vm.child.allowanceAmount}}</span>\r" +
    "\n" +
    "					</li>\r" +
    "\n" +
    "				</ul>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div class=\"button-bar\">\r" +
    "\n" +
    "			<a class=\"button button-balanced\" ng-click=\"openDepositModal()\">Deposit</a>\r" +
    "\n" +
    "			<a class=\"button button-assertive\" ng-click=\"\">Withdraw</a>\r" +
    "\n" +
    "			<a class=\"button button-calm icon ion-gear-a\" ng-click=\"\"></a>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('views/tab-child.html',
    "<ion-view view-title=\"Child\">\n" +
    "	<ion-content>\n" +
    "		<div class=\"bar bar-header\">\n" +
    "			<h1 class=\"title\">TODO</h1>\n" +
    "		</div>\n" +
    "	</ion-content>\n" +
    "</ion-view>"
  );


  $templateCache.put('views/tab-parent.html',
    "<ion-view view-title=\"My Children\">\n" +
    "	<ion-content class=\"padding\">\n" +
    "\n" +
    "		<div class=\"list\">\n" +
    "			<div ng-repeat=\"child in vm.children\">\n" +
    "				<a class=\"item\" ui-sref=\"tab.parentsChild({childId: child._id})\">\n" +
    "					{{child.name}}\n" +
    "				</a>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<button class=\"button button-icon icon ion-ios-plus-outline\"></button>\n" +
    "\n" +
    "	</ion-content>\n" +
    "</ion-view>"
  );


  $templateCache.put('views/tabs.html',
    "<!--\n" +
    "Create tabs with an icon and label, using the tabs-positive style.\n" +
    "Each tab's child <ion-nav-view> directive will have its own\n" +
    "navigation history that also transitions its views in and out.\n" +
    "-->\n" +
    "<ion-tabs class=\"tabs-icon-top tabs-color-active-positive\">\n" +
    "\n" +
    "	<!-- Parent tab -->\n" +
    "	<ion-tab title=\"Parent\" icon=\"ion-person\" ui-sref=\"tab.parent\">\n" +
    "		<ion-nav-view name=\"parent-tab\"></ion-nav-view>\n" +
    "	</ion-tab>\n" +
    "\n" +
    "	<!-- Child tab -->\n" +
    "	<ion-tab title=\"Child\" icon=\"ion-ios-body\" ui-sref=\"tab.child\">\n" +
    "		<ion-nav-view name=\"child-tab\"></ion-nav-view>\n" +
    "	</ion-tab>\n" +
    "\n" +
    "</ion-tabs>"
  );

}]);
