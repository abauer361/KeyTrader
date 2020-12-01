// Rename this file to environment.local.ts and fill out hostname. Change protocol to https if using https

const protocol = 'http://';
const hostname = 'localhost';
const portNumber = ':8080'; // portnumber needs to be :numb if used

export const env = {
  PROTOCOL: protocol,
  HOSTNAME: hostname,
  PORT_NUMBER: portNumber
}
