const ResourcePathParser = require('../../src/services/resource-path-parser');

const { expect, test } = require('../test');

describe('services', () => {
  describe('path-parser', () => {
    describe('normalizePath', () => {
      test.it('should remove the first part of a path', () => {
        const parser = new ResourcePathParser('/v1/foo/bar');
        parser.normalizePath();
        expect(parser.getFullPath()).to.equal('/foo/bar');
      });

      test.it('should strip off .json', () => {
        const parser = new ResourcePathParser('/v1/foo/bar.json');
        parser.normalizePath();
        expect(parser.getFullPath()).to.equal('/foo/bar');
      });

      test.it('should remove the last part if it\'s a {PathParameter}', () => {
        let parser = new ResourcePathParser('/v1/foo/bar/{blah}.json');
        parser.normalizePath();
        expect(parser.getFullPath()).to.equal('/foo/bar');

        parser = new ResourcePathParser('/v1/foo/bar/{blah}');
        parser.normalizePath();
        expect(parser.getFullPath()).to.equal('/foo/bar');
      });
    });

    describe('forEachPathNode', () => {
      test.it('should enumerate each non-empty item in the path nodes', () => {
        const parser = new ResourcePathParser('/foo/bar');
        const collectedNodes = [];
        parser.forEachPathNode(pathNode => collectedNodes.push(pathNode)); // eslint-disable-line max-nested-callbacks
        expect(collectedNodes).to.eql(['foo', 'bar']);
      });
    });

    describe('isPathVariable', () => {
      test.it('should identify if a path node string is a variable identifier', () => {
        const parser = new ResourcePathParser('/foo/{AccountSid}/{Bar}/{Sid}');
        expect(parser.isPathVariable('foo')).to.be.false;
        expect(parser.isPathVariable('{AccountSid}')).to.be.true;
        expect(parser.isPathVariable('{Bar}')).to.be.true;
        expect(parser.isPathVariable('{Sid}')).to.be.true;
      });
    });
  });
});