(function (angular) {
    angular
        .module('app')
        .value('i18nChart', i18nChart());

    function i18nChart() {
        return {
            eng: {
                home: {
                    logout: 'Log Out'
                },
                login: {
                    username: 'Username',
                    password: 'Password',
                    yourName: 'Your Name',
                    emailOptional: 'Email (optional)',
                    login: 'Login',
                    register: 'Register',
                    wrongCred: 'Wrong username or password'
                },
                child: {
                    summaryFor: 'Summary for',
                    currentBalance: 'Current Balance',
                    allowance: 'Allowance',
                    none: 'none',
                    transactions: 'Transactions',
                    deposit: 'Deposit',
                    withdraw: 'Withdraw'
                }
            }
        };
    }
})(angular);