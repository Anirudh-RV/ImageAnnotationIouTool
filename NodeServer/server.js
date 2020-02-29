var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var path = require('path');
const bodyParser = require('body-parser')
var zip = require('express-zip');
const child_process = require('child_process');
var zipFolder = require('zip-folder');
var port = 4000;

app.use(cors())

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/img',express.static(path.join(__dirname, 'public/uploaded')));
app.use('/file',express.static(path.join(__dirname,'public/file')));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

// 'public/Uploaded is destination'
// for scaling it to multiple users, send user_id to the backend and save under a new folder with the user_id name.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var fs = require('fs');
      var dir = 'public/uploaded/'+req.headers['username'];
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      var dir = 'public/uploaded/'+req.headers['username']+'/images';
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null,dir)
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname)
    }
  })

var upload = multer({ storage: storage }).array('file')


app.post('/saveIoU',function(req,res){
    var dir = 'public/uploaded/'+req.headers['username']+"/IoU";
    var fs = require('fs');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFile(dir+"/IoU.txt",req.headers['data']+"\n",{flag: "a+"}, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("File Saved");
    });

    return res.send(req.body.username)
})

app.post('/saveastextfile',function(req,res){
    var dir = 'public/uploaded/'+req.body.username+"/output";
    var fs = require('fs');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFile(dir+"/output_"+req.body.imagename+".txt",req.body.imagedata, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("File Saved");
    });

    return res.send(req.body.username)
})

var folderpath = './public/uploaded';

app.post('/downloadallfiles', function(req, res) {
  var userfolderpath = folderpath+"/"+req.body.username
   zipFolder(userfolderpath, folderpath+'/all_'+req.body.username+'.zip', function(err) {
     if(err) {
         console.log('error: ', err);
     } else {
         console.log('Done');
     }
   });
   res.download(folderpath + '/all_'+req.body.username+'.zip');
});

app.post('/downloadfiles', function(req, res) {
  var userfolderpath = folderpath+"/"+req.body.username+"/output"
  zipFolder(userfolderpath, folderpath+'/'+req.body.username+'.zip', function(err) {
    if(err) {
        console.log('error: ', err);
    } else {
        console.log('Done');
    }
  });
  res.download(folderpath + '/'+req.body.username+'.zip');
});

app.get('/',function(req,res){
    return res.send('Hello Server')
})

app.post('/upload',function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json(err)
          // An unknown error occurred when uploading.
        }
        return res.status(200).send(req.file)
        // Everything went fine.
      })
});

app.listen(port, function() {
    console.log('running on port: '+port);
});
