# Variable
variable "aws_profile" {
  default = "itm-ph-alpha"
  description = "The AWS profile."
}

variable "aws_account_id" {
  default = "055846995890"
  description = "The AWS account id."
}

variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "ap-southeast-1"
}

variable "vpc_id" {
  description = "VPC ID for instances (adn-th-alp-vpc)"
  default = "vpc-ee04068b"
}

variable "instance_name" {
  description = "instance name for EC2"
  default = "aws-terraform-poc"
}

variable "ami_id" {
  description = "AMI ID for EC2"
  default = "ami-5aab6739"
}

variable "instance_type" {
  description = "Instances for EC2"
  default = "t2.micro"
}

variable "subnet_a_id" {
  description = "Subnet in AZa to place things in (subnet-bbf71ccd | adn-th-alp-subnet-ap-1a | ap-southeast-1a)"
  default = "subnet-bbf71ccd"
}

variable "subnet_b_id" {
  description = "Subnet in AZa to place things in (subnet-c1ad52a5 | adn-th-alp-subnet-ap-1b | ap-southeast-1b)"
  default = "subnet-c1ad52a5"
}