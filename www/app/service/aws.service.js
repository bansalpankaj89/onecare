(function() {
    angular.module('mediDocApp.service')
    .factory('awsService', awsService);
    
    awsService.$inject = ['$q', 'awsConfig'];
    
    function awsService($q, awsConfig) {
        var bucketLocation = "";
        var init = function() {
            AWS.config.update({accessKeyId: awsConfig.accessKeyId, secretAccessKey: awsConfig.secretAccessKey});
            //console.log(awsConfig.accessKeyId, awsConfig.secretAccessKey);
            //AWS.config.region = awsConfig.region;
            var bucket = new AWS.S3({params: {Bucket: awsConfig.bucket }});
            bucket.getBucketLocation({ Bucket: awsConfig.bucket}, function(err, data) {
                if(err)
                    console.error('bucket location not found', err);
                bucketLocation = 's3-'+data.LocationConstraint;
            })
        }
        
        init();
        
        var getAllImages = function() {
            return $q(function(resolve, reject) {
                var bucket = new AWS.S3({params: {Bucket: awsConfig.bucket}});
                bucket.listObjects(function (err, data) {
                    if (err) {
                        console.error('Could not load objects from S3', err);
                    } else {
//                        document.getElementById('status').innerHTML = 'Loaded ' + data.Contents.length + ' items from S3';
//                        for (var i = 0; i < data.Contents.length; i++) {
//                            document.getElementById('objects').innerHTML +=
//                            '<li>' + data.Contents[i].Key + '</li>';
//                        }
                        console.log(' items retrived on s3 bucket ',data);
                    }
                });
            })                
        }
        
        var uploadImage = function (file, key) {
            var bucket = new AWS.S3({ params: { Bucket: awsConfig.bucket } });
            //return $q(function(resolve, reject) {
            var defer = $q.defer()
            if(file) {
                var tick = new Date().getTime();
                var fileName = tick +'_'+ file.name
                var params = { Key: key + '/' + fileName, 
                              ContentType: file.type, 
                              Body: file, 
                              ServerSideEncryption: 'AES256',
                              ACL: 'public-read'
                             };
                bucket.putObject(params, function(err, data) {
                    if(err) {
                        defer.reject('Error :0' + err.message );
                    }
                    else {
                        defer.resolve('https://'+bucketLocation+'.amazonaws.com/'+awsConfig.bucket+'/'+key+'/'+fileName);
                    }
                })
                .on('httpUploadProgress',function(progress) {
                    defer.notify(Math.round(progress.loaded / progress.total * 100) + '%');
                    //console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                });
            }
            else {
                defer.reject('no files to upload');
            }
            return defer.promise;
        }
        
        var uploadImageString = function (file, key, type, name) {
            var bucket = new AWS.S3({ params: { Bucket: awsConfig.bucket } });
            //return $q(function(resolve, reject) {
            var defer = $q.defer()
            if(file) {
                var tick = new Date().getTime();
                var fileName = tick +'_'+ name
                var params = { Key: key + '/' + fileName, 
                              ContentType: type, 
                              Body: file, 
                              ServerSideEncryption: 'AES256',
                              ACL: 'public-read'
                             };
                bucket.putObject(params, function(err, data) {
                    if(err) {
                        defer.reject('Error :0' + err.message );
                    }
                    else {
                        defer.resolve('https://'+bucketLocation+'.amazonaws.com/'+awsConfig.bucket+'/'+key+'/'+fileName);
                    }
                })
                .on('httpUploadProgress',function(progress) {
                    defer.notify(Math.round(progress.loaded / progress.total * 100) + '%');
                    //console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                });
            }
            else {
                defer.reject('no files to upload');
            }
            return defer.promise;
        }
        
        return {
            getAllImages: getAllImages,
            uploadImage: uploadImage,
            uploadImageString: uploadImageString
        };
    }
})();