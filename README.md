Nick Count
==========

Some people on IRC are *really* spammy. Maybe if I show them how spammy they
are they will take their conversations to different channels?

How to deploy
-------------
Install node and dependencies the usual way. The package names are 
`nodejs-legacy` and `npm` on Ubuntu.

```shell
$ npm install
```
First, you need to configure the site by setting environment variables. At a
minimum you should set the following:
```shell
$ # NC_CHANNEL_LIST should be a comma separated list of channels to join
$ export NC_CHANNEL_LIST='#hamper-testing,#osu-lug
$ # NC_NICK should be the nickname of the bot
$ export NC_NICK='my-bot'
```
Additional configuration options can be found by inspecting the source (AKA I'm
lazy and it's only ~50 lines anyway). Note that it defaults to using a sqlite
database and runs on port 8000.

Start the IRC bot:
```shell
$ npm run start-bot
```
Start the site:
```shell
$ npm start
```


TODO
----
- [ ] Decouple IRC bot from website
- [ ] Add CSS
