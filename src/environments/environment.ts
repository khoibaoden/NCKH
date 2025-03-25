// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const url = 'http://103.153.69.217:5055';
// export const environment = {
//   production: false,
//   url: `${url}`,
// };

// export const environment = {
//     production: false,
//     baseFeUrl: 'http://103.153.69.217:6002',
//     baseApiUrl: 'http://103.153.69.217:6001/api',
//     baseApiImageUrl: 'http://103.153.69.217:6001',
//     baseSignLRUrl: 'http://103.153.69.217:6001',
//     baseApiUploadFile: 'http://103.153.69.217:6001/api/file/upload',
//     baseApiDeleteFile: 'http://103.153.69.217:6001/api/file/delete',
// };

// môi trường phát triển
export const environment = {
    production: false,
    url: 'https://localhost:7115',
    baseFeUrl: 'https://localhost:7115',
    baseApiUrl: 'https://localhost:7115/api',
    baseApiImageUrl: 'https://localhost:7115',
    baseSignLRUrl: 'https://localhost:7115',
    baseApiUploadFile: 'https://localhost:7115/api/file/upload',
    baseApiDeleteFile: 'https://localhost:7115/api/file/delete',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
