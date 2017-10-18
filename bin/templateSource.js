var http = require('http');
var https = require('https');
var request = require('request');
var fs = require('fs');
var url = require('url');
var chalk = require('chalk');
var AdmZip = require('adm-zip');

class templateSource {

    constructor(projectName, module, executePath){
        this.projectName = projectName;
        this.rootPath = executePath;
        this.projectPath = executePath + '/' + projectName;
        this.promptFile = 'prompt.js';
        this.promptFilePath = this.projectPath + '/' + this.promptFile;
        this.templateZip = module + ".zip";
        this.templateZipPath = this.projectPath + '/' + this.templateZip;
        this.sourceFileUrl = 'https://raw.githubusercontent.com/OnagiNagao/terraform_template/master/' + this.templateZip;
        this.tfvarsFilePath = this.projectPath + '/' + projectName + '.tfvars';
    }

    getSourceTemplate(encoding) {
        return new Promise((resolve, reject) => {
            request({url: this.sourceFileUrl, encoding: encoding}, (err, res, body) => {
                if (err) reject(err);
                resolve(body);
            });
        });
    }

    writeSourceTemplate(content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.projectPath + '/' + this.templateZip, content, (err) => {
                if (err) reject(err);
                resolve(this.projectPath + '/' + this.templateZip);
            });
        });
    }

    extractZip() {
        var zip = new AdmZip(this.templateZipPath);
        zip.extractAllTo(this.projectPath, /*overwrite*/true);
    }

    async downloadTemplate() {
        try {
            let content = await this.getSourceTemplate(null)
            // .catch((err)=>{this.errorHandler(err);});

            fs.mkdir(this.projectPath, (err) => {
                if (err) throw (err);
            })
            await this.writeSourceTemplate(content)
            // .catch((err)=>{this.errorHandler(err);});

            this.extractZip();
            await fs.unlink(this.templateZipPath, (err) => {
                if (err) throw (err);
            })
        } catch (e) {
            console.log(e.message);

        }
    }

    readPromptFie() {
        return new Promise((resolve, reject) => {
            fs.access(this.promptFilePath, fs.constants.R_OK, (err) => {
                if (err) {
                    resolve([]);
                    return;
                }
                resolve(require(this.promptFilePath));
            });
        });
    }

    writeTfvars(answers) {
        let content = '';
        for (let key  in answers) {
            content += (key + '=' + '"' + answers[key] + '"')
            content += '\r\n';
        }
        console.log(content);

        fs.writeFile(this.tfvarsFilePath, content, (err) => {
            if (err) {return this.errorHandler(err)};
            console.log('... write configuration file success');
            console.log(chalk.green("Init Project: " + this.projectName + " SUCCESS"));
        });
    }

    errorHandler(err) {
        console.log(chalk.red('ERROR: ' + err));
        process.exit(1);
    }
}

module.exports = templateSource;