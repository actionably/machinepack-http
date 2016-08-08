var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Http = require('../');

describe('machinepack-http: fetch-webpage-html', function() {

  var Sails = new SailsApp();
  var app;
  before(function(done) {
    process.chdir(path.resolve(__dirname, 'fixtures', 'app'));
    Sails.lift({
      hooks: {grunt: false, views: false},
      port: 1492
    }, function(err, _sails) {
      if (err) {return done(err);}
      app = _sails;
      return done();
    });
  });

  after(function(done) {
    app.lower(function(err) {
      if (err) {return done(err);}
      setTimeout(done, 500);
    });
  });

  it('should trigger `success` and get the correct HTML when requesting a valid path', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/html',
    }).exec({
      success: function(response) {
        assert.equal(response, '<html><body>hi!</body></html>');
        return done();
      },
      error: done
    });

  });

  it('should trigger `notFound` when a 404 status code is received', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/notFound',
    }).exec({
      success: function() {
        return done('Expected the `notFound` exit to be triggered, not `success`!');
      },
      notFound: function(response) {
        assert.equal(response.status, 404);
        return done();
      },
      error: done
    });

  });

  it('should trigger `badRequest` when a 400 status code is received', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/badRequest',
    }).exec({
      success: function() {
        return done('Expected the `badRequest` exit to be triggered, not `success`!');
      },
      badRequest: function(response) {
        assert.equal(response.status, 400);
        return done();
      },
      error: done
    });

  });

  it('should trigger `forbidden` when a 403 status code is received', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/forbidden',
    }).exec({
      success: function() {
        return done('Expected the `forbidden` exit to be triggered, not `success`!');
      },
      forbidden: function(response) {
        assert.equal(response.status, 403);
        return done();
      },
      error: done
    });

  });

  it('should trigger `unauthorized` when a 401 status code is received', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/unauthorized',
    }).exec({
      success: function() {
        return done('Expected the `unauthorized` exit to be triggered, not `success`!');
      },
      unauthorized: function(response) {
        assert.equal(response.status, 401);
        return done();
      },
      error: done
    });

  });

  it('should trigger `serverError` when a 5xx status code is received', function(done) {

    Http.fetchWebpageHtml({
      url: 'http://localhost:1492/error',
    }).exec({
      success: function() {
        return done('Expected the `serverError` exit to be triggered, not `success`!');
      },
      serverError: function(response) {
        assert.equal(response.status, 500);
        return done();
      },
      error: done
    });

  });

  it('should trigger `requestFailed` when attempting to reach a server that doesn\'t exist', function(done) {

    Http.fetchWebpageHtml({
      url: 'error',
      baseUrl: 'http://localhosty.cakes:9999'
    }).exec({
      success: function() {
        return done('Expected the `requestFailed` exit to be triggered, not `success`!');
      },
      requestFailed: function(response) {
        return done();
      },
      error: done
    });

  });

});

