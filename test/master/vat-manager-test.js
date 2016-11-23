var helper = require("../helper");
var VatManager = require("../../src/managers/master/vat-manager");
var instanceManager = null;
var validator = require('dl-models').validator.vat;

require("should");

function getData() {
    var Vat = require('dl-models').master.Vat;
    var now = new Date();
    var stamp = now / 1000 | 0;
    var code = stamp.toString(36);
    var vat = new Vat();
 
    vat.name = `Pasal 22[${code}]`;
    vat.rate = 1.5; 
    vat.description = "";
    return vat;
}

before('#00. connect db', function (done) {
    helper.getDb()
        .then(db => {
            instanceManager = new VatManager(db, {
                username: 'vat-test'
            });
            done();
        })
        .catch(e => {
            done(e);
        })
});

var createdId;
it('#01. should success when create new data', function (done) {
    var data = getData();
    instanceManager.create(data)
        .then(id => {
            id.should.be.Object();
            createdId = id;
            done();
        })
        .catch(e => {
            done(e);
        })
});

it('#02. should error when create new data', function (done) {
    var data = {};
    instanceManager.create(data)
        .then(id => {
            id.should.be.Object();
            createdId = id;
            done();
        })
        .catch(e => {
            e.errors.should.have.property('name');
            e.errors.should.have.property('rate');
            done();
        })
});