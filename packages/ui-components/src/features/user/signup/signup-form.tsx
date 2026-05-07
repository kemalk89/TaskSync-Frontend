"use client";

import { useFormikContext } from "formik";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";

export const SignupForm = () => {
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
  } = useFormikContext<SignupFormValues>();

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup className="mb-3">
        <FormLabel htmlFor="email">E-Mail</FormLabel>
        <FormControl
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.email && !!errors.email}
        />
        <FormControl.Feedback type="invalid">
          {touched.email && errors.email}
        </FormControl.Feedback>
      </FormGroup>
      <FormGroup className="mb-3">
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormControl
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.password && !!errors.password}
        />
        <FormControl.Feedback type="invalid">
          {touched.password && errors.password}
        </FormControl.Feedback>
      </FormGroup>
      <Button type="submit" disabled={isSubmitting}>
        Registrieren
      </Button>
    </Form>
  );
};

export interface SignupFormValues {
  email: string;
  password: string;
}
