const TWITTER_TOKENS = {
    TWITTER_CONSUMER_KEY: "T0PxjdOnWr6KeCheUk3pUSky2",
    TWITTER_CONSUMER_SECRET: "IvFAw63maCIAYdBpdZS6Ta7hfRd2MFJtpbJunwQzFtJ5j8uOzg",
    TWITTER_ACCESS_TOKEN: "156335482-aF6PzU76zEu9oVUnarwDTy3yERcYDSaExvWfBbqt",
    TWITTER_TOKEN_SECRET: "CVnPHllMHE9Bzi0cohBiwYksHaxtHOtf2UmUnQ2PPFgu4"
  };
  
//   const DB_USER = "SOME USER";
//   const DB_PASSWORD = "SOME PASSWPORD";
//   const MONGODB = {
//     MONGODB_URI: `mongodb://${DB_USER}:${DB_PASSWORD}@ds<SOME_DOMAIN>.mlab.com:<PORT>/<PROJECT_NAME>`
//   };
  
  const SESSION = {
    COOKIE_KEY: "thisappisawesome"
  };
  
  const KEYS = {
    ...TWITTER_TOKENS,
    // ...MONGODB,
    ...SESSION
  };
  
  module.exports = KEYS;