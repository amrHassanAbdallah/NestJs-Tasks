import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


@EntityRepository(User)
export class UserRepository extends Repository<User>{
    private logger = new Logger("UserRepository");

    async signUp(authCredentialsDto:AuthCredentialsDto):Promise<void>{
        const {username, password} = authCredentialsDto;
        
        const user = new User(); 
        user.username = username;
        const {hashedPassword,salt} =await this.hashPassword(password);
        user.password = hashedPassword;
        user.salt = salt;
        try{
            await user.save();
            
        }catch(error){
            this.logger.error(error);
            if(error.code == 23505){//duplicate username
                throw new ConflictException("Username already exists");
            }else{
                throw new InternalServerErrorException();   
            }
        }
    }
    async validateUserPassword(authCredDto:AuthCredentialsDto){
        const { username, password } = authCredDto;
        const user = await this.findOne({where:{username}});
        if(user && await user.validatePassword(password)){
            return user.username;
        }else{
            return null;
        }
    }

    private async hashPassword(password: string): Promise<{hashedPassword:string,salt:string}> {
        const salt = await bcrypt.genSalt();
        return {hashedPassword:await bcrypt.hash(password, salt),salt};
    }
}