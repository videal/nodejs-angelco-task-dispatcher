const model = require('nodejs-angelco-database');
const dispatcher = require('./modules/dispatcher');
module.exports = () => {
    return new Promise((resolve, reject) => {
        return dispatcher.start()
            .then(result => {
                let taskId = result.taskId;
                let ids = result.data;
                for (let i = 0; i < ids.length; i++) {
                    ((i) => {
                        model.company.GetByNumericId(ids[i]).then(company => {
                            let companyId = undefined;
                            if (company != undefined) {
                                companyId = company.id;
                            }
                            model.taskCompany.Save({
                                companyId: companyId,
                                companyNumericId: ids[i],
                                taskId: taskId
                            })
                                .then(result => {
                                    resolve();
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        });
                    })(i);
                }
            })
            .catch(() => {
                reject();
            });
    });
};