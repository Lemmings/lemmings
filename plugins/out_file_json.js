var require = null;
return {
    initialize : function(_require){
        require = _require;
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        var args = inputTools.args();
        outputTools.file(args.file, JSON.stringify(inputTools.kvs[args.input]), function(err){
            callback(null);
        });
    },
}
