const model = require('nodejs-angelco-database');
const configurations = require('./configurations');
const request = require('request-promise');
module.exports = {
    start: () => {
        return new Promise((resolve, reject) => {
            var result = {};
            model.downloadTask.Get()
                .then(document => {
                    if (document != undefined) {
                        result.taskId = document.id;
                        var filters = document.filters;
                        var filterString = '&';
                        for (var i = 0; i < filters.length; i++) {
                            filterString += 'filter_data' + filters[i] + '&';
                        }
                        filterString = filterString.substring(0, filterString.length - 1);
                        var uri = configurations.uriIds + filterString;
                        var username = configurations.proxy.username;
                        var password = configurations.proxy.password;
                        var port = 22225;
                        var session_id = (1000000 * Math.random()) | 0;
                        var super_proxy = 'http://' + username + '-session-' + session_id + ':' + password + '@zproxy.luminati.io:' + port;
                        var options = {
                            url: uri,
                            //proxy: super_proxy,
                            headers: configurations.headers
                        };
                        request(options)
                            .then(function (data) {
                                try {
                                    var json = JSON.parse(data);
                                    result.data = json["ids"];
                                    console.log(result.data.length + ' found companies');
                                    resolve(result);
                                } catch (error) {
                                    reject(error);
                                }
                            }, function (error) {
                                console.log('Error:');
                                console.log(error);
                                console.log();
                                reject(error);
                            });
                    } else {
                        reject();
                    }
                });
        });
    }
};