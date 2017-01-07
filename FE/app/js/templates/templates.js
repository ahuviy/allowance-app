angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/addChildOverlay.html',
    "<ion-modal-view ng-controller=\"addChildOverlayCtrl as vm\">\n" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\n" +
    "		<h1 class=\"title\">{{::vm.title}}</h1>\n" +
    "		<button class=\"button button-clear button-positive\"\n" +
    "				ng-click=\"vm.cancelModal()\">\n" +
    "			Cancel\n" +
    "		</button>\n" +
    "	</ion-header-bar>\n" +
    "\n" +
    "	<ion-content>\n" +
    "		 <form novalidate\n" +
    "			   name=\"addChildForm\"\n" +
    "			   ng-submit=\"vm.submitChild()\">\n" +
    "			<div class=\"list\">\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">Name</span>\n" +
    "					<input type=\"text\"\n" +
    "						   placeholder=\"Name\"\n" +
    "						   ng-model=\"vm.dataToSubmit.name\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">Password</span>\n" +
    "					<input type=\"password\"\n" +
    "						   placeholder=\"Password\"\n" +
    "						   ng-model=\"vm.dataToSubmit.password\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">Account No.</span>\n" +
    "					<input disabled\n" +
    "						   type=\"number\"\n" +
    "						   placeholder=\"Account No.\"\n" +
    "						   ng-model=\"vm.dataToSubmit.accountNo\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">Monthly Interest (%)</span>\n" +
    "					<input type=\"number\"\n" +
    "						   placeholder=\"Monthly Interest (%)\"\n" +
    "						   min=\"0\"\n" +
    "						   ng-model=\"vm.dataToSubmit.interestRate\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">Monthly Rebate (%)</span>\n" +
    "					<input type=\"number\"\n" +
    "						   placeholder=\"Monthly Rebate (%)\"\n" +
    "						   min=\"0\"\n" +
    "						   ng-model=\"vm.dataToSubmit.rebateRate\">\n" +
    "				</label>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "			<button type=\"submit\"\n" +
    "					class=\"button button-block button-positive\"\n" +
    "					ng-disabled=\"addChildForm.$invalid\">\n" +
    "				{{vm.creatingNewChild ? 'Create' : 'Update'}}\n" +
    "			</button>\n" +
    "		</form>\n" +
    "\n" +
    "		<button class=\"button button-block button-assertive\"\n" +
    "				ng-hide=\"vm.creatingNewChild\"\n" +
    "				ng-click=\"vm.deleteChild()\">\n" +
    "			Delete\n" +
    "		</button>\n" +
    "	</ion-content>\n" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/busyIndicatorDrtv.html',
    "<div\n" +
    "	ng-show=\"vm.show\"\n" +
    "	class=\"busy-indicator-wrapper\">\n" +
    "	<ion-spinner></ion-spinner>\n" +
    "</div>"
  );


  $templateCache.put('views/child.html',
    "<ion-view>\n" +
    "	<ion-nav-title>{{'child.summaryFor' | i18n}} {{vm.child.name}}</ion-nav-title>\n" +
    "\n" +
    "	<!-- HEADER -->\n" +
    "	<ion-header-bar align-title=\"left\" class=\"bar-subheader\">\n" +
    "		<div class=\"buttons\">\n" +
    "			<button class=\"button button-clear button-dark\">\n" +
    "				{{'child.currentBalance' | i18n}}:\n" +
    "				<span ng-class=\"{'balanced':vm.child.balance>=0, 'assertive':vm.child.balance<0}\">\n" +
    "					{{vm.child.balance}}\n" +
    "				</span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "		<h1 class=\"title\"></h1>\n" +
    "		<div class=\"buttons\">\n" +
    "			<button class=\"button button-clear button-dark\">\n" +
    "				{{'child.allowance' | i18n}}:\n" +
    "				<span ng-hide=\"vm.child.allowance==='none'\">\n" +
    "					<span class=\"positive\">{{vm.child.allowanceAmount}}</span>\n" +
    "					({{vm.child.allowance}})\n" +
    "				</span>\n" +
    "				<span ng-show=\"vm.child.allowance==='none'\">{{'child.none' | i18n}}</span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "	</ion-header-bar>\n" +
    "\n" +
    "	<!-- TRANSACTIONS -->\n" +
    "	<ion-content class=\"has-header has-footer\">\n" +
    "		<div class=\"list\">\n" +
    "			<div class=\"item item-divider\">\n" +
    "				{{'child.transactions' | i18n}}\n" +
    "			</div>\n" +
    "			<ul class=\"list\" collection-repeat=\"transaction in vm.transactions | orderBy: '-date'\">\n" +
    "				<li class=\"item\">\n" +
    "					<small class=\"ah-gray\">\n" +
    "						{{transaction.timestamp | date:'dd.MM.yy'}}\n" +
    "					</small> &nbsp;&nbsp;{{transaction.description}}\n" +
    "					<strong class=\"item-note\" ng-class=\"{'balanced':transaction.type==='deposit', 'assertive':transaction.type==='withdraw'}\">\n" +
    "							<span ng-show=\"transaction.type==='withdraw'\">-</span>{{transaction.sum}}\n" +
    "					</strong>\n" +
    "				</li>\n" +
    "			</ul>\n" +
    "		</div>\n" +
    "	</ion-content>\n" +
    "\n" +
    "	<!-- FOOTER -->\n" +
    "	<ion-footer-bar class=\"bar-stable\">\n" +
    "		<div class=\"button-bar\">\n" +
    "			<a class=\"button button-clear button-balanced\" ng-click=\"vm.openDepositModal()\">{{'child.deposit' | i18n}}</a>\n" +
    "			<a class=\"button button-clear button-assertive\" ng-click=\"vm.openWithdrawModal()\">{{'child.withdraw' | i18n}}</a>\n" +
    "			<a class=\"button button-clear button-calm icon ion-gear-a\" ng-click=\"vm.openAddChildModal()\"></a>\n" +
    "		</div>\n" +
    "	</ion-footer-bar>\n" +
    "\n" +
    "</ion-view>"
  );


  $templateCache.put('views/depositOverlay.html',
    "<ion-modal-view ng-controller=\"depositOverlayCtrl as vm\">\n" +
    "	<ion-header-bar class=\"bar-stable\">\n" +
    "		<h1 class=\"title\">\n" +
    "			{{vm.dataToSubmit.depositType === 'single' ? 'Make a Deposit' : 'Change Allowance'}}\n" +
    "		</h1>\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"dismissModal()\">Cancel</button>\n" +
    "	</ion-header-bar>\n" +
    "	<ion-content>\n" +
    "		<form novalidate name=\"depositForm\"\n" +
    "			  ng-submit=\"vm.submitDeposit()\">\n" +
    "			<div class=\"list\">\n" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\n" +
    "					<span class=\"input-label\">\n" +
    "						{{vm.dataToSubmit.depositType === 'single' ? 'Amount to Deposit' : 'Allowance Amount'}}\n" +
    "					</span>\n" +
    "					<input type=\"number\"\n" +
    "						   min=\"0\"\n" +
    "						   ng-model=\"vm.dataToSubmit.sum\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label 	class=\"item item-input item-stacked-label\"\n" +
    "						ng-show=\"vm.dataToSubmit.depositType === 'single'\">\n" +
    "					<span class=\"input-label\">Description</span>\n" +
    "					<input type=\"text\"\n" +
    "						   ng-model=\"vm.dataToSubmit.description\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-select\">\n" +
    "					<div class=\"input-label\">\n" +
    "						Type of Deposit\n" +
    "					</div>\n" +
    "					<select ng-model=\"vm.dataToSubmit.depositType\">\n" +
    "						<option ng-repeat=\"type in vm.selectDepositType\"\n" +
    "								value=\"{{type.value}}\">\n" +
    "							{{type.label}}\n" +
    "						</option>\n" +
    "					</select>\n" +
    "				</label>\n" +
    "\n" +
    "			</div>\n" +
    "\n" +
    "			<button class=\"button button-block button-balanced\"\n" +
    "					ng-disabled=\"depositForm.$invalid\">\n" +
    "				{{vm.dataToSubmit.depositType === 'single' ? 'Deposit' : 'Change Allowance'}}\n" +
    "			</button>\n" +
    "		</form>\n" +
    "	</ion-content>\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/errorOverlay.html',
    "<ion-modal-view>\n" +
    "\n" +
    "	<ion-header-bar class=\"bar-stable\">\n" +
    "		<h1 class=\"title\">Error</h1>\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"dismissModal()\">Cancel</button>\n" +
    "	</ion-header-bar>\n" +
    "\n" +
    "	<ion-content>\n" +
    "		<div class=\"card\">\n" +
    "			<div class=\"item item-divider assertive\">\n" +
    "				An error occured\n" +
    "			</div>\n" +
    "			<div class=\"item item-text-wrap\">\n" +
    "				{{errorData}}\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</ion-content>\n" +
    "\n" +
    "</ion-modal-view>"
  );


  $templateCache.put('views/home.html',
    "<ion-view>\n" +
    "	<ion-nav-title>{{vm.parentName}}</ion-nav-title>\n" +
    "\n" +
    "	<ion-nav-buttons side=\"primary\">\n" +
    "		<button class=\"button button-icon icon ion-ios-plus-outline\"\n" +
    "				ng-click=\"vm.openAddChildModal()\"></button>\n" +
    "    </ion-nav-buttons>\n" +
    "	<ion-nav-buttons side=\"secondary\">\n" +
    "		<button\n" +
    "			class=\"button button-clear button-assertive\"\n" +
    "			ng-click=\"vm.logout()\">\n" +
    "			{{'home.logout' | i18n}}\n" +
    "		</button>\n" +
    "    </ion-nav-buttons>\n" +
    "	\n" +
    "	<ion-content class=\"padding\">\n" +
    "\n" +
    "		<div class=\"list\">\n" +
    "			<div ng-repeat=\"child in vm.children track by child._id\">\n" +
    "				<a 	class=\"item\"\n" +
    "					ui-sref=\"child({childId: child._id})\">\n" +
    "					{{::child.name}}\n" +
    "				</a>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<button class=\"button button-assertive\" ng-click=\"vm.changeLang()\">Change Language</button>\n" +
    "\n" +
    "	</ion-content>\n" +
    "</ion-view>"
  );


  $templateCache.put('views/login.html',
    "<ion-view>\n" +
    "	<ion-nav-title>\n" +
    "    	{{vm.createNewAccount ? ('login.register' | i18n) : ('login.login' | i18n)}}\n" +
    "    </ion-nav-title>\n" +
    "\n" +
    "	<ion-nav-buttons side=\"secondary\">\n" +
    "		<button class=\"button button-clear button-positive\" ng-click=\"vm.toggleSubmit()\">\n" +
    "			{{vm.createNewAccount ? ('login.login' | i18n) : ('login.register' | i18n)}}\n" +
    "		</button>\n" +
    "    </ion-nav-buttons>\n" +
    "\n" +
    "	<ion-content class=\"padding\">\n" +
    "\n" +
    "		<form 	novalidate\n" +
    "			   	name=\"loginForm\"\n" +
    "			   	ng-submit=\"vm.submit(vm.dataToSubmit)\">\n" +
    "			<div class=\"list\">\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">{{'login.username' | i18n}}</span>\n" +
    "					<input type=\"text\"\n" +
    "						   placeholder=\"Username\"\n" +
    "						   ng-model=\"vm.dataToSubmit.username\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-floating-label\">\n" +
    "					<span class=\"input-label\">{{'login.password' | i18n}}</span>\n" +
    "					<input type=\"password\"\n" +
    "						   placeholder=\"Password\"\n" +
    "						   ng-model=\"vm.dataToSubmit.password\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label 	class=\"item item-input item-floating-label\"\n" +
    "						ng-show=\"vm.createNewAccount\">\n" +
    "					<span class=\"input-label\">{{'login.yourName' | i18n}}</span>\n" +
    "					<input type=\"text\"\n" +
    "						   placeholder=\"Your Name\"\n" +
    "						   ng-model=\"vm.dataToSubmit.name\"\n" +
    "						   ng-required=\"vm.createNewAccount\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label 	class=\"item item-input item-floating-label\"\n" +
    "						ng-show=\"vm.createNewAccount\">\n" +
    "					<span class=\"input-label\">{{'login.emailOptional' | i18n}}</span>\n" +
    "					<input type=\"email\"\n" +
    "						   placeholder=\"Email (optional)\"\n" +
    "						   ng-model=\"vm.dataToSubmit.email\">\n" +
    "				</label>\n" +
    "			</div>\n" +
    "\n" +
    "			<button type=\"submit\"\n" +
    "					class=\"button button-block button-positive\"\n" +
    "					ng-disabled=\"loginForm.$invalid\">\n" +
    "				{{vm.createNewAccount ? ('login.register' | i18n) : ('login.login' | i18n)}}\n" +
    "			</button>\n" +
    "		</form>\n" +
    "		\n" +
    "		<div class=\"list\">\n" +
    "			<label class=\"item assertive\" ng-show=\"vm.error\">\n" +
    "				{{'login.wrongCred | i18n'}}\n" +
    "			</label>\n" +
    "		</div>\n" +
    "	</ion-content>\n" +
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
    "<ion-modal-view ng-controller=\"withdrawOverlayCtrl as vm\">\n" +
    "	<ion-header-bar class=\"bar-stable\">\n" +
    "		<h1 class=\"title\">Make a Withdraw</h1>\n" +
    "		<button class=\"button button-clear button-positive\"\n" +
    "				ng-click=\"dismissModal()\">Cancel</button>\n" +
    "	</ion-header-bar>\n" +
    "	<ion-content>\n" +
    "		<form novalidate name=\"withdrawForm\"\n" +
    "			  ng-submit=\"vm.submitWithdraw()\">\n" +
    "			<div class=\"list\">\n" +
    "				<label class=\"item item-input item-stacked-label\">\n" +
    "					<span class=\"input-label\">Amount to Withdraw</span>\n" +
    "					<input type=\"number\"\n" +
    "						   min=\"1\"\n" +
    "						   ng-model=\"vm.dataToSubmit.sum\"\n" +
    "						   ng-required=\"true\">\n" +
    "				</label>\n" +
    "\n" +
    "				<label class=\"item item-input item-stacked-label\">\n" +
    "					<span class=\"input-label\">Description</span>\n" +
    "					<input type=\"text\"\n" +
    "						   ng-model=\"vm.dataToSubmit.description\">\n" +
    "				</label>\n" +
    "			</div>\n" +
    "\n" +
    "			<button class=\"button button-block button-assertive\"\n" +
    "					ng-disabled=\"withdrawForm.$invalid\">\n" +
    "				Withdraw\n" +
    "			</button>\n" +
    "		</form>\n" +
    "	</ion-content>\n" +
    "</ion-modal-view>"
  );

}]);
