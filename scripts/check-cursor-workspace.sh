#!/usr/bin/env bash

set -e

echo ""
echo "Checking Cursor Workspace..."
echo ""

FILES=(
".cursor/rules/00-core.mdc"
".cursor/context/PROJECT_SUMMARY.md"
".cursor/context/ARCHITECTURE.md"
".cursor/context/CURRENT_TASK.md"
".cursor/context/README.md"
".cursor/prompts/feature-development.md"
".cursor/memories/architectural-decisions.md"
".cursor/README.md"
"AI_ARCHITECT.md"
"CONTRIBUTING.md"
"DECISION_LOG.md"
"PROJECT_STATUS.md"
"specs/README.md"
"specs/000-project/README.md"
)

FAILED=0


for FILE in "${FILES[@]}"
do

if [ -f "$FILE" ]; then

echo "✅ $FILE"

else

echo "❌ Missing: $FILE"

FAILED=1

fi

done


echo ""

if [ $FAILED -eq 0 ]; then

echo "================================="
echo "Cursor Workspace Ready 🚀"
echo "================================="

else

echo "================================="
echo "Cursor Workspace Incomplete"
echo "================================="

exit 1

fi
