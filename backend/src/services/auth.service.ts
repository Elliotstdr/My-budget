import jwt from "jsonwebtoken";

/**
 * Compare the id in the token with the param id
 * @param authorization 
 * @param id 
 * @returns boolean
 */
export const compareTokenUserID = (authorization: string | undefined, id: string | undefined): boolean => {
    if(!authorization || !id) return false;
    const decodedToken = jwt.verify(authorization?.split(" ")[1], "RANDOM_TOKEN_SECRET");
    const userId = (decodedToken as jwt.JwtPayload).userId;

    return userId === id.toString()
}