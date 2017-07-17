'use strict';

const chai = require('chai');
const cap = require('chai-as-promised');

const should = chai.should();

let esRetry = require('../index');

/**
 * Return a success response
 * @param cb
 * @returns {Promise.<string>}
 */
function success(cb) {
  if (cb) {
    return cb(undefined, 'success');
  }
  return new Promise((resolve, reject) => resolve('success'));
}

/**
 * Return a generic error that shouldn't be handled
 * @param cb
 * @returns {Promise.<*>}
 */
function fail(cb) {
  let error = new Error('fail');
  if (cb) {
    return cb(error);
  }
  return new Promise((resolve, reject) => reject(error));
}

/**
 * Return the proper No living connections error
 * @param cb
 * @returns {Promise.<*>}
 */
function noLiving(cb) {
  let error = new Error('No Living connections');
  if (cb) {
    cb(error);
  }
  return new Promise((resolve, reject) => reject(error));
}


/**
 * Generate a new elasticsearch dummy
 *
 * @returns {{Client: Client, objProto: {key: string}, stringProto: string, counter, config}}
 */
function createEs() {
  let config;
  let counter = 0;
  let objProto = {key: 'value'};
  let stringProto = 'string';


  function Client(actConfig) {
    ++counter;
    config = actConfig;
  }

  Client.prototype.objProto = objProto;
  Client.prototype.stringProto = stringProto;


  let es = {
    Client,
    objProto,
    stringProto,
    get counter() {
      return counter;
    },
    get config() {
      return config;
    }
  };

  Client.prototype.success = success;
  return es;
}


/**
 * Elasticsearch Tests
 */

describe('Client tests', function () {

  let es;
  let retryCount = 10;

  beforeEach(function () {
    es = createEs();
  });

  it('handles promise functions', function (done) {

    let client = esRetry(es);

    client.success()
      .then(res => {
        res.should.equal('success');
        es.counter.should.equal(1);
        done()
      })
      .catch(done);
  });

  it('handles callback functions', function (done) {

    let client = esRetry(es);

    client.success((err, res) => {
      res.should.equal('success');
      es.counter.should.equal(1);
      done(err);
    });
  });


  it('will retry the specified number of times', function (done) {
    let counter = 0;
    let retryCount = 5;

    es.Client.prototype.testMethod = (cb) => {
      ++counter;
      return noLiving(cb);
    };

    let client = esRetry(es, {}, retryCount);

    client.testMethod()
      .then(() => {
        done('Fail');
      })
      .catch(err => {
        counter.should.equal(retryCount);
        es.counter.should.equal(retryCount);
        done();
      })
      .catch(done);
  });


  it('will retry promise to get a new connection', function (done) {
    let counter = 0;

    es.Client.prototype.testMethod = (cb) => {
      ++counter;
      return noLiving(cb);
    };

    let client = esRetry(es);

    client.testMethod()
      .then(() => {
        done('Fail');
      })
      .catch(err => {
        counter.should.equal(retryCount);
        es.counter.should.equal(retryCount);
        done();
      })
      .catch(done);
  });


  it('will retry callback to get a new connection', function (done) {
    let counter = 0;

    es.Client.prototype.testMethod = (cb) => {
      ++counter;
      return noLiving(cb);
    };

    let client = esRetry(es);

    client.testMethod((err, res) => {
      if (!err) {
        done('fail');
      } else {
        counter.should.equal(retryCount);
        es.counter.should.equal(retryCount);
        done();
      }
    });
  });


  it('will not retry promise on other errors', function (done) {
    let counter = 0;

    es.Client.prototype.testMethod = (cb) => {
      ++counter;
      return fail(cb);
    };

    let client = esRetry(es);

    client.testMethod()
      .then(() => done('Fail'))
      .catch(err => {
        counter.should.equal(1);
        es.counter.should.equal(1);
        done();
      })
      .catch(done);
  });

  it('will not retry callback on other errors', function (done) {
    let counter = 0;

    es.Client.prototype.testMethod = (cb) => {
      ++counter;
      return fail(cb);
    };

    let client = esRetry(es);

    client.testMethod((err, res) => {
      if (!err) {
        done('fail');
      } else {
        counter.should.equal(1);
        es.counter.should.equal(1);
        done();
      }
    });
  });


  it('will not change non functions', function () {
    let client = esRetry(es);
    client.objProto.should.equal(es.objProto);
    client.stringProto.should.equal(es.stringProto);

    let notEql = Object.assign({}, es.objProto);
    notEql.should.not.equal(es.objProto);
  });

  it('will pass in the proper config', function () {
    let config = {host: {host: 'localhost', port: 9200, protocol: 'http'}};
    let client = esRetry(es, config);
    es.config.should.equal(config);
    es.counter.should.equal(1);
  })
});