# TRform
TRform is easy way to create terraform by using terraform template

## Installation
    npm i terraform_template

## Explanation
You have to run trform command at the parent directory of your project, TRform have will get your requesting template and prompt the require/optional parameters to generate configuration file.
TRform will create your project folder that contain terraform script.
And you can also use trform command to deploy or destroy on AWS.

#### General Structure:
```
└── project_name
    ├── main.tf
    ├── variable.tf
    ├── terraform.tfvars
    └── prompt.js
```
## Usage
#### trform [options] [command] {projectName}
```
  Options:

    -h, --help  output usage information

  Commands:

    init [options] <projectName>  init terraform project
    deploy <projectName>          deploy terraform project
    destroy <projectName>         destroy terraform project
```
* **trform init [options] {projectName}**
```
  Options:

    -m, --module <module>  The AWS's module
    -h, --help             output usage information
```
* **trform deploy {projectName}**
* **trform destroy {projectName}**

## Avaliable Module
In init option, there are module option (-m) that provide terraform script template with required resource to start the project.

* ec2

## Example

- Initail new template with ec2 module
````
trform init -m ec2 sample_project
    _  _      _____  ____    __                              _  _   
  _| || |_   |_   _||  _ \  / _|  ___   _ __  _ __ ___     _| || |_ 
 |_  ..  _|    | |  | |_) || |_  / _ \ | '__|| '_ ` _ \   |_  ..  _|
 |_      _|    | |  |  _ < |  _|| (_) || |   | | | | | |  |_      _|
   |_||_|      |_|  |_| \_\|_|   \___/ |_|   |_| |_| |_|    |_||_|  
                                                                    
Init Project: sample_project
Init module: ec2
... prepare template success
... start configuration

? The AWS profile: itm-ph-alpha
? The AWS account id: 123456
? The AWS region to create things: ap-southeast-1
? VPC ID for instances: vpc-xxxx
? instance name for EC2: aws-terraform-poc
? AMI ID for EC2: ami-5aab6739
? Instances type for EC2: t2.micro
? Subnet id in ZoneA: sub-xxx
? Subnet id in ZoneB: sub-xxx
aws_profile="itm-ph-alpha"
aws_account_id="123456"
aws_region="ap-southeast-1"
vpc_id="vpc-xxxx"
instance_name="aws-terraform-poc"
ami_id="ami-5aab6739"
instance_type="t2.micro"
subnet_a_id="sub-xxx"
subnet_b_id="sub-xxx"

... write configuration file success
Init Project: sample_project SUCCESS
````
