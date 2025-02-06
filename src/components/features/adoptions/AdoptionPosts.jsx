import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostPage, setPosts } from "@/redux/postSlice";
import { fetchAllPostsAPI } from "@/apis/post";
import { toast } from "sonner";
import AdoptionPost from "./AdoptionPost";

const AdoptionPosts = () => {
  const { posts, page } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loaderRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const originalScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      history.scrollRestoration = originalScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && hasMorePosts && handleLoadMore(),
      { threshold: 0.5 }
    );

    loaderRef.current && observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMorePosts, posts]);

  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;
      dispatch(setPostPage(nextPage));
      const { data } = await fetchAllPostsAPI(nextPage);
      if (data.data.results.length === 0) {
        setHasMorePosts(false);
        return;
      }
      dispatch(setPosts([...posts, ...data.data.results]));
    } catch (error) {
      toast.error("Failed to load more posts");
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <AdoptionPost post={post} />
        </Fragment>
      ))}
      {hasMorePosts && (
        <div
          ref={loaderRef}
          style={{ height: "50px", background: "transparent" }}
        ></div>
      )}
    </div>
  );
};

export default AdoptionPosts;
