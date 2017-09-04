# Specify the provider and access details
provider "aws" {
  profile = "${var.aws_profile}"
  allowed_account_ids = ["${var.aws_account_id}"]
  region = "${var.aws_region}"
}

# EC2
resource "aws_instance" "inst" {
  "ami" = "${var.ami_id}"
  "availability_zone" = "ap-southeast-1a"
  "iam_instance_profile" = "${aws_iam_instance_profile.inst_profile.name}"
  "instance_type" = "${var.instance_type}"
  "subnet_id" = "${var.subnet_a_id}"
  "vpc_security_group_ids" = ["${aws_security_group.inst_sg.id}"]
  tags {
    Name = "${var.instance_name}"
  }
}

resource "aws_security_group" "inst_sg" {
  description = "controls direct access to application instances"
  vpc_id      = "${var.vpc_id}"
  name        = "${var.instance_name}-sg"

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80

    cidr_blocks = [
      "110.170.201.176/28",
      "52.220.2.232/32", # NAT ALPHA
      "52.77.125.180/32", # NAT STAGING
      "52.77.119.162/32", # NAT MANAGEMENT
    ]
  }

  ingress {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
    cidr_blocks = ["10.230.60.0/22"] # admin_cidr_ingress
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

## IAM
resource "aws_iam_instance_profile" "inst_profile" {
  name  = "${var.instance_name}-profile"
  roles = ["${aws_iam_role.inst_role.name}"]
}

resource "aws_iam_role" "inst_role" {
  name = "${var.instance_name}-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
