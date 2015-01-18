'use strict';

exports.up = function(knex, Promise) {
   return knex.schema.createTable('messages', function (table) {
    table.string('nick').primary;
    table.integer('num_messages');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
