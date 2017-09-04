#!/bin/sh

current_dir=$PWD
opt=$1

if [ "$opt" = "init" ]; then
    project_name=$2
    module=$3
    current_dir=$PWD

    module_zip=$module.zip
    mkdir -p ./$project_name
    wget -O ./$project_name/$module.zip https://raw.githubusercontent.com/OnagiNagao/terraform_template/master/$module_zip

    if [ $? -ne 0 ]; then
        echo "ERROR: Something wrong."
        exit
    fi

    unzip -o ./$project_name/$module_zip -d ./$project_name
    rm -rf ./$project_name/$module_zip

    echo ""
    echo "Instance name: "$project_name
    echo "Enter instance type [default = t2.micro]: "
    read instance_type
    echo ""

    file_tfvars=./$project_name/$project_name.tfvars
    echo "Create file configuration ..."
    echo "" > $file_tfvars
    echo "instance_name = \"$project_name\"" >> $file_tfvars

    if [ ${#instance_type} -ne 0 ]; then
        echo "instance_type = \"$instance_type\"" >> $file_tfvars
    fi

    if [ $? -ne 0 ]; then
        echo "ERROR: Something wrong."
        exit
    fi

    echo "******* CREATE CONFIG FILE SUCCESSFUL *******"
    cat $file_tfvars
    echo ""

    echo "******* TERRAFORM PLAN *******"
    cd ./$project_name
    terraform plan -var-file=$project_name.tfvars
    cd $current_dir

    echo ""
    echo "Please run the follow commands to apply terraform."
    echo "./generate.sh apply $project_name"
    echo "./generate.sh destroy $project_name"

elif [ "$opt" = "apply" ]; then
    project_name=$2
    echo "******* TERRAFORM APPLY *******"
    cd ./$project_name
    terraform apply -var-file=$project_name.tfvars
    cd $current_dir

    echo ""
    echo "The command to destroy terraform."
    echo "./generate.sh destroy $project_name"

elif [ "$opt" = "destroy" ]; then
    project_name=$2
    echo "******* TERRAFORM DESTROY *******"
    cd ./$project_name
    terraform destroy -var-file=$project_name.tfvars
    cd $current_dir
fi
