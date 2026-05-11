#!/usr/bin/env bash
set -euo pipefail

sudo dnf update -y
sudo dnf install -y \
  java-17-openjdk-devel \
  maven \
  nodejs \
  npm \
  mysql-server \
  mysql

sudo systemctl enable mysqld
sudo systemctl start mysqld

echo "Fedora 41 prerequisites installed."
