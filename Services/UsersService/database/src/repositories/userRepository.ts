import { myDataSource } from "../data-source";
import { User } from "../entities/Users";

export const userRepository = myDataSource.getRepository(User);
