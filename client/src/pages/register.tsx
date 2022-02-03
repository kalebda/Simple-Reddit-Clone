import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface Props {}
function Register(props: Props) {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log("values--", values);
          const response = await register({ options: values });
          console.log("----response----", response);
          if (response.data?.register.errors) {
            console.log("in herrere");
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data.register.user) {
            console.log("in heree");
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="email"
                placeholder="joh@example.com"
                label="Email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);
