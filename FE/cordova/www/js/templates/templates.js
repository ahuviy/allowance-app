angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/addChildOverlay.html',
    "<ion-modal-view ng-controller=\"addChildOverlayCtrl as vm\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\r" +
    "\n" +
    "		<h1 class=\"title\">{{vm.title}}</h1>\r" +
    "\n" +
    "		<button class=\"button button-clear button-positive\"\r" +
    "\n" +
    "				ng-click=\"vm.cancelModal()\">\r" +
    "\n" +
    "			Cancel\r" +
    "\n" +
    "		</button>\r" +
    "\n" +
    "	</ion-header-bar>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "		 <form novalidate\r" +
    "\n" +
    "			   name=\"addChildForm\"\r" +
    "\n" +
    "			   ng-submit=\"vm.submitChild()\">\r" +
    "\n" +
    "			<div class=\"list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Name</span>\r" +
    "\n" +
    "					<input type=\"text\"\r" +
    "\n" +
    "						   placeholder=\"Name\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.name\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Password</span>\r" +
    "\n" +
    "					<input type=\"password\"\r" +
    "\n" +
    "						   placeholder=\"Password\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.password\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Account No.</span>\r" +
    "\n" +
    "					<input disabled\r" +
    "\n" +
    "						   type=\"number\"\r" +
    "\n" +
    "						   placeholder=\"Account No.\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.accountNo\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Monthly Interest (%)</span>\r" +
    "\n" +
    "					<input type=\"number\"\r" +
    "\n" +
    "						   placeholder=\"Monthly Interest (%)\"\r" +
    "\n" +
    "						   min=\"0\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.interestRate\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Monthly Rebate (%)</span>\r" +
    "\n" +
    "					<input type=\"number\"\r" +
    "\n" +
    "						   placeholder=\"Monthly Rebate (%)\"\r" +
    "\n" +
    "						   min=\"0\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.rebateRate\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<button type=\"submit\"\r" +
    "\n" +
    "					class=\"button button-block button-positive\"\r" +
    "\n" +
    "					ng-disabled=\"addChildForm.$invalid\">\r" +
    "\n" +
    "				{{vm.creatingNewChild ? 'Create' : 'Update'}}\r" +
    "\n" +
    "			</button>\r" +
    "\n" +
    "		</form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<button class=\"button button-block button-assertive\"\r" +
    "\n" +
    "				ng-hide=\"vm.creatingNewChild\"\r" +
    "\n" +
    "				ng-click=\"vm.deleteChild()\">\r" +
    "\n" +
    "			Delete\r" +
    "\n" +
    "		</button>\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/busyIndicatorDrtv.html',
    "<div ng-hide=\"show === 0\" class=\"busy-indicator\">\n" +
    "	<div class=\"centered-screen\">\n" +
    "		<img src=\"assets/images/busyIndicator.gif\"/>\n" +
    "	</div>\n" +
    "	<div ng-show=\"progress\" class=\"progress-number\" ng-bind=\"progress + '%' \"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/child.html',
    "<ion-view view-title=\"Expanded View\">\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "		<div class=\"list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<!-- SUMMARY -->\r" +
    "\n" +
    "			<div class=\"item item-divider\">Summary for {{vm.child.name}}</div>\r" +
    "\n" +
    "			<ul class=\"list\">\r" +
    "\n" +
    "				<li class=\"item\">\r" +
    "\n" +
    "					Current Balance\r" +
    "\n" +
    "					<strong class=\"item-note\" ng-class=\"{'balanced':vm.child.balance>=0, 'assertive':vm.child.balance<0}\">\r" +
    "\n" +
    "							{{vm.child.balance}}\r" +
    "\n" +
    "					</strong>\r" +
    "\n" +
    "				</li>\r" +
    "\n" +
    "				<li class=\"item\">\r" +
    "\n" +
    "					Monthly Allowance\r" +
    "\n" +
    "					<strong class=\"item-note\" ng-class=\"{'positive':vm.child.allowance}\">\r" +
    "\n" +
    "						{{vm.child.allowance ? vm.child.allowanceAmount : 'none'}}\r" +
    "\n" +
    "					</strong>\r" +
    "\n" +
    "				</li>\r" +
    "\n" +
    "			</ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<div class=\"item item-divider\">Transactions</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<!-- TRANSACTIONS -->\r" +
    "\n" +
    "			<ul class=\"list\" collection-repeat=\"transaction in vm.transactions | orderBy: '-date'\">\r" +
    "\n" +
    "				<li class=\"item\">\r" +
    "\n" +
    "					<small class=\"ah-gray\">\r" +
    "\n" +
    "						{{transaction.timestamp | date:'dd.MM.yy'}}\r" +
    "\n" +
    "					</small> &nbsp;&nbsp;{{transaction.description}}\r" +
    "\n" +
    "					<strong\r" +
    "\n" +
    "						class=\"item-note\"\r" +
    "\n" +
    "						ng-class=\"{'balanced':transaction.type==='deposit', 'assertive':transaction.type==='withdraw'}\">\r" +
    "\n" +
    "							<span ng-show=\"transaction.type==='withdraw'\">-</span>{{transaction.sum}}\r" +
    "\n" +
    "					</strong>\r" +
    "\n" +
    "				</li>\r" +
    "\n" +
    "			</ul>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<!-- THE FOOTER WITH THE BUTTONS -->\r" +
    "\n" +
    "	<div class=\"bar bar-footer bar-stable\">\r" +
    "\n" +
    "		<div class=\"button-bar\">\r" +
    "\n" +
    "			<a class=\"button button-clear button-balanced\" ng-click=\"vm.openDepositModal()\">Deposit</a>\r" +
    "\n" +
    "			<a class=\"button button-clear button-assertive\" ng-click=\"vm.openWithdrawModal()\">Withdraw</a>\r" +
    "\n" +
    "			<a class=\"button button-clear button-calm icon ion-gear-a\" ng-click=\"vm.openAddChildModal()\"></a>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('views/depositOverlay.html',
    "<ion-modal-view ng-controller=\"depositOverlayCtrl as vm\">\r" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\r" +
    "\n" +
    "		<h1 class=\"title\">\r" +
    "\n" +
    "			{{vm.dataToSubmit.depositType === 'single' ? 'Make a Deposit' : 'Change Allowance'}}\r" +
    "\n" +
    "		</h1>\r" +
    "\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"dismissModal()\">Cancel</button>\r" +
    "\n" +
    "	</ion-header-bar>\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "		<form novalidate name=\"depositForm\"\r" +
    "\n" +
    "			  ng-submit=\"vm.submitDeposit()\">\r" +
    "\n" +
    "			<div class=\"list\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">\r" +
    "\n" +
    "						{{vm.dataToSubmit.depositType === 'single' ? 'Amount to Deposit' : 'Allowance Amount'}}\r" +
    "\n" +
    "					</span>\r" +
    "\n" +
    "					<input type=\"number\"\r" +
    "\n" +
    "						   min=\"0\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.sum\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Description</span>\r" +
    "\n" +
    "					<input type=\"text\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.description\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-select\">\r" +
    "\n" +
    "					<div class=\"input-label\">\r" +
    "\n" +
    "						Type of Deposit\r" +
    "\n" +
    "					</div>\r" +
    "\n" +
    "					<select ng-model=\"vm.dataToSubmit.depositType\">\r" +
    "\n" +
    "						<option ng-repeat=\"type in vm.selectDepositType\"\r" +
    "\n" +
    "								value=\"{{type.value}}\">\r" +
    "\n" +
    "							{{type.label}}\r" +
    "\n" +
    "						</option>\r" +
    "\n" +
    "					</select>\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<button class=\"button button-block button-balanced\"\r" +
    "\n" +
    "					ng-disabled=\"depositForm.$invalid\">\r" +
    "\n" +
    "				{{vm.dataToSubmit.depositType === 'single' ? 'Deposit' : 'Change Allowance'}}\r" +
    "\n" +
    "			</button>\r" +
    "\n" +
    "		</form>\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/errorOverlay.html',
    "<ion-modal-view>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\r" +
    "\n" +
    "		<h1 class=\"title\">Error</h1>\r" +
    "\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"dismissModal()\">Cancel</button>\r" +
    "\n" +
    "	</ion-header-bar>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "		<div class=\"card\">\r" +
    "\n" +
    "			<div class=\"item item-divider assertive\">\r" +
    "\n" +
    "				An error occured\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "			<div class=\"item item-text-wrap\">\r" +
    "\n" +
    "				{{errorData}}\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/home.html',
    "<ion-view view-title=\"My Children\">\r" +
    "\n" +
    "	<ion-content class=\"padding\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"list\">\r" +
    "\n" +
    "			<div ng-repeat=\"child in vm.children track by child._id\">\r" +
    "\n" +
    "				<a class=\"item\" ui-sref=\"child({childId: child._id})\">\r" +
    "\n" +
    "					{{::child.name}}\r" +
    "\n" +
    "				</a>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<button class=\"button button-icon icon ion-ios-plus-outline\"\r" +
    "\n" +
    "				ng-click=\"vm.openAddChildModal()\"></button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('views/login.html',
    "<ion-view view-title=\"Login\">\r" +
    "\n" +
    "	<ion-content class=\"padding\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<form novalidate\r" +
    "\n" +
    "			   name=\"loginForm\"\r" +
    "\n" +
    "			   ng-submit=\"vm.submitLogin(vm.dataToSubmit)\">\r" +
    "\n" +
    "			<div class=\"list\">\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Username</span>\r" +
    "\n" +
    "					<input type=\"text\"\r" +
    "\n" +
    "						   placeholder=\"Username\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.username\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Password</span>\r" +
    "\n" +
    "					<input type=\"password\"\r" +
    "\n" +
    "						   placeholder=\"Password\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.password\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				<ion-checkbox ng-model=\"vm.createNewAccount\">\r" +
    "\n" +
    "					Create New Account\r" +
    "\n" +
    "				</ion-checkbox>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<button type=\"submit\"\r" +
    "\n" +
    "					class=\"button button-block button-positive\"\r" +
    "\n" +
    "					ng-disabled=\"loginForm.$invalid\">\r" +
    "\n" +
    "				Sign-in\r" +
    "\n" +
    "			</button>\r" +
    "\n" +
    "		</form>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div class=\"list\">\r" +
    "\n" +
    "			<label class=\"item assertive\" ng-show=\"vm.error\">\r" +
    "\n" +
    "				Wrong username or password\r" +
    "\n" +
    "			</label>\r" +
    "\n" +
    "		</div>\r" +
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


  $templateCache.put('views/withdrawOverlay.html',
    "<ion-modal-view ng-controller=\"withdrawOverlayCtrl as vm\">\r" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\r" +
    "\n" +
    "		<h1 class=\"title\">Make a Withdraw</h1>\r" +
    "\n" +
    "		<button class=\"button button-clear button-positive\"\r" +
    "\n" +
    "				ng-click=\"dismissModal()\">Cancel</button>\r" +
    "\n" +
    "	</ion-header-bar>\r" +
    "\n" +
    "	<ion-content>\r" +
    "\n" +
    "		<form novalidate name=\"withdrawForm\"\r" +
    "\n" +
    "			  ng-submit=\"vm.submitWithdraw()\">\r" +
    "\n" +
    "			<div class=\"list\">\r" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Amount to Withdraw</span>\r" +
    "\n" +
    "					<input type=\"number\"\r" +
    "\n" +
    "						   min=\"1\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.sum\"\r" +
    "\n" +
    "						   ng-required=\"true\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\r" +
    "\n" +
    "					<span class=\"input-label\">Description</span>\r" +
    "\n" +
    "					<input type=\"text\"\r" +
    "\n" +
    "						   ng-model=\"vm.dataToSubmit.description\">\r" +
    "\n" +
    "				</label>\r" +
    "\n" +
    "			</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "			<button class=\"button button-block button-assertive\"\r" +
    "\n" +
    "					ng-disabled=\"withdrawForm.$invalid\">\r" +
    "\n" +
    "				Withdraw\r" +
    "\n" +
    "			</button>\r" +
    "\n" +
    "		</form>\r" +
    "\n" +
    "	</ion-content>\r" +
    "\n" +
    "</ion-modal-view>"
  );

}]);
