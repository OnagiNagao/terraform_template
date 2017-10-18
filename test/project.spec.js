const mocha = require('mocha');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

var shell = require('shelljs');
const project = require('./../bin/project');

chai.should();
chai.use(sinonChai);
const expect = chai.expect;
const TemplateSource = require('../bin/templateSource');

describe('Test class TemplateSource', async function () {

    it('success init with no prompt', () => {
        this.sandbox = sinon.createSandbox();
        var downloadTemplateStub = this.sandbox.stub(TemplateSource.prototype, 'downloadTemplate');
        // var readPromptFieStub = this.sandbox.stub(TemplateSource.prototype, 'readPromptFie');
        // readPromptFieStub.returned([{key: 'value'}]);
        project.init('name', 'module', 'dir');
        this.sandbox.restore();
        this.sandbox.assert.calledOnce(downloadTemplateStub);
        // this.sandbox.ass/ert.calledOnce(readPromptFieStub);
    });

    it('success deploy', () => {
        this.sandbox = sinon.createSandbox();
        var execStub = this.sandbox.stub(shell, 'exec');
        project.deploy('name', 'dir');
        this.sandbox.restore();
        this.sandbox.assert.calledWith(execStub, 'terraform plan -var-file=dir/name/name.tfvars dir/name');
        this.sandbox.assert.calledWith(execStub, 'terraform apply -var-file=dir/name/name.tfvars dir/name');
    });

    it('success destroy', () => {
        this.sandbox = sinon.createSandbox();
        var execStub = this.sandbox.stub(shell, 'exec');
        project.destroy('name', 'dir');
        this.sandbox.restore();
        this.sandbox.assert.calledWith(execStub, 'terraform plan -destroy -var-file=dir/name/name.tfvars dir/name');
        this.sandbox.assert.calledWith(execStub, 'terraform destroy -force -var-file=dir/name/name.tfvars dir/name');
    });
});