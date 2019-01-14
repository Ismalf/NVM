var fs = require('fs');

fs.symlink('../media_files/Alex/Alone', '../media_files/Top Albums/Alex_Alone', 'dir', function(err){
    if(err){
        console.log(err);
    }
});

fs.rmdirSync('../media_files/Top Albums/Alex_Alone')