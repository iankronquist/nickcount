var irc = require('irc');
var querystring = require('querystring');
var http = require('http');
var knex = require('knex')({
  client: process.env.CLIENT || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'bot-db.sqlite3' }
});


console.log(process.env.NC_CHANNEL_LIST.split(','));
var client = new irc.Client(process.env.NC_SERVER || 'chat.freenode.net',
  process.env.NC_NICK || 'nick-counter-bot',
  { channels:process.env.NC_CHANNEL_LIST.split(',') }
);

client.addListener('message', function (from, to, message) {
    knex.select('num_messages')
          .from('messages')
          .where( { nick:from } )
          .then(function(resp) {
            if (resp.length) {
              knex('messages').where({nick:from})
                .update({nick:from, num_messages: resp[0].num_messages + 1})
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              knex('messages')
                .insert({nick:from, num_messages: 1})
                .catch(function (error) {
                  console.log(error);
                });
            }
          });
});

// Run every 10 minutes
var interval = setInterval( function() {
  // Send all the messages to the site and then delete them
  knex
    .select('*')
    .from('messages')
    .then(function (messages) {
      var options = {
        method: 'post',
        host: process.env.APP_HOST,
        path: '/update',
        port: process.env.APP_PORT,
      };
      var data = querystring.stringify({ messages: messages });
      var req = http.request(options, function (res) {
      });
      console.log('sending ' + messages.length + ' messages')
      req.write(data);
      req.end();
      knex.select('*').from('messages').del().then(function () {
        console.log('deleted messages');
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  
}, 5000);
