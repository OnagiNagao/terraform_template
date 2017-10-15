#!/usr/bin/env node
var http = require('http');
var https = require('https');
var fs = require('fs');
var program = require('commander');
var chalk = require('chalk');
var figlet = require('figlet');
var inquirer = require('inquirer');

const project = require('./project');

const RESOURCE_URL = 'https://raw.githubusercontent.com/OnagiNagao/terraform_template/master/';
const EXECUTE_DIR = process.cwd();

program
    .command('init <projectName>')
    .description('init terraform project')
    .option('-m, --module <module>', 'The AWS\'s module', /^(ec2)$/i)
    // .option('-m, --module <module>', 'The AWS\'s module', /^(ec2|apiGateWay)$/i)
    .action(async function(projectName, options) {
        try {
            if (options.module == true) {
                console.log(chalk.red('Error: invalid module name'));
                return;
            } else if (options.module == undefined) {
                options.module = 'new';
            }

            console.log(chalk.rgb(0, 255, 174)(
                figlet.textSync('#  TTerraform  #', {horizontalLayout: 'fitted'})
            ));
            project.init(projectName, options.module, EXECUTE_DIR);

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
        project.deploy(projectName, EXECUTE_DIR);
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
                project.destroy(projectName, EXECUTE_DIR);
            }
        });
    });

program.parse(process.argv);
