const   appAuth = {
            // username : password
            'parhumm' : 'uxcloud'
        },

        // Crisp Node API
        // https://github.com/crisp-im/node-crisp-api
        // curl -H "Content-Type: application/json" -X POST -d '{"email":"YOUR_ACCOUNT_EMAIL","password":"YOUR_ACCOUNT_PASSWORD"}' https://api.crisp.chat/v1/user/session/login
        crispAuth = {
            identifier  : '',
            key         : '',
            websiteId   : '',
        };



//
// Export Variables
//

module.exports = {
    app: appAuth,
    crisp: crispAuth,
};