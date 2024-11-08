import { firebase } from 'src/firebase/config';
import { defineAction } from 'astro:actions';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from 'firebase/auth';
import { z } from 'zod';

export const registerUser = defineAction({
    accept: 'form',
    input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(2),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ name, email, password, remember_me }, { cookies }) => {

        // Cookies
        if (remember_me) {
            cookies.set('email', email, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
                path: '/',
            });
        } else {
            cookies.delete('email', {
                path: '/',
            });
        }

        //Creacion de usuario
        try {

            const user = await createUserWithEmailAndPassword(
                firebase.auth,
                email,
                password
            );

            // Actualizar el nombre del usuario (displatName)
            updateProfile(firebase.auth.currentUser!, {
                displayName: name,
            });

            //Verificar el correo electronico
            await sendEmailVerification(firebase.auth.currentUser!, {
                url: `${import.meta.env.WEBSITE_URL}/protected?emeailVerified=true`, // a donde se redirigira al usuario para validar su correo
            });

            return {
                uid: user.user.uid,
                email: user.user.email
            }

        } catch (error) {

            const fireBaseError = error as AuthError;

            if (fireBaseError.code === 'auth/email-already-in-use') {
                throw new Error('El correo electronico ya esta en uso');
            }

            throw new Error('Error al crear usuario');
        }
    },
});