#!/bin/bash

# Stop tracking files that should be ignored
git rm -r --cached .

# Add all files again (this time respecting the .gitignore)
git add .

# Show status to verify cleanup
git status

echo "Repository cleaned. You can now commit the changes with:"
echo "git commit -m \"Clean up repository and fix gitignore\""
