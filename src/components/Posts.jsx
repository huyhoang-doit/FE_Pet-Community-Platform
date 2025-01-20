import { Fragment } from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  return (
    <div>
      {posts.map((post, index) => (
        <Fragment key={post._id}>
          <Post post={post} />
          {index !== posts.length - 1 && <hr />}
        </Fragment>
      ))}
    </div>
  );
};

export default Posts;
