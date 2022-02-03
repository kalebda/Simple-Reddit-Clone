import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { UpdootSection } from "../components/UpdootSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
const Index = () => {
  const [variables, setVariables] = React.useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <div>No posts</div>;
  }
  return (
    <>
      <Layout variant="regular">
        <br />
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8}>
            {data.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>

                    <Text>{p.creator.username} </Text>
                    <Flex align="center">
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      {meData?.me?.id !== p.creator.id ? null : (
                        <Box ml="auto">
                          <IconButton
                            mr={4}
                            ml="auto"
                            aria-label="Delete Icon"
                            icon={<DeleteIcon />}
                            onClick={() => {
                              deletePost({ id: p.id });
                            }}
                          />
                          <NextLink
                            href="/post/edit/[id]"
                            as={`/post/edit/${p.id}`}
                          >
                            <IconButton
                              ml="auto"
                              aria-label="Delete Icon"
                              icon={<EditIcon />}
                            />
                          </NextLink>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              m="auto"
              my={8}
            >
              Load More
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
