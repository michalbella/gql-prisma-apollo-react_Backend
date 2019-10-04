import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';


const seeds = async () => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    const testUser = await prisma.mutation.createUser({
        data: {
            name: 'Michal',
            email: 'test@gmail1.com',
            password: bcrypt.hashSync('password12345')
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'test post',
            body: 'empty',
            published: true,
            author: {
                connect: {
                    id: testUser.id
                }
            }
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'test post 2',
            body: 'empty 2',
            published: false,
            author: {
                connect: {
                    id: testUser.id
                }
            }
        }
    })
}

export {
    seeds as
    default
}