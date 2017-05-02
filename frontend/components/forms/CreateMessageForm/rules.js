export const DESTROY_AFTER_HOUR = 0;
export const DESTROY_AFTER_READ = 1;
export const rules =  {
    message: {
        presence: true,
        length: {
            minimum: 1,
            message: "Must be at least 1 characters"
        },
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: "Must be at least 6 characters"
        },
    },
    confirmPassword: {
        presence: true,
        equality: "password",
    },
    destroyMethod: {
        presence: true,
    },
};

