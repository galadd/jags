#!/bin/bash

# Get the absolute path of the cloned repository
repo_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Remove the line added to the ~/.bashrc file
sed -i "/${repo_path//\//\\/}/d" ~/.bashrc

# Refresh the current terminal session
source ~/.bashrc

# Display success message
echo "gen has been removed from the PATH environment variable."
