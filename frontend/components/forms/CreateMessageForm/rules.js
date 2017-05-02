export const DESTROY_BY_TIME = 0;
export const DESTROY_BY_VISIT = 1;
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
    destroyOption: {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
        },
    }
};

