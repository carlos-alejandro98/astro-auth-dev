import { defineAction } from "astro:actions";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { firebase } from "src/firebase/config";
import { z } from "zod";

export const loginUser = defineAction({
    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ email, password, remember_me }, { cookies }) => {

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

        try {
            const user = await signInWithEmailAndPassword(firebase.auth, email, password);

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