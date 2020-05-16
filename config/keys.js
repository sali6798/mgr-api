//   const DB_USER = "SOME USER";
//   const DB_PASSWORD = "SOME PASSWPORD";
//   const MONGODB = {
//     MONGODB_URI: `mongodb://${DB_USER}:${DB_PASSWORD}@ds<SOME_DOMAIN>.mlab.com:<PORT>/<PROJECT_NAME>`
//   };
  
  const SESSION = {
    COOKIE_KEY: "thisappisawesome"
  };
  
  const KEYS = {
    // ...TWITTER_TOKENS,
    // ...MONGODB,
    ...SESSION
  };
  
  module.exports = KEYS;