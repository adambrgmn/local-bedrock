#!/usr/bin/env node
'use strict';
require('dotenv').config({ silent: true });

const path = require('path');
const { spawn } = require('child_process');
const Listr = require('listr');
const chalk = require('chalk');
const glob = require('globby');
const { ncftpPut } = require('./utils');

const tasks = new Listr([
  {
    title: 'Check environment',
    task: (ctx, task) => {
      const requiredEnvVars = [
        'FTP_USER',
        'FTP_PASSWORD',
        'FTP_SERVER',
        'FTP_ROOT',
      ];

      if (process.env.CI) requiredEnvVars.push('TRAVIS_COMMIT');

      const missingEnvVars = requiredEnvVars.filter(
        envVar => process.env[envVar] == null,
      );

      const allOk = missingEnvVars.length === 0;

      if (!allOk) {
        task.title = 'Environment invalid';
        throw new Error(`Missing env vars (${missingEnvVars.join(', ')})`);
      } else {
        task.title = 'Environment valid';
      }
    },
  },

  {
    title: 'Get updated files',
    task: ctx =>
      new Promise((resolve, reject) => {
        const proc = spawn(
          'git',
          ['diff', '--name-only', process.env.TRAVIS_COMMIT || 'HEAD'],
          { cwd: process.cwd() },
        );

        const files = [];
        const stderr = [];

        proc.stdout.on('data', data => {
          const entries = data.toString().split('\n');
          files.push(...entries);
        });

        proc.stderr.on('data', data => stderr.push(data.toString()));

        proc.on('close', code => {
          if (code > 0) {
            const error = new Error(stderr.join('\n'));
            error.code = code;
            reject(error);
          } else {
            ctx.changedFiles = files;
            resolve(files);
          }
        });
      }),
  },

  {
    title: 'Push to ftp-server',
    task: async ctx => {
      const itemsToPush = [
        { localPath: 'config', recursive: true },
        { localPath: 'web/app', remotePath: 'web/', recursive: true },
      ];

      if (ctx.changedFiles.includes('composer.json')) {
        itemsToPush.push({ localPath: 'vendor', recursive: true });
      }

      if (process.env.UPDATE_WORDPRESS) {
        itemsToPush.push({
          localPath: 'web/wp',
          remotePath: '/web',
          recursive: true,
        });
      }

      return new Listr(
        itemsToPush.map(item => ({
          title: `Push ${item.localPath}/`,
          task: () => ncftpPut(item),
        })),
        { concurrent: true },
      );
    },
  },
]);

tasks
  .run()
  .then(ctx => {
    console.log('\n', chalk.green('Everything pushed to server'));
    process.exit();
  })
  .catch(err => {
    console.error('\n', chalk.red('An error occurred during deploy'));
    console.error(chalk.red('  →', err.message));
    process.exit(err.code || 1);
  });
