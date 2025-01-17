import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  return (
    <div>
      {posts.map((post, index) => (
        <>
          <Post key={post._id} post={post} />
          {index !== posts.length - 1 && <hr />}
        </>
      ))}
    </div>
  );
};

export default Posts;
