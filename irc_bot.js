var irc = require('irc');
var knex = require('knex')({
  client: process.env.CLIENT || 'sqlite3',
  connection: process.env.DATABASE_URL || { filename: 'dev.sqlite3' }
});


console.log(process.env.NC_CHANNEL_LIST.split(','));
var client = new irc.Client(process.env.NC_SERVER || 'chat.freenode.net',
  process.env.NC_NICK || 'nick-counter-bot',
  { channels:process.env.NC_CHANNEL_LIST.split(',') }
);

client.addListener('message', function (from, to, message) {
  console.log(from, to, message);
  knex.select('num_messages')
      .from('messages')
      .where( { nick:from } )
      .then(function(resp) {
        console.log(resp);
        if (resp.length) {
          knex('messages').where({nick:from})
            .update({nick:from, num_messages: resp.num_messages + 1})
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
