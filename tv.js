const   chalk       = require('chalk'),
    path        = require('path'),
    app         = require('express')(),
    basicAuth   = require('express-basic-auth'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,

    auth        = require('./auth.js'),
    wordWasher  = require('./word-washer.js'),
    wordcloud   = require('./wordcloud.js');

var conversation = {};



//
// Application Authenticate
//

app.use(basicAuth({
    challenge: true,
    users: auth.app
}));



//
// Define Client File
//

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



//
// Emmit Message and Cloud
//

var emmitMessageCloud = function(content, sessionId, username, country, type) {
    var finalContent = content;

    if (type === 'send') {
        //
        // Washing Words and Create Wordcloud Data
        //
        var wordWasherOutput = wordWasher.washing(content),

            // Washing Words
            cleanWords = {
                wordcloudContent: wordWasherOutput.wordcloudContent,
                content: wordWasherOutput.content,
            },

            // Create Wordcloud Data
            wordcloudData   = wordcloud.update(cleanWords.wordcloudContent);

        finalContent = cleanWords.content;
    }


    //
    // Store chats based on sessions
    //

    if (typeof conversation[sessionId] === 'undefined') {
        conversation[sessionId] = [];
    }

    conversation[sessionId].push({
        content: finalContent,
        type: type,
        username: username,
    });



    //
    // Ready to Emmit
    //

    var emitMessages = {};

    emitMessages.conversation = conversation[sessionId];

    if (type === 'send') {
        emitMessages.wordcloudData  = wordcloudData;
    }

    emitMessages.username       = username;
    emitMessages.country        = country;
    emitMessages.sessionId      = sessionId;
    emitMessages.websiteId      = auth.crisp.websiteId;
    emitMessages.type           = type;


    // Emit it
    io.emit('message', emitMessages);
};



//
// Define Crisp
//

const   Crisp       = require("node-crisp-api"),
    CrispClient = new Crisp();


// Authenticate to API (identifier, key)
CrispClient.authenticate(auth.crisp.identifier, auth.crisp.key);


// Get New Chats
CrispClient.on("message:send", function(message) {
    CrispClient.websiteConversations.getMeta(auth.crisp.websiteId, message.session_id).then(meta => {

        // console.log('User: ', message);
        // io.emit('meta', meta);

        var content     = message.content,
            sessionId   = message.session_id,
            username    = message.user.nickname,
            country     = meta.device.geolocation.country;

        if (content && content.length > 0 && (typeof content !== 'object')) {
            emmitMessageCloud(content, sessionId, username, country, 'send');
        }
    }).catch(err => {
        // io.emit('message', message);
        // console.log('errrr', err);
    });
});
CrispClient.on("message:received", function(message) {
    CrispClient.websiteConversations.getMeta(auth.crisp.websiteId, message.session_id).then(meta => {

        // console.log('Operator: ', message);
        // io.emit('meta', meta);

        var content     = message.content,
            sessionId   = message.session_id,
            username    = message.user.nickname,
            country     = meta.device.geolocation.country;

        if (content && content.length > 0 && (typeof content !== 'object')) {
            emmitMessageCloud(content, sessionId, username, country, 'received');
        }
    }).catch(err => {
        // io.emit('message', message);
        // console.log('errrr', err);
    });
});



http.listen(port, function(){
    // console.log('listening on *:' + port);
});