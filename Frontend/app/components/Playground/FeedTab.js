"use client";
import React from "react";
import AddThought from "./AddThought";
import PostTab from "./PostTab";
import { useSelector, useDispatch } from "react-redux";
import { fetchAlldata } from "@/redux/dataSlice";
import ThoughtTab from "./ThoughtTab";

const FeedTab = () => {
  const data = useSelector((state) => state.data.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data.length === 0) dispatch(fetchAlldata());
  }, []);

  return (
    <div className="flex flex-col w-full space-y-5 pb-5 overflow-x-hidden">
      <AddThought />
      {data.map((post, index) => {
        if (post.type === "post") return <PostTab key={index} post={post} />;
        if (post.type === "thought")
          return <ThoughtTab key={index} post={post} />;
      })}
    </div>
  );
};

export default FeedTab;
