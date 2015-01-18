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
};
