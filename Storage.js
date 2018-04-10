// Initialize the database
const low = require('lowdb');
const lodashId = require("lodash-id");
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db._.mixin(lodashId);
db._.createId = function() {
  var id = db.get("uid");
  id++;
  db.set("uid", id).write();
  return id;
}

db.defaults({
    uid : 0,
    games : [],
    users : [],
    players : []
})
  .write();

var Storage = function() {
  this.userExists = function(user) {
    return undefined !== db.get("users").find(user).value();
  }
  
  this.createUser = function(name, password) {
    if( this.userExists({ name : name }) ) {
      return false;
    } else {
      var user = {
        name : name,
        password : password
      }
      if( db.get("users").insert(user).write() ) {
        return user;
      } else {
        console.log("couldn't insert " + name);
        return false;
      }
    }
  },
  
  this.getUser = function(parameters) {
    return db.get("users").find(parameters).cloneDeep().value();
  },
  
  this.getUserByName = function(name) {
    return this.getUser({ name : name });
  }
}

module.exports = Storage;