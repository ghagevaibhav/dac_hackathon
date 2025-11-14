import z from 'zod';

const registerSchema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.email("This is not an Email"),
        password: z.string().min(8).max(20),
        mobile: z.string().min(10),
        birth: z.coerce.date()
});

const signInSchema = z.object({
        email: z.email(),
        password: z.string()
});

const changePasswordSchema = z.object({
        currentPassword: z.string().min(8).max(20),
        newPassword: z.string().min(8).max(20),
        confirmPassword: z.string().min(8).max(20)
});

const editProfileSchema = z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.email().optional(),
        mobile: z.string().min(10).optional(),
        birth: z.date().optional()
});

export {
        registerSchema,
        signInSchema,
        changePasswordSchema,
        editProfileSchema
};