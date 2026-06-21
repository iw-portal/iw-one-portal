#!/bin/bash

echo ""
read -p "Commit message: " message

if [ -z "$message" ]; then
  echo "Commit message cannot be empty."
  exit 1
fi

echo ""
echo "Pulling latest changes..."
git pull --rebase

if [ $? -ne 0 ]; then
  echo "Pull failed. Resolve conflicts and try again."
  exit 1
fi

echo ""
echo "Staging files..."
git add .

echo ""
echo "Creating commit..."
git commit -m "$message"

if [ $? -ne 0 ]; then
  echo "Nothing to commit."
  exit 1
fi

echo ""
echo "Pushing..."
git push

echo ""
echo "Done!"