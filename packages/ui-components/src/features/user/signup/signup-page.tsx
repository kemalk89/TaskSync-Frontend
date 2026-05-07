"use client";

import { Formik } from "formik";
import { SignupForm, SignupFormValues } from "./signup-form";
import { useSignup } from "./use-signup";
import Link from "next/link";

export const SignupPage = () => {
  const signup = useSignup();

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "500px" }}>
        <h3>Registrierung</h3>
        <Formik<SignupFormValues>
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors: Partial<SignupFormValues> = {};
            if (!values.email) {
              errors.email = "Required";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            signup.mutate(values, {
              onSuccess: () => {
                setSubmitting(false);
              },
            });
          }}
        >
          <SignupForm />
        </Formik>
        <div className="mt-4">
          Already have an account? <Link href="/user/login">Login</Link>
        </div>
      </div>
    </div>
  );
};
