#!/usr/bin/env node
var http = require('http');
var https = require('https');
var fs = require('fs');
var program = require('commander');
var shell = require('shelljs');
var request = require('request');
var AdmZip = require('adm-zip');
var url = require('url');
var chalk = require('chalk');
var figlet = require('figlet');
var inquirer = require('inquirer');

const RESOURCE_URL = 'https://raw.githubusercontent.com/OnagiNagao/terraform_template/master/';

function getSourceTemplate (fileUrl, encoding) {
    return new Promise((resolve, reject) => {
        request({url: fileUrl, encoding: encoding}, (err, res, body) => {
            if (err) reject(err);
            resolve(body);
        });
    });
}

function writeSourceTemplate (filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => { if (err) reject(err); resolve()});
    });
}

async function downloadTemplate(fileUrl, directory, fileName) {
    let content = await getSourceTemplate(fileUrl, null);
    fs.mkdir(directory, (err) => { if (err) throw (err);});
    await writeSourceTemplate(directory + '/' + fileName, content);
}

function readPromptFie(promptFilePath) {
    return new Promise((resolve, reject) => {
        fs.access(promptFilePath, fs.constants.R_OK, (err) => {
            if (err) {
                resolve([]);
                return;
            };
            resolve(require(promptFilePath));
        });
    });
}

function writeTfvars(filePath, answers, projectName) {
    let content = '';
    for( key  in answers ){
        content += (key + '=' + '"' + answers[key] + '"')
        content += '\r\n';
    }
    console.log(content);

    fs.writeFile(filePath, content, (err) => {
        if (err) return console.log(err);
        console.log('... write configuration file success');
        console.log(chalk.green("Init Project: " + projectName + " SUCCESS"));
    });
}

program
    .command('init <projectName>')
    .description('init terraform project')
    .option('-m, --module <module>', 'The AWS\'s module', /^(ec2)$/i)
    // .option('-m, --module <module>', 'The AWS\'s module', /^(ec2|apiGateWay)$/i)
    .action(async function(projectName, options) {
        try {
            //TODO:: refactor variable
            console.log(chalk.rgb(0, 255, 174)(
                figlet.textSync('#  TTerraform  #', {horizontalLayout: 'fitted'})
            ));

            console.log("Init Project:", projectName);
            if (options.module == true) {
                console.log(chalk.red('Error: invalid module name'));
                return;
            } else if (options.module == undefined) {
                options.module = 'new';
            }

            var directoryPrefix = projectName;
            console.log("Init module:", options.module);

            var fileUrl = RESOURCE_URL + options.module + ".zip";
            var output = options.module + ".zip";
            await downloadTemplate(fileUrl, directoryPrefix, output)
            console.log('... download template success');

            var zip = new AdmZip(directoryPrefix+"/"+output);
            zip.extractAllTo(directoryPrefix, /*overwrite*/true);
            await fs.unlink(directoryPrefix+"/"+output, (err) => { if (err) throw (err);});

            console.log('... prepare template success');
            console.log('... start configuration');

            var question = await readPromptFie(process.cwd() + '/' + directoryPrefix + '/prompt.js')
            if (question.length <= 0){
                console.log('... no additional configuration file');
                console.log(chalk.green("Init Project: " + projectName + " SUCCESS"));
                return;
            }

            console.log('');
            inquirer.prompt(question).then((answers) => {
                writeTfvars(directoryPrefix+'/' + projectName + '.tfvars', answers, projectName);
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

program
    .command('deploy <projectName>')
    .description('deploy terraform project')
    .action(function(projectName, options) {
        console.log("Deploy Project:", projectName);
        let projectPath = process.cwd() + '/' + projectName;
        shell.exec('terraform plan -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
        // shell.exec('terraform apply -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
    });

program
    .command('destroy <projectName>')
    .description('destroy terraform project')
    .action(function(projectName, options) {
        console.log("Destroy Project:", projectName);
        inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Are you sure: (default: Y)"
        }).then(function (answers) {
            if (answers['confirm']) {
                let projectPath = process.cwd() + '/' + projectName;
                shell.exec('terraform plan -destroy -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
                // shell.exec('terraform destroy -force -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
            }
        });
    });

// program
//     .command('test')
//     .description('test')
//     .action(function(options) {
//         template()
//     });

program.parse(process.argv);
