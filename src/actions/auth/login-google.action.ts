import { defineAction } from "astro:actions";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { firebase } from "src/firebase/config";
import { z } from "zod";

export const loginWithGoogle = defineAction({
    accept: 'json',
    input: z.any(),
    handler: async (credentials) => {

        const credential = GoogleAuthProvider.credentialFromResult(credentials);

        if (!credential) {
            throw new Error('Google SignIn failed');
        }

        await signInWithCredential(firebase.auth, credential);

        return {
            success: true,
        }
    }
});