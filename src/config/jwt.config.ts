import * as config from 'config';

const jwtConfig = config.get('jwt');
export const JwtConfig = {
    secret: process.env.JWT_SECRET||jwtConfig.secret,
    signOptions:{
        expiresIn: jwtConfig.expiresIn
    }
}