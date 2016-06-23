var kv = {}
  , _ = require('lodash')
  , storageTypes = {
    basic: InMemoryStorage
  }
;

/**
 *  Base class for storage
 */
function BaseStorage(id) { this.id = id; }

_.extend(BaseStorage.prototype, {
  /**
   *  @member {string|number} A unique id for this storage item
   */
  id: null
  /**
   * Gets a value assigned to the user
   */
  , get: function(item_id) { throw new Error("Not Implemented"); }
  /**
   * Puts a value assigned to the user
   */
  , put: function(item_id, value) { throw new Error("Not Implemented"); }
});

function InMemoryStorage(id) {
    BaseStorage.apply(this, arguments);
    kv[id]  = kv[id] || {};
    this.db = kv[id];
}

_.extend(InMemoryStorage.prototype, BaseStorage.prototype, {
  get: function(key, cb) {
    cb(null, this.db[key]);
    return this;
  }
  , put: function(key, val, cb) {
    this.db[key] = val;
    cb(null, "");
    return this;
  }
});

module.exports = {
  /**
   *  Register a storage handler 
   *
   *  @arg {storage.type} type The storage type to register
   *  @arg {function} cls The class that handles storage for this type
   */
  register: function(type, cls) {
    storageTypes[type] = cls;
  }

  /**
   *  Creates a storage provider for user storage
   *  
   *  @arg {string|number} user_id A unique id to identify the provider
   */
  , create: function(id, type) {
    return new storageTypes[type || 'basic'](id);
  }
};
