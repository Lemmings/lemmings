var funcs = require("./funcs");

var PluginHandler = module.exports = function(dir){
    this.dir = dir;
    this.plugin = {};
};

PluginHandler.prototype.initialize = function(callback){
    var self = this;
    var header = "'use strict';var fs,require,exports = {"
                 + "_initialize : function(api){"
                 + " require = api.require;"
                 + " fs = api.fs;"
                 + " if(exports.initialize)exports.initialize();"
                 + "},"
                 + "_finalize : function(){"
                 + " if(exports.finalize)exports.finalize();"
                 + "},"
                 + "};"
                 ;
    var footer = "return exports;";
    funcs.scanDir(this.dir, function(dir, file, callback){
        funcs.readFunctionFile(dir + '/' + file, header, footer, function(err, func){
            if(err){
                return callback(err);
            }
            self.plugin[file] = func();
            callback(err);
        });
    }, function(err){
        if(err){
            return callback(err);
        }
        var api = {
            require : require,
            fs : require('fs'),
        };
        for(var key in self.plugin){
            try{
                self.plugin[key]._initialize(api);
            }catch(e){
                console.error('%s:%s', key, e.stack);
            }
        }
        callback(err);
    });
}
PluginHandler.prototype.finalize = function(){
    for(var key in this.plugin){
        this.plugin[key]._finalize();
    }
}
PluginHandler.prototype.getFunc = function(name){
    if(name in this.plugin){
        return this.plugin[name].run;
    }
    return null;
}
