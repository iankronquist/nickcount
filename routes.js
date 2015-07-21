module.exports = function (app) {
  var knex = app.get('knex');
  app.get('/', function (req, res) {
    knex.select('*').from('messages').then(function(messages) {
      console.log(messages);
      return res.render('index.html',
        {
          channel_list: process.env.NC_CHANNEL_LIST,
          messages: messages
        });
    });
  });
  app.post('/update', function (req, res) {
    console.log(req.body);
    if (req.body.messages) {
      req.body.messages.forEach(function (message) {
        knex.select('num_messages')
              .from('messages')
              .where( { nick:message.from } )
              .then(function(resp) {
                if (resp.length) {
                  knex('messages').where({nick:message.from})
                    .update({nick:from, num_messages: resp[0].num_messages + message.num_messages})
                    .catch(function (error) {
                      console.log(error);
                    });
                } else {
                  knex('messages')
                    .insert({nick:message.from, num_messages: 1})
                    .catch(function (error) {
                      console.log(error);
                    });
                }
              });
        });
    }
    return 'updating db';
  });
};
