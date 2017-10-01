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

program
    .command('init <projectName>')
    .description('init terraform project')
    .option('-m, --module <module>', 'The AWS\'s module', /^(ec2|apiGateWay)$/i)
    .action(function(projectName, options) {
        console.log(chalk.rgb(0,255,174)(
            figlet.textSync('#  TTerraform  #', { horizontalLayout: 'fitted' })
        ));

        console.log("Init Project:", projectName);

        var directoryPrefix = projectName;
        if (options.module == undefined){
            console.log('in undefined');
        } else if (options.module == true) {
            console.log('in true');
        } else if (options.module == 'ec2') { // TODO:: change to else & switch case
            console.log("Init module:", options.module);

            var fileUrl = RESOURCE_URL+options.module+".zip";
            var output = options.module + ".zip";
            request({url: fileUrl, encoding: null}, function(err, res, body) {
                if(err) throw err;
                fs.mkdir(directoryPrefix);
                fs.writeFile(directoryPrefix+"/"+output, body, function(err) {

                    console.log('... download template success');

                    var zip = new AdmZip(directoryPrefix+"/"+output);
                    zip.extractAllTo(directoryPrefix, /*overwrite*/true);
                    fs.unlink(directoryPrefix+"/"+output);

                    console.log('... prepare template success');
                    console.log('... start configuration\n');

                    var prompt = require(process.cwd() + '/ec2_bk/prompt.js')
                    inquirer.prompt(prompt).then(function (answers) {

                        let content = '';
                        for( key  in answers ){
                            content += (key + '=' + '"' + answers[key] + '"');
                            content += '\r\n';
                        }
                        console.log(content);

                        fs.writeFile(directoryPrefix+'/' + projectName + '.tfvars', content, function (err) {
                            if (err) return console.log(err);
                            console.log('... write configuration file success');
                            console.log(chalk.green("Init Project: " + projectName + " SUCCESS"));
                        });
                    });
                });
            });
        }
    });

program
    .command('deploy <projectName>')
    .description('deploy terraform project')
    .action(function(projectName, options) {
        console.log("Deploy Project:", projectName);
        let projectPath = process.cwd() + '/' + projectName;
        shell.exec('terraform plan  -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
        shell.exec('terraform apply  -var-file='+ projectPath + '/' + projectName + '.tfvars ' + projectPath);
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
                shell.exec('terraform plan -destroy ' + projectPath);
                shell.exec('terraform destroy -force ' + projectPath);
            }
        });
    });

// program
//     .command('test')
//     .description('test')
//     .action(function(options) {
//         console.log("Test Project:");
//         var a = require(process.cwd() + '/ec2_bk/prompt.js')
//         console.log(a);
//         console.log(a[0]['name']);
//         inquirer.prompt(a).then(function (answers) {
//             console.log(answers);
//         });
//     });

program.parse(process.argv);
