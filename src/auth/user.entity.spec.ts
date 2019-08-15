import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
    let user:User;

    beforeEach(function() {
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    });
    
    describe('validatePassword', () => {
        it('returns true when password is valid', async() => {
            bcrypt.hash.mockReturnValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456',user.salt);
            expect(result).toEqual(true);
            
        });

        it('returns false when password is invalid', async () => {
            bcrypt.hash.mockReturnValue('Password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', user.salt);
            expect(result).toEqual(false);

        });
    });
    
});
