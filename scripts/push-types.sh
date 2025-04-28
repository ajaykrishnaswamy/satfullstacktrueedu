#!/bin/bash

# Generate the types
echo "Generating Supabase types..."
npm run db:generate-types

# Check if there are changes to commit
if git diff --quiet types/supabase-schema.ts; then
  echo "No changes to commit."
  exit 0
fi

# Add the changes
git add types/supabase-schema.ts

# Commit the changes
git commit -m "chore: update Supabase schema types"

# Push to the remote repository
git push

echo "Types updated and pushed to GitHub successfully!" 