import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post("signup")
    signup(@Body(ValidationPipe) authCred: AuthCredentialsDto): Promise<{ accessToken: string }>{
        return this.authService.signUp(authCred);
    }

    @Post("signin")
    signin(@Body(ValidationPipe) authCred: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCred);
    }
}
