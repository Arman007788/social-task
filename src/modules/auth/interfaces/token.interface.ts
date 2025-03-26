// token service interface
export interface TokenInterface {
  generateToken(userId: number, tokenType: string): Promise<string>;
  generateJwtToken(userId: number, key: string, expiresIn: string): string;
}
