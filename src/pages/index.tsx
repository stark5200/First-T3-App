import { type NextPage } from "next";
import Head from "next/head";
//import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignInButton, useUser} from "@clerk/nextjs";
import dayjs from "dayjs";
import  Image  from "next/image"
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
 
//import { error } from "console";
// I'm lost

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput(""); 
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! please try again later.");
      }
    }
  });

  console.log(user);

  if (!user) return null;

  return ( 
    <div className="flex gap-3 w-full">
      <Image 
        src={user.profileImageUrl}
        alt="Profile image" 
        className="w-20 h-20 rounded-full"
        width={56}
        height={56}
      />
      <input 
        placeholder="Type some emojis!" 
        className="grow bg-transparent outline-none" 
        value={input}
        onChange={(e) => setInput(e.target.value)}

        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if ( input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} >
          Post
        </button>
      )}

      { isPosting && (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div> 
  )  
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="border-b border-slate-400 p-4 gap-3 flex">
      <Image 
        src={author.profileImageUrl}
        alt="Profile image"
        className="w-20 h-20 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const {data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div> Something went wrong. </div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (<PostView {...fullPost} key={fullPost.post.id}/>))}
    </div>
  )

}

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //start fetching
  api.posts.getAll.useQuery();

  // weird behaviour
  if ( !userLoaded ) return <div />;

  return (
  
    <main className="flex justify-center h-screen">
      <div className="bg-red-200 h-full w-full border-slate-400 md:max-w-2xl border-x">
        <div className="border-b border-slate-400 p-4 flex justify-center">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}  
          {isSignedIn && <CreatePostWizard />}  
        </div>
        
        <Feed />
      </div>
    </main>
  
  );
};

export default Home;
