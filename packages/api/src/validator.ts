export const Validator = {
  notEmpty: (input: unknown, errorMessage: string) => {
    if (!input) {
      throw errorMessage;
    }
  },
};
