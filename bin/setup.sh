#!/bin/bash

# Get the absolute path of the cloned repository
repo_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Add the gen executable to the PATH environment variable
echo "export PATH=\"\$PATH:${repo_path}\"" >> ~/.bashrc

# Refresh the current terminal session
source ~/.bashrc

# Display success message
echo "gen has been added to the PATH environment variable."
