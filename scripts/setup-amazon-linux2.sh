#!/usr/bin/env bash
set -euo pipefail

sudo yum update -y
sudo amazon-linux-extras enable corretto17
sudo yum clean metadata
sudo yum install -y java-17-amazon-corretto-devel maven mysql

# Install Node.js 20 from NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

echo "Amazon Linux 2 prerequisites installed."
