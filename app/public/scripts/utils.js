'use strict';

const ncftpPut = ({ localPath, remotePath, recursive }) =>
new Promise((resolve, reject) => {
  const args = [
    recursive ? '-R' : '',
    '-u',
    process.env.FTP_USER,
    '-p',
    process.env.FTP_PASSWORD,
    process.env.FTP_SERVER,
    path.join(process.env.FTP_ROOT, remotePath || ''),
    localPath,
  ];

  const proc = spawn('ncftpput', args, { cwd: process.cwd() });
  const errMessage = [];
  proc.stderr.on('data', data => errMessage.push(data.toString()));

  proc.on('close', code => {
    if (code > 0) {
      const error = new Error(errorMessage.join('\n'));
      error.code = code;

      reject(error);
    } else {
      resolve();
    }
  });
});

exports.ncftpPut = ncftpPut;
