const mocha = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const fs = require('fs');
const request = require('request');

chai.should();
chai.use(sinonChai);
const expect = chai.expect;
const TemplateSource = require('../bin/templateSource');

describe('Test class TemplateSource', function () {

    it('return data array when success readPromptFie', () => {
        this.sandbox = sinon.createSandbox();
        var accessStub = this.sandbox.stub(fs,'access');
        new TemplateSource().readPromptFie();
        this.sandbox.assert.calledOnce(accessStub);
        this.sandbox.restore();
    });

    it('return empty array when error readPromptFie', async () => {
        this.sandbox = sinon.createSandbox();
        var accessStub = this.sandbox.stub(fs,'access').callsFake(
            (path, constant, cb) => cb('error')
        );
        var ts = new TemplateSource();
        var result = await ts.readPromptFie();
        expect(result.length).to.equal(0);
        this.sandbox.assert.calledOnce(accessStub);
        this.sandbox.restore();
    });

    it('success writeTfvars', () => {
        this.sandbox = sinon.createSandbox();
        var writeFileStub = this.sandbox.stub(fs, 'writeFile');
        let answers = {
            key: 'value'
        };
        new TemplateSource('mockName', 'mockModule', 'mockPath').writeTfvars(answers);
        this.sandbox.assert.calledWith(writeFileStub, 'mockPath/mockName/mockName.tfvars', 'key="value"\r\n');
        this.sandbox.restore();
    });

    it('call errorHandler when error writeTfvars', async function() {
        this.sandbox = sinon.createSandbox();
        var errorHandlerStub = this.sandbox.stub(TemplateSource.prototype, 'errorHandler');
        var writeFileStub = this.sandbox.stub(fs, 'writeFile').callsFake(
            (path, content, cb) => cb('error')
        );
        let answers = {
            key: 'value'
        };
        new TemplateSource('mockName', 'mockModule', 'mockPath').writeTfvars(answers);
        this.sandbox.assert.calledWith(writeFileStub, 'mockPath/mockName/mockName.tfvars', 'key="value"\r\n');
        this.sandbox.assert.calledOnce(errorHandlerStub);
        this.sandbox.restore();
    });

    it('exit with code 1 when errorHandler', async function() {
        this.sandbox = sinon.createSandbox();
        var exitStub = this.sandbox.stub(process, 'exit');
        new TemplateSource('mockName', 'mockModule', 'mockPath').errorHandler('error');
        this.sandbox.assert.calledWith(exitStub, 1);
        this.sandbox.restore();
    });
});