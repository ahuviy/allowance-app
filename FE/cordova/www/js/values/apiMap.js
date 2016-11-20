(function (angular) {
	angular
		.module('app')
		.value('apiMap', apiMap());

	function apiMap() {
		return {
			getChildren: {
				urlTemplate: '/api/children/<%= parentId%>',
				method: 'GET',
				event: 'getChildren'
			},
			getChildById: {
				urlTemplate: '/api/children/get/<%= childId%>',
				method: 'GET',
				event: 'getChildById'
			},
			addParent: {
				url: '/api/account/add',
				method: 'POST',
				event: 'addParent'
			},
			addChild: {
				urlTemplate: '/api/children/<%= parentId%>',
				method: 'POST',
				event: 'addChild'
			},
			updateChild: {
				urlTemplate: '/api/account/<%= childId%>/update',
				method: 'POST',
				event: 'updateChild'
			},
			deleteChild: {
				urlTemplate: '/api/account/<%= childId%>/delete',
				method: 'GET',
				event: 'deleteChild'
			},
			generateNewAccountNumber: {
				url: '/api/account/generate',
				method: 'GET',
				event: 'generateNewAccountNumber'
			},
			cancelNewAccountNumber: {
				urlTemplate: '/api/account/cancel/<%= accountNo%>',
				method: 'POST',
				event: 'cancelNewAccountNumber'
			},
			loginWithFacebook: {
				url: '/api/signupWithFB',
				method: 'POST',
				event: 'loginWithFacebook'
			},
			loginWithUsername: {
				url: '/api/signup',
				method: 'POST',
				event: 'loginWithUsername'
			},
			deposit: {
				urlTemplate: '/api/account/<%= accountId%>/deposit',
				method: 'POST',
				event: 'deposit'
			},
			withdraw: {
				urlTemplate: '/api/account/<%= accountId%>/withdraw',
				method: 'POST',
				event: 'withdraw'
			}
		};
	}
}(angular));