// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, Profile } from 'passport-google-oauth20';
// import { config } from 'dotenv';

// config();

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       callbackURL: 'http://localhost:3000/auth/google/redirect', // endpoint in our app which google will return control to after authenticating a user
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;

//     const user = {
//       email: emails[0].value,
//       firstname: name.givenName,
//       lastname: name.familyName,
//       picture: photos[0].value,
//     };
//     return user;
//   }
// }
