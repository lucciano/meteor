(function () {

  // Constructor for an empty ContextSet.
  //
  // A ContextSet is used to hold a set of Meteor.deps.Contexts that
  // are to be invalidated at some future time.  If a Context in the
  // set becomes invalidated for any reason, it's immediately removed
  // from the set.
  var ContextSet = function () {
    this._contextsById = {};
  };

  // Adds the Context `ctx` to this set if it is not already
  // present.  Returns true if the context is new to this set.
  ContextSet.prototype.add = function (ctx) {
    var self = this;
    if (ctx && ! (ctx.id in self._contextsById)) {
      self._contextsById[ctx.id] = ctx;
      ctx.on_invalidate(function () {
        delete self._contextsById[ctx.id];
      });
      return true;
    }
    return false;
  };

  // Adds the current Context to this set if there is one.  Returns
  // true if there is a current Context and it's new to the set.
  ContextSet.prototype.addCurrentContext = function () {
    var self = this;
    var context = Meteor.deps.Context.current;
    if (! context)
      return false;
    return self.add(context);
  };

  // Invalidate all Contexts in this set.  They will be removed
  // from the set as a consequence.
  ContextSet.prototype.invalidateAll = function () {
    var self = this;
    for (var id in self._contextsById)
      self._contextsById[id].invalidate();
  };

  // Returns true if there are no Contexts in this set.
  ContextSet.prototype.isEmpty = function () {
    var self = this;
    for(var id in self._contextsById)
      return false;
    return true;
  };

  Meteor.deps.ContextSet = ContextSet;
})();