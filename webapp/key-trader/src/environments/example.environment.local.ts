// Rename this file to environment.local.ts and fill out hostname. Change protocol to https if using https

const protocol = 'http://';
const hostname = '192.168.41.129';
const portNumber = ''; // portnumber needs to be :numb if used

export const env = {
  PROTOCOL: protocol,
  HOSTNAME: hostname,
  PORT_NUMBER: portNumber
}
