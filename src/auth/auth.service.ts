import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService:JwtService
    ){}
    
    async signUp(authCredDto:AuthCredentialsDto):Promise<void>{
        return this.userRepository.signUp(authCredDto);
    }

    async signIn(authCredDto:AuthCredentialsDto):Promise<{accessToken:string}>{
        const result = await this.userRepository.validateUserPassword(authCredDto);
        if(!result){
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload:JwtPayload = {result};
        const accessToken = await this.jwtService.sign(payload);
        return {accessToken};
    }   


}
