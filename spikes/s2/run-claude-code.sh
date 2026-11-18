#!/bin/sh
# Package S spike S2 — one Claude Code run of wait_for_user.
#   spikes/s2/run-claude-code.sh <minutes> <progress:true|false> [log dir]
# Run from anywhere; it cds to the repo root (mcp.json uses a repo-relative path). Prints elapsed seconds,
# the exit code and Claude's answer. The MCP server's own log (progress token, beats, end) goes to
# $BW2_SPIKE_MCP_LOG (default <log dir>/mcp-<minutes>m-<progress>.log).
set -u
MIN=$1; PROG=$2; OUT=${3:-/tmp}
cd "$(dirname "$0")/../.." || exit 1
export BW2_SPIKE_MCP_LOG="${BW2_SPIKE_MCP_LOG:-$OUT/mcp-${MIN}m-${PROG}.log}"
START=$(date +%s)
claude -p "Call the tool mcp__spike__wait_for_user exactly once with minutes=$MIN and progress=$PROG. When it returns, reply with its exact text. If it fails, reply with the exact error text." \
  --mcp-config spikes/s2/mcp.json --strict-mcp-config --allowedTools mcp__spike__wait_for_user \
  > "$OUT/claude-${MIN}m-${PROG}.out" 2>&1
CODE=$?
END=$(date +%s)
echo "minutes=$MIN progress=$PROG exit=$CODE elapsed=$((END-START))s MCP_TOOL_TIMEOUT=${MCP_TOOL_TIMEOUT:-unset}"
cat "$OUT/claude-${MIN}m-${PROG}.out"
