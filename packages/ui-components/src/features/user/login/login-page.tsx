"use client";

import { Formik } from "formik";
import { LoginForm, LoginFormValues } from "./login-form";
import { Button } from "react-bootstrap";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { ToastContext } from "../../../toast";

export const LoginPage = () => {
  const router = useRouter();
  const { newToast } = useContext(ToastContext);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "500px" }}>
        <h3>Login</h3>
        <Formik<LoginFormValues>
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors: Partial<LoginFormValues> = {};
            if (!values.email) {
              errors.email = "Required";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={async (values) => {
            const response = await signIn("credentials", {
              ...values,
              redirect: false,
            });

            if (response.error) {
              newToast({
                type: "error",
                msg: "Die eingegebenen Zugangsdaten sind leider nicht korrekt. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
              });
            } else {
              router.push(callbackUrl);
            }
          }}
        >
          <LoginForm />
        </Formik>

        <div className="mt-3">
          <Link href="/user/signup">Create a new account</Link>
        </div>

        <hr></hr>

        <Button
          variant="outline-dark"
          onClick={() => signIn("auth0", { redirectTo: callbackUrl })}
        >
          Login mit Auth0
        </Button>
      </div>
    </div>
  );
};
