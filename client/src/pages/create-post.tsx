import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import InputField from "../components/InputField";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost = () => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Text" />
            <Box mt={4}>
              <InputField
                textArea
                name="text"
                placeholder="text"
                label="Text"
              />
            </Box>

            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
