import { useFormikContext } from "formik";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import Link from "next/link";

export const LoginForm = () => {
  const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
    useFormikContext<LoginFormValues>();

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup className="mb-3">
        <FormLabel htmlFor="username">Username</FormLabel>
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
        <div>
          <Link href="/user/forgot-password">Forgot password?</Link>
        </div>
      </FormGroup>
      <Button type="submit">Login</Button>
    </Form>
  );
};

export interface LoginFormValues {
  email: string;
  password: string;
}
