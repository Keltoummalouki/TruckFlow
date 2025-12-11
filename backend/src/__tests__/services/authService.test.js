import { jest } from '@jest/globals';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwtUtils = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
};

jest.unstable_mockModule('../../models/userModel.js', () => ({
  default: mockUserModel,
}));

jest.unstable_mockModule('../../utils/jwtUtils.js', () => mockJwtUtils);

const { registerUser, loginUser, refreshAccessToken } = await import('../../services/authService.js');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const userData = { email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'password123' };
      const mockUser = { _id: '123', ...userData, role: 'user' };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      mockJwtUtils.generateAccessToken.mockReturnValue('accessToken');
      mockJwtUtils.generateRefreshToken.mockReturnValue('refreshToken');

      const result = await registerUser(userData);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUserModel.create).toHaveBeenCalledWith(userData);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter si email existe déjà', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(registerUser({ email: 'test@test.com' }))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('loginUser', () => {
    it('devrait connecter un utilisateur valide', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      mockJwtUtils.generateAccessToken.mockReturnValue('accessToken');
      mockJwtUtils.generateRefreshToken.mockReturnValue('refreshToken');

      const result = await loginUser('test@test.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter avec des identifiants invalides', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(loginUser('test@test.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshAccessToken', () => {
    it('devrait générer un nouveau access token', async () => {
      const mockUser = { _id: '123', role: 'user', isActive: true };
      
      mockJwtUtils.verifyRefreshToken.mockReturnValue({ id: '123' });
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockJwtUtils.generateAccessToken.mockReturnValue('newAccessToken');

      const result = await refreshAccessToken('validRefreshToken');

      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });

    it('devrait rejeter si utilisateur non trouvé', async () => {
      mockJwtUtils.verifyRefreshToken.mockReturnValue({ id: '123' });
      mockUserModel.findById.mockResolvedValue(null);

      await expect(refreshAccessToken('validRefreshToken'))
        .rejects.toThrow('User not found');
    });
  });
});
