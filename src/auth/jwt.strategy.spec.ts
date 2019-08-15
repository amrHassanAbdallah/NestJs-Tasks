import { JwtStrategy } from "./jwt.strategy";
import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { UnauthorizedException } from "@nestjs/common";


const mockUserRepository = ()=>({
    findOne:jest.fn()
})


describe('JwtStrategy', () => {
    let jwtStrategy:JwtStrategy;
    let userRepository;

    beforeEach(async function() {
        const module = await Test.createTestingModule({
            providers:[
                JwtStrategy,
                {provide:UserRepository,useFactory:mockUserRepository}
            ]
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        userRepository = module.get<UserRepository>(UserRepository);
    });


    describe('validate', () => {
        it('validates and returns the user based on JWT payload',async () => {
            const user = new User();
            user.username = "test";

            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate({username:"test"});
            expect(result).toEqual(result);
        });

        it('throws an unauth exception', () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({username:'test'})).rejects.toThrowError(UnauthorizedException);
            
        });
        
    });


    
    
    
});