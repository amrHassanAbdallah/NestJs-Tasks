import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "./user.entity";


const mockAuthCredentialsDto = {username:"test user",password:"dsadsad!2d"};

describe('UserRepository', () => {
    let userRepository;
    beforeEach(async function() {
        const module = await Test.createTestingModule({
            providers:[
                UserRepository,
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signup', () => {
        let save;
        beforeEach(()=>{
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });
        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockAuthCredentialsDto)).resolves.not.toThrow();
        });
        it('throws a conflict exception when username already exists', () => {
            save.mockRejectedValue({code:'23505'});
            expect(userRepository.signUp(mockAuthCredentialsDto)).rejects.toThrowError(ConflictException);
        });
        
        it('throws anyother error', () => {
            save.mockRejectedValue({ code: '235015' });
            expect(userRepository.signUp(mockAuthCredentialsDto)).rejects.toThrowError(InternalServerErrorException);
        });
    });
 

    describe('validatePassword', () => {
        let user;
        beforeEach(()=>{
            const validatePassword =  jest.fn();
            /*userRepository.findOne = jest.fn().mockResolvedValue({
                username = "test",
                validatePassword
            });*/
            userRepository.findOne = jest.fn();
            user= new User();
            user.username = "test";
            user.validatePassword = validatePassword;
        });
        it('returns valid user name', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(result).toEqual(user.username)
        });
        it('returns null when user not found', async() => {
            userRepository.findOne.mockResolvedValue(null);
            
            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toEqual(null)
        });
        it('return null when password is invalid', async() => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(result).toEqual(null)
        });
        
        
    });
    

    
});