// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { env} from './environment.local';
const protocol = env.PROTOCOL;
const hostname = env.HOSTNAME;
const portNumber = env.PORT_NUMBER; // portnumber needs to be :numb if used
const url = protocol + hostname + portNumber;

function getApiUrl(apiEndpoint: string) {
  return url + '/api/' + apiEndpoint;
}

export const environment = {
  production: false,
  hostname,
  protocol,
  portNumber,
  url,
  getApiUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
