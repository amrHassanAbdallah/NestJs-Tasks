import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService:JwtService
    ){}
    
    async signUp(authCredDto: AuthCredentialsDto): Promise<{ accessToken: string }>{
        this.userRepository.signUp(authCredDto);
        return await this.generateToken(authCredDto.username);
    }

    async signIn(authCredDto:AuthCredentialsDto):Promise<{accessToken:string}>{
        const username = await this.userRepository.validateUserPassword(authCredDto);
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }

        return await this.generateToken(username);
    }   




    private async generateToken(username: string) {
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
        return { accessToken };
    }
}
