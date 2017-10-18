var shell = require('shelljs');
var chalk = require('chalk');
var inquirer = require('inquirer');

const TemplateSource = require('./templateSource');

module.exports = {
    async init(projectName, module, executeDir) {
        console.log("Init Project:", projectName);
        console.log("Init module:", module);

        var ts = new TemplateSource(projectName, module, executeDir);
        await ts.downloadTemplate();

        console.log('... prepare template success');
        console.log('... start configuration');

        var question = await ts.readPromptFie()
        if (question.length <= 0){
            console.log('... no additional configuration file');
            console.log(chalk.green("Init Project: " + projectName + " SUCCESS"));
            return;
        }

        console.log('');
        inquirer.prompt(question).then((answers) => {
            ts.writeTfvars(answers);
        });
    },
    deploy(projectName, executeDir) {
        let projectPath = executeDir + '/' + projectName;
        shell.exec('terraform plan -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
        shell.exec('terraform apply -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
    },
    destroy(projectName, executeDir) {
        let projectPath = executeDir + '/' + projectName;
        shell.exec('terraform plan -destroy -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
        shell.exec('terraform destroy -force -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
    }
};