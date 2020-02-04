var sfile = require('../lib');
var should = require('chai').should();

describe('index test', function () {
    it('search test', function () {
        sfile.search('jquery').should.eql(true);
    })
});