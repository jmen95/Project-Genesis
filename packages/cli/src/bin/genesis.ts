#!/usr/bin/env node

import { runGenesisCli } from '../cli/program.js';

const exitCode = await runGenesisCli();
process.exit(exitCode);
